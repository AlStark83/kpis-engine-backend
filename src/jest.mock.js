import { jest } from "@jest/globals";

// 🔥 MOCK DB
jest.unstable_mockModule("../../src/services/db.service.js", () => ({
  executeStoredProcedure: jest.fn(() =>
    Promise.resolve([
      { Coordinador: "Juan", PorcentajeConclusion: 50 }
    ])
  )
}));

// 🔥 MOCK REGISTRY (ESTO ES LO QUE FALTABA)
jest.unstable_mockModule("../../src/core/registry.js", () => ({
  getKPIConfig: jest.fn(async () => ({
    key: "carga_coordinadores",
    storedProcedure: "fake_sp",
    adapter: "carga_coordinadores",
    formatter: "carga_coordinadores",
    mapFilters: () => ({})
  }))
}));

// 🔥 IMPORT DESPUÉS DE LOS MOCKS
const { executeKPI } = await import("../../src/core/engine.js");

test("executeKPI regresa estructura completa", async () => {
  const result = await executeKPI({
    kpi: "carga_coordinadores",
    filters: {}
  });

  expect(result.result.type).toBe("card_list");
  expect(result.result.items.length).toBeGreaterThan(0);
});