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
  document.getElementById('escaneo-qr').classList.remove('oculto');
  iniciarQR();
});

function voltearTarjeta() {
  const tarjeta = document.getElementById('tarjeta');
  tarjeta.classList.toggle('volteada');
}

function cerrarSesion() {
  alert("Sesión cerrada correctamente.");
}

function iniciarQR() {
  const video = document.getElementById('preview');
  const resultado = document.getElementById('resultadoQR');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    resultado.textContent = "Tu dispositivo no soporta escaneo con cámara.";
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      video.play();

      const scanner = new QrScanner(video, result => {
        resultado.textContent = `Código detectado: ${result}`;
        scanner.stop();
        stream.getTracks().forEach(track => track.stop());
      });
      scanner.start();
    })
    .catch(err => {
      resultado.textContent = "Error al acceder a la cámara.";
    });
}
