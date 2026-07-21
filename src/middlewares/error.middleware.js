export const notFound = (req, res) => {
	res.status(404).json({
		success: false,
		message: "Endpoint no encontrado",
		path: req.originalUrl,
	});
};

export const errorHandler = (error, req, res, next) => {
	if (res.headersSent) {
		return next(error);
	}

	const sqlDetail =
		error?.parent?.message ||
		error?.original?.message ||
		error?.originalError?.info?.message;

	const statusCode = error.statusCode || error.status || 500;

	console.error("[errorHandler]", error);

	return res.status(statusCode).json({
		success: false,
		message:
			statusCode === 500
				? "No fue posible procesar la consulta."
				: error.message,
		detail: sqlDetail || error.message,
		code: error.code,
	});
};
