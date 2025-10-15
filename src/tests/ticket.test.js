import { generarTicket, resetTickets, obtenerTodosLosTicketsAgrupados } from '../utils/ticket.js';

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
   it('Crea ticket cuando hay tickets de otra fecha o tipo (sin afectar turno)', () => {
    resetTickets([
      {
        nombre: 'Estacion Norte',
        filaTickets: [
          { numeroTurno: 5, tipoCombustible: 'Diesel', fechaCarga: '2025-10-07', nombre: 'Carlos' },
          { numeroTurno: 6, tipoCombustible: 'Especial', fechaCarga: '2025-10-09', nombre: 'Lucia' }
        ],
        filaEspera: []
      }
    ]);
    const nuevo = generarTicket('Estacion Norte', 'Gasolina', 'AAA999', 'Pedro', '2025-10-08');
    expect(nuevo.numeroTurno).toBe(1); 
    expect(nuevo.tipoCombustible).toBe('Gasolina');
  });
   it('No lanza error y ejecuta guardarEnLocalStorage correctamente (rama try/catch)', () => {
    const mockSet = jest.spyOn(localStorage, 'setItem');
    resetTickets([
      {
        nombre: 'Estacion Norte',
        filaTickets: [],
        filaEspera: []
      }
    ]);

    const nuevo = generarTicket('Estacion Norte', 'Gasolina', 'PPP111', 'Laura', '2025-10-10');
    expect(mockSet).toHaveBeenCalled(); 
    expect(nuevo.nombre).toBe('Laura');
    mockSet.mockRestore();
  });
/*----------------------------------------------------------*/ 

describe('obtenerTodosLosTicketsAgrupados', () => {
  
  it('retorna objeto vacío cuando no hay estaciones', () => {
    resetTickets([]); 
    const resultado = obtenerTodosLosTicketsAgrupados();
    expect(resultado).toEqual({});
  });

});
  it('ordena tickets por fecha cuando fechaCarga es diferente', () => {
    resetTickets([
      {
        nombre: 'Estacion Test',
        filaTickets: [
          { numeroTurno: 1, tipoCombustible: 'Gasolina', fechaCarga: '2025-10-10', nombre: 'Juan' },
          { numeroTurno: 2, tipoCombustible: 'Diesel', fechaCarga: '2025-10-08', nombre: 'Ana' }
        ],
        filaEspera: []
      }
    ]);
    
    const resultado = obtenerTodosLosTicketsAgrupados();
    
    expect(resultado['Estacion Test']).toHaveLength(2);
    expect(resultado['Estacion Test'][0].fechaCarga).toBe('2025-10-08');
    expect(resultado['Estacion Test'][1].fechaCarga).toBe('2025-10-10');
  });

  it('ordena tickets por numeroTurno cuando fechaCarga es igual', () => {
    resetTickets([
      {
        nombre: 'Estacion Test',
        filaTickets: [
          { numeroTurno: 3, tipoCombustible: 'Gasolina', fechaCarga: '2025-10-08', nombre: 'Pedro' },
          { numeroTurno: 1, tipoCombustible: 'Diesel', fechaCarga: '2025-10-08', nombre: 'Ana' },
          { numeroTurno: 2, tipoCombustible: 'Especial', fechaCarga: '2025-10-08', nombre: 'Luis' }
        ],
        filaEspera: []
      }
    ]);
    
    const resultado = obtenerTodosLosTicketsAgrupados();
    
    expect(resultado['Estacion Test']).toHaveLength(3);
    expect(resultado['Estacion Test'][0].numeroTurno).toBe(1);
    expect(resultado['Estacion Test'][1].numeroTurno).toBe(2);
    expect(resultado['Estacion Test'][2].numeroTurno).toBe(3);
  });




  
  
});
