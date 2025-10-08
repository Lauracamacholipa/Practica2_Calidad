beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn(() => "[]"),
    setItem: jest.fn(),
  };
});

import { aplicarFiltrosCombinados } from '../utils/combustible.filters.js';

const mockEstaciones = [
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
];

// Mock correcto apuntando al módulo donde se importa obtenerEstaciones
jest.mock('../data/mockEstaciones.js', () => {
  const originalModule = jest.requireActual('../data/mockEstaciones.js');
  return {
    ...originalModule,
    obtenerEstaciones: jest.fn(() => mockEstaciones)
  };
});

describe('aplicarFiltrosCombinados', () => {
  // Ruta 1: Ningún filtro aplicado
  it('debería devolver todas las estaciones sin filtros', () => {
    const resultado = aplicarFiltrosCombinados({
      zona: "todos",
      combustible: "todos",
      ordenar: false
    });
    expect(resultado).toHaveLength(mockEstaciones.length);
    expect(resultado).toEqual(expect.arrayContaining(mockEstaciones));
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
});
