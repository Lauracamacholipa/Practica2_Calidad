import { gasolinaAlcanzara } from "../utils/calculadoraColas.js";

describe("gasolinaAlcanzara - Cobertura completa (3 rutas)", () => {

  // R1: capacidad > vehiculos
  it('R1: debería indicar que sí alcanzará cuando la capacidad es mayor que los vehículos en cola', () => {
    expect(gasolinaAlcanzara(30, 400))
      .toBe("Sí alcanzará: Hay suficiente combustible para su turno");
  });

});
