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
});