import { obtenerTodosLosTicketsAgrupados } from "./utils/ticket.js";

function mostrarTickets() {
  const container = document.querySelector("#lista-tickets");

  if (!container) return;

  const ticketsAgrupados = obtenerTodosLosTicketsAgrupados();

  // Limpiar contenedor
  container.innerHTML = '<h2>Tickets por Estación</h2>';

  if (Object.keys(ticketsAgrupados).length === 0) {
    container.innerHTML += "<p>No hay tickets registrados.</p>";
    return;
  }

  for (const [nombreEstacion, tickets] of Object.entries(ticketsAgrupados)) {
    if (tickets.length === 0) continue;

    const divEstacion = document.createElement("div");
    divEstacion.className = "ticket-estacion";
    divEstacion.style.marginBottom = "20px";
    divEstacion.innerHTML = `
      <h3>Tickets - ${nombreEstacion}</h3>
      <ul>
        ${tickets.map(t => `
          <li>
            Turno: <strong>${t.numeroTurno}</strong> |
            Nombre: <strong>${t.nombre}</strong> |
            Placa: <strong>${t.placa}</strong> |
            Fecha: <strong>${t.fechaCarga}</strong>
          </li>
        `).join("")}
      </ul>
    `;
    container.appendChild(divEstacion);
  }
  const btnVolver = document.createElement("button");
btnVolver.id = "btn-volver-estaciones-tickets";
btnVolver.textContent = "Volver";
btnVolver.classList.add("btn-secundario");
btnVolver.addEventListener("click", () => {
  document.querySelector("#lista-tickets").style.display = "none";
  document.querySelector("#seccion-estaciones").style.display = "block";
});

container.appendChild(btnVolver);

}

// Escuchar evento cuando se activa la vista
window.addEventListener("DOMContentLoaded", () => {
  mostrarTickets(); // Carga inicial, si fuera necesario
});

// Exportar por si se necesita recargar manualmente
export { mostrarTickets };
