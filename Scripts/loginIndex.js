// =============================================================
// ROL SELECCIONADO ACTUALMENTE
// Variable global que almacena el rol activo en el formulario
// de login. Por defecto inicia como "estudiante".
// =============================================================
var rolActual = "estudiante";

// =============================================================
// USUARIOS DE PRUEBA POR DEFECTO
// Lista de usuarios iniciales con sus credenciales y roles.
// Se usan para poder ingresar al sistema sin registro previo.
// =============================================================
var usuariosPorDefecto = [
  { correo: "estudiante@abc.edu.co", contrasena: "123456",   rol: "estudiante",  nombre: "María García" },
  { correo: "docente@abc.edu.co",    contrasena: "123456",   rol: "docente",     nombre: "Prof. Rodríguez" },
  { correo: "admin@abc.edu.co",      contrasena: "admin123", rol: "coordinador", nombre: "Coordinador" },
];

// =============================================================
// INICIALIZAR USUARIOS EN LOCALSTORAGE
// Guarda los usuarios por defecto en localStorage únicamente
// si aún no existe ningún dato guardado, evitando sobrescribir
// usuarios registrados previamente.
// =============================================================
if (!localStorage.getItem("usuarios")) {
  localStorage.setItem("usuarios", JSON.stringify(usuariosPorDefecto));
}

// =============================================================
// CAMBIAR ROL
// Actualiza el rol activo al hacer clic en uno de los botones
// de selección de rol. Resalta visualmente el botón seleccionado,
// muestra el nombre del rol en el formulario y limpia los campos
// de correo, contraseña y mensaje de error.
// =============================================================
function cambiarRol(rol, boton) {
  rolActual = rol;

  // Quitar clase activo de todos los botones
  var botones = document.querySelectorAll(".btn-rol");
  botones.forEach(function(btn) {
    btn.classList.remove("activo");
  });

  // Poner clase activo al botón clickeado
  boton.classList.add("activo");

  // Mostrar el rol activo en el formulario (solo si el elemento existe)
  var elementoRol = document.getElementById("rol-activo");
  if (elementoRol != null) {
    var nombres = {
      estudiante:  "Estudiante",
      docente:     "Docente",
      coordinador: "Coordinador",
    };
    elementoRol.innerHTML = "Iniciando como: <strong>" + nombres[rol] + "</strong>";
  }

  // Limpiar campos y error
  document.getElementById("correo").value = "";
  document.getElementById("contrasena").value = "";
  document.getElementById("mensaje-error").textContent = "";
}

// =============================================================
// INICIAR SESIÓN
// Valida las credenciales ingresadas contra los usuarios
// guardados en localStorage. Si coinciden el correo, la
// contraseña y el rol seleccionado, guarda la sesión activa
// y redirige al usuario según su rol:
//   - Coordinador  → principal.html
//   - Estudiante / Docente → Index.html (catálogo público)
// Si los campos están vacíos o las credenciales son incorrectas,
// muestra un mensaje de error.
// =============================================================
function iniciarSesion() {
  var correo     = document.getElementById("correo").value.trim();
  var contrasena = document.getElementById("contrasena").value;
  var error      = document.getElementById("mensaje-error");

  // Validar que no estén vacíos
  if (correo === "" || contrasena === "") {
    error.textContent = "Por favor completa todos los campos.";
    return;
  }

  // Buscar el usuario en localStorage
  var usuarios = JSON.parse(localStorage.getItem("usuarios"));
  var usuario  = usuarios.find(function(u) {
    return u.correo === correo && u.contrasena === contrasena && u.rol === rolActual;
  });

  // Si no se encuentra el usuario
  if (!usuario) {
    error.textContent = "Correo, contraseña o rol incorrecto.";
    return;
  }

  // Login exitoso: guardar sesión
  localStorage.setItem("sesion", JSON.stringify({
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol:    usuario.rol,
  }));

  // Redirigir según el rol
  if (usuario.rol === "coordinador") {
    window.location.href = "./principal.html";
  } else {
    // Estudiantes y docentes van al catálogo público
    window.location.href = "../Index.html";
  }
}