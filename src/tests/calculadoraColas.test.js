import { gasolinaAlcanzara } from "../utils/calculadoraColas.js";

describe("gasolinaAlcanzara - Cobertura completa (3 rutas)", () => {

  // R1: capacidad > vehiculos
  it('R1: debería indicar que sí alcanzará cuando la capacidad es mayor que los vehículos en cola', () => {
    expect(gasolinaAlcanzara(30, 400))
      .toBe("Sí alcanzará: Hay suficiente combustible para su turno");
  });
 // R2: capacidad === vehiculos
  it('R2: debería mostrar advertencia cuando la capacidad es igual al número de vehículos', () => {
    expect(gasolinaAlcanzara(60, 500))
      .toBe("Advertencia: El combustible justo alcanza, mejor ir a otro surtidor para no arriesgarse");
  });
 // R3: capacidad < vehiculos
  it('R3: debería indicar que no alcanzará cuando la capacidad es menor que los vehículos en cola', () => {
    expect(gasolinaAlcanzara(120, 300))
      .toBe("No alcanzará: El combustible no cubrirá su posición en la cola");
  });
});
