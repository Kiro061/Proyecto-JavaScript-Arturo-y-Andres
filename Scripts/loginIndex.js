// Rol seleccionado actualmente
var rolActual = "estudiante";

// Usuarios de prueba guardados en localStorage
var usuariosPorDefecto = [
  { correo: "estudiante@abc.edu.co", contrasena: "123456",   rol: "estudiante",  nombre: "María García" },
  { correo: "docente@abc.edu.co",    contrasena: "123456",   rol: "docente",     nombre: "Prof. Rodríguez" },
  { correo: "admin@abc.edu.co",      contrasena: "admin123", rol: "coordinador", nombre: "Coordinador" },
];

// Guardar usuarios en localStorage si no existen
if (!localStorage.getItem("usuarios")) {
  localStorage.setItem("usuarios", JSON.stringify(usuariosPorDefecto));
}

// Función para cambiar el rol seleccionado
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

// Función para iniciar sesión
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

  // Aquí luego redirigirías al principal según el rol:
   window.location.href = "./pages/principal.html";
}