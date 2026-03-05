// ScriptPrincipal.js - Dashboard del coordinador

// =============================================================
// CARGA DE DATOS DESDE LOCALSTORAGE
// Lee y parsea de forma segura los arreglos principales del
// sistema. Si no existen o hay un error de parseo, retorna un
// arreglo vacío para evitar fallos en el dashboard.
// =============================================================
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

// =============================================================
// MOSTRAR NOMBRE DE BIENVENIDA
// Lee la sesión activa y muestra solo el primer nombre del
// coordinador en el mensaje de bienvenida del dashboard.
// =============================================================
var sesion = JSON.parse(localStorage.getItem('sesion'));
if (sesion) {
  document.getElementById('nombreBienvenida').textContent = sesion.nombre.split(' ')[0];
}

// =============================================================
// MOSTRAR CONTADORES
// Actualiza las tarjetas de estadísticas del dashboard con la
// cantidad actual de cursos, módulos, lecciones, docentes y
// administrativos registrados en el sistema.
// =============================================================
document.getElementById('totalCursos').textContent    = cursos.length;
document.getElementById('totalModulos').textContent   = modulos.length;
document.getElementById('totalLecciones').textContent = lecciones.length;
document.getElementById('totalDocentes').textContent  = docentes.length;
document.getElementById('totalAdmins').textContent    = administrativos.length;

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
// MOSTRAR ÚLTIMOS 5 CURSOS REGISTRADOS
// Toma los 5 cursos más recientes (últimos del arreglo) y los
// muestra en orden inverso en la sección de actividad reciente.
// Cada item muestra el nombre del curso, el docente asignado y
// la cantidad de módulos que tiene. Si no hay cursos, muestra
// un mensaje informativo en su lugar.
// =============================================================
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