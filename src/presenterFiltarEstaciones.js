import { obtenerEstaciones } from "./utils/estaciones.js";
import {
  filtrarPorZona,
  ordenarPorCantidad,
  filtrarPorCombustible
} from "./utils/combustible.filters.js";

// Importamos la calculadora
import {
  calcularVehiculosEnCola,
  calcularCapacidadCarga,
  gasolinaAlcanzara
} from "./utils/calculadoraColas.js";

// Elementos del DOM
const filtroZona = document.querySelector("#filtro-zona");
const checkboxOrdenar = document.querySelector("#checkbox-ordenar");
const container = document.querySelector("#lista-estaciones");
const filtroCombustible = document.querySelector("#filtro-combustible");

let estadoActual = {
  zona: "todos",
  combustible: "todos",
  ordenar: false
};

/**
 * Formatea una fecha ISO a un formato más legible
 */
function formatearFecha(fechaISO) {
  const opciones = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
}

/**
 * Genera HTML con los tickets agrupados por fecha
 * @param {Array} tickets - Lista de tickets
 * @returns {string} HTML listo para insertar
 */
function generarTicketsHTML(tickets) {
  if (!tickets || tickets.length === 0) {
    return "<p><strong>Tickets:</strong></p><ul><li>No hay tickets registrados.</li></ul>";
  }

  // Agrupamos por fecha
  const ticketsPorFecha = {};

  tickets.forEach(ticket => {
    const fecha = ticket.fechaCarga;

    if (!ticketsPorFecha[fecha]) {
      ticketsPorFecha[fecha] = [];
    }

    ticketsPorFecha[fecha].push(ticket);
  });

  let html = "<p><strong>Tickets activos:</strong></p><ul>";

  for (const [fecha, lista] of Object.entries(ticketsPorFecha)) {
    const esHoy = fecha === new Date().toISOString().split("T")[0];
    const ultimaPlaca = lista[lista.length - 1]?.placa || "—";

    html += `
      <li>
        <strong>${esHoy ? "Hoy" : formatearFecha(fecha)} (${fecha})</strong>: 
        Total: ${lista.length} - Última placa: ${ultimaPlaca}
      </li>
    `;
  }

  html += "</ul>";

  return html;
}

/**
 * Genera HTML con el cálculo de disponibilidad de cada tipo de combustible
 * @param {Object} estacion - Estación actual
 * @returns {string} HTML listo para insertar
 */
function generarCalculoCombustibleHTML(estacion) {
  const vehiculosEnCola = estacion.filaEspera?.length || 0;
  let html = "<p><strong>Análisis de disponibilidad:</strong></p><ul>";

  estacion.combustibles.forEach(c => {
    const capacidad = calcularCapacidadCarga(c.cantidad);
    const mensaje = gasolinaAlcanzara(vehiculosEnCola, capacidad);

    let icono = "";
    if (c.cantidad <= 0) {
    icono = "❌ No hay combustible, lo sentimos, busque otro surtidor"; // Si no hay combustible, no alcanza
    } else if (capacidad > vehiculosEnCola) {
    icono = "✅ La probabilidad de recargar combustible es optima";
    } else if (capacidad === vehiculosEnCola && vehiculosEnCola > 0) {
    icono = "⚠️ La osibilidad de recargar combustible es muy justa, le recomendamos buscar otro surtidor";
    } else {
    icono = "❌ No alcanzará";
    }

    html += `<li><strong>${c.tipo}:</strong> ${icono}</li>`;
  });

  html += "</ul>";
  return html;
}

