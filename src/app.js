// /src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import kpiRoutes from "./api/kpi.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import { setStoredProcedureExecutor } from "./services/db.service.js";
import { conn } from "./db.js";
import { QueryTypes } from "sequelize";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;

setStoredProcedureExecutor(async ({ procedure, params }) => {
	if (!conn) {
		throw new Error("Database connection is not available");
	}

	const replacements = params || {};
	const keys = Object.keys(replacements);

	const paramString = keys.length
		? keys.map((key) => `@${key} = :${key}`).join(", ")
		: "";

	const query = paramString
		? `EXEC ${procedure} ${paramString}`
		: `EXEC ${procedure}`;

	const result = await conn.query(query, {
		replacements,
		type: QueryTypes.SELECT,
	});

	return result;
});

app.use(morgan("dev"));
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
	res.json({ message: "KPI Engine running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/kpis", kpiRoutes);
app.use("/kpi", kpiRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});


export default app;