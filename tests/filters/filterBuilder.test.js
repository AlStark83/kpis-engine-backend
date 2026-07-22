import {
	buildFilters,
	mapDashboardFiltersToSql,
	normalizeDashboardFilters,
} from "../../src/filters/filterBuilder.js";

describe("dashboard filter normalization", () => {
	test("normaliza filtros vacios", () => {
		expect(normalizeDashboardFilters({})).toEqual({
			dateFrom: null,
			dateTo: null,
			years: [],
			products: [],
			clients: [],
			services: [],
			coordinators: [],
			statuses: [],
			subclients: [],
			requesters: [],
			states: [],
			managers: [],
		});
	});

	test("acepta aliases actuales, canonicos y SQL", () => {
		expect(
			normalizeDashboardFilters({
				fechaInicio: "2026-06-01",
				FECHA_FIN: "2026-06-30T10:20:30.000Z",
				anio: 2026,
				products: ["1"],
				CLIENT: "10",
				servicio: "20",
				COORDINATOR: "coor-1",
				estatus: "2",
				subclients: "30",
				SOLICITANTE: "user-1",
				estado: "5",
				managers: "7",
			}),
		).toMatchObject({
			dateFrom: "2026-06-01",
			dateTo: "2026-06-30",
			years: ["2026"],
			products: ["1"],
			clients: ["10"],
			services: ["20"],
			coordinators: ["coor-1"],
			statuses: ["2"],
			subclients: ["30"],
			requesters: ["user-1"],
			states: ["5"],
			managers: ["7"],
		});
	});

	test("normaliza seleccion multiple, nulos, vacios y duplicados", () => {
		const result = normalizeDashboardFilters({
			cliente: ["A", "", null, "A", "B"],
			gestor: "1,2,2, 3 ",
		});

		expect(result.clients).toEqual(["A", "B"]);
		expect(result.managers).toEqual(["1", "2", "3"]);
	});

	test("TODOS equivale a no filtrar esa dimension", () => {
		const result = normalizeDashboardFilters({
			cliente: ["TODOS", "Cliente A"],
			producto: "ALL",
			estado: "*",
		});

		expect(result.clients).toEqual([]);
		expect(result.products).toEqual([]);
		expect(result.states).toEqual([]);
	});

	test("conserva caracteres especiales en valores", () => {
		const result = normalizeDashboardFilters({
			cliente: ["Cliente & Asociados", "Norte/Sureste", "A+B"],
		});

		expect(result.clients).toEqual([
			"Cliente & Asociados",
			"Norte/Sureste",
			"A+B",
		]);
	});
});

describe("dashboard filter SQL mapping", () => {
	test("traduce filtros al contrato SQL de dashboard", () => {
		expect(
			mapDashboardFiltersToSql({
				dateFrom: "2026-06-01",
				dateTo: "2026-06-30",
				clients: ["Cliente A", "Cliente B"],
				managers: ["Gestor 1"],
			}),
		).toMatchObject({
			FECHA_INICIO: "2026-06-01",
			FECHA_FIN: "2026-06-30",
			YEARS: null,
			CLIENT: "Cliente A,Cliente B",
			GESTOR: "Gestor 1",
		});
	});

	test("usa YEARS cuando no hay rango completo de fechas", () => {
		expect(
			mapDashboardFiltersToSql({
				fechaInicio: "2026-06-01",
				anio: [2025, 2026],
			}),
		).toMatchObject({
			FECHA_INICIO: null,
			FECHA_FIN: null,
			YEARS: "2025,2026",
		});
	});

	test("permite rango parcial cuando el KPI lo requiere", () => {
		expect(
			mapDashboardFiltersToSql(
				{
					fechaInicio: "2026-06-01",
					anio: [2026],
				},
				{ dateRangeMode: "any" },
			),
		).toMatchObject({
			FECHA_INICIO: "2026-06-01",
			FECHA_FIN: null,
			YEARS: null,
		});
	});

	test("omite parametros deshabilitados por contrato de KPI", () => {
		const result = mapDashboardFiltersToSql(
			{
				estatus: "2",
				subcliente: "99",
				cliente: "10",
			},
			{
				includeStatus: false,
				includeSubclient: false,
			},
		);

		expect(result).not.toHaveProperty("STATUS");
		expect(result).not.toHaveProperty("SUBCLIENTE");
		expect(result.CLIENT).toBe("10");
	});

	test("respeta allowedParams para SPs de filtros existentes", () => {
		expect(
			mapDashboardFiltersToSql(
				{
					anio: 2026,
					cliente: "10",
					gestor: "20",
				},
				{ allowedParams: ["YEARS", "CLIENT"] },
			),
		).toEqual({
			YEARS: "2026",
			CLIENT: "10",
		});
	});

	test("buildFilters conserva el contrato compacto anterior", () => {
		expect(
			buildFilters({
				fechaInicio: "2026-06-01",
				cliente: ["A", "B"],
				producto: "TODOS",
			}),
		).toEqual({
			FECHA_INICIO: "2026-06-01",
			CLIENT: "A,B",
		});
	});
});