function actualizarVista() {
  let resultado = obtenerEstaciones();

  // Filtro por Zona
  if (estadoActual.zona !== "todos") {
    resultado = filtrarPorZona(estadoActual.zona, resultado);
  }

  // Filtro por Combustible
  if (estadoActual.combustible !== "todos") {
    resultado = filtrarPorCombustible(estadoActual.combustible, resultado);
  }

  // Ordenar si está activo
  if (estadoActual.ordenar) {
    resultado = ordenarPorCantidad(resultado);
  }

  // Limpiar contenedor
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  if (resultado.length === 0) {
    container.innerHTML = "<p>No hay estaciones que coincidan con los filtros.</p>";
    return;
  }

  // Mostrar tarjetas
  resultado.forEach(estacion => {
    const totalEnFila = estacion.filaEspera?.length || 0;
    const ultimaPlaca = (estacion.filaEspera && estacion.filaEspera.length > 0)
      ? estacion.filaEspera[totalEnFila - 1]?.placa
      : '—';

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

      <p><strong>Fila de espera:</strong></p>
      <ul>
        <li>Total en cola: <strong>${totalEnFila}</strong></li>
        <li>Última placa registrada: <strong>${ultimaPlaca}</strong></li>
      </ul>
      

      <!-- Tickets agrupados por fecha -->
      ${generarTicketsHTML(estacion.filaTickets)}

      <!-- Análisis de disponibilidad -->
      <!-- Botón para calcular disponibilidad -->
<button class="btn-calcular-colas" data-estacion='${JSON.stringify(estacion)}'>Calcular Colas</button>
<div class="resultado-colas" id="resultado-colas-${estacion.nombre.replace(/\s/g, "")}"></div>

      <button class="btn-agregar-combustible" data-estacion="${estacion.nombre}">Agregar Combustible</button>
      <button class="btn-agregar-fila" data-estacion="${estacion.nombre}">Agregar a Fila</button>
      <button class="btn-generar-ticket" data-estacion="${estacion.nombre}">Generar Ticket</button>



      <hr />
    `;
    container.appendChild(div);
  });
}
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-calcular-colas")) {
    const estacionData = JSON.parse(e.target.getAttribute("data-estacion"));
    const contenedorResultado = document.querySelector(`#resultado-colas-${estacionData.nombre.replace(/\s/g, "")}`);

    if (!contenedorResultado) return;

    const vehiculosEnCola = estacionData.filaEspera?.length || 0;
    let html = "<p><strong>Análisis de disponibilidad:</strong></p><ul>";

    estacionData.combustibles.forEach(c => {
      const capacidad = calcularCapacidadCarga(c.cantidad);
      const mensaje = gasolinaAlcanzara(vehiculosEnCola, c.cantidad);

      let icono = "";
      if (c.cantidad <= 0) {
        icono = "❌ No hay combustible, lo sentimos, busque otro surtidor";
      } else if (capacidad > vehiculosEnCola) {
        icono = "✅ La probabilidad de recargar combustible es óptima";
      } else if (capacidad === vehiculosEnCola && vehiculosEnCola > 0) {
        icono = "⚠️ La posibilidad es muy justa, mejor buscar otro surtidor";
      } else {
        icono = "❌ No alcanzará";
      }

      html += `<li><strong>${c.tipo}:</strong> ${icono}</li>`;
    });

    html += "</ul>";
    html += `<button class="btn-cerrar-colas" data-estacion='${estacionData.nombre.replace(/\s/g, "")}'>Cerrar análisis</button>`;

    contenedorResultado.innerHTML = html;

    contenedorResultado.scrollIntoView({ behavior: "smooth" });

    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("btn-cerrar-colas")) {
        const id = e.target.getAttribute("data-estacion");
        const contenedor = document.querySelector(`#resultado-colas-${id}`);
        if (contenedor) contenedor.innerHTML = "";
      }
    });
    
  }
});



document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-agregar-combustible")) {
    const nombreEstacion = e.target.getAttribute("data-estacion");

    const formSection = document.querySelector("#agregar-combustible-section");
    const selectEstacion = document.querySelector("#estacion");

    // Mostrar sección
    formSection.style.display = "block";

    // Seleccionar estación automáticamente
    if (selectEstacion) {
      selectEstacion.value = nombreEstacion;
    }

    // Scroll opcional hacia el formulario
    formSection.scrollIntoView({ behavior: "smooth" });
  }
});




// Escuchar cambios en el filtro de zona
if (container) {
  // Cargar datos iniciales
  window.addEventListener("DOMContentLoaded", () => {
    actualizarVista();
  });

  if (filtroZona) {
    filtroZona.addEventListener("change", (e) => {
      estadoActual = {
        ...estadoActual,
        zona: e.target.value
      };
      actualizarVista();
    });
  }

  if (checkboxOrdenar) {
    checkboxOrdenar.addEventListener("change", () => {
      estadoActual = {
        ...estadoActual,
        ordenar: checkboxOrdenar.checked
      };
      actualizarVista();
    });
  }

  if (filtroCombustible) {
    filtroCombustible.addEventListener("change", (e) => {
      estadoActual = {
        ...estadoActual,
        combustible: e.target.value
      };
      actualizarVista();
    });
  }
}
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-agregar-combustible")) {
    const nombreEstacion = e.target.getAttribute("data-estacion");

    const formSection = document.querySelector("#agregar-combustible-section");
    const selectEstacion = document.querySelector("#estacion");
    const listaEstaciones = document.querySelector("#seccion-estaciones");

    // Mostrar formulario y ocultar la lista
    formSection.style.display = "block";
    if (listaEstaciones) listaEstaciones.style.display = "none";

    // Preseleccionar estación
    if (selectEstacion) {
      selectEstacion.value = nombreEstacion;
    }

    // Scroll hacia el formulario
    formSection.scrollIntoView({ behavior: "smooth" });
  }
});


export { actualizarVista };