// =============================================================
// DASHBOARD DEL DOCENTE - MI PANEL
// Muestra solo los cursos asignados al docente en sesión.
// También muestra los módulos, lecciones y estudiantes
// matriculados en cada curso, en un modal con tabs.
// =============================================================

// =============================================================
// LEER SESIÓN ACTIVA
// Obtiene los datos del docente logueado desde localStorage.
// barraNav.js ya redirige al login si no hay sesión activa.
// =============================================================
var sesion = JSON.parse(localStorage.getItem("sesion"));
var nombreDocente = "";

if (sesion != null) {
    nombreDocente = sesion.nombre;
}

// =============================================================
// FUNCIÓN PARA LEER LOCALSTORAGE DE FORMA SEGURA
// Intenta parsear un valor del localStorage. Si hay error o
// no existe la clave, devuelve un arreglo vacío.
// =============================================================
function getData(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (e) {
        return [];
    }
}

// =============================================================
// DATOS GLOBALES
// Carga todos los datos necesarios desde localStorage.
// =============================================================
var todosCursos      = getData("cursos");
var todosModulos     = getData("modulos");
var todasLecciones   = getData("lecciones");
var todosEstudiantes = getData("estudiantes");
var todosDocentes    = getData("docentes");

// =============================================================
// CURSOS DEL DOCENTE EN SESIÓN
// Filtra del arreglo global solo los cursos donde el campo
// "docente" coincide con el nombre del docente en sesión.
// =============================================================
var misCursos = [];
for (var i = 0; i < todosCursos.length; i++) {
    if (todosCursos[i].docente == nombreDocente) {
        misCursos.push(todosCursos[i]);
    }
}

// =============================================================
// BUSCAR DATOS DEL DOCENTE EN EL ARREGLO DE DOCENTES
// Busca el objeto docente completo para mostrar su área
// académica en el hero. Compara nombres + apellidos.
// =============================================================
var datosDocente = null;
for (var i = 0; i < todosDocentes.length; i++) {
    var nombreCompleto = todosDocentes[i].nombres + " " + todosDocentes[i].apellidos;
    if (nombreCompleto == nombreDocente) {
        datosDocente = todosDocentes[i];
        break;
    }
}

// =============================================================
// INICIALIZACIÓN
// Al cargar la página muestra el saludo, calcula estadísticas
// y renderiza los cursos.
// =============================================================
mostrarSaludo();
calcularEstadisticas();
renderizarCursos(misCursos);

// =============================================================
// MOSTRAR SALUDO
// Pone el nombre del docente en el hero y su área si existe.
// =============================================================
function mostrarSaludo() {
    var titulo = document.getElementById("saludoDocente");
    var area   = document.getElementById("areaDocente");

    if (titulo != null) {
        titulo.textContent = "Hola, " + nombreDocente + " 👋";
    }

    if (area != null && datosDocente != null) {
        area.textContent = "Área: " + datosDocente.area;
    }
}

// =============================================================
// CALCULAR ESTADÍSTICAS
// Cuenta cursos, estudiantes únicos y módulos del docente.
// Muestra los totales en los bloques del hero.
// =============================================================
function calcularEstadisticas() {
    var totalCursos = misCursos.length;
    var totalModulos = 0;
    var estudiantesUnicos = [];

    for (var i = 0; i < misCursos.length; i++) {
        var mods = getModulosDeCurso(misCursos[i].nombre);
        totalModulos += mods.length;

        // contar estudiantes únicos en todos los cursos
        var ests = getEstudiantesDelCurso(misCursos[i].nombre);
        for (var j = 0; j < ests.length; j++) {
            var yaContado = false;
            for (var k = 0; k < estudiantesUnicos.length; k++) {
                if (estudiantesUnicos[k].email == ests[j].email) {
                    yaContado = true;
                    break;
                }
            }
            if (!yaContado) {
                estudiantesUnicos.push(ests[j]);
            }
        }
    }

    document.getElementById("statCursos").textContent      = totalCursos;
    document.getElementById("statEstudiantes").textContent = estudiantesUnicos.length;
    document.getElementById("statModulos").textContent     = totalModulos;
}

// =============================================================
// OBTENER MÓDULOS DE UN CURSO
// Devuelve todos los módulos que pertenecen al curso recibido.
// =============================================================
function getModulosDeCurso(nombreCurso) {
    var resultado = [];
    for (var i = 0; i < todosModulos.length; i++) {
        if (todosModulos[i].curso == nombreCurso) {
            resultado.push(todosModulos[i]);
        }
    }
    return resultado;
}

// =============================================================
// OBTENER LECCIONES DE UN MÓDULO
// Devuelve todas las lecciones que pertenecen al módulo recibido.
// =============================================================
function getLeccionesDeModulo(nombreModulo) {
    var resultado = [];
    for (var i = 0; i < todasLecciones.length; i++) {
        if (todasLecciones[i].modulo == nombreModulo) {
            resultado.push(todasLecciones[i]);
        }
    }
    return resultado;
}

