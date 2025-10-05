/* src/presenterRegistrarEstaciones.js*/

import registrarEstacion from "./modules/estacion/registrarEstacion.js";
import { obtenerEstaciones } from "./utils/estaciones.js";

const form = document.querySelector("#form-registrar-estacion");
const resultadoDiv = document.querySelector("#resultado-registro");

if (form && resultadoDiv) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.querySelector("#nombre").value.trim();
    const zona = document.querySelector("#zona").value.trim();
    const direccion = document.querySelector("#direccion").value.trim();

    const combustiblesSeleccionados = Array.from(
      document.querySelectorAll('input[name="combustibles"]:checked')
    ).map(cb => cb.value);

    const data = {
      nombre,
      zona,
      direccion,
      combustibles: combustiblesSeleccionados
    };

    const resultado = registrarEstacion(data);

    if (typeof resultado === "string" && resultado === "") {
      resultadoDiv.innerHTML = "<p class='error'>Datos incompletos</p>";
    } else if (typeof resultado === "string") {
      resultadoDiv.innerHTML = `<p class='error'>${resultado}</p>`;
    } else {
      // Si todo es válido, lo agregamos a localStorage
      try {
        let nuevasEstaciones = [];

        try {
          nuevasEstaciones = JSON.parse(localStorage.getItem("nuevasEstaciones")) || [];
        } catch (e) {
          console.error("Error leyendo localStorage:", e);
        }

        nuevasEstaciones.push(resultado);
        localStorage.setItem("nuevasEstaciones", JSON.stringify(nuevasEstaciones));

        resultadoDiv.innerHTML = "<p class='success'>Estación registrada correctamente</p>";

        // Opcional: limpiar el formulario
        form.reset();

        // Opcional: actualizar una lista si tienes una
        actualizarListaEstaciones();

      } catch (e) {
        console.error("Error guardando en localStorage:", e);
        resultadoDiv.innerHTML = "<p class='error'>Hubo un problema al guardar la estación</p>";
      }
    }
  });
}

// Opcional: función para mostrar todas las estaciones registradas
function actualizarListaEstaciones() {
  const contenedor = document.querySelector("#lista-estaciones-registradas");
  if (!contenedor) return;

  const todas = obtenerEstaciones();

  contenedor.innerHTML = "";

  if (todas.length === 0) {
    contenedor.innerHTML = "<p>No hay estaciones registradas.</p>";
    return;
  }

  const ul = document.createElement("ul");
  todas.forEach(estacion => {
    const li = document.createElement("li");
    li.textContent = `${estacion.nombre} - ${estacion.zona}`;
    ul.appendChild(li);
  });

  contenedor.appendChild(ul);
}