import { obtenerEstaciones } from "./utils/estaciones.js";

// Contenedor donde se mostrarán las estaciones
const container = document.querySelector("#lista-estaciones");

if (container) {
  // Cargar estaciones al cargar la página
  window.addEventListener("DOMContentLoaded", () => {
    const estaciones = obtenerEstaciones();

    if (estaciones.length === 0) {
      container.innerHTML = "<p>No hay estaciones registradas.</p>";
      return;
    }

    // Limpiar contenido previo
    container.innerHTML = "";

    // Generar tarjetas dinámicas
    estaciones.forEach(estacion => {
      // Fila de espera
      const cantidadEnFila = estacion.filaEspera?.length || 0;
      const ultimaPlaca = cantidadEnFila > 0 ? estacion.filaEspera[cantidadEnFila - 1]?.placa : "—";

      // Fila de tickets
      const cantidadTickets = estacion.filaTickets?.length || 0;

      const div = document.createElement("div");
      div.className = "tarjeta-estacion";
      div.innerHTML = `
        <h3>${estacion.nombre}</h3>
        <p><strong>Zona:</strong> ${estacion.zona}</p>
        <p><strong>Dirección:</strong> ${estacion.direccion}</p>

        <p><strong>Combustibles:</strong></p>
        <ul>
          ${estacion.combustibles.map(c => `<li>${c.tipo} (${c.cantidad} litros)</li>`).join("")}
        </ul>

        <p><strong>Fila de Espera:</strong></p>
        <ul>
          <li>Total en fila: <strong>${cantidadEnFila}</strong></li>
          <li>Última placa: <strong>${ultimaPlaca}</strong></li>
        </ul>

        <p><strong>Tickets:</strong></p>
        <ul>
          <li>Cantidad de tickets registrados: <strong>${cantidadTickets}</strong></li>
        </ul>

        <hr />
      `;
      container.appendChild(div);
    });
  });
}