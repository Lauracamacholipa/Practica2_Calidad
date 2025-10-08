// src/data/mockEstaciones.js

export const estacionesLista = [
  {
    nombre: "Gulf Norte",
    direccion: "Av. América #1256",
    zona: "Norte",
    combustibles: [
      { tipo: "Normal", cantidad: 850 },
      { tipo: "Diesel", cantidad: 600 }
    ],
    filaEspera: [
      { nombre: "Eduardo Quiroga", placa: "5678GPQ", tipo: "Normal" },
      { nombre: "Juan Perez", placa: "1234ABC", tipo: "Normal" }
    ],
    filaTickets: [
      {
        numeroTurno: 1,
        nombre: "Carlos Rivas",
        placa: "9988XYZ",
        tipoCombustible: "Normal",
        fechaCarga: "2025-04-06"
      },
      {
        numeroTurno: 2,
        nombre: "Ana Gómez",
        placa: "NEWPLATE",
        tipoCombustible: "Normal",
        fechaCarga: "2025-04-06"
      }
    ]
  },
  {
    nombre: "YPFB Cala Cala",
    direccion: "Av. Melchor Pérez #245",
    zona: "Norte",
    combustibles: [
      { tipo: "Especial", cantidad: 720 },
      { tipo: "Diesel", cantidad: 550 }
    ],
    filaEspera: [],
    filaTickets: []
  },
  {
    nombre: "Petrobras La Recoleta",
    direccion: "Calle Jordán #321",
    zona: "Norte",
    combustibles: [
      { tipo: "Diesel", cantidad: 680 },
      { tipo: "Normal", cantidad: 900 }
    ],
    filaEspera: [
      { nombre: "María López", placa: "8921BCD", tipo: "Diesel" },
      { nombre: "Carlos Rivas", placa: "3456FGH", tipo: "Diesel" },
      { nombre: "Lucía Mendoza", placa: "7788JKL", tipo: "Diesel" }
    ],
    filaTickets: []
  },
  {
    nombre: "YPFB San Antonio",
    direccion: "Av. Villazón #789",
    zona: "Sur",
    combustibles: [
      { tipo: "Normal", cantidad: 920 },
      { tipo: "Diesel", cantidad: 700 }
    ],
    filaEspera: [
      { nombre: "Pedro Salazar", placa: "9988MNO", tipo: "Normal" }
    ],
    filaTickets: []
  },
  {
    nombre: "Gulf Terminal",
    direccion: "Av. Panamericana km 5",
    zona: "Sur",
    combustibles: [
      { tipo: "Diesel", cantidad: 550 },
      { tipo: "Especial", cantidad: 400 }
    ],
    filaEspera: [],
    filaTickets: []
  },
  {
    nombre: "Petrobras Queru Queru",
    direccion: "Av. 6 de Agosto #456",
    zona: "Sur",
    combustibles: [
      { tipo: "Especial", cantidad: 480 },
      { tipo: "Diesel", cantidad: 500 }
    ],
    filaEspera: [],
    filaTickets: []
  },
  {
    nombre: "YPFB Central",
    direccion: "Plaza Bolívar #123",
    zona: "Cercado",
    combustibles: [
      { tipo: "Normal", cantidad: 110 },
      { tipo: "Diesel", cantidad: 200 }
    ],
    filaEspera: [
      { nombre: "Valeria Torres", placa: "2233XYZ", tipo: "Normal" },
      { nombre: "Andrés Gutiérrez", placa: "1122TUV", tipo: "Normal" },
      { nombre: "Sofía Herrera", placa: "3344QWE", tipo: "Normal" },
      { nombre: "Diego Castro", placa: "5566RTY", tipo: "Normal" }
    ],
    filaTickets: []
  },
  {
    nombre: "Petrobras Muyurina",
    direccion: "Av. Ayacucho #678",
    zona: "Cercado",
    combustibles: [
      { tipo: "Diesel", cantidad: 750 },
      { tipo: "Normal", cantidad: 800 }
    ],
    filaEspera: [],
    filaTickets: []
  },
  {
    nombre: "Gulf Quillacollo",
    direccion: "Av. Blanco Galindo #901",
    zona: "Quillacollo",
    combustibles: [
      { tipo: "Especial", cantidad: 620 },
      { tipo: "Diesel", cantidad: 650 }
    ],
    filaEspera: [],
    filaTickets: []
  },
  {
    nombre: "YPFB Quillacollo Centro",
    direccion: "Calle Bolívar #1002",
    zona: "Quillacollo",
    combustibles: [
      { tipo: "Diesel", cantidad: 580 },
      { tipo: "Especial", cantidad: 450 }
    ],
    filaEspera: [
      { nombre: "Eduardo Quiroga", placa: "5678GPQ", tipo: "Diesel" },
      { nombre: "Juan Perez", placa: "1234ABC", tipo: "Diesel" }
    ],
    filaTickets: []
  }
];

