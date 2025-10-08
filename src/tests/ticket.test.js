import { generarTicket, resetTickets } from '../utils/ticket.js';

beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn(() => "[]"),
    setItem: jest.fn(),
  };
  jest.spyOn(console, 'error').mockImplementation(() => {}); // silencia logs de errores
});

describe('generarTicket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetTickets([
      {
        nombre: 'Estacion Norte',
        filaTickets: [
          { numeroTurno: 1, tipoCombustible: 'Gasolina', fechaCarga: '2025-10-08', nombre: 'Pedro' },
          { numeroTurno: 2, tipoCombustible: 'Gasolina', fechaCarga: '2025-10-08', nombre: 'Ana' }
        ],
        filaEspera: []
      }
    ]);
  });

  it('crea ticket con turno siguiente (tickets previos del mismo tipo y fecha)', () => {
    const nuevo = generarTicket('Estacion Norte', 'Gasolina', 'ABC123', 'Juan', '2025-10-08');
    expect(nuevo.numeroTurno).toBe(3);
    expect(nuevo.tipoCombustible).toBe('Gasolina');
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  it('Lanza error si faltan datos', () => {
    expect(() => generarTicket('', 'Gasolina', 'ABC123', 'Juan', '2025-10-08'))
      .toThrow('Todos los campos son obligatorios.');
  });
   it('Lanza error si la estación no existe', () => {
    expect(() => generarTicket('Estacion Fantasma', 'Gasolina', 'AAA111', 'Juan', '2025-10-08'))
      .toThrow('Estación no encontrada.');
  });
  it('Lanza error si el conductor ya tiene ticket activo', () => {
    resetTickets([
      {
        nombre: 'Estacion Norte',
        filaTickets: [{ numeroTurno: 1, tipoCombustible: 'Gasolina', fechaCarga: '2025-10-08', nombre: 'Juan' }],
        filaEspera: []
      }
    ]);
    expect(() => generarTicket('Estacion Norte', 'Gasolina', 'ABC123', 'Juan', '2025-10-08'))
      .toThrow('Ya tiene un ticket activo.');
  });
  it('Crea ticket correctamente si no hay tickets previos del mismo tipo', () => {
    resetTickets([
      {
        nombre: 'Estacion Norte',
        filaTickets: [],
        filaEspera: []
      }
    ]);
    const nuevo = generarTicket('Estacion Norte', 'Diesel', 'XYZ999', 'Carlos', '2025-10-09');
    expect(nuevo.numeroTurno).toBe(1);
  });

   it('Lanza error si el conductor tiene ticket activo en la fila de espera', () => {
    resetTickets([
      {
        nombre: 'Estacion Norte',
        filaTickets: [],
        filaEspera: [{ nombre: 'Juan' }]
      }
    ]);
    expect(() =>
      generarTicket('Estacion Norte', 'Gasolina', 'XYZ123', 'Juan', '2025-10-08')
    ).toThrow('Ya tiene un ticket activo.');
  });

  
  
});
