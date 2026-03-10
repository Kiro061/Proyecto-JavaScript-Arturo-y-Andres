// ══════════════════════════════════════════════════
// ScriptCatalogo.js
// Lógica para la página pública de cursos
// ══════════════════════════════════════════════════

// =============================================================
// TOGGLE MODO OSCURO / CLARO
// Alterna la clase "dark-mode" en el body al hacer clic en el
// botón de tema. Cambia el ícono entre 🌙 (oscuro) y ☀️ (claro)
// según el modo activo.
// =============================================================
document.getElementById('btnTheme').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// =============================================================
// CARGA DE DATOS DESDE LOCALSTORAGE
// Lee y parsea de forma segura los arreglos de cursos, módulos,
// lecciones y docentes. Si no existen o hay un error de parseo,
// devuelve un arreglo vacío para evitar fallos en el resto
// de la página.
// =============================================================
function getData(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { return []; }
}

var cursos    = getData('cursos');
var modulos   = getData('modulos');
var lecciones = getData('lecciones');
var docentes  = getData('docentes');

// =============================================================
// POBLAR FILTRO DE ÁREAS
// Extrae las áreas únicas de los docentes asociados a cada curso
// y las agrega como opciones al select de filtro, ordenadas
// alfabéticamente.
// =============================================================
var areas = cursos
    .map(function (c) {
        var d = getDocente(c.docente);
        return d ? d.area : null;
    })
    .filter(Boolean);

// Eliminar duplicados
areas = areas.filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();

var selectArea = document.getElementById('filtroArea');
areas.forEach(function (a) {
    var op = document.createElement('option');
    op.value = a;
    op.textContent = a;
    selectArea.appendChild(op);
});

// =============================================================
// OBTENER DOCENTE POR NOMBRE COMPLETO
// Busca y retorna el objeto docente cuyo nombre completo
// (nombres + apellidos) coincida con el valor recibido.
// =============================================================
function getDocente(nombreCompleto) {
    return docentes.find(function (d) {
        return (d.nombres + ' ' + d.apellidos) === nombreCompleto;
    });
}

// =============================================================
// OBTENER MÓDULOS DE UN CURSO
// Retorna todos los módulos que pertenecen al curso indicado.
// =============================================================
function getModulosDeCurso(nombreCurso) {
    return modulos.filter(function (m) { return m.curso === nombreCurso; });
}

// =============================================================
// OBTENER LECCIONES DE UN MÓDULO
// Retorna todas las lecciones que pertenecen al módulo indicado.
// =============================================================
function getLeccionesDeModulo(nombreModulo) {
    return lecciones.filter(function (l) { return l.modulo === nombreModulo; });
}

// =============================================================
// GENERAR URL DE AVATAR DEL DOCENTE
// Retorna la URL de la foto del docente si tiene una guardada.
// Si no, genera un avatar automático con sus iniciales usando
// la API de ui-avatars.
// =============================================================
function avatarUrl(docente) {
    if (docente && docente.foto) return docente.foto;
    var nombre = docente ? docente.nombres : 'D';
    return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nombre) + '&background=5C8374&color=fff';
}

