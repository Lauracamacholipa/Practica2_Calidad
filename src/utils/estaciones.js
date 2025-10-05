/* src/utils/estaciones.js */
import { estacionesLista } from '../data/mockEstaciones.js';


export function obtenerEstaciones() {
  
  const adicionales = JSON.parse(localStorage.getItem("nuevasEstaciones") || "[]");
  return [...estacionesLista, ...adicionales];
}
