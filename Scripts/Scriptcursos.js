// ── DATOS ─────────────────────────────────────────────

var cursos = [];
var modulos = [];
var lecciones = [];

if (localStorage.getItem("cursos") != null) {
    cursos = JSON.parse(localStorage.getItem("cursos"));
}
if (localStorage.getItem("modulos") != null) {
    modulos = JSON.parse(localStorage.getItem("modulos"));
}
if (localStorage.getItem("lecciones") != null) {
    lecciones = JSON.parse(localStorage.getItem("lecciones"));
}

// ── TABS ───────────────────────────────────────────────

function mostrarSeccion(id, boton) {
    // validar que haya cursos antes de ir a módulos
    if (id == "seccionModulos" && cursos.length == 0) {
        alert("Primero debes crear al menos un curso.");
        return;
    }

    // validar que haya módulos antes de ir a lecciones
    if (id == "seccionLecciones" && modulos.length == 0) {
        alert("Primero debes crear al menos un módulo.");
        return;
    }
    document.getElementById("seccionCursos").style.display = "none";
    document.getElementById("seccionModulos").style.display = "none";
    document.getElementById("seccionLecciones").style.display = "none";

    document.getElementById(id).style.display = "block";

    var tabs = document.querySelectorAll(".tab");
    tabs.forEach(function(t) { t.classList.remove("activo"); });
    boton.classList.add("activo");

    // actualizar selects al cambiar de pestaña
    if (id == "seccionModulos") {
        cargarSelectCursos();
        mostrarModulos();
    }
    if (id == "seccionLecciones") {
        cargarSelectModulos();
        mostrarLecciones();
    }
}

// ── CURSOS ─────────────────────────────────────────────

function guardarCurso() {
    var codigo = document.getElementById("codigoCurso").value.trim();
    var nombre = document.getElementById("nombreCurso").value.trim();
    var descripcion = document.getElementById("descripcionCurso").value.trim();
    var docente = document.getElementById("docenteCurso").value;
    var indice = document.getElementById("indiceCurso").value;

    if (codigo == "" || nombre == "" || descripcion == "" || docente == "") {
        document.getElementById("errorCurso").textContent = "Por favor llena todos los campos.";
        return;
    }

    document.getElementById("errorCurso").textContent = "";

    var curso = {
        codigo: codigo,
        nombre: nombre,
        descripcion: descripcion,
        docente: docente
    };

    if (indice == -1) {
        cursos.push(curso);
    } else {
        cursos[indice] = curso;
    }

    localStorage.setItem("cursos", JSON.stringify(cursos));
    limpiarCurso();
    mostrarCursos();
}

function mostrarCursos() {
    var filas = document.getElementById("filasCursos");
    filas.innerHTML = "";

    if (cursos.length == 0) {
        filas.innerHTML = "<tr><td colspan='5' style='text-align:center;color:gray;'>No hay cursos registrados.</td></tr>";
        return;
    }

    for (var i = 0; i < cursos.length; i++) {
        var c = cursos[i];
        filas.innerHTML += "<tr>" +
            "<td>" + c.codigo + "</td>" +
            "<td>" + c.nombre + "</td>" +
            "<td>" + c.descripcion + "</td>" +
            "<td>" + c.docente + "</td>" +
            "<td>" +
                "<button style='background-color:#1B4242' onclick='editarCurso(" + i + ")'>Editar</button>" +
                "<button style='background-color:#c0392b' onclick='eliminarCurso(" + i + ")'>Eliminar</button>" +
            "</td>" +
        "</tr>";
    }
}

function editarCurso(i) {
    var c = cursos[i];
    document.getElementById("codigoCurso").value = c.codigo;
    document.getElementById("nombreCurso").value = c.nombre;
    document.getElementById("descripcionCurso").value = c.descripcion;
    document.getElementById("docenteCurso").value = c.docente;
    document.getElementById("indiceCurso").value = i;
    window.scrollTo(0, 0);
}

function eliminarCurso(i) {
    var confirmar = confirm("¿Seguro que quieres eliminar este curso?");
    if (confirmar) {
        cursos.splice(i, 1);
        localStorage.setItem("cursos", JSON.stringify(cursos));
        mostrarCursos();
    }
}

