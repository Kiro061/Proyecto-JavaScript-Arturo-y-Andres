// =============================================================
// VISTA DEL ESTUDIANTE - MIS CURSOS
// Muestra solo los cursos en los que el estudiante está
// matriculado. Lee el correo de la sesión activa, busca al
// estudiante en localStorage y filtra sus cursos asignados.
// =============================================================

// =============================================================
// LEER SESIÓN ACTIVA
// Obtiene los datos del usuario logueado desde localStorage.
// barraNav.js ya redirige al login si no hay sesión.
// =============================================================
var sesion = JSON.parse(localStorage.getItem("sesion"));
var correoSesion = "";
var nombreSesion = "";

if (sesion != null) {
    correoSesion = sesion.correo;
    nombreSesion = sesion.nombre;
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
// Carga desde localStorage todos los datos que necesita la
// vista: estudiantes, cursos, módulos, lecciones y docentes.
// =============================================================
var todosEstudiantes = getData("estudiantes");
var todosCursos      = getData("cursos");
var todosModulos     = getData("modulos");
var todasLecciones   = getData("lecciones");
var todosDocentes    = getData("docentes");

// =============================================================
// BUSCAR AL ESTUDIANTE EN SESIÓN
// Compara el correo de la sesión con el email de cada
// estudiante registrado. Devuelve el objeto estudiante o null.
// =============================================================
var estudianteActual = null;
for (var i = 0; i < todosEstudiantes.length; i++) {
    if (todosEstudiantes[i].email == correoSesion) {
        estudianteActual = todosEstudiantes[i];
        break;
    }
}

// =============================================================
// CURSOS DEL ESTUDIANTE
// Filtra del arreglo global solo los cursos en los que
// aparece el nombre del estudiante (según sus cursos asignados).
// =============================================================
var misCursos = [];

if (estudianteActual != null) {
    var cursosAsignados = estudianteActual.cursos; // arreglo de nombres de cursos

    for (var i = 0; i < todosCursos.length; i++) {
        for (var j = 0; j < cursosAsignados.length; j++) {
            if (todosCursos[i].nombre == cursosAsignados[j]) {
                misCursos.push(todosCursos[i]);
                break;
            }
        }
    }
}

// =============================================================
// INICIALIZACIÓN
// Al cargar la página muestra el saludo y carga los cursos.
// =============================================================
mostrarSaludo();
calcularEstadisticas();
renderizarCursos(misCursos);

// =============================================================
// MOSTRAR SALUDO
// Pone el nombre del estudiante en el título del hero.
// =============================================================
function mostrarSaludo() {
    var elemento = document.getElementById("saludoEstudiante");
    if (elemento != null) {
        var nombre = estudianteActual != null ? estudianteActual.nombres : nombreSesion;
        elemento.textContent = "Hola, " + nombre + " 👋";
    }
}

// =============================================================
// CALCULAR ESTADÍSTICAS
// Cuenta los cursos, módulos y lecciones totales del estudiante
// y los muestra en los bloques del hero.
// =============================================================
function calcularEstadisticas() {
    var totalCursos   = misCursos.length;
    var totalModulos  = 0;
    var totalLecciones = 0;

    for (var i = 0; i < misCursos.length; i++) {
        var mods = getModulosDeCurso(misCursos[i].nombre);
        totalModulos += mods.length;

        for (var j = 0; j < mods.length; j++) {
            var lecs = getLeccionesDeModulo(mods[j].nombre);
            totalLecciones += lecs.length;
        }
    }

    document.getElementById("statCursos").textContent    = totalCursos;
    document.getElementById("statModulos").textContent   = totalModulos;
    document.getElementById("statLecciones").textContent = totalLecciones;
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
// OBTENER DOCENTE POR NOMBRE COMPLETO
// Busca en el arreglo de docentes el que tenga el nombre
// completo igual al valor recibido. Devuelve null si no existe.
// =============================================================
function getDocente(nombreCompleto) {
    for (var i = 0; i < todosDocentes.length; i++) {
        var nombre = todosDocentes[i].nombres + " " + todosDocentes[i].apellidos;
        if (nombre == nombreCompleto) {
            return todosDocentes[i];
        }
    }
    return null;
}

// =============================================================
// URL DEL AVATAR DEL DOCENTE
// Si el docente tiene foto la devuelve; si no, genera un avatar
// automático con sus iniciales usando la API de ui-avatars.
// =============================================================
function avatarDocente(docente) {
    if (docente != null && docente.foto != "") {
        return docente.foto;
    }
    var nombre = docente != null ? docente.nombres : "D";
    return "https://ui-avatars.com/api/?name=" + encodeURIComponent(nombre) + "&background=5C8374&color=fff";
}

// =============================================================
// RENDERIZAR CURSOS
// Genera las tarjetas de curso en el grid. Si la lista está
// vacía muestra el mensaje de "sin cursos".
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
        var docente  = getDocente(c.docente);
        var mods     = getModulosDeCurso(c.nombre);
        var foto     = avatarDocente(docente);
        var area     = docente != null ? docente.area : "";
        var indice   = todosCursos.indexOf(c);

        // calcular total de lecciones del curso
        var totalLecs = 0;
        for (var j = 0; j < mods.length; j++) {
            totalLecs += getLeccionesDeModulo(mods[j].nombre).length;
        }

        var card = document.createElement("div");
        card.className = "card-est";
        card.setAttribute("data-busqueda", (c.nombre + " " + c.descripcion + " " + c.docente).toLowerCase());

        card.innerHTML =
            "<div class='card-banda'></div>" +
            "<div class='card-cuerpo'>" +
                "<p class='card-codigo-est'>" + c.codigo + "</p>" +
                "<h3 class='card-nombre-est'>" + c.nombre + "</h3>" +
                "<p class='card-descripcion-est'>" + c.descripcion + "</p>" +
                "<div class='card-docente-est'>" +
                    "<img src='" + foto + "' onerror=\"this.src='https://ui-avatars.com/api/?name=D&background=5C8374&color=fff'\">" +
                    "<div>" +
                        "<div class='card-docente-nombre'>" + (c.docente || "Sin asignar") + "</div>" +
                        (area ? "<div class='card-docente-area'>" + area + "</div>" : "") +
                    "</div>" +
                "</div>" +
            "</div>" +
            "<div class='card-pie'>" +
                "<span class='badge-est'>📚 " + mods.length + " módulo(s) · " + totalLecs + " lección(es)</span>" +
                "<button class='btn-detalle' onclick='abrirModal(" + indice + ")'>Ver →</button>" +
            "</div>";

        grid.appendChild(card);
    }
}

