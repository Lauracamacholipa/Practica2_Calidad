import { aplicarFiltrosCombinados } from '../src/utils/combustible.filters.js';

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

jest.mock('../src/utils/combustible.filters.js', () => {
  const originalModule = jest.requireActual('../src/utils/combustible.filters.js');
  return {
    ...originalModule,
    obtenerEstaciones: jest.fn(() => mockEstaciones)
  };
});

describe('aplicarFiltrosCombinados', () => {
  it('debería ejecutarse correctamente con datos mockeados', () => {
    const { aplicarFiltrosCombinados } = require('../src/utils/combustible.filters.js');
    const resultado = aplicarFiltrosCombinados();
    expect(resultado.length).toBe(mockEstaciones.length);
  });
});
