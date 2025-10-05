import { agregarCombustibleExistente } from "./data/mockEstaciones.js";
import { obtenerEstaciones } from "./utils/estaciones.js";
import { cargarOpcionesEstaciones } from "./helpers.js"; // 👈 Importamos la función reutilizable

// Seleccionamos elementos del DOM
const form = document.querySelector("#form-agregar-combustible");
const resultadoDiv = document.querySelector("#resultado-agregar-combustible");

const selectEstacion = document.querySelector("#estacion"); // Lo movemos afuera para usarlo directamente

if (form && resultadoDiv) {
  // Rellenar opciones de estaciones al cargar
  window.addEventListener("DOMContentLoaded", () => {
    cargarOpcionesEstaciones(selectEstacion); // Usamos la función compartida
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombreEstacion = document.querySelector("#estacion").value;
    const tipoCombustible = document.querySelector("#tipo-combustible").value;
    const cantidad = parseInt(document.querySelector("#cantidad").value, 10);

    if (!nombreEstacion || !tipoCombustible || isNaN(cantidad) || cantidad <= 0) {
      resultadoDiv.innerHTML = "<p class='error'>Por favor complete todos los campos correctamente.</p>";
      return;
    }

    const resultado = agregarCombustibleExistente(nombreEstacion, tipoCombustible, cantidad);

    if (typeof resultado === "string") {
      if (resultado === "Estación no encontrada") {
        resultadoDiv.innerHTML = `<p class='error'>${resultado}</p>`;
      } else if (resultado.includes("no registrado")) {
        resultadoDiv.innerHTML = `<p class='error'>${resultado}</p>`;
      } else {
        resultadoDiv.innerHTML = `<p class='success'>${resultado}</p>`;
        form.reset();
        actualizarStockActual(nombreEstacion);
      }
    } else {
      resultadoDiv.innerHTML = "<p class='error'>Hubo un error al procesar la solicitud.</p>";
    }
  });
}

// Función opcional: mostrar el stock actualizado de combustibles
function actualizarStockActual(nombreEstacion) {
  const contenedor = document.querySelector("#stock-actual");
  if (!contenedor) return;

  const todas = obtenerEstaciones();
  const estacion = todas.find(e => e.nombre === nombreEstacion);

  if (!estacion) {
    contenedor.innerHTML = "<p>No se encontró la estación.</p>";
    return;
  }

  contenedor.innerHTML = `<h4>Stock actual en ${estacion.nombre}</h4>`;
  const ul = document.createElement("ul");

  estacion.combustibles.forEach(com => {
    const li = document.createElement("li");
    li.textContent = `${com.tipo}: ${com.cantidad} litros`;
    ul.appendChild(li);
  });

  contenedor.appendChild(ul);
}