// =============================================================
// OBTENER ESTUDIANTES DE UN CURSO
// Devuelve todos los estudiantes que tienen el curso en su
// lista de cursos matriculados.
// =============================================================
function getEstudiantesDelCurso(nombreCurso) {
    var resultado = [];
    for (var i = 0; i < todosEstudiantes.length; i++) {
        var cursosEst = todosEstudiantes[i].cursos;
        for (var j = 0; j < cursosEst.length; j++) {
            if (cursosEst[j] == nombreCurso) {
                resultado.push(todosEstudiantes[i]);
                break;
            }
        }
    }
    return resultado;
}

// =============================================================
// URL DE AVATAR DE ESTUDIANTE
// Si el estudiante tiene foto la devuelve; si no, genera un
// avatar automático con sus iniciales.
// =============================================================
function avatarEstudiante(est) {
    if (est.foto != "") {
        return est.foto;
    }
    return "https://ui-avatars.com/api/?name=" + encodeURIComponent(est.nombres) + "&background=9EC8B9&color=092635";
}

// =============================================================
// RENDERIZAR CURSOS
// Genera las tarjetas de cada curso del docente en el grid.
// Muestra módulos y estudiantes como badges en cada card.
// =============================================================
function renderizarCursos(lista) {
    var grid = document.getElementById("gridCursos");
    var sinCursos = document.getElementById("mensajeSinCursos");
    grid.innerHTML = "";

    if (lista.length == 0) {
        sinCursos.style.display = "block";
        return;
    }

    sinCursos.style.display = "none";

    for (var i = 0; i < lista.length; i++) {
        var c = lista[i];
        var mods = getModulosDeCurso(c.nombre);
        var ests = getEstudiantesDelCurso(c.nombre);
        var indice = todosCursos.indexOf(c);

        var card = document.createElement("div");
        card.className = "card-doc";
        card.setAttribute("data-busqueda", (c.nombre + " " + c.descripcion + " " + c.codigo).toLowerCase());

        card.innerHTML =
            "<div class='card-doc-banda'></div>" +
            "<div class='card-doc-cuerpo'>" +
                "<p class='card-doc-codigo'>" + c.codigo + "</p>" +
                "<h3 class='card-doc-nombre'>" + c.nombre + "</h3>" +
                "<p class='card-doc-descripcion'>" + c.descripcion + "</p>" +
                "<div class='card-doc-resumen'>" +
                    "<span class='resumen-badge badge-modulos-doc'>📚 " + mods.length + " módulo(s)</span>" +
                    "<span class='resumen-badge badge-estudiantes-doc'>👩‍🎓 " + ests.length + " estudiante(s)</span>" +
                "</div>" +
            "</div>" +
            "<div class='card-doc-pie'>" +
                "<button class='btn-ver-doc' onclick='abrirModal(" + indice + ")'>Ver detalle →</button>" +
            "</div>";

        grid.appendChild(card);
    }
}

// =============================================================
// CURSO ACTIVO EN EL MODAL
// Variable global que guarda el índice del curso abierto en
// el modal, para usarlo al cambiar entre tabs.
// =============================================================
var indiceCursoModal = -1;

// =============================================================
// ABRIR MODAL
// Muestra el modal con la información del curso seleccionado.
// Carga los módulos por defecto y guarda el índice del curso.
// =============================================================
function abrirModal(indice) {
    indiceCursoModal = indice;
    var c = todosCursos[indice];

    document.getElementById("mCodigo").textContent      = c.codigo;
    document.getElementById("mNombre").textContent      = c.nombre;
    document.getElementById("mDescripcion").textContent = c.descripcion;

    // resetear tabs al abrir: mostrar módulos primero
    var tabs = document.querySelectorAll(".modal-tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("activo");
    }
    tabs[0].classList.add("activo");

    document.getElementById("panelModulos").style.display    = "";
    document.getElementById("panelEstudiantes").style.display = "none";

    cargarModulos(c.nombre);
    cargarEstudiantes(c.nombre);

    document.getElementById("modalOverlay").classList.add("activo");
    document.body.style.overflow = "hidden";
}

