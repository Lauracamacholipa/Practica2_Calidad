// Importamos utilidades
import { obtenerEstaciones } from "./utils/estaciones.js";
import {
  generarTicket,
  existeTicketActivoPorNombre
} from "./utils/ticket.js";

// Importamos funciones comunes desde helpers
import { cargarOpcionesEstaciones } from "./helpers.js"; // 👈 Ruta según dónde esté tu archivo helpers.js

// Seleccionamos elementos del DOM
const form = document.querySelector("#form-generar-ticket");
const resultadoDiv = document.querySelector("#resultado-generar-ticket");
const selectEstacion = document.querySelector("#ticket-estacion");

if (form && resultadoDiv && selectEstacion) {
  // Cargar opciones al inicio
  window.addEventListener("DOMContentLoaded", () => {
    cargarOpcionesEstaciones(selectEstacion); // ✅ Usamos la función compartida
  });

  // Manejar envío del formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombreEstacion = document.querySelector("#ticket-estacion").value;
    const nombre = document.querySelector("#ticket-nombre").value.trim();
    const placa = document.querySelector("#ticket-placa").value.trim();
    const tipoCombustible = document.querySelector("#ticket-combustible").value;
    const fechaCarga = document.querySelector("#ticket-fecha").value;

    if (!nombre || !placa || !tipoCombustible || !fechaCarga) {
      resultadoDiv.innerHTML = "<p class='error'>Por favor complete todos los campos.</p>";
      return;
    }

    // Verificar si ya tiene un ticket o está en fila
    if (existeTicketActivoPorNombre(nombre)) {
      resultadoDiv.innerHTML = `<p class='error'>❌ ${nombre}, ya tienes un ticket activo o estás en cola. No puedes generar otro.</p>`;
      return;
    }

    try {
      // Llamar a la función que genera el ticket
      const nuevoTicket = generarTicket(nombreEstacion, tipoCombustible, placa, nombre, fechaCarga);

      // Mostrar mensaje de éxito
      resultadoDiv.innerHTML = `
        <p class='success'>
          ✅ Ticket generado exitosamente.<br />
          Número de turno: <strong>${nuevoTicket.numeroTurno}</strong><br />
          Fecha de carga: <strong>${nuevoTicket.fechaCarga}</strong>
        </p>
      `;

      form.reset(); // Limpiar formulario

      // Opcional: recargar vista de estaciones para mostrar cambios
      // Disparamos un evento personalizado para notificar que se debe actualizar la vista
    window.dispatchEvent(new Event("actualizarListaEstaciones"));
    } catch (e) {
      console.error("Error al generar ticket:", e);
      resultadoDiv.innerHTML = `<p class='error'>❌ Error: ${e.message}</p>`;
    }
  });
}