// /src/core/engine.js
import { buildFilters } from "../filters/filterBuilder.js";
import { executeStoredProcedure } from "../services/db.service.js";
import { getKPIConfig } from "./registry.js";
import { ADAPTERS } from "../adapters/index.js";
import { FORMATTERS } from "../formatters/index.js";

export const executeKPI = async ({ kpi, filters = {} }) => {
	console.log("🧠 KPI:", kpi);

	const kpiConfig = await getKPIConfig(kpi);
	console.log("🧠 KPI CONFIG:", kpiConfig);

	const procedureParams = kpiConfig.mapFilters
		? kpiConfig.mapFilters(filters)
		: {};
	console.log("🧠 PARAMS:", procedureParams);

	const rawData = await executeStoredProcedure({
		procedure: kpiConfig.storedProcedure,
		params: procedureParams,
		kpiConfig,
	});
	console.log("🧠 RAW DATA:", rawData);

	const adapter = ADAPTERS[kpiConfig.adapter];
	console.log("🧠 Adapter:", kpiConfig.adapter);

	if (!adapter) {
		throw new Error(`Adapter "${kpiConfig.adapter}" not found`);
	}

	const adaptedData = adapter({
		rows: rawData,
		config: kpiConfig,
	});

	const formatter = FORMATTERS[kpiConfig.formatter];
	console.log("🧠 Formatter:", kpiConfig.formatter);

	if (!formatter) {
		throw new Error(`Formatter "${kpiConfig.formatter}" not found`);
	}

	const result = formatter({
		data: adaptedData,
		config: kpiConfig,
	});

	return {
		kpi: kpiConfig.key,
		filters: procedureParams,
		result,
	};
};
