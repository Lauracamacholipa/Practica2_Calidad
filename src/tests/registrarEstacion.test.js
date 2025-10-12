import registrarEstacion from '../modules/estacion/registrarEstacion.js';
// Mock del localStorage
beforeEach(() => {
  global.localStorage = {
    getItem: jest.fn(() => "[]"),
    setItem: jest.fn()
  };
});

describe('registrarEstacion - Cobertura completa (8 rutas)', () => {
  // R1: Nombre inválido o vacío
  it('R1: debería devolver "" si el nombre es inválido o vacío', () => {
    const resultado = registrarEstacion({ nombre: "", zona: "Norte" });
    expect(resultado).toBe("");
  }); 
  // R2: Solo nombre válido
  it('R2: debería devolver objeto con solo nombre si zona, dirección y combustibles no son válidos', () => {
    const resultado = registrarEstacion({ nombre: "Estación A" });
    expect(resultado).toEqual({ nombre: "Estación A" });
  });
  // R3: Nombre y zona válidos
  it('R3: debería devolver objeto con nombre y zona válidos', () => {
    const resultado = registrarEstacion({
      nombre: "Estación B",
      zona: "Sur"
    });
    expect(resultado).toEqual({ nombre: "Estación B", zona: "Sur" });
  });
});
