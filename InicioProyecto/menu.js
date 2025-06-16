let saldo = parseFloat(localStorage.getItem("saldo")) || 1200000;
let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
let config = JSON.parse(localStorage.getItem("config")) || {
  modoOscuro: true,
  nombreUsuario: "Usuario",
  contrasena: "1234"
};
let scanner = null;

document.addEventListener("DOMContentLoaded", function() {
  configurarEventos();
  inicializarSecciones();
  aplicarConfiguracion();
  actualizarSaldo();
});

function configurarEventos() {
  document.getElementById("btn-enviar").addEventListener("click", () => mostrarSeccion("enviar-dinero"));
  document.getElementById("btn-ingresar").addEventListener("click", () => mostrarSeccion("ingresar-dinero"));
  document.getElementById("btn-sacar").addEventListener("click", () => mostrarSeccion("sacar-dinero"));
  document.getElementById("btn-movimientos").addEventListener("click", () => {
    mostrarSeccion("ver-movimientos");
    actualizarListaMovimientos();
  });
  document.getElementById("btn-tarjeta").addEventListener("click", () => mostrarSeccion("ver-tarjeta"));
  document.getElementById("btn-generarqr").addEventListener("click", () => mostrarSeccion("generar-qr"));
  document.getElementById("btn-escanearqr").addEventListener("click", () => {
    mostrarSeccion("escanear-qr");
    escanearQR();
  });
  document.getElementById("btn-cerrar-sesion").addEventListener("click", cerrarSesion);
  document.querySelector(".config-btn").addEventListener("click", toggleConfigMenu);
  document.querySelector(".cambiar-modo").addEventListener("click", cambiarModo);
  document.querySelector(".cambiar-contrasena").addEventListener("click", mostrarCambioContraseña);
  document.querySelector(".cambiar-nombre").addEventListener("click", mostrarCambioNombre);
  document.querySelector(".confirmar-envio").addEventListener("click", enviarDinero);
  document.querySelector(".confirmar-contrasena").addEventListener("click", cambiarContraseña);
  document.querySelector(".confirmar-nombre").addEventListener("click", cambiarNombre);
  document.getElementById("btn-generar").addEventListener("click", generarQR);
  document.getElementById("tarjeta").addEventListener("click", voltearTarjeta);
}

function inicializarSecciones() {
  document.querySelector("#ingresar-dinero").innerHTML = `
    <h3>💰 Ingresar Dinero</h3>
    <input type="number" class="input-estilo" id="monto-ingresar" placeholder="Monto a ingresar">
    <button class="btn-estilo" id="btn-ingresar-confirmar">Confirmar Ingreso</button>
  `;
  document.getElementById("btn-ingresar-confirmar").addEventListener("click", ingresarDinero);

  document.querySelector("#sacar-dinero").innerHTML = `
    <h3>🏧 Sacar Dinero</h3>
    <input type="number" class="input-estilo" id="monto-sacar" placeholder="Monto a retirar">
    <button class="btn-estilo" id="btn-sacar-confirmar">Confirmar Retiro</button>
  `;
  document.getElementById("btn-sacar-confirmar").addEventListener("click", sacarDinero);
}

function aplicarConfiguracion() {
  document.body.classList.toggle("modo-claro", !config.modoOscuro);
  actualizarTextoBotonModo();
  actualizarNombreUsuario();
}

function actualizarNombreUsuario() {
  const elementoNombre = document.getElementById("nombre-usuario");
  if (elementoNombre) {
    elementoNombre.textContent = config.nombreUsuario || "";
  }
}

function actualizarTextoBotonModo() {
  const botonModo = document.querySelector(".cambiar-modo");
  if (botonModo) {
    botonModo.textContent = config.modoOscuro ? '🌓 Cambiar a Modo Claro' : '🌓 Cambiar a Modo Oscuro';
  }
}

