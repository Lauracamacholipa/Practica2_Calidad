/*src/modules/estacion/registrarEstacion.js*/
import { estacionesLista } from "../../data/mockEstaciones.js";
function registrarEstacion(data) {
  const resultado = {};

  if (!data.nombre || typeof data.nombre !== "string" || data.nombre.trim() === "") {
    return "";
  }

  resultado.nombre = data.nombre.trim();

  if (data.zona && typeof data.zona === "string" && data.zona.trim() !== "") {
    resultado.zona = data.zona.trim();
  }

  if (data.direccion && typeof data.direccion === "string" && data.direccion.trim() !== "") {
    resultado.direccion = data.direccion.trim();
  }

  // 👇 Aquí está la corrección
  if (Array.isArray(data.combustibles) && data.combustibles.length > 0) {
    resultado.combustibles = data.combustibles.map(tipo => ({
      tipo,
      cantidad: 0 // Ahora sí tiene el formato correcto
    }));
  }

  // Solo si todos los campos están presentes
  if (resultado.nombre && resultado.zona && resultado.direccion && resultado.combustibles) {
    let adicionales = [];
    try {
      adicionales = JSON.parse(localStorage.getItem("nuevasEstaciones") || "[]");
    } catch (e) {
      console.error("Error leyendo nuevasEstaciones:", e);
    }

    const existentes = [...estacionesLista, ...adicionales];

    const yaExiste = existentes.some(e =>
      e.nombre === resultado.nombre &&
      e.zona === resultado.zona &&
      e.direccion === resultado.direccion &&
      JSON.stringify(e.combustibles) === JSON.stringify(resultado.combustibles)
    );

    if (yaExiste) {
      return "Estacion de servicio ya existente";
    }
  }

  return resultado;
}

export default registrarEstacion;
