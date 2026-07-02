// /src/services/db.service.js
let storedProcedureExecutor = null;

export const setStoredProcedureExecutor = (executor) => {
	if (typeof executor !== "function") {
		throw new Error("Stored procedure executor must be a function");
	}

	storedProcedureExecutor = executor;
};

const DEADLOCK_ERROR_NUMBER = 1205;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isDeadlockError = (error) => {
	return (
		error?.parent?.number === DEADLOCK_ERROR_NUMBER ||
		error?.original?.number === DEADLOCK_ERROR_NUMBER
	);
};

export async function executeStoredProcedure(sql) {
	if (!storedProcedureExecutor) {
		throw new Error("Stored procedure executor has not been configured");
	}

	const maxRetries = 2;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await storedProcedureExecutor(sql);
		} catch (error) {
			if (!isDeadlockError(error) || attempt === maxRetries) {
				throw error;
			}

			const delay = 500 * (attempt + 1);

			console.warn(
				`[db.service] Deadlock detectado. Reintentando SP en ${delay}ms. Intento ${
					attempt + 1
				}/${maxRetries}`,
			);

			await sleep(delay);
		}
	}
}
