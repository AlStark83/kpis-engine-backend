export default {
	storedProcedure: "dbo.sp_Operaciones_total_reportes_por_gestor",
	adapter: "carga_gestores",
	formatter: "carga_gestores",

	mapFilters: (filters) => {
		const normalize = (value) => {
			if (!value || (Array.isArray(value) && value.length === 0)) {
				return null;
			}
			if (Array.isArray(value)) {
				return value.join(",");
			}
			return value;
		};

		return {
			YEARS: normalize(filters.anio),
			PRODUCT: normalize(filters.producto),
			CLIENT: normalize(filters.cliente),
			SERVICES: normalize(filters.servicio),
			COORDINATOR: normalize(filters.coordinador),
			STATUS: normalize(filters.estatus),
			SOLICITANTE: normalize(filters.solicitante),
			ESTADO: normalize(filters.estado),
			GESTOR: normalize(filters.gestor),
		};
	},
	meta: {
		type: "gestores",
	},
};
