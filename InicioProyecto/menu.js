let saldo = parseFloat(localStorage.getItem("saldo")) || 1200000;
let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

const actualizarSaldo = () => {
  document.querySelector(".saldo").textContent = `Saldo disponible: $${saldo.toLocaleString()}`;
  localStorage.setItem("saldo", saldo);
};

const mostrarSeccion = (id) => {
  document.querySelectorAll(".contenido").forEach(div => div.classList.add("oculto"));
  document.getElementById(id).classList.remove("oculto");
};

window.voltearTarjeta = () => {
  document.getElementById("tarjeta").classList.toggle("volteada");
};

document.getElementById("btn-enviar").onclick = () => mostrarSeccion("enviar-dinero");
document.getElementById("btn-ingresar").onclick = () => mostrarSeccion("ingresar-dinero");
document.getElementById("btn-sacar").onclick = () => mostrarSeccion("sacar-dinero");
document.getElementById("btn-movimientos").onclick = () => {
  mostrarSeccion("ver-movimientos");
  actualizarListaMovimientos();
};
document.getElementById("btn-tarjeta").onclick = () => mostrarSeccion("ver-tarjeta");
document.getElementById("btn-generarqr").onclick = () => mostrarSeccion("generar-qr");
document.getElementById("btn-escanearqr").onclick = () => {
  mostrarSeccion("escanear-qr");
  escanearQR();
};

// Enviar Dinero
document.querySelector("#enviar-dinero .btn-estilo").onclick = () => {
  const inputs = document.querySelectorAll("#enviar-dinero input");
  const nombre = inputs[0].value;
  const documento = inputs[1].value;
  const cuenta = inputs[2].value;
  const monto = parseFloat(inputs[3].value);
  const concepto = inputs[4].value;

  if (!nombre || !documento || !cuenta || isNaN(monto) || monto <= 0) {
    alert("Por favor completa todos los campos correctamente.");
    return;
  }

  if (monto > saldo) {
    alert("Saldo insuficiente.");
    return;
  }

  saldo -= monto;
  movimientos.push(`Enviado $${monto.toLocaleString()} a ${nombre}`);
  guardarMovimientos();
  actualizarSaldo();
  alert("Transferencia realizada con éxito.");
  inputs.forEach(input => input.value = "");
};

// Ingresar Dinero
document.querySelector("#ingresar-dinero").innerHTML = `
  <h3>💰 Ingresar Dinero</h3>
  <input type="number" class="input-estilo" id="monto-ingresar" placeholder="Monto a ingresar">
  <button class="btn-estilo" onclick="ingresarDinero()">Confirmar Ingreso</button>
`;

window.ingresarDinero = () => {
  const monto = parseFloat(document.getElementById("monto-ingresar").value);
  if (isNaN(monto) || monto <= 0) {
    alert("Ingresa un monto válido.");
    return;
  }
  saldo += monto;
  movimientos.push(`Ingresado $${monto.toLocaleString()}`);
  guardarMovimientos();
  actualizarSaldo();
  alert("Dinero ingresado correctamente.");
};

// Sacar Dinero
document.querySelector("#sacar-dinero").innerHTML = `
  <h3>🏧 Sacar Dinero</h3>
  <input type="number" class="input-estilo" id="monto-sacar" placeholder="Monto a retirar">
  <button class="btn-estilo" onclick="sacarDinero()">Confirmar Retiro</button>
`;

window.sacarDinero = () => {
  const monto = parseFloat(document.getElementById("monto-sacar").value);
  if (isNaN(monto) || monto <= 0) {
    alert("Ingresa un monto válido.");
    return;
  }
  if (monto > saldo) {
    alert("Saldo insuficiente.");
    return;
  }
  saldo -= monto;
  movimientos.push(`Retirado $${monto.toLocaleString()}`);
  guardarMovimientos();
  actualizarSaldo();
  alert("Dinero retirado correctamente.");
};

// Lista de Movimientos
function actualizarListaMovimientos() {
  const lista = document.querySelector("#ver-movimientos ul");
  lista.innerHTML = "";
  movimientos.slice().reverse().forEach(mov => {
    const li = document.createElement("li");
    li.textContent = mov;
    lista.appendChild(li);
  });
}

function guardarMovimientos() {
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

// Cerrar Sesión
function cerrarSesion() {
  if (confirm("¿Deseas cerrar sesión?")) {
    localStorage.clear();
    window.location.href = "index.html";
  }
}

// ✅ Generar QR
document.getElementById("btn-generar").onclick = () => {
  const nombre = document.getElementById("qr-nombre").value;
  const documento = document.getElementById("qr-documento").value;
  const cuenta = document.getElementById("qr-cuenta").value;
  const monto = document.getElementById("qr-monto").value;

  if (!nombre || !documento || !cuenta || !monto) {
    alert("Completa todos los campos.");
    return;
  }

  const datosQR = { nombre, documento, cuenta, monto };

  QRCode.toCanvas(document.createElement("canvas"), JSON.stringify(datosQR), (error, canvas) => {
    if (error) return alert("Error al generar QR");
    const contenedorQR = document.getElementById("codigo-qr");
    contenedorQR.innerHTML = "";
    contenedorQR.appendChild(canvas);
  });
};

// 📷 Escanear QR
function escanearQR() {
  const video = document.getElementById("video");
  const qrResult = document.getElementById("qr-result");

  QrScanner.hasCamera().then(hasCamera => {
    if (!hasCamera) {
      qrResult.textContent = "No se encontró una cámara.";
      return;
    }

    const scanner = new QrScanner(video, result => {
      qrResult.textContent = "Datos recibidos: " + result;
      scanner.stop();
    });

    scanner.start();
  });
}

// Iniciar mostrando saldo
actualizarSaldo();
