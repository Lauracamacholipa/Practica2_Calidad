/*src/utils/combustible.filters.js */
import { estacionesLista, obtenerEstaciones } from "../data/mockEstaciones.js";



export function ordenarPorCantidad(estaciones = []) {
  return [...estaciones].sort((a, b) => {
    const totalA = a.combustibles.reduce((acc, c) => acc + c.cantidad, 0);
    const totalB = b.combustibles.reduce((acc, c) => acc + c.cantidad, 0);
    return totalB - totalA; // De mayor a menor
  });
}

export function filtrarPorCombustible(tipo, estaciones = []) { //INICIO
  if (tipo === "todos") return [...estaciones]; //[2] -> Decision

  const tiposValidos = ["Normal", "Especial", "Diesel", "Gas"]; //[3]
  if (!tiposValidos.includes(tipo)) { //[4] -> Decision
    throw new Error(`Tipo de combustible "${tipo}" no reconocido`); //[5]
  }

  return estaciones.filter(e => { //[6]
    const combustible = e.combustibles.find(c => c.tipo === tipo);
    return combustible && combustible.cantidad > 0;
  });
} // FIN

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
