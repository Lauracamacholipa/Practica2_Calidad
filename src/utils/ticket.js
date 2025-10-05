// src/utils/ticket.js

let estacionesConColas = [];

/**
 * Reinicia el estado inicial de las estaciones
 */
export function resetTickets(mockEstaciones = []) {
  // Clonar profundamente y asegurar estructura completa
  estacionesConColas = clonarEstaciones(mockEstaciones).map(estacion => ({
    ...estacion,
    filaEspera: estacion.filaEspera || [],
    filaTickets: estacion.filaTickets || []
  }));
}

/**
 * Genera un nuevo ticket para una persona
 *
 * @param {string} estacionNombre - Nombre de la estación
 * @param {string} tipoCombustible - Tipo de combustible solicitado
 * @param {string} placa - Placa del vehículo
 * @param {string} nombre - Nombre del conductor
 * @param {string} fechaCarga - Fecha en formato YYYY-MM-DD
 * @returns {Object} - Nuevo ticket generado
 */
export function generarTicket(estacionNombre, tipoCombustible, placa, nombre, fechaCarga) {
  if (!estacionNombre || !tipoCombustible || !placa || !nombre || !fechaCarga) {
    throw new Error('Todos los campos son obligatorios.');
  }

  const estacion = estacionesConColas.find(e => e.nombre === estacionNombre);

  if (!estacion) {
    throw new Error('Estación no encontrada.');
  }

  // Verificar si ya tiene ticket activo (en filaEspera o filaTickets)
  const tieneTicket = estacion.filaTickets.some(t => t.nombre === nombre) ||
                      estacion.filaEspera.some(p => p.nombre === nombre);

  if (tieneTicket) {
    throw new Error('Ya tiene un ticket activo.');
  }

  // Filtrar por fecha y tipo
  const ticketsMismaFecha = estacion.filaTickets.filter(
    t => t.fechaCarga === fechaCarga && t.tipoCombustible === tipoCombustible
  );

  const ultimoTurno = ticketsMismaFecha.length > 0
    ? Math.max(...ticketsMismaFecha.map(t => t.numeroTurno))
    : 0;

  const nuevoTicket = {
    numeroTurno: ultimoTurno + 1,
    tipoCombustible,
    estacion: estacionNombre,
    placa: placa.trim(),
    nombre: nombre.trim(),
    fechaCarga,
    fechaIngreso: new Date().toISOString()
  };

  estacion.filaTickets.push(nuevoTicket);

  // 👇 Guardar cambios en localStorage
  guardarEnLocalStorage();
  return nuevoTicket;
}

/**
 * Devuelve todos los tickets activos de una estación, ordenados por fecha y turno
 *
 * @param {string} estacionNombre - Nombre de la estación
 * @returns {Array<Object>} - Lista de tickets
 */
export function obtenerTicketsPorEstacion(estacionNombre) {
  const estacion = estacionesConColas.find(e => e.nombre === estacionNombre);
  if (!estacion) return [];

  return [...estacion.filaTickets].sort((a, b) => {
    if (a.fechaCarga !== b.fechaCarga) {
      return a.fechaCarga.localeCompare(b.fechaCarga);
    }
    return a.numeroTurno - b.numeroTurno;
  });
}


/**
 * Verifica si una persona tiene algún ticket activo en cualquier estación
 */
export function existeTicketActivoPorNombre(nombre) {
  return estacionesConColas.some(estacion =>
    estacion.filaTickets.some(t => t.nombre === nombre) ||
    estacion.filaEspera.some(p => p.nombre === nombre)
  );
}

/**
 * Devuelve todos los tickets activos agrupados por estación
 *
 * @returns {Object} - Un objeto con estaciones como clave y array de tickets como valor
 */
export function obtenerTodosLosTicketsAgrupados() {
  const resultado = {};

  estacionesConColas.forEach(estacion => {
    resultado[estacion.nombre] = [...estacion.filaTickets].sort((a, b) => {
      if (a.fechaCarga !== b.fechaCarga) {
        return a.fechaCarga.localeCompare(b.fechaCarga);
      }
      return a.numeroTurno - b.numeroTurno;
    });
  });

  return resultado;
}
/**
 * Elimina un ticket activo de una estación para un conductor específico
 *
 * @param {string} estacionNombre - Nombre de la estación
 * @param {string} nombre - Nombre del conductor
 * @returns {boolean} - true si se eliminó, false si no se encontró
 */
export function eliminarTicket(estacionNombre, nombre) {
  const estacion = estacionesConColas.find(e => e.nombre === estacionNombre);
  if (!estacion) return false;

  const index = estacion.filaTickets.findIndex(t => t.nombre === nombre);
  if (index === -1) return false;

  estacion.filaTickets.splice(index, 1);
  return true;
}

export function clonarEstaciones(estaciones) {
  return JSON.parse(JSON.stringify(estaciones));
}

function guardarEnLocalStorage() {
  try {
    const adicionales = JSON.parse(localStorage.getItem("nuevasEstaciones") || "[]");
    
    // Actualizar la estación correspondiente con los nuevos tickets
    estacionesConColas.forEach(estacion => {
      const index = adicionales.findIndex(e => e.nombre === estacion.nombre);
      
      if (index !== -1) {
        adicionales[index] = estacion;
      } else {
        // Si no está en localStorage, pero sí es nueva, la añadimos
        adicionales.push(estacion);
      }
    });

    localStorage.setItem("nuevasEstaciones", JSON.stringify(adicionales));
  } catch (e) {
    console.error("Error al guardar en localStorage:", e);
  }
}