// =============================================================
// ABRIR MODAL DE DETALLE
// Muestra el modal con toda la info del curso: docente,
// descripción y módulos con sus lecciones anidadas.
// =============================================================
function abrirModal(indice) {
    var c       = todosCursos[indice];
    var docente = getDocente(c.docente);
    var mods    = getModulosDeCurso(c.nombre);
    var foto    = avatarDocente(docente);
    var area    = docente != null ? docente.area : "";

    document.getElementById("mCodigo").textContent      = c.codigo;
    document.getElementById("mNombre").textContent      = c.nombre;
    document.getElementById("mDescripcion").textContent = c.descripcion;

    // Card del docente
    document.getElementById("mDocente").innerHTML =
        "<img src='" + foto + "' onerror=\"this.src='https://ui-avatars.com/api/?name=D&background=5C8374&color=fff'\">" +
        "<div>" +
            "<div class='docente-info-nombre'>" + (c.docente || "Sin asignar") + "</div>" +
            (area ? "<div class='docente-info-area'>" + area + "</div>" : "") +
        "</div>";

    // Módulos con lecciones
    var mModulos = document.getElementById("mModulos");
    mModulos.innerHTML = "";

    if (mods.length == 0) {
        mModulos.innerHTML = "<p style='font-size:13px;color:#aac9c0;'>Este curso aún no tiene módulos registrados.</p>";
    } else {
        for (var i = 0; i < mods.length; i++) {
            var m    = mods[i];
            var lecs = getLeccionesDeModulo(m.nombre);

            var lecsHtml = "";
            if (lecs.length == 0) {
                lecsHtml = "<p class='sin-lecciones-est'>Sin lecciones registradas.</p>";
            } else {
                for (var j = 0; j < lecs.length; j++) {
                    var l = lecs[j];
                    lecsHtml +=
                        "<div class='leccion-fila'>" +
                            "<div class='leccion-numero'>" + (j + 1) + "</div>" +
                            "<div>" +
                                "<div class='leccion-nombre'>" + l.titulo + "</div>" +
                                "<div class='leccion-horas-est'>⏱ " + l.horas + " hora(s)</div>" +
                                (l.multimedia ? "<a class='leccion-link-est' href='" + l.multimedia + "' target='_blank'>🔗 Ver recurso</a>" : "") +
                            "</div>" +
                        "</div>";
                }
            }

            var bloque = document.createElement("div");
            bloque.className = "modulo-bloque";
            bloque.innerHTML =
                "<div class='modulo-encabezado' onclick='toggleModulo(this)'>" +
                    "<div>" +
                        "<div class='modulo-encabezado-nombre'>" + m.nombre + "</div>" +
                        "<div class='modulo-encabezado-desc'>" + m.descripcion + "</div>" +
                    "</div>" +
                    "<span class='modulo-flecha'>▼</span>" +
                "</div>" +
                "<div class='lecciones-lista-est'>" + lecsHtml + "</div>";

            mModulos.appendChild(bloque);
        }
    }

    document.getElementById("modalOverlay").classList.add("activo");
    document.body.style.overflow = "hidden";
}

// =============================================================
// TOGGLE MÓDULO
// Abre o cierra la lista de lecciones de un módulo al hacer
// clic en su encabezado. Rota la flecha según el estado.
// =============================================================
function toggleModulo(encabezado) {
    var lista  = encabezado.nextElementSibling;
    var flecha = encabezado.querySelector(".modulo-flecha");
    var abierto = lista.classList.toggle("visible");
    if (abierto) {
        flecha.classList.add("abierto");
    } else {
        flecha.classList.remove("abierto");
    }
}

// =============================================================
// CERRAR MODAL
// Cierra el modal. Si se llama desde el overlay, solo cierra
// si el clic fue sobre el fondo oscuro, no sobre el contenido.
// =============================================================
function cerrarModal(event) {
    if (event == null || event.target === document.getElementById("modalOverlay")) {
        document.getElementById("modalOverlay").classList.remove("activo");
        document.body.style.overflow = "";
    }
}

// =============================================================
// BUSCAR CURSO
// Filtra las tarjetas visibles según el texto ingresado en
// el buscador. Busca en nombre, descripción y docente.
// =============================================================
function buscar() {
    var texto = document.getElementById("buscador").value.toLowerCase();
    var cards = document.querySelectorAll(".card-est");

    for (var i = 0; i < cards.length; i++) {
        var dato = cards[i].getAttribute("data-busqueda");
        if (dato.indexOf(texto) != -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}
