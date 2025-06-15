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

function voltearTarjeta() {
  const tarjeta = document.getElementById('tarjeta');
  tarjeta.classList.toggle('volteada');
}

function cerrarSesion() {
  alert("Sesión cerrada correctamente.");
}