function limpiarCurso() {
    document.getElementById("codigoCurso").value = "";
    document.getElementById("nombreCurso").value = "";
    document.getElementById("descripcionCurso").value = "";
    document.getElementById("docenteCurso").value = "";
    document.getElementById("indiceCurso").value = -1;
    document.getElementById("errorCurso").textContent = "";
}

// ── MÓDULOS ────────────────────────────────────────────

function cargarSelectCursos() {
    var select = document.getElementById("cursoModulo");
    select.innerHTML = "<option value=''>Seleccionar curso...</option>";
    for (var i = 0; i < cursos.length; i++) {
        select.innerHTML += "<option value='" + cursos[i].nombre + "'>" + cursos[i].nombre + "</option>";
    }
}

function guardarModulo() {
    var codigo = document.getElementById("codigoModulo").value.trim();
    var nombre = document.getElementById("nombreModulo").value.trim();
    var descripcion = document.getElementById("descripcionModulo").value.trim();
    var curso = document.getElementById("cursoModulo").value;
    var indice = document.getElementById("indiceModulo").value;

    if (codigo == "" || nombre == "" || descripcion == "" || curso == "") {
        document.getElementById("errorModulo").textContent = "Por favor llena todos los campos.";
        return;
    }

    document.getElementById("errorModulo").textContent = "";

    var modulo = {
        codigo: codigo,
        nombre: nombre,
        descripcion: descripcion,
        curso: curso
    };

    if (indice == -1) {
        modulos.push(modulo);
    } else {
        modulos[indice] = modulo;
    }

    localStorage.setItem("modulos", JSON.stringify(modulos));
    limpiarModulo();
    mostrarModulos();
}

function mostrarModulos() {
    var filas = document.getElementById("filasModulos");
    filas.innerHTML = "";

    if (modulos.length == 0) {
        filas.innerHTML = "<tr><td colspan='5' style='text-align:center;color:gray;'>No hay módulos registrados.</td></tr>";
        return;
    }

    for (var i = 0; i < modulos.length; i++) {
        var m = modulos[i];
        filas.innerHTML += "<tr>" +
            "<td>" + m.codigo + "</td>" +
            "<td>" + m.nombre + "</td>" +
            "<td>" + m.descripcion + "</td>" +
            "<td>" + m.curso + "</td>" +
            "<td>" +
                "<button style='background-color:#1B4242' onclick='editarModulo(" + i + ")'>Editar</button>" +
                "<button style='background-color:#c0392b' onclick='eliminarModulo(" + i + ")'>Eliminar</button>" +
            "</td>" +
        "</tr>";
    }
}

function editarModulo(i) {
    var m = modulos[i];
    cargarSelectCursos();
    document.getElementById("codigoModulo").value = m.codigo;
    document.getElementById("nombreModulo").value = m.nombre;
    document.getElementById("descripcionModulo").value = m.descripcion;
    document.getElementById("cursoModulo").value = m.curso;
    document.getElementById("indiceModulo").value = i;
    window.scrollTo(0, 0);
}

function eliminarModulo(i) {
    var confirmar = confirm("¿Seguro que quieres eliminar este módulo?");
    if (confirmar) {
        modulos.splice(i, 1);
        localStorage.setItem("modulos", JSON.stringify(modulos));
        mostrarModulos();
    }
}

function limpiarModulo() {
    document.getElementById("codigoModulo").value = "";
    document.getElementById("nombreModulo").value = "";
    document.getElementById("descripcionModulo").value = "";
    document.getElementById("cursoModulo").value = "";
    document.getElementById("indiceModulo").value = -1;
    document.getElementById("errorModulo").textContent = "";
}

// ── LECCIONES ──────────────────────────────────────────

function cargarSelectModulos() {
    var select = document.getElementById("moduloLeccion");
    select.innerHTML = "<option value=''>Seleccionar módulo...</option>";
    for (var i = 0; i < modulos.length; i++) {
        select.innerHTML += "<option value='" + modulos[i].nombre + "'>" + modulos[i].nombre + " (" + modulos[i].curso + ")</option>";
    }
}