function mostrarSeccion(id) {
  document.querySelectorAll(".contenido").forEach(div => {
    div.classList.add("oculto");
  });
  
  if (id && document.getElementById(id)) {
    document.getElementById(id).classList.remove("oculto");
    agregarBotonRegresar();
  } else {
    const botonRegresar = document.querySelector(".btn-regresar");
    if (botonRegresar) botonRegresar.remove();
  }
  
  document.getElementById("config-menu").classList.add("oculto");
}

function agregarBotonRegresar() {
  const botonAnterior = document.querySelector(".btn-regresar");
  if (botonAnterior) botonAnterior.remove();
  
  const botonRegresar = document.createElement("button");
  botonRegresar.className = "btn-regresar";
  botonRegresar.innerHTML = "✕";
  
  botonRegresar.addEventListener("click", () => {
    mostrarSeccion("");
    if (scanner) scanner.stop();
  });
  
  document.querySelector(".container").appendChild(botonRegresar);
}

function toggleConfigMenu() {
  const menu = document.getElementById("config-menu");
  menu.classList.toggle("oculto");
}

function cambiarModo() {
  config.modoOscuro = !config.modoOscuro;
  localStorage.setItem("config", JSON.stringify(config));
  document.body.classList.toggle("modo-claro", !config.modoOscuro);
  actualizarTextoBotonModo();
  mostrarNotificacion(`Modo ${config.modoOscuro ? "oscuro" : "claro"} activado`);
  toggleConfigMenu();
}

function mostrarCambioContraseña() {
  const inputs = document.querySelectorAll("#cambiar-contrasena input");
  inputs.forEach(input => input.value = "");
  mostrarSeccion("cambiar-contrasena");
  toggleConfigMenu();
}

function mostrarCambioNombre() {
  const inputNombre = document.querySelector("#cambiar-nombre input");
  inputNombre.value = config.nombreUsuario;
  mostrarSeccion("cambiar-nombre");
  toggleConfigMenu();
}

function cambiarContraseña() {
  const inputs = document.querySelectorAll("#cambiar-contrasena input");
  const actual = inputs[0].value;
  const nueva = inputs[1].value;
  const confirmacion = inputs[2].value;

  if (actual !== config.contrasena) {
    mostrarNotificacion("Contraseña actual incorrecta", true);
    return;
  }

  if (nueva.length < 4) {
    mostrarNotificacion("La nueva contraseña debe tener al menos 4 caracteres", true);
    return;
  }

  if (nueva !== confirmacion) {
    mostrarNotificacion("Las contraseñas no coinciden", true);
    return;
  }

  config.contrasena = nueva;
  localStorage.setItem("config", JSON.stringify(config));
  mostrarNotificacion("🔒 Contraseña cambiada con éxito");
  mostrarSeccion("");
}

function cambiarNombre() {
  const inputNombre = document.querySelector("#cambiar-nombre input");
  const nuevoNombre = inputNombre.value.trim();
  
  if (!nuevoNombre) {
    mostrarNotificacion("Ingresa un nombre válido", true);
    return;
  }

  if (nuevoNombre.length < 3) {
    mostrarNotificacion("El nombre debe tener al menos 3 caracteres", true);
    return;
  }

  config.nombreUsuario = nuevoNombre;
  localStorage.setItem("config", JSON.stringify(config));
  actualizarNombreUsuario();
  mostrarNotificacion(`👤 Nombre cambiado a ${nuevoNombre}`);
  mostrarSeccion("");
}

function actualizarSaldo() {
  document.querySelector(".saldo").textContent = `Saldo disponible: $${saldo.toLocaleString()}`;
  localStorage.setItem("saldo", saldo);
}

function voltearTarjeta() {
  document.getElementById("tarjeta").classList.toggle("volteada");
}

function enviarDinero() {
  const inputs = document.querySelectorAll("#enviar-dinero input");
  const nombre = inputs[0].value;
  const documento = inputs[1].value;
  const cuenta = inputs[2].value;
  const monto = parseFloat(inputs[3].value);
  const concepto = inputs[4].value;

  if (!nombre || !documento || !cuenta || isNaN(monto) || monto <= 0) {
    mostrarNotificacion("Por favor completa todos los campos correctamente.", true);
    return;
  }

  if (monto > saldo) {
    mostrarNotificacion("Saldo insuficiente.", true);
    return;
  }

  saldo -= monto;
  movimientos.push(`Enviado $${monto.toLocaleString()} a ${nombre}${concepto ? ` (${concepto})` : ''}`);
  guardarMovimientos();
  actualizarSaldo();
  mostrarNotificacion("💸 Dinero enviado con éxito.");
  inputs.forEach(input => input.value = "");
}

