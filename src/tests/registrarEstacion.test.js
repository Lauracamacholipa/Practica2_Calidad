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
});
