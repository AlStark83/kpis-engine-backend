// /src/filters/filterBuilder.js
const isNil = (value) => value === undefined || value === null;

const ALL_VALUES = new Set(["*", "ALL", "TODO", "TODOS"]);

const CANONICAL_ALIASES = {
	dateFrom: ["dateFrom", "fechaInicio", "fecha_inicio", "FECHA_INICIO"],
	dateTo: ["dateTo", "fechaFin", "fecha_fin", "FECHA_FIN"],
	years: ["years", "anio", "anios", "YEARS"],
	products: ["products", "producto", "productos", "product", "PRODUCT"],
	clients: ["clients", "cliente", "clientes", "client", "CLIENT"],
	services: ["services", "servicio", "servicios", "SERVICES"],
	coordinators: ["coordinators", "coordinador", "coordinadores", "coordinator", "COORDINATOR"],
	statuses: ["statuses", "estatus", "status", "STATUS"],
	subclients: ["subclients", "subcliente", "subclientes", "SUBCLIENTE"],
	requesters: ["requesters", "solicitante", "solicitantes", "SOLICITANTE"],
	states: ["states", "estado", "estados", "ESTADO"],
	managers: ["managers", "gestor", "gestores", "GESTOR"],
};

const SQL_PARAM_BY_CANONICAL_KEY = {
	dateFrom: "FECHA_INICIO",
	dateTo: "FECHA_FIN",
	years: "YEARS",
	products: "PRODUCT",
	clients: "CLIENT",
	services: "SERVICES",
	coordinators: "COORDINATOR",
	statuses: "STATUS",
	subclients: "SUBCLIENTE",
	requesters: "SOLICITANTE",
	states: "ESTADO",
	managers: "GESTOR",
};

const DEFAULT_SQL_PARAMS = [
	"FECHA_INICIO",
	"FECHA_FIN",
	"YEARS",
	"PRODUCT",
	"CLIENT",
	"SERVICES",
	"COORDINATOR",
	"STATUS",
	"SUBCLIENTE",
	"SOLICITANTE",
	"ESTADO",
	"GESTOR",
];

const normalizeScalar = (value) => {
	if (isNil(value)) return null;

	const normalized = String(value).trim();
	return normalized === "" ? null : normalized;
};

const normalizeDate = (value) => {
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString().slice(0, 10);
	}

	const normalized = normalizeScalar(value);
	if (!normalized) return null;

	const isoDateMatch = normalized.match(/^(\d{4}-\d{2}-\d{2})/);
	return isoDateMatch ? isoDateMatch[1] : normalized;
};

const toArray = (value) => {
	if (Array.isArray(value)) return value;
	if (isNil(value)) return [];
	return String(value).split(",");
};

const normalizeList = (value) => {
	const result = [];
	const seen = new Set();
	let selectsAll = false;

	for (const item of toArray(value)) {
		const normalized = normalizeScalar(item);
		if (!normalized) continue;

		if (ALL_VALUES.has(normalized.toUpperCase())) {
			selectsAll = true;
			continue;
		}

		if (!seen.has(normalized)) {
			seen.add(normalized);
			result.push(normalized);
		}
	}

	return selectsAll ? [] : result;
};

const firstDefinedAliasValue = (filters, aliases) => {
	for (const alias of aliases) {
		if (Object.prototype.hasOwnProperty.call(filters, alias)) {
			return filters[alias];
		}
	}

	return undefined;
};

export const normalizeDashboardFilters = (filters = {}) => {
	const source = filters && typeof filters === "object" ? filters : {};

	return {
		dateFrom: normalizeDate(firstDefinedAliasValue(source, CANONICAL_ALIASES.dateFrom)),
		dateTo: normalizeDate(firstDefinedAliasValue(source, CANONICAL_ALIASES.dateTo)),
		years: normalizeList(firstDefinedAliasValue(source, CANONICAL_ALIASES.years)),
		products: normalizeList(firstDefinedAliasValue(source, CANONICAL_ALIASES.products)),
		clients: normalizeList(firstDefinedAliasValue(source, CANONICAL_ALIASES.clients)),
		services: normalizeList(firstDefinedAliasValue(source, CANONICAL_ALIASES.services)),
		coordinators: normalizeList(firstDefinedAliasValue(source, CANONICAL_ALIASES.coordinators)),
		statuses: normalizeList(firstDefinedAliasValue(source, CANONICAL_ALIASES.statuses)),
		subclients: normalizeList(firstDefinedAliasValue(source, CANONICAL_ALIASES.subclients)),
		requesters: normalizeList(firstDefinedAliasValue(source, CANONICAL_ALIASES.requesters)),
		states: normalizeList(firstDefinedAliasValue(source, CANONICAL_ALIASES.states)),
		managers: normalizeList(firstDefinedAliasValue(source, CANONICAL_ALIASES.managers)),
	};
};

const listToSql = (value) => (value.length ? value.join(",") : null);

export const mapDashboardFiltersToSql = (filters = {}, options = {}) => {
	const {
		allowedParams = DEFAULT_SQL_PARAMS,
		dateRangeMode = "complete",
		includeDateRange = true,
		includeStatus = true,
		includeSubclient = true,
		nullMissing = true,
	} = options;

	const allowed = new Set(allowedParams);
	const normalized = normalizeDashboardFilters(filters);
	const hasDateRange =
		dateRangeMode === "any"
			? Boolean(normalized.dateFrom || normalized.dateTo)
			: Boolean(normalized.dateFrom && normalized.dateTo);

	const valuesByParam = {
		FECHA_INICIO: includeDateRange && hasDateRange ? normalized.dateFrom : null,
		FECHA_FIN: includeDateRange && hasDateRange ? normalized.dateTo : null,
		YEARS: hasDateRange ? null : listToSql(normalized.years),
		PRODUCT: listToSql(normalized.products),
		CLIENT: listToSql(normalized.clients),
		SERVICES: listToSql(normalized.services),
		COORDINATOR: listToSql(normalized.coordinators),
		STATUS: includeStatus ? listToSql(normalized.statuses) : null,
		SUBCLIENTE: includeSubclient ? listToSql(normalized.subclients) : null,
		SOLICITANTE: listToSql(normalized.requesters),
		ESTADO: listToSql(normalized.states),
		GESTOR: listToSql(normalized.managers),
	};

	return DEFAULT_SQL_PARAMS.reduce((accumulator, param) => {
		if (!allowed.has(param)) return accumulator;
		if (!includeDateRange && (param === "FECHA_INICIO" || param === "FECHA_FIN")) {
			return accumulator;
		}
		if (!includeStatus && param === "STATUS") return accumulator;
		if (!includeSubclient && param === "SUBCLIENTE") return accumulator;

		const value = valuesByParam[param];
		if (value !== null || nullMissing) {
			accumulator[param] = value;
		}

		return accumulator;
	}, {});
};

export const buildFilters = (filters = {}) => {
	const normalized = normalizeDashboardFilters(filters);

	return Object.entries(SQL_PARAM_BY_CANONICAL_KEY).reduce(
		(accumulator, [canonicalKey, sqlParam]) => {
			const value = normalized[canonicalKey];
			const normalizedValue = Array.isArray(value) ? listToSql(value) : value;

			if (normalizedValue !== null) {
				accumulator[sqlParam] = normalizedValue;
			}

			return accumulator;
		},
		{},
	);
};
