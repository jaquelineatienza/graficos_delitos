import { delitos_subtipo } from "./delitos_subtipo.js";
import { uso_arma } from "./uso_arma.js";
import { uso_moto } from "./uso_moto.js";
import { delitos_mes } from "./delitos_mes.js";
import { delitos_horario } from "./delitos_horarios.js";
import { delitos_barrios } from "./delitos_barrios.js";

const h3 = document.getElementById("h3");
const data = document.getElementById("dato");

data.addEventListener("change", function () {
  const opcion = data.value;
  console.log(opcion);
  actualizarVisualizacion(opcion);
});

function actualizarVisualizacion(opcion) {
  h3.innerHTML = "";
  switch (opcion) {
    case "subtipo":
      delitos_subtipo();
      h3.innerHTML = "Tipo de delito";
      break;
    case "mes":
      delitos_mes();
      h3.innerHTML = "Delitos por mes";
      break;
    case "barrios":
      delitos_barrios();
      h3.innerHTML = "Delitos por barrio";
      break;
    default:
      console.log("opcion no valida");
  }
}
window.addEventListener("DOMContentLoaded", () => {
  data.value = "subtipo";
  actualizarVisualizacion("subtipo");
});

// Ejecutar al cambiar selección

document.addEventListener("DOMContentLoaded", () => {
  uso_arma();
  uso_moto();
  delitos_horario();
});