// =============================================================
// CARGAR MÓDULOS EN EL MODAL
// Renderiza los módulos del curso con sus lecciones anidadas.
// =============================================================
function cargarModulos(nombreCurso) {
    var contenedor = document.getElementById("mModulos");
    contenedor.innerHTML = "";

    var mods = getModulosDeCurso(nombreCurso);

    if (mods.length == 0) {
        contenedor.innerHTML = "<p class='sin-datos-doc'>Sin módulos registrados.</p>";
        return;
    }

    for (var i = 0; i < mods.length; i++) {
        var m    = mods[i];
        var lecs = getLeccionesDeModulo(m.nombre);

        var lecsHtml = "";
        if (lecs.length == 0) {
            lecsHtml = "<p class='sin-datos-doc'>Sin lecciones registradas.</p>";
        } else {
            for (var j = 0; j < lecs.length; j++) {
                var l = lecs[j];
                lecsHtml +=
                    "<div class='leccion-doc'>" +
                        "<div class='leccion-num-doc'>" + (j + 1) + "</div>" +
                        "<div>" +
                            "<div class='leccion-titulo-doc'>" + l.titulo + "</div>" +
                            "<div class='leccion-horas-doc'>⏱ " + l.horas + " hora(s)</div>" +
                            (l.multimedia ? "<a class='leccion-link-doc' href='" + l.multimedia + "' target='_blank'>🔗 Ver recurso</a>" : "") +
                        "</div>" +
                    "</div>";
            }
        }

        var bloque = document.createElement("div");
        bloque.className = "modulo-bloque-doc";
        bloque.innerHTML =
            "<div class='modulo-enc-doc' onclick='toggleModulo(this)'>" +
                "<div>" +
                    "<div class='modulo-enc-nombre'>" + m.nombre + "</div>" +
                    "<div class='modulo-enc-desc'>" + m.descripcion + "</div>" +
                "</div>" +
                "<span class='modulo-enc-flecha'>▼</span>" +
            "</div>" +
            "<div class='lecciones-doc'>" + lecsHtml + "</div>";

        contenedor.appendChild(bloque);
    }
}

// =============================================================
// CARGAR ESTUDIANTES EN EL MODAL
// Renderiza la lista de estudiantes matriculados en el curso.
// =============================================================
function cargarEstudiantes(nombreCurso) {
    var contenedor = document.getElementById("mEstudiantes");
    contenedor.innerHTML = "";

    var ests = getEstudiantesDelCurso(nombreCurso);

    if (ests.length == 0) {
        contenedor.innerHTML = "<p class='sin-datos-doc'>Ningún estudiante matriculado en este curso.</p>";
        return;
    }

    for (var i = 0; i < ests.length; i++) {
        var e   = ests[i];
        var url = avatarEstudiante(e);

        var fila = document.createElement("div");
        fila.className = "estudiante-fila";
        fila.innerHTML =
            "<img class='estudiante-avatar' src='" + url + "' onerror=\"this.src='https://ui-avatars.com/api/?name=" + e.nombres + "&background=9EC8B9&color=092635'\">" +
            "<div>" +
                "<div class='estudiante-nombre-modal'>" + e.nombres + " " + e.apellidos + "</div>" +
                "<div class='estudiante-grado-modal'>" + e.grado + " · " + e.email + "</div>" +
            "</div>";

        contenedor.appendChild(fila);
    }
}

// =============================================================
// CAMBIAR TAB EN EL MODAL
// Muestra el panel correspondiente al tab clickeado y oculta
// el otro. Marca visualmente el tab activo.
// =============================================================
function cambiarTab(panel, boton) {
    // quitar clase activo de todos los tabs
    var tabs = document.querySelectorAll(".modal-tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("activo");
    }
    boton.classList.add("activo");

    // mostrar el panel correcto
    document.getElementById("panelModulos").style.display     = panel == "modulos"     ? "" : "none";
    document.getElementById("panelEstudiantes").style.display = panel == "estudiantes" ? "" : "none";
}

// =============================================================
// TOGGLE MÓDULO
// Abre o cierra la lista de lecciones de un módulo.
// =============================================================
function toggleModulo(encabezado) {
    var lista  = encabezado.nextElementSibling;
    var flecha = encabezado.querySelector(".modulo-enc-flecha");
    var abierto = lista.classList.toggle("visible");
    if (abierto) {
        flecha.classList.add("abierto");
    } else {
        flecha.classList.remove("abierto");
    }
}

// =============================================================
// CERRAR MODAL
// Cierra el modal. Si viene del overlay solo cierra si el clic
// fue sobre el fondo oscuro, no sobre el contenido.
// =============================================================
function cerrarModal(event) {
    if (event == null || event.target === document.getElementById("modalOverlay")) {
        document.getElementById("modalOverlay").classList.remove("activo");
        document.body.style.overflow = "";
    }
}

// =============================================================
// BUSCAR CURSO
// Filtra las tarjetas del grid según el texto del buscador.
// =============================================================
function buscar() {
    var texto = document.getElementById("buscador").value.toLowerCase();
    var cards = document.querySelectorAll(".card-doc");

    for (var i = 0; i < cards.length; i++) {
        var dato = cards[i].getAttribute("data-busqueda");
        if (dato.indexOf(texto) != -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}
