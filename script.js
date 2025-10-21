// 🎵 Sonidos desde URLs públicas
const sonidoClick = new Audio('https://www.soundjay.com/button/sounds/button-16.mp3');
const sonidoWin = new Audio('https://www.soundjay.com/button/sounds/button-10.mp3');
const sonidoLose = new Audio('https://www.soundjay.com/button/sounds/button-3.mp3');
const sonidoTie = new Audio('https://www.soundjay.com/button/sounds/button-09.mp3');

let tablero = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

const humano = "X";
const computadora = "O";
let nivel = "dificil"; // nivel por defecto

// Modal inicio
function iniciarJuego() {
  nivel = document.getElementById("nivelModal").value;
  document.getElementById("modalInicio").style.display = "none";
  crearTablero();
}

// Crear tablero visual
function crearTablero() {
  const table = document.getElementById("tablero");
  table.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const row = table.insertRow();
    for (let j = 0; j < 3; j++) {
      const cell = row.insertCell();
      cell.textContent = tablero[i][j];
      cell.onclick = () => movimientoHumano(i, j);
      if(tablero[i][j] !== "") cell.style.animation = "aparecer 0.3s ease";
      // Colores según nivel
      if(nivel === "facil") cell.style.backgroundColor = "#d1ffd6";
      else if(nivel === "medio") cell.style.backgroundColor = "#fff1d6";
      else cell.style.backgroundColor = "#ffd6e0";
    }
  }
}

// Movimiento del jugador humano
function movimientoHumano(i, j) {
  if (tablero[i][j] === "") {
    tablero[i][j] = humano;
    sonidoClick.play();
    crearTablero();
    if (verificarGanador(tablero, humano)) {
      setTimeout(() => { sonidoWin.play(); alert("🎉 ¡Ganaste!"); }, 100);
      return;
    }
    if (empate(tablero)) {
      setTimeout(() => { sonidoTie.play(); alert("🤝 ¡Empate!"); }, 100);
      return;
    }
    movimientoComputadora();
  }
}

// Movimiento computadora según nivel
function movimientoComputadora() {
  let mov;
  if (nivel === "facil") mov = movimientoAleatorio();
  else if (nivel === "medio") mov = Math.random() < 0.5 ? mejorMovimiento() : movimientoAleatorio();
  else mov = mejorMovimiento();

  tablero[mov.i][mov.j] = computadora;
  sonidoClick.play();
  crearTablero();

  if (verificarGanador(tablero, computadora)) {
    setTimeout(() => { sonidoLose.play(); alert("😈 La computadora gana"); }, 100);
  } else if (empate(tablero)) {
    setTimeout(() => { sonidoTie.play(); alert("🤝 ¡Empate!"); }, 100);
  }
}

// Movimiento aleatorio
function movimientoAleatorio() {
  const opciones = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (tablero[i][j] === "") opciones.push({i,j});
  return opciones[Math.floor(Math.random() * opciones.length)];
}

// Minimax para IA
function mejorMovimiento() {
  let mejorPuntaje = -Infinity;
  let movimiento;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (tablero[i][j] === "") {
        tablero[i][j] = computadora;
        let puntaje = minimax(tablero, 0, false);
        tablero[i][j] = "";
        if (puntaje > mejorPuntaje) {
          mejorPuntaje = puntaje;
          movimiento = { i, j };
        }
      }
    }
  }
  return movimiento;
}

function minimax(tablero, profundidad, esMax) {
  if (verificarGanador(tablero, computadora)) return 1;
  if (verificarGanador(tablero, humano)) return -1;
  if (empate(tablero)) return 0;

  if (esMax) {
    let mejor = -Infinity;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (tablero[i][j] === "") {
          tablero[i][j] = computadora;
          mejor = Math.max(mejor, minimax(tablero, profundidad + 1, false));
          tablero[i][j] = "";
        }
    return mejor;
  } else {
    let mejor = Infinity;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (tablero[i][j] === "") {
          tablero[i][j] = humano;
          mejor = Math.min(mejor, minimax(tablero, profundidad + 1, true));
          tablero[i][j] = "";
        }
    return mejor;
  }
}

// Verificar ganador
function verificarGanador(tablero, jugador) {
  for (let i = 0; i < 3; i++) {
    if (tablero[i][0] === jugador && tablero[i][1] === jugador && tablero[i][2] === jugador) return true;
    if (tablero[0][i] === jugador && tablero[1][i] === jugador && tablero[2][i] === jugador) return true;
  }
  if (tablero[0][0] === jugador && tablero[1][1] === jugador && tablero[2][2] === jugador) return true;
  if (tablero[0][2] === jugador && tablero[1][1] === jugador && tablero[2][0] === jugador) return true;
  return false;
}

// Verificar empate
function empate(tablero) {
  return tablero.flat().every(celda => celda !== "");
}

// Reiniciar juego
function reiniciar() {
  tablero = [["", "", ""], ["", "", ""], ["", "", ""]];
  document.getElementById("modalInicio").style.display = "flex"; // mostrar modal
  crearTablero();
}