// =============================================================
// ESCAPAR HTML
// Convierte caracteres especiales en entidades HTML para evitar
// inyección de código al renderizar contenido dinámico en el DOM.
// =============================================================
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// =============================================================
// RENDERIZAR GRID DE CURSOS
// Genera y muestra las tarjetas de curso en el grid principal.
// Muestra el contador de resultados encontrados. Si la lista
// está vacía, muestra un mensaje ilustrado en su lugar.
// Cada tarjeta incluye datos del curso, docente, número de
// módulos y un botón para abrir el modal de detalle.
// =============================================================
function renderGrid(lista) {
    var grid = document.getElementById('gridCursos');
    var info = document.getElementById('infoResultados');
    grid.innerHTML = '';

    info.textContent = lista.length === 0
        ? ''
        : lista.length + (lista.length === 1 ? ' curso encontrado' : ' cursos encontrados');

    if (lista.length === 0) {
        grid.innerHTML =
            '<div class="vacio">' +
            '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#5C8374" stroke-width="1.5">' +
            '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>' +
            '</svg>' +
            '<p>No se encontraron cursos con ese criterio.</p>' +
            '</div>';
        return;
    }

    lista.forEach(function (c) {
        var docente = getDocente(c.docente);
        var mods    = getModulosDeCurso(c.nombre);
        var lec    = getLeccionesDeModulo(c.nombre);
        var foto    = avatarUrl(docente);
        var area    = docente ? docente.area : '';
        var idx     = cursos.indexOf(c);

        var card = document.createElement('div');
        card.className = 'card-curso';

        card.innerHTML =
            '<div class="card-banner"></div>' +
            '<div class="card-body">' +
                '<span class="card-codigo">' + escHtml(c.codigo) + '</span>' +
                '<h3 class="card-nombre">' + escHtml(c.nombre) + '</h3>' +
                '<p class="card-descripcion">' + escHtml(c.descripcion) + '</p>' +
                '<div class="card-docente">' +
                    '<img class="docente-avatar" src="' + foto + '" ' +
                        'onerror="this.src=\'https://ui-avatars.com/api/?name=D&background=5C8374&color=fff\'" alt="Docente">' +
                    '<div>' +
                        '<div class="docente-nombre">' + escHtml(c.docente || 'Sin asignar') + '</div>' +
                        (area ? '<div class="docente-area">' + escHtml(area) + '</div>' : '') +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="card-footer">' +
                '<span class="badge-modulos">📚 ' + mods.length + (mods.length === 1 ? ' módulo' : ' módulos') + '</span>' +
                '<span class="badge-modulos">📝' + lec.length + (lec.length === 1 ? ' leccion' : ' lecciones') + '</span>' +
                '<button class="btn-ver" onclick="abrirModal(' + idx + ')">Ver curso →</button>' +
            '</div>';

        grid.appendChild(card);
    });
}

// =============================================================
// FILTRAR CURSOS
// Lee el texto del buscador y el área seleccionada, y filtra
// el arreglo de cursos buscando coincidencias en nombre,
// descripción, docente y código. Luego llama a renderGrid
// con los resultados filtrados.
// =============================================================
function filtrar() {
    var texto = document.getElementById('busqueda').value.toLowerCase().trim();
    var area  = document.getElementById('filtroArea').value;

    var resultado = cursos.filter(function (c) {
        var docente  = getDocente(c.docente);
        var areaDoc  = docente ? docente.area : '';
        var coincideTexto = !texto ||
            c.nombre.toLowerCase().includes(texto)      ||
            c.descripcion.toLowerCase().includes(texto) ||
            c.docente.toLowerCase().includes(texto)     ||
            c.codigo.toLowerCase().includes(texto);
        var coincideArea = !area || areaDoc === area;
        return coincideTexto && coincideArea;
    });

    renderGrid(resultado);
}

