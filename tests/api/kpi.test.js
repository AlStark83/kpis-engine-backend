import request from "supertest";
import app from "../../src/app.js";

test("POST /api/kpis/run responde correctamente", async () => {
  const res = await request(app)
    .post("/api/kpis/run")
    .send({ kpi: "tiempo_gestion", filters: {} });

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
});