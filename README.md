## DESARROLLADORES DEL SOFTWARE

- Sandrith Carolina Paez Rincón -- Nicolás Felipe Arrubla Chaux.

# Proyecto Acme Bank - Autogestión de Cuentas Bancarias

Repositorio oficial del proyecto *Acme Bank*, una aplicación web desarrollada en JavaScript puro que permite a los usuarios la autogestión de sus cuentas bancarias de forma segura, intuitiva y completamente responsive.

## 📌 Descripción del Proyecto

Acme Bank es una plataforma bancaria digital que permite a los usuarios gestionar sus cuentas sin intervención directa del banco. Implementa funcionalidades clave como inicio de sesión, registro de cuenta, recuperación de contraseña, transacciones bancarias, generación de extractos y certificados, todo con persistencia de datos en el navegador utilizando estructuras JSON.

---

## 🧩 Funcionalidades Principales

### 🔐 Inicio de Sesión
- Formulario con tipo de identificación, número de identificación y contraseña.
- Validación de credenciales.
- Redirección al Dashboard en caso de éxito.
- Enlaces a:
  - *Crear cuenta*
  - *Recordar contraseña*


### 📝 Registro de Cuenta
- Formulario con datos personales completos.
- Validación en tiempo real de campos obligatorios.
- Generación automática de:
  - Número de cuenta bancaria
  - Fecha de creación
- Confirmación con resumen de la cuenta.
- Botón para cancelar y volver al inicio.

### 🔄 Recuperación de Contraseña
- Solicita tipo y número de identificación + correo electrónico.
- Validación de datos y cambio seguro de contraseña.
- Formulario de nueva contraseña en caso de validación exitosa.

### 📊 Dashboard
Contiene un menú de navegación con las siguientes secciones:

#### 🧾 Resumen de Cuenta
- Visualización de número de cuenta, saldo actual y fecha de creación.
