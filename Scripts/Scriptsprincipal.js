// ScriptPrincipal.js - Dashboard del coordinador

function getData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}

var cursos          = getData('cursos');
var modulos         = getData('modulos');
var lecciones       = getData('lecciones');
var docentes        = getData('docentes');
var administrativos = getData('administrativos');

// Mostrar nombre de bienvenida
var sesion = JSON.parse(localStorage.getItem('sesion'));
if (sesion) {
  document.getElementById('nombreBienvenida').textContent = sesion.nombre.split(' ')[0];
}

// Mostrar contadores
document.getElementById('totalCursos').textContent    = cursos.length;
document.getElementById('totalModulos').textContent   = modulos.length;
document.getElementById('totalLecciones').textContent = lecciones.length;
document.getElementById('totalDocentes').textContent  = docentes.length;
document.getElementById('totalAdmins').textContent    = administrativos.length;

// Evitar inyección de HTML
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Mostrar últimos 5 cursos
var contenedor = document.getElementById('listaCursosRecientes');

if (cursos.length === 0) {
  contenedor.innerHTML = '<p class="lista-vacia">No hay cursos registrados aún.</p>';
} else {
  var recientes = cursos.slice(-5).reverse();

  recientes.forEach(function(c) {
    var totalMods = modulos.filter(function(m) { return m.curso === c.nombre; }).length;
    var texto = totalMods + (totalMods === 1 ? ' módulo' : ' módulos');

    var item = document.createElement('div');
    item.className = 'curso-item';
    item.innerHTML =
      '<div class="curso-item-icono">📚</div>' +
      '<div>' +
        '<div class="curso-item-nombre">' + escHtml(c.nombre) + '</div>' +
        '<div class="curso-item-docente">' + escHtml(c.docente || 'Sin docente asignado') + '</div>' +
      '</div>' +
      '<span class="curso-item-badge">' + texto + '</span>';

    contenedor.appendChild(item);
  });
}