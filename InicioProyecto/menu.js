function ocultarTodo() {
  document.querySelectorAll('.contenido').forEach(div => {
    div.classList.add('oculto');
  });
}

document.getElementById('btn-enviar').addEventListener('click', () => {
  ocultarTodo();
  document.getElementById('enviar-dinero').classList.remove('oculto');
});

document.getElementById('btn-ingresar').addEventListener('click', () => {
  ocultarTodo();
  document.getElementById('ingresar-dinero').classList.remove('oculto');
});

document.getElementById('btn-sacar').addEventListener('click', () => {
  ocultarTodo();
  document.getElementById('sacar-dinero').classList.remove('oculto');
});

document.getElementById('btn-movimientos').addEventListener('click', () => {
  ocultarTodo();
  document.getElementById('ver-movimientos').classList.remove('oculto');
});

document.getElementById('btn-tarjeta').addEventListener('click', () => {
  ocultarTodo();
  document.getElementById('ver-tarjeta').classList.remove('oculto');
});

document.getElementById('btn-qr').addEventListener('click', () => {
  ocultarTodo();
  document.getElementById('scanner-qr').classList.remove('oculto');
  iniciarScanner();
});

document.getElementById('btn-generar-qr').addEventListener('click', () => {
  ocultarTodo();
  document.getElementById('generar-qr').classList.remove('oculto');
});

function cerrarSesion() {
  alert("Sesión cerrada correctamente.");
}

function voltearTarjeta() {
  const tarjeta = document.getElementById('tarjeta');
  tarjeta.classList.toggle('volteada');
}

let qrScanner;

function iniciarScanner() {
  const video = document.getElementById('qr-video');
  const resultado = document.getElementById('resultado-qr');

  if (!qrScanner) {
    qrScanner = new QrScanner(video, result => {
      resultado.textContent = `Contenido QR: ${result}`;
      qrScanner.stop();
    });
  }

  qrScanner.start();
}

function generarQR() {
  const texto = document.getElementById('texto-qr').value.trim();
  const contenedor = document.getElementById('qr-generado');
  contenedor.innerHTML = "";

  if (!texto) {
    contenedor.textContent = "Escribe algo primero.";
    return;
  }

  new QRCode(contenedor, {
    text: texto,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}
