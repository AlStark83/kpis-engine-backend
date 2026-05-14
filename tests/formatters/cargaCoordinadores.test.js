import { cargaCoordinadoresFormatter } from "../../src/formatters/cargaCoordinadores.formatter.js";

test("genera estructura correcta para UI", () => {
  const data = [
    { name: "Juan", value: 50 }
  ];

  const result = cargaCoordinadoresFormatter({ data });

  expect(result.type).toBe("card_list");
  expect(result.items.length).toBe(1);
  expect(result.summary).toBeDefined();
});