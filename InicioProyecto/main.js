
  const firebaseConfig = {
    apiKey: "AIzaSyDJr0HvUVTpUV-yZi_8D5BVgi-rWwHZrsU",
    authDomain: "newlogin-8dd90.firebaseapp.com",
    databaseURL: "https://newlogin-8dd90-default-rtdb.firebaseio.com",
    projectId: "newlogin-8dd90",
    storageBucket: "newlogin-8dd90.firebasestorage.app",
    messagingSenderId: "509239189396",
    appId: "1:509239189396:web:3948ef416f77aad1bdf981"
  };

firebase.initializeApp(firebaseConfig);

// Mostrar formularios
function showForm(formName) {
  document.querySelectorAll("form").forEach(form => form.classList.remove("active"));
  document.getElementById(`${formName}-form`).classList.add("active");
}

// Alternar visibilidad de contraseña
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = (input.type === "password") ? "text" : "password";
}

// ---------------- REGISTRO ----------------
document.getElementById("register-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const docType = document.getElementById("doc-type").value;
  const documento = document.getElementById("doc-number").value.trim();
  const nacimiento = document.getElementById("birthdate").value;
  const password = document.getElementById("register-password").value.trim();
  const registerError = document.getElementById("register-error");
  const registerSuccess = document.getElementById("register-success");

  if (!nombre || !email || !docType || !documento || !nacimiento || !password) {
    registerError.textContent = "Completa todos los campos.";
    return;
  }

  if (password.length < 6) {
    registerError.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      return firebase.database().ref("usuarios/" + uid).set({
        nombre: nombre,
        email: email,
        documento: documento,
        tipoDocumento: docType,
        nacimiento: nacimiento
      });
    })
    .then(() => {
      registerSuccess.textContent = "✅ Registro exitoso. Ahora puedes iniciar sesión.";
      registerError.textContent = "";
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        registerError.textContent = "Este correo ya está registrado.";
      } else {
        registerError.textContent = "Error: " + error.message;
      }
      registerSuccess.textContent = "";
    });
});

// ---------------- INICIO DE SESIÓN ----------------
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const docNumberInput = document.getElementById("login-doc-number");
  const passwordInput = document.getElementById("login-password");
  const loginError = document.getElementById("login-error");

  const docNumber = docNumberInput.value.trim();
  const password = passwordInput.value.trim();

  if (!docNumber || !password) {
    loginError.textContent = "Debes completar todos los campos.";
    return;
  }

  firebase.database().ref("usuarios").orderByChild("documento").equalTo(docNumber).once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = Object.values(snapshot.val())[0];
        const email = userData.email;

        return firebase.auth().signInWithEmailAndPassword(email, password);
      } else {
        throw new Error("Documento no registrado.");
      }
    })
    .then(() => {
      window.location.href = "menu.html";
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});

// ---------------- RECUPERAR CONTRASEÑA ----------------
document.getElementById("reset-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const resetEmail = document.getElementById("reset-email").value.trim();
  const resetError = document.getElementById("reset-error");
  const resetSuccess = document.getElementById("reset-success");

  if (!resetEmail) {
    resetError.textContent = "Ingresa un correo electrónico.";
    return;
  }

  firebase.auth().sendPasswordResetEmail(resetEmail)
    .then(() => {
      resetSuccess.textContent = "Correo de recuperación enviado.";
      resetError.textContent = "";
    })
    .catch((error) => {
      resetError.textContent = "Error: " + error.message;
      resetSuccess.textContent = "";
    });
});

// Mostrar login por defecto al cargar
showForm("login");