/*src/utils/calculadoraColas.js*/
export function calcularVehiculosEnCola(distancia) {
    return Math.round ( distancia / 6);
  }
  export function calcularCapacidadCarga(combustibleTotal) {
    return Math.round(combustibleTotal / 50);
  }
  export function gasolinaAlcanzara(distancia, combustibleTotal) {
    const vehiculos = calcularVehiculosEnCola(distancia);
    const capacidad = calcularCapacidadCarga(combustibleTotal);
  
    if (capacidad > vehiculos) {
      return "Sí alcanzará: Hay suficiente combustible para su turno";
    }else if (capacidad === vehiculos) {
        return "Advertencia: El combustible justo alcanza, mejor ir a otro surtidor para no arriesgarse";
        
      }else{
        return "No alcanzará: El combustible no cubrirá su posición en la cola";
      }
}