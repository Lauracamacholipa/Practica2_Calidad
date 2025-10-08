// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Importar funciones
import { agregarAfila, estacionesLista } from '../data/mockEstaciones.js';

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

});