// /src/formatters/table.formatter.js
// /src/formatters/table.formatter.js

export const tableFormatter = ({ data, config = {} }) => {
	return {
		type: "table",
		title: config.title ?? data.title ?? "",
		columns: data.columns ?? [],
		rows: data.rows ?? [],
		meta: config.meta ?? null,
	};
};
