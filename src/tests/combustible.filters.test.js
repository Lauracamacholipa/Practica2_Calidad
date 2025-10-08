// tests/combustible.filters.test.js
import { aplicarFiltrosCombinados } from '../src/utils/combustible.filters.js';

describe('aplicarFiltrosCombinados', () => {
  it('debería ejecutarse sin errores con filtros vacíos', () => {
    const resultado = aplicarFiltrosCombinados();
    expect(Array.isArray(resultado)).toBe(true);
  });
});
