import { executeKPI } from "../../src/core/engine.js";

// mock del SP
jest.mock("../../src/services/db.service.js", () => ({
  executeStoredProcedure: jest.fn(() =>
    Promise.resolve([
      { Coordinador: "Juan", PorcentajeConclusion: 50 }
    ])
  )
}));

test("executeKPI regresa estructura completa", async () => {
  const result = await executeKPI({
    kpi: "carga_coordinadores",
    filters: {}
  });

  expect(result.result.type).toBe("card_list");
  expect(result.result.items.length).toBeGreaterThan(0);
});