function guardarLeccion() {
    var titulo = document.getElementById("tituloLeccion").value.trim();
    var horas = document.getElementById("horasLeccion").value.trim();
    var contenido = document.getElementById("contenidoLeccion").value.trim();
    var multimedia = document.getElementById("multimediaLeccion").value.trim();
    var modulo = document.getElementById("moduloLeccion").value;
    var indice = document.getElementById("indiceLeccion").value;

    if (titulo == "" || horas == "" || contenido == "" || modulo == "") {
        document.getElementById("errorLeccion").textContent = "Por favor llena todos los campos obligatorios.";
        return;
    }

    document.getElementById("errorLeccion").textContent = "";

    var leccion = {
        titulo: titulo,
        horas: horas,
        contenido: contenido,
        multimedia: multimedia,
        modulo: modulo
    };

    if (indice == -1) {
        lecciones.push(leccion);
    } else {
        lecciones[indice] = leccion;
    }

    localStorage.setItem("lecciones", JSON.stringify(lecciones));
    limpiarLeccion();
    mostrarLecciones();
}

function mostrarLecciones() {
    var filas = document.getElementById("filasLecciones");
    filas.innerHTML = "";

    if (lecciones.length == 0) {
        filas.innerHTML = "<tr><td colspan='6' style='text-align:center;color:gray;'>No hay lecciones registradas.</td></tr>";
        return;
    }

    for (var i = 0; i < lecciones.length; i++) {
        var l = lecciones[i];

        var linkMultimedia = "—";
        if (l.multimedia != "") {
            linkMultimedia = "<a class='link-multimedia' href='" + l.multimedia + "' target='_blank'>Ver recurso</a>";
        }

        filas.innerHTML += "<tr>" +
            "<td>" + l.titulo + "</td>" +
            "<td>" + l.horas + " h</td>" +
            "<td>" + l.contenido + "</td>" +
            "<td>" + linkMultimedia + "</td>" +
            "<td>" + l.modulo + "</td>" +
            "<td>" +
                "<button style='background-color:#1B4242' onclick='editarLeccion(" + i + ")'>Editar</button>" +
                "<button style='background-color:#c0392b' onclick='eliminarLeccion(" + i + ")'>Eliminar</button>" +
            "</td>" +
        "</tr>";
    }
}

function editarLeccion(i) {
    var l = lecciones[i];
    cargarSelectModulos();
    document.getElementById("tituloLeccion").value = l.titulo;
    document.getElementById("horasLeccion").value = l.horas;
    document.getElementById("contenidoLeccion").value = l.contenido;
    document.getElementById("multimediaLeccion").value = l.multimedia;
    document.getElementById("moduloLeccion").value = l.modulo;
    document.getElementById("indiceLeccion").value = i;
    window.scrollTo(0, 0);
}

function eliminarLeccion(i) {
    var confirmar = confirm("¿Seguro que quieres eliminar esta lección?");
    if (confirmar) {
        lecciones.splice(i, 1);
        localStorage.setItem("lecciones", JSON.stringify(lecciones));
        mostrarLecciones();
    }
}

function limpiarLeccion() {
    document.getElementById("tituloLeccion").value = "";
    document.getElementById("horasLeccion").value = "";
    document.getElementById("contenidoLeccion").value = "";
    document.getElementById("multimediaLeccion").value = "";
    document.getElementById("moduloLeccion").value = "";
    document.getElementById("indiceLeccion").value = -1;
    document.getElementById("errorLeccion").textContent = "";
}

// ── CARGAR SELECT DE DOCENTES ──────────────────────────

function cargarSelectDocentes() {
    var select = document.getElementById("docenteCurso");
    select.innerHTML = "<option value=''>Seleccionar docente...</option>";
    var docentes = [];
    if (localStorage.getItem("docentes") != null) {
        docentes = JSON.parse(localStorage.getItem("docentes"));
    }
    for (var i = 0; i < docentes.length; i++) {
        var nombre = docentes[i].nombres + " " + docentes[i].apellidos;
        select.innerHTML += "<option value='" + nombre + "'>" + nombre + "</option>";
    }
}

// ── INICIO ─────────────────────────────────────────────

cargarSelectDocentes();
mostrarCursos();