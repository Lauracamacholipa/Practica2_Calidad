import registrarEstacion from '../modules/estacion/registrarEstacion.js';
import { estacionesLista } from '../data/mockEstaciones.js';

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
   // R4: Nombre, zona y dirección válidos, sin combustibles válidos
  it('R4: debería devolver objeto con nombre, zona y dirección si combustibles es inválido', () => {
    const resultado = registrarEstacion({
      nombre: "Estación C",
      zona: "Cercado",
      direccion: "Av. Blanco Galindo",
      combustibles: "no-array"
    });
    expect(resultado).toEqual({
      nombre: "Estación C",
      zona: "Cercado",
      direccion: "Av. Blanco Galindo"
    });
  });
  // R5: Todos los campos válidos y estación nueva
  it('R5: debería registrar correctamente una estación nueva', () => {
    const resultado = registrarEstacion({
      nombre: "Estación Nueva",
      zona: "Norte",
      direccion: "Calle 10",
      combustibles: ["Diesel"]
    });
    expect(resultado).toEqual({
      nombre: "Estación Nueva",
      zona: "Norte",
      direccion: "Calle 10",
      combustibles: [{ tipo: "Diesel", cantidad: 0 }]
    });
  });
  // R6: Error al leer localStorage pero sin duplicado
  it('R6: debería devolver resultado válido aunque localStorage falle', () => {
    global.localStorage.getItem = jest.fn(() => { throw new Error("Error de lectura"); });

    const resultado = registrarEstacion({
      nombre: "Estación Falla",
      zona: "Este",
      direccion: "Av. Heroínas",
      combustibles: ["Normal"]
    });

    expect(resultado.nombre).toBe("Estación Falla");
  });
  // R7: Estación duplicada existente (ya en lista)
  it('R7: debería detectar estación duplicada existente', () => {
    const estacionDuplicada = {
      nombre: estacionesLista[0].nombre,
      zona: estacionesLista[0].zona,
      direccion: estacionesLista[0].direccion,
      combustibles: estacionesLista[0].combustibles.map(c => c.tipo)
    };

    const resultado = registrarEstacion(estacionDuplicada);
    expect(resultado).toBe("Estacion de servicio ya existente");
  });
   // R8: Error en localStorage + estación duplicada
  it('R8: debería retornar mensaje de duplicado incluso si localStorage falla', () => {
    global.localStorage.getItem = jest.fn(() => { throw new Error("Error de lectura"); });

    const estacionDuplicada = {
      nombre: estacionesLista[0].nombre,
      zona: estacionesLista[0].zona,
      direccion: estacionesLista[0].direccion,
      combustibles: estacionesLista[0].combustibles.map(c => c.tipo)
    };

    const resultado = registrarEstacion(estacionDuplicada);
    expect(resultado).toBe("Estacion de servicio ya existente");
  });
});
