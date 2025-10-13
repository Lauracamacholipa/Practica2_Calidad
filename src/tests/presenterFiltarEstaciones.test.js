/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

document.body.innerHTML = `
  <select id="filtro-zona"></select>
  <input type="checkbox" id="checkbox-ordenar">
  <div id="lista-estaciones"></div>
  <select id="filtro-combustible"></select>
`;

jest.mock('../utils/estaciones.js', () => ({
  obtenerEstaciones: jest.fn(),
}));

jest.mock('../utils/combustible.filters.js', () => ({
  filtrarPorZona: jest.fn(),
  filtrarPorCombustible: jest.fn(),
  ordenarPorCantidad: jest.fn(),
}));

const { actualizarVista } = require('../presenterFiltrarEstaciones.js');
const { obtenerEstaciones } = require('../utils/estaciones.js');

// 🧪 4️⃣ Tests
describe('actualizarVista', () => {
  let container;

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.querySelector("#lista-estaciones");
  });

  it('muestra todas las estaciones sin filtros ni orden', () => {
    obtenerEstaciones.mockReturnValue([
      { nombre: 'E1', zona: 'Norte', direccion: 'A', combustibles: [], filaEspera: [], filaTickets: [] }
    ]);

    actualizarVista();

    expect(obtenerEstaciones).toHaveBeenCalled();
    expect(container.querySelectorAll('.tarjeta-estacion').length).toBe(1);
    expect(container.innerHTML).toContain('E1');
  });
});
