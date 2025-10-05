/*src/utils/combustible.filters.js */
import { estacionesLista } from '../data/mockEstaciones.js';


export function ordenarPorCantidad(estaciones = []) {
  return [...estaciones].sort((a, b) => {
    const totalA = a.combustibles.reduce((acc, c) => acc + c.cantidad, 0);
    const totalB = b.combustibles.reduce((acc, c) => acc + c.cantidad, 0);
    return totalB - totalA; // De mayor a menor
  });
}

export function filtrarPorCombustible(tipo, estaciones = []) {
  if (tipo === "todos") return [...estaciones];

  const tiposValidos = ["Normal", "Especial", "Diesel", "Gas"];
  if (!tiposValidos.includes(tipo)) {
    throw new Error(`Tipo de combustible "${tipo}" no reconocido`);
  }

  return estaciones.filter(e => {
    const combustible = e.combustibles.find(c => c.tipo === tipo);
    return combustible && combustible.cantidad > 0;
  });
}

export function filtrarPorZona(zona, estaciones = estacionesLista) {
  // 👇 Primero verificamos si queremos todas las zonas
  if (zona === "todos") {
    return [...estaciones];
  }

  // Luego verificamos si la zona es válida
  const zonasValidas = ["Norte", "Sur", "Cercado", "Quillacollo", "Colcapirua"];
  if (!zonasValidas.includes(zona)) {
    throw new Error(`Zona "${zona}" no reconocida`);
  }

  // Filtramos solo por esa zona
  return estaciones.filter(e => e.zona === zona);
}

export function aplicarFiltrosCombinados({ zona, combustible, ordenar } = {}) {
  let resultado = obtenerEstaciones();

  if (zona && zona !== "todos") {
    resultado = filtrarPorZona(zona, resultado);
  }

  if (combustible && combustible !== "todos") {
    resultado = filtrarPorCombustible(combustible, resultado);
  }

  if (ordenar) {
    resultado = ordenarPorCantidad(resultado);
  }

  return resultado;
}
