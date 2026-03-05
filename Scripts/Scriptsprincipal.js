// ══════════════════════════════════════════════════
// ScriptPrincipal.js
// Lógica del panel / dashboard del coordinador
// ══════════════════════════════════════════════════

// ── Leer datos del localStorage ────────────────────
function getData(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { return []; }
}

var cursos          = getData('cursos');
var modulos         = getData('modulos');
var lecciones       = getData('lecciones');
var docentes        = getData('docentes');
var administrativos = getData('administrativos');

// ── Nombre de bienvenida desde sesión ─────────────
var sesion = JSON.parse(localStorage.getItem('sesion'));
if (sesion) {
    var primerNombre = sesion.nombre.split(' ')[0];
    document.getElementById('nombreBienvenida').textContent = primerNombre;
}

// ── Contadores en tarjetas ─────────────────────────
document.getElementById('totalCursos').textContent    = cursos.length;
document.getElementById('totalModulos').textContent   = modulos.length;
document.getElementById('totalLecciones').textContent = lecciones.length;
document.getElementById('totalDocentes').textContent  = docentes.length;
document.getElementById('totalAdmins').textContent    = administrativos.length;

// ── Cursos recientes (últimos 5) ───────────────────
var contenedor = document.getElementById('listaCursosRecientes');

if (cursos.length === 0) {
    contenedor.innerHTML = '<p class="lista-vacia">No hay cursos registrados aún.</p>';
} else {
    var recientes = cursos.slice(-5).reverse();

    recientes.forEach(function (c) {
        var modsCount = modulos.filter(function (m) { return m.curso === c.nombre; }).length;

        var item = document.createElement('div');
        item.className = 'curso-item';
        item.innerHTML =
            '<div class="curso-item-icono">📚</div>' +
            '<div>' +
                '<div class="curso-item-nombre">' + escHtml(c.nombre) + '</div>' +
                '<div class="curso-item-docente">' + escHtml(c.docente || 'Sin docente asignado') + '</div>' +
            '</div>' +
            '<span class="curso-item-badge">' + modsCount + (modsCount === 1 ? ' módulo' : ' módulos') + '</span>';

        contenedor.appendChild(item);
    });
}

// ── Escape HTML ────────────────────────────────────
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}