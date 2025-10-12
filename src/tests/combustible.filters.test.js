import { aplicarFiltrosCombinados, filtrarPorCombustible } from '../utils/combustible.filters.js';

// Mock solo para obtenerEstaciones
jest.mock('../data/mockEstaciones.js', () => {
  const originalModule = jest.requireActual('../data/mockEstaciones.js');
  return {
    ...originalModule,
    obtenerEstaciones: jest.fn(() => [
      {
        nombre: "Estación Norte",
        zona: "Norte",
        combustibles: [
          { tipo: "Normal", cantidad: 500 },
          { tipo: "Diesel", cantidad: 100 }
        ]
      },
      {
        nombre: "Estación Sur",
        zona: "Sur",
        combustibles: [
          { tipo: "Especial", cantidad: 300 },
          { tipo: "Gas", cantidad: 0 }
        ]
      },
      {
        nombre: "Estación Cercado",
        zona: "Cercado",
        combustibles: [
          { tipo: "Normal", cantidad: 200 },
          { tipo: "Diesel", cantidad: 50 }
        ]
      }
    ])
  };
});

// Mock console para evitar output en tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('aplicarFiltrosCombinados', () => {
  // Ruta 1: Ningún filtro aplicado
  it('debería devolver todas las estaciones sin filtros', () => {
    const resultado = aplicarFiltrosCombinados({
      zona: "todos",
      combustible: "todos",
      ordenar: false
    });
    expect(resultado).toHaveLength(3);
  });

  // Ruta 2: Solo filtro por zona
  it('debería filtrar solo por zona', () => {
    const resultado = aplicarFiltrosCombinados({
      zona: "Norte",
      combustible: "todos",
      ordenar: false
    });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe("Estación Norte");
  });

  // Ruta 3: Solo filtro por combustible
  it('debería filtrar solo por combustible', () => {
    const resultado = aplicarFiltrosCombinados({
      zona: "todos",
      combustible: "Normal",
      ordenar: false
    });
    expect(resultado).toHaveLength(2);
    expect(resultado).toEqual(expect.arrayContaining([
      expect.objectContaining({ nombre: "Estación Norte" }),
      expect.objectContaining({ nombre: "Estación Cercado" })
    ]));
  });

  // Ruta 4: Solo ordenar
  it('debería ordenar todas las estaciones', () => {
    const resultado = aplicarFiltrosCombinados({
      zona: "todos",
      combustible: "todos",
      ordenar: true
    });
    expect(resultado).toHaveLength(3);
  });

  // Ruta 5: Zona + Combustible
  it('debería filtrar por zona y combustible', () => {
    const resultado = aplicarFiltrosCombinados({
      zona: "Norte",
      combustible: "Normal",
      ordenar: false
    });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe("Estación Norte");
  });

  // Ruta 6: Zona + Ordenar
  it('debería filtrar por zona y ordenar', () => {
    const resultado = aplicarFiltrosCombinados({
      zona: "Norte",
      combustible: "todos",
      ordenar: true
    });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe("Estación Norte");
  });

  // Ruta 7: Combustible + Ordenar
  it('debería filtrar por combustible y ordenar', () => {
    const resultado = aplicarFiltrosCombinados({
      zona: "todos",
      combustible: "Normal",
      ordenar: true
    });
    expect(resultado).toHaveLength(2);
    expect(resultado).toEqual(expect.arrayContaining([
      expect.objectContaining({ nombre: "Estación Norte" }),
      expect.objectContaining({ nombre: "Estación Cercado" })
    ]));
  });

  // Ruta 8: Zona + Combustible + Ordenar
  it('debería filtrar por zona, combustible y ordenar', () => {
    const resultado = aplicarFiltrosCombinados({
      zona: "Norte",
      combustible: "Normal",
      ordenar: true
    });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe("Estación Norte");
  });
});

describe('filtrarPorCombustible', () => {
  // Mock de estaciones para las pruebas de filtrado
  const mockEstacionesFiltro = [
    {
      nombre: "Estación A",
      combustibles: [
        { tipo: "Normal", cantidad: 500 },
        { tipo: "Diesel", cantidad: 100 }
      ]
    },
    {
      nombre: "Estación B", 
      combustibles: [
        { tipo: "Normal", cantidad: 0 }, 
        { tipo: "Especial", cantidad: 300 }
      ]
    },
    {
      nombre: "Estación C",
      combustibles: [
        { tipo: "Diesel", cantidad: 200 },
        { tipo: "Gas", cantidad: 150 }
      ]
    },
    {
      nombre: "Estación D",
      combustibles: [
        { tipo: "Normal", cantidad: 800 },
        { tipo: "Especial", cantidad: 400 }
      ]
    }
  ];

  // TC1: Camino P1 - Tipo "todos"
  it('debería retornar todas las estaciones cuando tipo es "todos"', () => {
    const resultado = filtrarPorCombustible("todos", mockEstacionesFiltro);
    
    expect(resultado).toHaveLength(4);
    expect(resultado).toEqual(mockEstacionesFiltro);
  });

});