// Funciones auxiliares para módulos dinámicos

export function agregarEstacion(estacion) {
  if (!estacion.filaEspera) {
    estacion.filaEspera = [];
  }
  estacionesLista.push(estacion);
}
export function agregarAfila(nombreEstacion, datosConductor) { //[1]
  const nombreLower = nombreEstacion.toLowerCase(); //[2]

  let estacion = estacionesLista.find(est => est.nombre.toLowerCase() === nombreLower); //[3]

  if (estacion) { //[4] NODO DECISIÓN
    if (!estacion.filaEspera) { //[5] NODO DECISIÓN
      estacion.filaEspera = []; //[6]
    }

    const nuevaPosicion = estacion.filaEspera.length + 1; //[7]
    estacion.filaEspera.push({ //[8]
      nombre: datosConductor.nombre,
      placa: datosConductor.placa,
      tipo: datosConductor.tipo
    });
    console.log(`Conductor ${datosConductor.nombre} agregado a estación mock "${nombreEstacion}". Posición: ${nuevaPosicion}`); //[9] 
    return nuevaPosicion; //[10]
  }

  try { //[11] NODO DECISIÓN
    const adicionales = JSON.parse(localStorage.getItem("nuevasEstaciones") || "[]"); //[12]
    const index = adicionales.findIndex(e => e.nombre.toLowerCase() === nombreLower); //[13]

    if (index !== -1) { //[14] NODO DECISIÓN
      estacion = adicionales[index]; //[15]

      if (!estacion.filaEspera) { //[16] NODO DECISIÓN
        estacion.filaEspera = []; //[17]
      }

      const nuevaPosicion = estacion.filaEspera.length + 1; //[18]
      estacion.filaEspera.push({ //[19]
        nombre: datosConductor.nombre,
        placa: datosConductor.placa,
        tipo: datosConductor.tipo
      });
      adicionales[index] = estacion; //[20]
      localStorage.setItem("nuevasEstaciones", JSON.stringify(adicionales)); //[21]
      console.log(`Conductor ${datosConductor.nombre} agregado a estación localStorage "${nombreEstacion}". Posición: ${nuevaPosicion}`); //[22]
      return nuevaPosicion; //[23]
    }
  } catch (error) { //[24]
    console.error("Error al acceder a estaciones del localStorage:", error); //[25]
  }

  console.error(`Error: No se encontró la estación "${nombreEstacion}"`); //[26]
  return false; //[27]
}
export function obtenerCantidadCombustible(nombreEstacion) {
  const estacion = estacionesLista.find(est => est.nombre === nombreEstacion);
  if (estacion) {
    return estacion.cantidadDisponible;
  }
}

export function agregarCombustibleExistente(nombreEstacion, tipo, cantidad) {
  const nombreLower = nombreEstacion.toLowerCase(); // [1]
  let estacion = estacionesLista.find(est => est.nombre.toLowerCase() === nombreLower); // [2]
  let enMock = true; // [3]

  if (!estacion) { // [4] DECISIÓN 1
    const adicionales = JSON.parse(localStorage.getItem("nuevasEstaciones") || "[]"); // [5]
    estacion = adicionales.find(e => e.nombre.toLowerCase() === nombreLower); // [6]
    enMock = false; // [7]

    if (!estacion) return "Estación no encontrada"; // [8] DECISIÓN 2 -> FIN

    const combustible = estacion.combustibles.find(c => c.tipo === tipo); // [9]
    if (!combustible) return `Tipo de combustible "${tipo}" no registrado en esta estación`; // [10] DECISIÓN 3 -> FIN

    combustible.cantidad += cantidad; // [11]
    localStorage.setItem("nuevasEstaciones", JSON.stringify(adicionales)); // [12]
    return `Se agregó ${cantidad} litros a ${tipo}`; // [13]
  }

  const combustible = estacion.combustibles.find(c => c.tipo === tipo); // [14]
  if (!combustible) return `Tipo de combustible "${tipo}" no registrado en esta estación`; // [15] DECISIÓN 4 -> [16]

  combustible.cantidad += cantidad; // [17]
  return `Se agregó ${cantidad} litros a ${tipo}`; // [18]
}