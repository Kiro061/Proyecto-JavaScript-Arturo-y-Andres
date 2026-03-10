// =============================================================
// VISTA DEL DOCENTE - MIS CURSOS
// Este script carga solo los cursos asignados al docente que
// tiene la sesión activa. Lee el nombre desde localStorage
// y lo compara con el campo "docente" de cada curso guardado.
// =============================================================

// =============================================================
// LEER SESIÓN ACTIVA
// Obtiene los datos del usuario que inició sesión desde
// localStorage. Si no hay sesión, barraNav.js ya redirige.
// =============================================================
var sesion = JSON.parse(localStorage.getItem("sesion"));
var nombreDocente = "";

if (sesion != null) {
    nombreDocente = sesion.nombre;
}

// =============================================================
// INICIALIZACIÓN
// Al cargar la página muestra el saludo y carga los cursos
// que le pertenecen al docente activo.
// =============================================================
mostrarSaludo();
cargarMisCursos();

// =============================================================
// MOSTRAR SALUDO
// Escribe el nombre del docente en el título de bienvenida.
// =============================================================
function mostrarSaludo() {
    var titulo = document.getElementById("tituloSaludo");
    if (titulo != null && nombreDocente != "") {
        titulo.textContent = "Bienvenido, " + nombreDocente;
    }
}

// =============================================================
// CARGAR MIS CURSOS
// Lee todos los cursos de localStorage y filtra solo los que
// tienen asignado al docente en sesión. Luego los renderiza
// como tarjetas en la pantalla.
// =============================================================
function cargarMisCursos() {
    var cursos = [];
    if (localStorage.getItem("cursos") != null) {
        cursos = JSON.parse(localStorage.getItem("cursos"));
    }

    // filtrar solo los cursos del docente en sesión
    var misCursos = [];
    for (var i = 0; i < cursos.length; i++) {
        if (cursos[i].docente == nombreDocente) {
            misCursos.push(cursos[i]);
        }
    }

    var contenedor = document.getElementById("contenedorCursos");
    var mensajeVacio = document.getElementById("mensajeSinCursos");
    contenedor.innerHTML = "";

    // si no tiene cursos, mostrar mensaje
    if (misCursos.length == 0) {
        mensajeVacio.style.display = "block";
        return;
    }

    mensajeVacio.style.display = "none";

    // crear una tarjeta por cada curso
    for (var i = 0; i < misCursos.length; i++) {
        var c = misCursos[i];

        // contar módulos del curso
        var cantModulos = contarModulos(c.nombre);

        // contar estudiantes matriculados
        var cantEstudiantes = contarEstudiantes(c.nombre);

        var card = document.createElement("div");
        card.className = "card-curso";
        card.setAttribute("data-nombre", c.nombre.toLowerCase());
        card.setAttribute("data-descripcion", c.descripcion.toLowerCase());

        card.innerHTML =
            "<p class='card-codigo'>" + c.codigo + "</p>" +
            "<p class='card-nombre'>" + c.nombre + "</p>" +
            "<p class='card-descripcion'>" + c.descripcion + "</p>" +
            "<p class='card-info'>Módulos: <span>" + cantModulos + "</span></p>" +
            "<p class='card-info'>Estudiantes: <span>" + cantEstudiantes + "</span></p>" +
            "<button class='card-btn' onclick='abrirDetalle(\"" + c.nombre + "\")'>Ver detalle</button>";

        contenedor.appendChild(card);
    }
}

// =============================================================
// CONTAR MÓDULOS
// Recibe el nombre de un curso y devuelve cuántos módulos
// tiene registrados en localStorage.
// =============================================================
function contarModulos(nombreCurso) {
    var modulos = [];
    if (localStorage.getItem("modulos") != null) {
        modulos = JSON.parse(localStorage.getItem("modulos"));
    }

    var cantidad = 0;
    for (var i = 0; i < modulos.length; i++) {
        if (modulos[i].curso == nombreCurso) {
            cantidad++;
        }
    }
    return cantidad;
}