// =============================================================
// ABRIR MODAL DE DETALLE
// Muestra el modal con la información completa del curso
// seleccionado: código, nombre, descripción, card del docente
// y la lista de módulos con sus lecciones anidadas. Bloquea
// el scroll del body mientras el modal está abierto.
// =============================================================
function abrirModal(i) {
    var c       = cursos[i];
    var docente = getDocente(c.docente);
    var mods    = getModulosDeCurso(c.nombre);
    var foto    = avatarUrl(docente);
    var area    = docente ? docente.area : '';

    document.getElementById('mCodigo').textContent      = c.codigo;
    document.getElementById('mNombre').textContent      = c.nombre;
    document.getElementById('mDescripcion').textContent = c.descripcion;

    // Card del docente
    document.getElementById('mDocenteCard').innerHTML =
        '<img src="' + foto + '" ' +
            'onerror="this.src=\'https://ui-avatars.com/api/?name=D&background=5C8374&color=fff\'" alt="Docente">' +
        '<div class="modal-docente-info">' +
            '<strong>' + escHtml(c.docente || 'Sin asignar') + '</strong>' +
            (area ? '<span>' + escHtml(area) + '</span>' : '') +
        '</div>';

    // Módulos y lecciones
    var modsHtml = '';

    if (mods.length === 0) {
        modsHtml = '<p style="font-size:0.85rem;color:#aac9c0;">Este curso aún no tiene módulos registrados.</p>';
    } else {
        mods.forEach(function (m) {
            var lecs = getLeccionesDeModulo(m.nombre);
            var lecsHtml = '';

            if (lecs.length === 0) {
                lecsHtml = '<p class="sin-lecciones">Sin lecciones registradas.</p>';
            } else {
                lecs.forEach(function (l, li) {
                    lecsHtml +=
                        '<div class="leccion-item">' +
                            '<div class="leccion-num">' + (li + 1) + '</div>' +
                            '<div>' +
                                '<div class="leccion-titulo">' + escHtml(l.titulo) + '</div>' +
                                '<div class="leccion-horas">⏱ ' + escHtml(l.horas) + ' hora(s)</div>' +
                                (l.multimedia
                                    ? '<a class="leccion-link" href="' + escHtml(l.multimedia) + '" target="_blank">🔗 Ver recurso</a>'
                                    : '') +
                            '</div>' +
                        '</div>';
                });
            }

            modsHtml +=
                '<div class="modulo-item">' +
                    '<div class="modulo-header" onclick="toggleModulo(this)">' +
                        '<div>' +
                            '<div class="modulo-nombre">' + escHtml(m.nombre) + '</div>' +
                            '<div class="modulo-desc-short">' + escHtml(m.descripcion) + '</div>' +
                        '</div>' +
                        '<span class="modulo-toggle">▼</span>' +
                    '</div>' +
                    '<div class="lecciones-lista">' + lecsHtml + '</div>' +
                '</div>';
        });
    }

    document.getElementById('mModulos').innerHTML = modsHtml;
    document.getElementById('modalOverlay').classList.add('activo');
    document.body.style.overflow = 'hidden';
}

// =============================================================
// EXPANDIR / COLAPSAR MÓDULO EN EL MODAL
// Alterna la visibilidad de la lista de lecciones de un módulo
// al hacer clic en su encabezado. También rota el ícono de
// flecha para indicar el estado abierto o cerrado.
// =============================================================
function toggleModulo(header) {
    var lista  = header.nextElementSibling;
    var toggle = header.querySelector('.modulo-toggle');
    var abierto = lista.classList.toggle('visible');
    toggle.classList.toggle('abierto', abierto);
}

// =============================================================
// CERRAR MODAL (BOTÓN)
// Cierra el modal de detalle quitando la clase "activo" y
// restaura el scroll normal del body.
// =============================================================
function cerrarModalBtn() {
    document.getElementById('modalOverlay').classList.remove('activo');
    document.body.style.overflow = '';
}

// =============================================================
// CERRAR MODAL AL HACER CLIC EN EL FONDO (OVERLAY)
// Solo cierra el modal si el clic fue directamente sobre el
// fondo oscuro, no sobre el contenido del modal.
// =============================================================
function cerrarModal(e) {
    if (e.target === document.getElementById('modalOverlay')) {
        cerrarModalBtn();
    }
}

// =============================================================
// INICIALIZACIÓN
// Si no hay cursos registrados muestra un mensaje ilustrado.
// Si hay cursos, renderiza el grid completo al cargar la página.
// =============================================================
if (cursos.length === 0) {
    document.getElementById('gridCursos').innerHTML =
        '<div class="vacio">' +
        '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#5C8374" stroke-width="1.5">' +
        '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' +
        '</svg>' +
        '<p>Aún no hay cursos publicados. Vuelve pronto.</p>' +
        '</div>';
} else {
    renderGrid(cursos);
}