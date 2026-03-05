// perfil.js - Lógica de la página de perfil

// Redirigir si no hay sesión activa
var sesion = JSON.parse(localStorage.getItem("sesion"));
if (!sesion) {
  window.location.href = "../index.html";
}

// Clave única por usuario para guardar su perfil
var KEY_PERFIL = "perfil_" + sesion.correo;
var datosPerfil = JSON.parse(localStorage.getItem(KEY_PERFIL)) || {};

// Nombres de roles legibles
var roles = {
  estudiante: "Estudiante",
  docente: "Docente",
  coordinador: "Coordinador / Administrativo"
};

// Campos de cada sección
var camposSeccion = {
  personal:      ["nombreCompleto", "correo", "telefono", "direccion", "fechaNacimiento", "genero"],
  institucional: ["identificacion", "rolInstitucion", "codigoInstitucional", "areaGrado", "fechaIngreso", "estadoUsuario"],
  seguridad:     ["passActual", "passNueva", "passConfirmar"]
};

// Control de si cada sección está en modo edición
var estadoEdicion = { personal: false, institucional: false, seguridad: false };
var snapshots = {};

// Poblar campos cuando carga la página
window.addEventListener("DOMContentLoaded", function() {

  // Navbar y hero
  document.getElementById("nombreNavbar").textContent = sesion.nombre;
  document.getElementById("heroNombre").textContent   = sesion.nombre;
  document.getElementById("heroRol").textContent      = roles[sesion.rol] || sesion.rol;

  // Foto guardada
  if (datosPerfil.foto) {
    document.getElementById("fotoPerfil").src = datosPerfil.foto;
    document.getElementById("fotoNavbar").src = datosPerfil.foto;
  }

  // Campos personales
  document.getElementById("nombreCompleto").value  = datosPerfil.nombreCompleto  || sesion.nombre || "";
  document.getElementById("correo").value          = datosPerfil.correo          || sesion.correo || "";
  document.getElementById("telefono").value        = datosPerfil.telefono        || "";
  document.getElementById("direccion").value       = datosPerfil.direccion       || "";
  document.getElementById("fechaNacimiento").value = datosPerfil.fechaNacimiento || "";
  document.getElementById("genero").value          = datosPerfil.genero          || "";

  // Campos institucionales
  document.getElementById("identificacion").value      = datosPerfil.identificacion      || "";
  document.getElementById("rolInstitucion").value      = roles[sesion.rol]               || sesion.rol;
  document.getElementById("codigoInstitucional").value = datosPerfil.codigoInstitucional || "";
  document.getElementById("areaGrado").value           = datosPerfil.areaGrado           || "";
  document.getElementById("fechaIngreso").value        = datosPerfil.fechaIngreso        || "";
  document.getElementById("estadoUsuario").value       = datosPerfil.estadoUsuario       || "Activo";
});

// Activar o desactivar edición de una sección
function toggleEditar(seccion) {
  if (!estadoEdicion[seccion]) {

    // Guardar valores actuales por si el usuario cancela
    snapshots[seccion] = {};
    camposSeccion[seccion].forEach(function(id) {
      snapshots[seccion][id] = document.getElementById(id).value;
    });

    // Habilitar campos (excepto rolInstitucion que es solo lectura)
    camposSeccion[seccion].forEach(function(id) {
      if (id !== "rolInstitucion") {
        document.getElementById(id).disabled = false;
      }
    });

    document.getElementById("acciones" + capitalizar(seccion)).style.display = "flex";
    document.getElementById("btnEditar" + capitalizar(seccion)).textContent = "✕ Cancelar";
    estadoEdicion[seccion] = true;

  } else {
    cancelarEditar(seccion);
  }
}

// Cancelar edición y restaurar valores anteriores
function cancelarEditar(seccion) {
  if (snapshots[seccion]) {
    camposSeccion[seccion].forEach(function(id) {
      document.getElementById(id).value = snapshots[seccion][id];
    });
  }

  camposSeccion[seccion].forEach(function(id) {
    document.getElementById(id).disabled = true;
  });

  document.getElementById("acciones" + capitalizar(seccion)).style.display = "none";
  document.getElementById("btnEditar" + capitalizar(seccion)).textContent = "Editar";
  estadoEdicion[seccion] = false;

  if (seccion === "seguridad") {
    document.getElementById("errorSeguridad").textContent = "";
    document.getElementById("okSeguridad").textContent = "";
  }
}

// Guardar los cambios de una sección
function guardarSeccion(seccion) {
  camposSeccion[seccion].forEach(function(id) {
    datosPerfil[id] = document.getElementById(id).value;
  });

  localStorage.setItem(KEY_PERFIL, JSON.stringify(datosPerfil));

  // Si cambió el nombre, actualizarlo en hero, navbar y sesión
  if (seccion === "personal") {
    var nuevoNombre = document.getElementById("nombreCompleto").value.trim();
    if (nuevoNombre !== "") {
      document.getElementById("heroNombre").textContent  = nuevoNombre;
      document.getElementById("nombreNavbar").textContent = nuevoNombre;
      sesion.nombre = nuevoNombre;
      localStorage.setItem("sesion", JSON.stringify(sesion));
    }
  }

  camposSeccion[seccion].forEach(function(id) {
    document.getElementById(id).disabled = true;
  });

  document.getElementById("acciones" + capitalizar(seccion)).style.display = "none";
  document.getElementById("btnEditar" + capitalizar(seccion)).textContent = "Editar";
  estadoEdicion[seccion] = false;
}

// Cambiar contraseña
function guardarSeguridad() {
  var actual    = document.getElementById("passActual").value;
  var nueva     = document.getElementById("passNueva").value;
  var confirmar = document.getElementById("passConfirmar").value;
  var errEl     = document.getElementById("errorSeguridad");
  var okEl      = document.getElementById("okSeguridad");

  errEl.textContent = "";
  okEl.textContent  = "";

  if (!actual || !nueva || !confirmar) {
    errEl.textContent = "Por favor completa todos los campos.";
    return;
  }

  var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  var usuario  = usuarios.find(function(u) { return u.correo === sesion.correo; });

  if (!usuario || usuario.contrasena !== actual) {
    errEl.textContent = "La contraseña actual es incorrecta.";
    return;
  }

  if (nueva.length < 6) {
    errEl.textContent = "La nueva contraseña debe tener al menos 6 caracteres.";
    return;
  }

  if (nueva !== confirmar) {
    errEl.textContent = "Las contraseñas no coinciden.";
    return;
  }

  usuario.contrasena = nueva;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  document.getElementById("passActual").value    = "";
  document.getElementById("passNueva").value     = "";
  document.getElementById("passConfirmar").value = "";

  camposSeccion.seguridad.forEach(function(id) {
    document.getElementById(id).disabled = true;
  });

  document.getElementById("accionesSeguridad").style.display = "none";
  document.getElementById("btnEditarSeguridad").textContent  = "Editar";
  estadoEdicion.seguridad = false;

  okEl.textContent = "Contraseña actualizada correctamente.";
}

// Poner en mayúscula la primera letra
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}