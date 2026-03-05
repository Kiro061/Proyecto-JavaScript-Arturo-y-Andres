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

// ── Nombre de sesión en navbar ─────────────────────
var sesionNav = JSON.parse(localStorage.getItem("sesion"));
if (sesionNav) {
    var elNombreNav = document.querySelector(".userName");
    if (elNombreNav) elNombreNav.textContent = sesionNav.nombre;
}