// /src/formatters/index.js
import { cardFormatter } from "./card.formatter.js";
import { chartFormatter } from "./chart.formatter.js";
import { tableFormatter } from "./table.formatter.js";
import { cargaCoordinadoresFormatter } from "./cargaCoordinadores.formatter.js";
import { cargaGestoresFormatter } from "./cargaGestores.formatter.js";

export const FORMATTERS = {
	card: cardFormatter,
	chart: chartFormatter,
	table: tableFormatter,
	carga_gestores: cargaGestoresFormatter,
	carga_coordinadores: cargaCoordinadoresFormatter,
	
};
