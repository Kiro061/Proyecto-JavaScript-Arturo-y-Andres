// =============================================================
// PROTECCIÓN DE RUTA
// Verifica si existe una sesión activa en localStorage.
// Si no hay sesión, redirige automáticamente al Login
// para evitar acceso no autorizado a la página.
// =============================================================
(function () {
  var sesionActual = localStorage.getItem("sesion");
  if (!sesionActual) {
    window.location.replace("../pages/Login.html");
  }
})();

// =============================================================
// DROPDOWN DEL MENÚ DE USUARIO
// Abre y cierra el menú desplegable del usuario al hacer clic
// en el botón. Rota la flecha según el estado (abierto/cerrado).
// También cierra el dropdown si se hace clic fuera de él.
// =============================================================
const userBtn = document.getElementById("userBtn");
const dropdown = document.getElementById("dropdown");
const arrow = userBtn.querySelector(".arrow");

userBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = dropdown.classList.toggle("show");
  arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
});

document.addEventListener("click", () => {
  dropdown.classList.remove("show");
  arrow.style.transform = "rotate(180deg)";
});

// =============================================================
// TOGGLE MODO OSCURO / CLARO
// Alterna la clase "dark-mode" en el body al hacer clic en el
// botón de tema. Cambia el ícono entre 🌙 (oscuro) y ☀️ (claro)
// según el modo activo.
// =============================================================
const btnTheme = document.getElementById("btnTheme");
btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  btnTheme.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// =============================================================
// LINK ACTIVO EN LA NAVEGACIÓN
// Marca visualmente el enlace del menú que fue clickeado como
// "activo", quitando primero la clase "active" de todos los
// demás links de navegación.
// =============================================================
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", function () {
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});

// =============================================================
// NOMBRE DEL USUARIO EN SESIÓN
// Lee la sesión activa desde localStorage y muestra el nombre
// del usuario autenticado en el elemento "nombreSesion" del
// encabezado.
// =============================================================
var sesion = JSON.parse(localStorage.getItem("sesion"));
var spanNombre = document.getElementById("nombreSesion");
if (spanNombre && sesion) {
  spanNombre.textContent = sesion.nombre;
}

// =============================================================
// CERRAR SESIÓN
// Al hacer clic en el botón de logout, elimina la sesión activa
// de localStorage y redirige al usuario a la página de Login.
// =============================================================
var btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("sesion");
    window.location.href = "../pages/Login.html";
  });
}