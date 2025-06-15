function mostrarContenido(id) {
  const secciones = document.querySelectorAll('.contenido');
  secciones.forEach(seccion => {
    seccion.classList.add('oculto');
  });

  const seleccionada = document.getElementById(id);
  if (seleccionada) {
    seleccionada.classList.remove('oculto');
  }
}

function cerrarSesion() {
  alert("Sesión cerrada.");
  window.location.href = "index.html"; // Ajusta esto si usas otra ruta
}