// =============================================================
// CONTAR ESTUDIANTES
// Recibe el nombre de un curso y devuelve cuántos estudiantes
// están matriculados en él según los datos en localStorage.
// =============================================================
function contarEstudiantes(nombreCurso) {
    var estudiantes = [];
    if (localStorage.getItem("estudiantes") != null) {
        estudiantes = JSON.parse(localStorage.getItem("estudiantes"));
    }

    var cantidad = 0;
    for (var i = 0; i < estudiantes.length; i++) {
        var cursosDelEstudiante = estudiantes[i].cursos;
        for (var j = 0; j < cursosDelEstudiante.length; j++) {
            if (cursosDelEstudiante[j] == nombreCurso) {
                cantidad++;
                break;
            }
        }
    }
    return cantidad;
}

// =============================================================
// ABRIR DETALLE
// Abre el modal con la información completa del curso:
// descripción, lista de módulos y lista de estudiantes
// matriculados en él.
// =============================================================
function abrirDetalle(nombreCurso) {
    // cargar datos del curso
    var cursos = [];
    if (localStorage.getItem("cursos") != null) {
        cursos = JSON.parse(localStorage.getItem("cursos"));
    }

    var curso = null;
    for (var i = 0; i < cursos.length; i++) {
        if (cursos[i].nombre == nombreCurso) {
            curso = cursos[i];
            break;
        }
    }

    if (curso == null) {
        return;
    }

    // llenar el modal con los datos del curso
    document.getElementById("modalTitulo").textContent = curso.nombre;
    document.getElementById("modalDescripcion").textContent = curso.descripcion;

    // cargar módulos del curso
    var listaModulos = document.getElementById("modalModulos");
    listaModulos.innerHTML = "";

    var modulos = [];
    if (localStorage.getItem("modulos") != null) {
        modulos = JSON.parse(localStorage.getItem("modulos"));
    }

    var modulosCurso = [];
    for (var i = 0; i < modulos.length; i++) {
        if (modulos[i].curso == nombreCurso) {
            modulosCurso.push(modulos[i]);
        }
    }

    if (modulosCurso.length == 0) {
        listaModulos.innerHTML = "<li class='sin-datos'>Sin módulos registrados.</li>";
    } else {
        for (var i = 0; i < modulosCurso.length; i++) {
            var li = document.createElement("li");
            li.innerHTML = modulosCurso[i].nombre + " <span>— " + modulosCurso[i].descripcion + "</span>";
            listaModulos.appendChild(li);
        }
    }

    // cargar estudiantes matriculados en el curso
    var listaEstudiantes = document.getElementById("modalEstudiantes");
    listaEstudiantes.innerHTML = "";

    var estudiantes = [];
    if (localStorage.getItem("estudiantes") != null) {
        estudiantes = JSON.parse(localStorage.getItem("estudiantes"));
    }

    var matriculados = [];
    for (var i = 0; i < estudiantes.length; i++) {
        var cursosEst = estudiantes[i].cursos;
        for (var j = 0; j < cursosEst.length; j++) {
            if (cursosEst[j] == nombreCurso) {
                matriculados.push(estudiantes[i]);
                break;
            }
        }
    }

    if (matriculados.length == 0) {
        listaEstudiantes.innerHTML = "<li class='sin-datos'>Sin estudiantes matriculados.</li>";
    } else {
        for (var i = 0; i < matriculados.length; i++) {
            var li = document.createElement("li");
            li.innerHTML =
                matriculados[i].nombres + " " + matriculados[i].apellidos +
                " <span>— " + matriculados[i].grado + "</span>";
            listaEstudiantes.appendChild(li);
        }
    }

    // mostrar el modal
    document.getElementById("modalOverlay").classList.add("activo");
}

// =============================================================
// CERRAR MODAL
// Cierra el modal de detalle. Si se llama desde el overlay,
// solo cierra si el clic fue sobre el fondo oscuro.
// =============================================================
function cerrarModal(event) {
    if (event == null || event.target === document.getElementById("modalOverlay")) {
        document.getElementById("modalOverlay").classList.remove("activo");
    }
}

// =============================================================
// BUSCAR CURSO
// Filtra las tarjetas de cursos según el texto ingresado en
// el buscador, ocultando las que no coincidan.
// =============================================================
function buscar() {
    var texto = document.getElementById("buscador").value.toLowerCase();
    var cards = document.querySelectorAll(".card-curso");

    for (var i = 0; i < cards.length; i++) {
        var nombre      = cards[i].getAttribute("data-nombre");
        var descripcion = cards[i].getAttribute("data-descripcion");

        if (nombre.indexOf(texto) != -1 || descripcion.indexOf(texto) != -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}
