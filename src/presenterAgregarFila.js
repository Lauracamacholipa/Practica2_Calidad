// Importamos utilidades
import { obtenerEstaciones } from "./utils/estaciones.js";
import { agregarAfila } from "./data/mockEstaciones.js";
import { cargarOpcionesEstaciones } from "./helpers.js"; // 👈 Usamos la función compartida

// Seleccionamos elementos del DOM
const form = document.querySelector("#form-agregar-fila");
const resultadoDiv = document.querySelector("#resultado-agregar-fila");
const selectFila = document.querySelector("#estacion-fila");

if (form && resultadoDiv && selectFila) {
  // Cargar opciones al inicio
  window.addEventListener("DOMContentLoaded", () => {
    cargarOpcionesEstaciones(selectFila); // ✅ Usamos la función compartida
  });

  // Manejar envío del formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombreEstacion = document.querySelector("#estacion-fila").value;
    const nombre = document.querySelector("#nombre-conductor").value.trim();
    const placa = document.querySelector("#placa-vehiculo").value.trim();
    const tipoCombustible = document.querySelector("#tipo-combustible-fila").value;

    if (!nombre || !placa || !tipoCombustible) {
      resultadoDiv.innerHTML = "<p class='error'>Por favor complete todos los campos.</p>";
      return;
    }

    const datos = {
      nombre,
      placa,
      tipo: tipoCombustible
    };

    const posicion = agregarAfila(nombreEstacion, datos);

    if (posicion !== false) {
      resultadoDiv.innerHTML = `<p class='success'>
        Conductor agregado correctamente. Posición en fila: <strong>${posicion}</strong>
      </p>`;
      form.reset();

      // Opcional: recargar la lista de estaciones para mostrar cambios
      import("./presenterFiltarEstaciones.js").then(({ actualizarVista }) => {
        if (typeof actualizarVista === "function") {
          actualizarVista();
        }
      });
    } else {
      resultadoDiv.innerHTML = "<p class='error'>Error: No se pudo agregar a la fila.</p>";
    }
  });
}