function ingresarDinero() {
  const monto = parseFloat(document.getElementById("monto-ingresar").value);
  
  if (isNaN(monto) || monto <= 0) {
    mostrarNotificacion("Ingresa un monto válido.", true);
    return;
  }
  
  saldo += monto;
  movimientos.push(`Ingresado $${monto.toLocaleString()}`);
  guardarMovimientos();
  actualizarSaldo();
  mostrarNotificacion("💰 Dinero ingresado correctamente.");
  document.getElementById("monto-ingresar").value = "";
}

function sacarDinero() {
  const monto = parseFloat(document.getElementById("monto-sacar").value);
  
  if (isNaN(monto) || monto <= 0) {
    mostrarNotificacion("Ingresa un monto válido.", true);
    return;
  }
  
  if (monto > saldo) {
    mostrarNotificacion("Saldo insuficiente.", true);
    return;
  }
  
  saldo -= monto;
  movimientos.push(`Retirado $${monto.toLocaleString()}`);
  guardarMovimientos();
  actualizarSaldo();
  mostrarNotificacion("🏧 Retiro realizado.");
  document.getElementById("monto-sacar").value = "";
}

function actualizarListaMovimientos() {
  const lista = document.querySelector(".lista-movimientos");
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

function generarQR() {
  const nombre = document.getElementById("qr-nombre").value;
  const documento = document.getElementById("qr-documento").value;
  const cuenta = document.getElementById("qr-cuenta").value;
  const monto = document.getElementById("qr-monto").value;

  if (!nombre || !documento || !cuenta || !monto) {
    mostrarNotificacion("Completa todos los campos.", true);
    return;
  }

  const datosQR = { nombre, documento, cuenta, monto };

  QRCode.toCanvas(document.createElement("canvas"), JSON.stringify(datosQR), (error, canvas) => {
    if (error) {
      mostrarNotificacion("Error al generar QR", true);
      return;
    }
    
    const contenedorQR = document.getElementById("codigo-qr");
    contenedorQR.innerHTML = "";
    contenedorQR.appendChild(canvas);
    mostrarNotificacion("QR generado con éxito");
  });
}

function escanearQR() {
  const video = document.getElementById("video");
  const qrResult = document.getElementById("qr-result");

  QrScanner.hasCamera().then(hasCamera => {
    if (!hasCamera) {
      qrResult.textContent = "No se encontró una cámara.";
      return;
    }

    scanner = new QrScanner(video, result => {
      try {
        const datos = JSON.parse(result);
        qrResult.innerHTML = `
          <strong>Datos recibidos:</strong><br>
          Nombre: ${datos.nombre}<br>
          Documento: ${datos.documento}<br>
          Cuenta: ${datos.cuenta}<br>
          Monto: $${parseFloat(datos.monto).toLocaleString()}
        `;
        scanner.stop();
        mostrarNotificacion("QR escaneado correctamente");
      } catch (e) {
        qrResult.textContent = "QR no válido: " + result;
      }
    });

    scanner.start();
  });
}

function mostrarNotificacion(mensaje, esError = false) {
  const noti = document.getElementById("notificacion");
  noti.textContent = mensaje;
  noti.className = esError ? "notificacion error" : "notificacion";
  noti.classList.remove("oculto");
  noti.style.opacity = "1";

  setTimeout(() => {
    noti.style.opacity = "0";
    setTimeout(() => {
      noti.classList.add("oculto");
    }, 300);
  }, 3000);
}

function cerrarSesion() {
  if (confirm("¿Deseas cerrar sesión?")) {
    localStorage.clear();
    window.location.href = "index.html";
  }
}