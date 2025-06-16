if (typeof firebase === 'undefined') {
  console.error('Firebase no está cargado. Verifica los scripts.');
} else {
  const firebaseConfig = {
    apiKey: "AIzaSyDJr0HvUVTpUV-yZi_8D5BVgi-rWwHZrsU",
    authDomain: "newlogin-8dd90.firebaseapp.com",
    databaseURL: "https://newlogin-8dd90-default-rtdb.firebaseio.com",
    projectId: "newlogin-8dd90",
    storageBucket: "newlogin-8dd90.firebasestorage.app",
    messagingSenderId: "509239189396",
    appId: "1:509239189396:web:3948ef416f77aad1bdf981"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
    const auth = firebase.auth();
    const database = firebase.database();

    // Función para mostrar formularios
    function showForm(formType) {
    document.querySelectorAll('form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${formType}-form`).classList.add('active');
    }

    // Función para alternar visibilidad de contraseña
    function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
    }

    // Función para buscar usuario por documento
    async function findUserByDocument(docType, docNumber) {
    try {
        const snapshot = await database.ref('users').orderByChild('docNumber').equalTo(docNumber).once('value');
        if (snapshot.exists()) {
        let userData = null;
        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            if (data.docType === docType) {
            userData = {
                uid: childSnapshot.key,
                email: data.email,
                ...data
            };
            }
        });
        return userData;
        }
        return null;
    } catch (error) {
        console.error("Error buscando usuario:", error);
        return null;
    }
    }

    document.getElementById('login-form'),addEventListener('sumit', async (e) => {
        e.preventDefault();

        const docType = document.getElementById('login-doc-type').value;
        const docNumber = document.getElementById('login-doc-number').value.replace(/\D/g, '');
        const password = document.getElementById('login-password').value;
        const errorElement = document.getElementById('login-error');

        errorElement.textContent = '';

        if (!docType || !docNumber || !password) {
    errorElement.textContent = 'Por favor completa todos los campos';
    return;
  }

  try {
    const userData = await findUserByDocument(docType, docNumber);
    if (!userData) {
      errorElement.textContent = 'No se encontró un usuario con ese documento';
      return;
    }

    // Iniciar sesión con email y contraseña
    await auth.signInWithEmailAndPassword(userData.email, password);
    
    // Redirigir al dashboard
    window.location.href = 'menu.html';

  } catch (error) {
    console.error("Error en login:", error);
    let errorMessage = 'Error al iniciar sesión';

    if (error.code === 'auth/wrong-password') {
      errorMessage = 'Contraseña incorrecta';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No existe una cuenta con estos datos';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Correo electrónico inválido';
    }

    errorElement.textContent = errorMessage;
  }
});

    // Manejar registro
    document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    const docType = document.getElementById('doc-type').value;
    const docNumber = document.getElementById('doc-number').value.replace(/\D/g, '');
    const birthdate = document.getElementById('birthdate').value;
    const errorElement = document.getElementById('register-error');
    const successElement = document.getElementById('register-success');

    errorElement.textContent = '';
    successElement.textContent = '';

    // Validaciones
    if (!email || !password || !name || !docType || !docNumber || !birthdate) {
        errorElement.textContent = 'Por favor completa todos los campos';
        return;
    }

    if (!/^\d{6}$/.test(password)) {
        errorElement.textContent = 'La contraseña debe tener exactamente 6 dígitos numéricos';
        return;
    }

    try {
        // Verificar si el documento ya existe
        const existingUser = await findUserByDocument(docType, docNumber);
        if (existingUser) {
        errorElement.textContent = 'Este documento ya está registrado';
        return;
        }

        // Crear usuario en Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Guardar datos adicionales en Realtime Database
        await database.ref('users/' + userCredential.user.uid).set({
        name: name,
        email: email,
        docType: docType,
        docNumber: docNumber,
        birthdate: birthdate,
        createdAt: firebase.database.ServerValue.TIMESTAMP
        });

        successElement.textContent = '¡Registro exitoso! Redirigiendo...';
        document.getElementById('register-form').reset();
        
        setTimeout(() => {
        showForm('login');
        successElement.textContent = '';
        }, 2000);

    } catch (error) {
        console.error("Error en registro:", error);
        let errorMessage = 'Error al registrar';
        
        if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ya está en uso';
        } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Correo electrónico inválido';
        } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        errorElement.textContent = errorMessage;
    }
    });

    // Manejar recuperación de contraseña
    document.getElementById('reset-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    const errorElement = document.getElementById('reset-error');
    const successElement = document.getElementById('reset-success');

    errorElement.textContent = '';
    successElement.textContent = '';

    if (!email) {
        errorElement.textContent = 'Por favor ingresa tu correo electrónico';
        return;
    }

    try {
        await firebase.auth().sendPasswordResetEmail(email);
        successElement.textContent = 'Se ha enviado un enlace de recuperación a tu correo.';
        document.getElementById('reset-form').reset();
    } catch (error) {
        console.error("Error al enviar correo de recuperación:", error);
        let errorMessage = 'Error al enviar correo de recuperación';
        
        if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo electrónico';
        } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Correo electrónico inválido';
        }
        
        errorElement.textContent = errorMessage;
    }
    });

    // Validación de campos numéricos
    document.querySelectorAll('.input-numeric').forEach(input => {
    input.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
        
        if (this.id.includes('password') && this.value.length > 6) {
        this.value = this.value.slice(0, 6);
        }
    });
    });

    // Observar estado de autenticación
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("Usuario autenticado:", user.email);
        // Aquí podrías redirigir al dashboard
    }
    })
}