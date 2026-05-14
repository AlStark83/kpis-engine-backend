import { cargaCoordinadoresAdapter } from "../../src/adapters/cargaCoordinadores.adapter.js";

test("transforma correctamente los datos del SP", () => {
  const input = [
    { Coordinador: "Juan", PorcentajeConclusion: 50 }
  ];

  const result = cargaCoordinadoresAdapter({ rows: input });

  expect(result).toEqual([
    { name: "Juan", value: 50 }
  ]);
});