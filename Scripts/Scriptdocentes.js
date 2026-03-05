// =============================================================
// DATOS INICIALES
// Declara el arreglo global de docentes y lo carga desde
// localStorage si ya existen datos guardados previamente.
// =============================================================
var docentes = [];

if (localStorage.getItem("docentes") != null) {
    docentes = JSON.parse(localStorage.getItem("docentes"));
}

// =============================================================
// INICIALIZACIÓN
// Muestra la tabla de docentes al cargar la página con los
// datos existentes en localStorage.
// =============================================================
mostrarTabla();

// =============================================================
// GUARDAR DOCENTE
// Valida los campos obligatorios del formulario y guarda un
// nuevo docente o actualiza uno existente en el arreglo y en
// localStorage. Luego limpia el formulario y refresca la tabla.
// =============================================================
function guardar() {

    var codigo = document.getElementById("codigo").value;
    var identificacion = document.getElementById("identificacion").value;
    var nombres = document.getElementById("nombres").value;
    var apellidos = document.getElementById("apellidos").value;
    var email = document.getElementById("email").value;
    var foto = document.getElementById("foto").value;
    var area = document.getElementById("area").value;
    var indice = document.getElementById("indiceEditar").value;

    if (codigo == "" || identificacion == "" || nombres == "" || apellidos == "" || email == "" || area == "") {
        document.getElementById("error").textContent = "Por favor llena todos los campos.";
        return;
    }

    document.getElementById("error").textContent = "";

    var docente = {
        codigo: codigo,
        identificacion: identificacion,
        nombres: nombres,
        apellidos: apellidos,
        email: email,
        foto: foto,
        area: area
    };

    if (indice == -1) {
        docentes.push(docente);
    } else {
        docentes[indice] = docente;
    }

    localStorage.setItem("docentes", JSON.stringify(docentes));
    limpiar();
    mostrarTabla();
}

// =============================================================
// MOSTRAR TABLA
// Renderiza las filas HTML de la tabla de docentes. Muestra la
// foto del docente o un avatar generado automáticamente si no
// tiene foto. Si no hay registros muestra un mensaje informativo.
// Cada fila incluye botones de editar y eliminar.
// =============================================================
function mostrarTabla() {

    var filas = document.getElementById("filas");
    filas.innerHTML = "";

    if (docentes.length == 0) {
        filas.innerHTML = "<tr><td colspan='8'>No hay docentes registrados.</td></tr>";
        return;
    }

    for (var i = 0; i < docentes.length; i++) {

        var d = docentes[i];
        var urlFoto = d.foto != "" ? d.foto : "https://ui-avatars.com/api/?name=" + d.nombres + "&background=5C8374&color=fff";

        filas.innerHTML += "<tr>" +
            "<td><img src='" + urlFoto + "' onerror=\"this.src='https://ui-avatars.com/api/?name=" + d.nombres + "&background=5C8374&color=fff'\"></td>" +
            "<td>" + d.codigo + "</td>" +
            "<td>" + d.identificacion + "</td>" +
            "<td>" + d.nombres + "</td>" +
            "<td>" + d.apellidos + "</td>" +
            "<td>" + d.email + "</td>" +
            "<td>" + d.area + "</td>" +
            "<td>" +
                "<button style='background-color:#1B4242' onclick='editar(" + i + ")'>Editar</button>" +
                "<button style='background-color:#c0392b' onclick='eliminar(" + i + ")'>Eliminar</button>" +
            "</td>" +
        "</tr>";
    }
}

// =============================================================
// EDITAR DOCENTE
// Carga los datos del docente seleccionado en el formulario
// para permitir su modificación.
// =============================================================
function editar(i) {
    var d = docentes[i];
    document.getElementById("codigo").value = d.codigo;
    document.getElementById("identificacion").value = d.identificacion;
    document.getElementById("nombres").value = d.nombres;
    document.getElementById("apellidos").value = d.apellidos;
    document.getElementById("email").value = d.email;
    document.getElementById("foto").value = d.foto;
    document.getElementById("area").value = d.area;
    document.getElementById("indiceEditar").value = i;
}

// =============================================================
// ELIMINAR DOCENTE
// Verifica si el docente está asignado a algún curso antes de
// eliminarlo. Si tiene cursos asignados, muestra un aviso con
// los nombres de esos cursos y bloquea la eliminación. Si no
// tiene cursos, pide confirmación y elimina el registro del
// arreglo y de localStorage.
// =============================================================
function eliminar(i) {
    var docente = docentes[i];
    var nombreDocente = docente.nombres + " " + docente.apellidos;

    // Verificar si el docente está asignado a algún curso
    var cursos = [];
    if (localStorage.getItem("cursos") != null) {
        cursos = JSON.parse(localStorage.getItem("cursos"));
    }

    var cursosAsignados = cursos.filter(function(c) {
        return c.docente === nombreDocente;
    });

    if (cursosAsignados.length > 0) {
        var nombresCursos = cursosAsignados.map(function(c) { return "\"" + c.nombre + "\""; }).join(", ");
        alert(
            "No se puede eliminar a " + nombreDocente + " porque está asignado al siguiente curso:\n\n" +
            nombresCursos + "\n\nPrimero reasigna o elimina ese curso."
        );
        return;
    }

    var confirmar = confirm("¿Seguro que quieres eliminar a " + nombreDocente + "?");
    if (confirmar) {
        docentes.splice(i, 1);
        localStorage.setItem("docentes", JSON.stringify(docentes));
        mostrarTabla();
    }
}

// =============================================================
// LIMPIAR FORMULARIO
// Vacía todos los campos del formulario de docente, resetea el
// índice de edición a -1 y borra el mensaje de error.
// =============================================================
function limpiar() {
    document.getElementById("codigo").value = "";
    document.getElementById("identificacion").value = "";
    document.getElementById("nombres").value = "";
    document.getElementById("apellidos").value = "";
    document.getElementById("email").value = "";
    document.getElementById("foto").value = "";
    document.getElementById("area").value = "";
    document.getElementById("indiceEditar").value = -1;
    document.getElementById("error").textContent = "";
}