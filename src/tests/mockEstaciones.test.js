// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Importar funciones UNA SOLA VEZ al inicio
import { agregarAfila, agregarCombustibleExistente, estacionesLista } from '../data/mockEstaciones.js';

describe('agregarAfila() - Test 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
    
    // Configurar datos de prueba
    estacionesLista.length = 0;
    estacionesLista.push({
      nombre: "Gulf Norte",
      direccion: "Av. América #1256",
      zona: "Norte",
      combustibles: [
        { tipo: "Normal", cantidad: 850 },
        { tipo: "Diesel", cantidad: 600 }
      ],
      filaEspera: [
        { nombre: "Eduardo Quiroga", placa: "5678GPQ", tipo: "Normal" }
      ],
      filaTickets: []
    });
  });

  test('debe agregar conductor a fila de estación mock existente', () => {
    const datosConductor = {
      nombre: "Laura Test",
      placa: "TEST123", 
      tipo: "Normal"
    };

    const posicion = agregarAfila("Gulf Norte", datosConductor);

    expect(posicion).toBe(2); // Posición 2 (ya hay 1 en fila)
    expect(typeof posicion).toBe('number');
  });

  test('debe crear filaEspera si no existe en estación mock', () => {
    // Quitar filaEspera de una estación
    estacionesLista[0].filaEspera = undefined;

    const datosConductor = {
        nombre: "Test Sin Fila",
        placa: "NOFILE1",
        tipo: "Diesel"
    };

    const posicion = agregarAfila("Gulf Norte", datosConductor);

    expect(posicion).toBe(1); // Primera posición
    expect(estacionesLista[0].filaEspera).toBeDefined();
    expect(estacionesLista[0].filaEspera.length).toBe(1);
  });

  test('debe agregar conductor a estación en localStorage', () => {
    const estacionLocalStorage = {
        nombre: "Estación LocalStorage", 
        zona: "Norte",
        direccion: "Test 123",
        combustibles: [
        { tipo: "Especial", cantidad: 720 }
        ],
        filaEspera: []
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify([estacionLocalStorage]));

    const datosConductor = {
        nombre: "Conductor LocalStorage",
        placa: "LOCAL123",
        tipo: "Especial"
    };

    const posicion = agregarAfila("Estación LocalStorage", datosConductor);

    expect(posicion).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('debe retornar false si estación no existe', () => {
    const datosConductor = {
      nombre: "Test No Existe",
      placa: "NOEXIST",
      tipo: "Normal"
    };

    const resultado = agregarAfila("Estación Inexistente", datosConductor);

    expect(resultado).toBe(false);
  });

  test('debe manejar error en localStorage', () => {
    localStorageMock.getItem.mockImplementation(() => {
        throw new Error("Error de localStorage");
    });

    const datosConductor = {
        nombre: "Test Error",
        placa: "ERROR123",
        tipo: "Normal"
    };

    const resultado = agregarAfila("Estación Que No Existe En Mock", datosConductor);

    expect(resultado).toBe(false);
  });

  test('debe agregar conductor a estación en localStorage con fila existente', () => {
    const estacionLocalStorage = {
        nombre: "Estación LocalStorage Con Fila", 
        zona: "Norte",
        direccion: "Test 123",
        combustibles: [
        { tipo: "Especial", cantidad: 720 }
        ],
        filaEspera: [
        { nombre: "Conductor Existente", placa: "EXIST123", tipo: "Especial" }
        ] // ← FILA YA EXISTE CON 1 ELEMENTO
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify([estacionLocalStorage]));

    const datosConductor = {
        nombre: "Conductor Nuevo LocalStorage",
        placa: "NEWLOCAL",
        tipo: "Especial"
    };

    const posicion = agregarAfila("Estación LocalStorage Con Fila", datosConductor);

    expect(posicion).toBe(2); // ← POSICIÓN 2 (ya hay 1 en fila)
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});

// SEGUNDO DESCRIBE - SIN IMPORTAR NUEVAMENTE
describe('agregarCombustibleExistente() - Test 2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
    
    // Configurar datos de prueba limpios
    estacionesLista.length = 0;
    estacionesLista.push(
      {
        nombre: "Gulf Norte",
        direccion: "Av. América #1256",
        zona: "Norte",
        combustibles: [
          { tipo: "Normal", cantidad: 850 },
          { tipo: "Diesel", cantidad: 600 }
        ],
        filaEspera: [],
        filaTickets: []
      },
      {
        nombre: "YPFB Cala Cala", 
        direccion: "Av. Melchor Pérez #245",
        zona: "Norte",
        combustibles: [
          { tipo: "Especial", cantidad: 720 },
          { tipo: "Diesel", cantidad: 550 }
        ],
        filaEspera: [],
        filaTickets: []
      }
    );
  });

  // CAMINO 1: Estación en MOCK + Combustible EXISTE → Éxito
  test('debe agregar combustible a estación mock cuando combustible existe', () => {
    const resultado = agregarCombustibleExistente("Gulf Norte", "Normal", 100);
    
    expect(resultado).toBe("Se agregó 100 litros a Normal");
    expect(estacionesLista[0].combustibles[0].cantidad).toBe(950); // 850 + 100
  });

   // CAMINO 2: Estación en MOCK + Combustible NO existe → Error tipo
  test('debe retornar error cuando tipo de combustible no existe en estación mock', () => {
    const resultado = agregarCombustibleExistente("Gulf Norte", "Super", 100);
    
    expect(resultado).toBe('Tipo de combustible "Super" no registrado en esta estación');
    // Verificar que no se modificó ninguna cantidad
    expect(estacionesLista[0].combustibles[0].cantidad).toBe(850);
    expect(estacionesLista[0].combustibles[1].cantidad).toBe(600);
  });


});