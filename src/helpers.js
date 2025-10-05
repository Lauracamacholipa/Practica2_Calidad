// src/helpers.js

import { obtenerEstaciones as rawObtenerEstaciones } from "./utils/estaciones.js";

// Estado local para cargar solo una vez
let _estaciones = null;

// Obtiene las estaciones, pero solo carga una vez (hasta que se fuerce recargar)
function obtenerEstaciones() {
  if (!_estaciones) {
    _estaciones = rawObtenerEstaciones();
    console.log("📊 Estaciones cargadas por primera vez");
  }
  return [..._estaciones]; // Devuelve una copia para evitar mutaciones accidentadas
}

// Fuerza recargar las estaciones (ej: después de agregar/editar)
function recargarEstaciones() {
  _estaciones = null;
  return obtenerEstaciones();
}

/**
 * Rellena un <select> con las estaciones registradas
 * @param {HTMLSelectElement} select - El elemento <select> donde se mostrarán las opciones
 */
function cargarOpcionesEstaciones(select) {
  if (!select) return;

  const estaciones = obtenerEstaciones();

  // Limpiar el select antes de agregar nuevas opciones
  select.innerHTML = "";

  estaciones.forEach(estacion => {
    const option = document.createElement("option");
    option.value = estacion.nombre;
    option.textContent = `${estacion.nombre} (${estacion.zona})`;
    select.appendChild(option);
  });
}

/**
 * Escucha cambios globales y actualiza todos los <select> con data-estaciones
 */
function escucharActualizacionGlobal() {
  window.addEventListener("actualizarListaEstaciones", () => {
    const selects = document.querySelectorAll("[data-estaciones]");
    selects.forEach(select => {
      cargarOpcionesEstaciones(select);
    });
  });
}

// Iniciar escucha al cargar helpers
escucharActualizacionGlobal();

// Exportamos funciones públicas
export {
  cargarOpcionesEstaciones,
  obtenerEstaciones,
  recargarEstaciones
};