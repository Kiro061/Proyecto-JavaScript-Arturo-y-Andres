// ── Protección de ruta ─────────────────────────────────
(function () {
  var sesionActual = localStorage.getItem("sesion");
  if (!sesionActual) {
    window.location.replace("../pages/Login.html");
  }
})();

// ── Dropdown del menú de usuario ──────────────────────
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

// ── Toggle modo oscuro / claro ─────────────────────────
const btnTheme = document.getElementById("btnTheme");
btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  btnTheme.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// ── Link activo en la navegación ───────────────────────
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", function () {
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});

// ── Nombre del usuario en sesión ───────────────────────
var sesion = JSON.parse(localStorage.getItem("sesion"));
var spanNombre = document.getElementById("nombreSesion");
if (spanNombre && sesion) {
  spanNombre.textContent = sesion.nombre;
}

// ── Cerrar sesión ──────────────────────────────────────
var btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("sesion");
    window.location.href = "../pages/Login.html";
  });
}