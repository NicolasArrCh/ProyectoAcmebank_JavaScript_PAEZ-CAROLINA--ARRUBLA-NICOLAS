import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDJr0HvUVTpUV-yZi_8D5BVgi-rWwHZrsU",
  authDomain: "newlogin-8dd90.firebaseapp.com",
  databaseURL: "https://newlogin-8dd90-default-rtdb.firebaseio.com",
  projectId: "newlogin-8dd90",
  storageBucket: "newlogin-8dd90.firebasestorage.app",
  messagingSenderId: "509239189396",
  appId: "1:509239189396:web:3948ef416f77aad1bdf981"
};

const app = initializeApp(firebaseConfig);

function showForm(formType){
    document.querySelectorAll('form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${formType}-form`).classList.add('active');

    const subtibles = {
        'login': 'Bienvenido de nuevo',
        'register': 'Crea tu cuenta',
        'reset': 'Recupera tu acceso'
    };
    document.getElementById('form-subtitle').textContent = subtitles[formType];
}

async function findUserByDocument(docType, docNumber){
    try{
        const snapshot = await database.ref('users').orderByChild('docNumber').equalTo(docNumber).once('value');
        if (snapshot.exist()) {
            let userData = null;
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                if (data.docType === docType){
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
    } catch(error){
        console.error("Error buscando usuario:", error);
        return null;
    }
}

document.getElementById('login-form').addEventListener('submit', async(e) =>{
    e.preventDefault();

    const docType = document.getElementById('login-doc-type').value;
    const docNumber = document.getElementById('login-doc-number').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');

    errorElement.textContent = '';

    if (!docType || !docNumber || !password){
        errorElement.textContent = 'Por favor completa todos los campos';
        return;
    }

    try{
        const userData = await findUserByDocument(docType, docNumber);

        if (!userData || !userData.email){
            errorElement.textContent = 'Documento no registrado';
        }

        await auth.signInWithEmailAndPassword(userData.email, password);

        alert('Inicio de sesión exitoso!');

    } catch(error){
        console.error("Error al iniciar sesión:", error);
        let errorMessage = 'Error al iniciar sesión';

        if (error.code === 'auth/wrong-password'){
            errorMessage = 'Contraseña incorrecta';
        } else if (error.code === 'auth/user-not-found'){
            errorMessage = 'Usuario no encontrado';
        }

        errorElement.textContent = errorMessage;
    }
});

document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    const docType = document.getElementById('doc-type').value;
    const docNumber = document.getElementById('doc-number').value;
    const birthdate = document.getElementById('birthdate').value;
    const errorElement = document.getElementById('register-error');
    const successElement = document.getElementById('register-success');

    errorElement.textContent = '';
    successElement.textContent = '';

    if (!email || !password || !name || !docType || !docNumber || !birthdate){
        errorElement.textContent = 'Por favor completa todos los campos';
        return;
    }

    if (password.length > 6){
        errorElement.textContent = 'La contraseña debe tener al menos 6 caracteres';
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;

            const userData = {
                name: name,
                email: email,
                docType: docType,
                docNumber: docNumber,
                birthdate: birthdate,
                createAt: firebase.database.ServerValue.TIMESTAMP
            };

            return database.ref('users/' + user.uid).set(userData);
        })

        .then(() => {
            successElement.textContent = 'Registro exitoso! serás redirigido...';
            document.getElementById('register-form').reset();

            setTimeout(() => {
                showForm('login');
                successElement.textContent = '';
            }, 2000);
        })
        .catch(error => {
            errorElement.textContent = 'Error: ' + error.message;
        });
});

document.getElementById('reset-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('reset-email').value;
    const errorElement = document.getElementById('reset-error');
    const successElement = document.getElementById('reset-success');

    errorElement.textContent = '';
    successElement.textContent = '';

    auth.sendPasswordResetEmail(email)
        .then(() =>{
            successElement.textContent = 'Se ha enviado un enlace de recuperación a tu correo.';
            document.getElementById('reset-form').reset();
        })
        .catch((error) => {
            errorElement.textContent = 'Error: ' + error.message;
        });
});

auth.onAuthStateChanged((user) => {
    if(user) {
        console.log("Usuario autenticado:", user.email);
    }
})

document.querySelectorAll('.input-numeric').forEach(input => {
    input.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');

        if (this.id.includes('password') && this.value.length > 6){
            this.value = this.value.slice(0, 6);
        }

        if (this.id.includes('password') && this.value.length !== 6 && this.value.length > 0){
            this.class.List.add('input-error');
        } else{
            this.classList.remove('input-error');
        }
    });

    input.addEventListener('blur', function() {
        if (this.id.includes('password') && this.value.length !== 6 && this.value.length > 0){
            this.classList.add('input-error');
            const errorMsg = `La contraseña debe tener exactamente 6 dígitos`;

            if (!this.nextElementSibling.classList.constains('error')){
                const errorElement = document.createElement('div');
                errorElement.className = 'error';
                errorElement.textContent = errorMsg;
                this.parentNode.insertBefore(errorElement, this.nextElementSibling);
            }
        }
    });

    input.addEventListener('focus', function(){
        this.classList.remove('input-error');
        if (this.nextElementSibling.classList.contains('error')){
            this.nextElementSibling.remove();
        }
    });
});

//  LAS DEMÁS FUNCIONES SE MANTIENEN IGUAL HASTA LAS VALIDACIONES DE FORMULARIOS