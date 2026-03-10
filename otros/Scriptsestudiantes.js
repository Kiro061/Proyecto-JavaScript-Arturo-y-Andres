// =============================================================
// DATOS INICIALES
// Declara el arreglo global de estudiantes y lo carga desde
// localStorage si ya existen datos guardados previamente.
// =============================================================
var estudiantes = [];

if (localStorage.getItem("estudiantes") != null) {
    estudiantes = JSON.parse(localStorage.getItem("estudiantes"));
}

// =============================================================
// INICIALIZACIÓN
// Al cargar la página muestra la tabla y actualiza el contador.
// =============================================================
cargarCheckboxCursos();
mostrarTabla();
actualizarContador();

// =============================================================
// ACTUALIZAR CONTADOR
// Muestra cuántos estudiantes hay registrados en total.
// =============================================================
function actualizarContador() {
    var contador = document.getElementById("contador");
    contador.textContent = "Total de estudiantes: " + estudiantes.length;
}

// =============================================================
// CARGAR CHECKBOXES DE CURSOS
// Rellena la lista de checkboxes con los cursos guardados en
// localStorage para poder matricular al estudiante en uno o
// varios cursos al momento de registrarlo.
// =============================================================
function cargarCheckboxCursos() {
    var contenedor = document.getElementById("checkboxCursos");
    contenedor.innerHTML = "";

    var cursos = [];
    if (localStorage.getItem("cursos") != null) {
        cursos = JSON.parse(localStorage.getItem("cursos"));
    }

    if (cursos.length == 0) {
        contenedor.innerHTML = "<p style='color:gray;font-size:13px;'>No hay cursos disponibles.</p>";
        return;
    }

    for (var i = 0; i < cursos.length; i++) {
        var label = document.createElement("label");
        label.innerHTML =
            "<input type='checkbox' value='" + cursos[i].nombre + "'> " + cursos[i].nombre;
        contenedor.appendChild(label);
    }
}

// =============================================================
// OBTENER CURSOS SELECCIONADOS
// Recorre los checkboxes del formulario y devuelve un arreglo
// con los nombres de los cursos marcados por el usuario.
// =============================================================
function getCursosSeleccionados() {
    var seleccionados = [];
    var checkboxes = document.querySelectorAll("#checkboxCursos input[type='checkbox']");
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            seleccionados.push(checkboxes[i].value);
        }
    }
    return seleccionados;
}

// =============================================================
// MARCAR CHECKBOXES
// Recibe un arreglo de nombres de cursos y marca los checkboxes
// correspondientes. Se usa al editar un estudiante.
// =============================================================
function marcarCheckboxes(cursosDelEstudiante) {
    var checkboxes = document.querySelectorAll("#checkboxCursos input[type='checkbox']");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        for (var j = 0; j < cursosDelEstudiante.length; j++) {
            if (checkboxes[i].value == cursosDelEstudiante[j]) {
                checkboxes[i].checked = true;
            }
        }
    }
}

// =============================================================
// GUARDAR ESTUDIANTE
// Valida los campos del formulario y guarda un nuevo estudiante
// o actualiza uno existente en el arreglo y en localStorage.
// También verifica que el email no esté duplicado.
// =============================================================
function guardar() {
    var codigo         = document.getElementById("codigo").value.trim();
    var identificacion = document.getElementById("identificacion").value.trim();
    var nombres        = document.getElementById("nombres").value.trim();
    var apellidos      = document.getElementById("apellidos").value.trim();
    var email          = document.getElementById("email").value.trim();
    var foto           = document.getElementById("foto").value.trim();
    var grado          = document.getElementById("grado").value;
    var indice         = document.getElementById("indiceEditar").value;
    var cursos         = getCursosSeleccionados();

    // validar campos obligatorios
    if (codigo == "" || identificacion == "" || nombres == "" || apellidos == "" || email == "" || grado == "") {
        document.getElementById("error").textContent = "Por favor llena todos los campos.";
        return;
    }

    // validar email duplicado
    for (var i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].email == email && i != indice) {
            document.getElementById("error").textContent = "Ese email ya está registrado.";
            return;
        }
    }

    document.getElementById("error").textContent = "";

    var estudiante = {
        codigo: codigo,
        identificacion: identificacion,
        nombres: nombres,
        apellidos: apellidos,
        email: email,
        foto: foto,
        grado: grado,
        cursos: cursos
    };

    if (indice == -1) {
        estudiantes.push(estudiante);
    } else {
        estudiantes[parseInt(indice)] = estudiante;
    }

    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    limpiar();
    mostrarTabla();
    actualizarContador();
}

// =============================================================
// MOSTRAR TABLA
// Renderiza las filas HTML de la tabla de estudiantes. Muestra
// la foto del estudiante o un avatar automático si no tiene.
// Los cursos aparecen como etiquetas (tags) visuales.
// =============================================================
function mostrarTabla() {
    var filas = document.getElementById("filas");
    filas.innerHTML = "";

    if (estudiantes.length == 0) {
        filas.innerHTML = "<tr><td colspan='9' style='text-align:center;color:gray;'>No hay estudiantes registrados.</td></tr>";
        return;
    }

    for (var i = 0; i < estudiantes.length; i++) {
        var e = estudiantes[i];
        var urlFoto = e.foto != "" ? e.foto : "https://ui-avatars.com/api/?name=" + e.nombres + "&background=5C8374&color=fff";

        // construir los tags de cursos
        var tagsCursos = "";
        if (e.cursos.length == 0) {
            tagsCursos = "<span style='color:gray;font-size:12px;'>Sin cursos</span>";
        } else {
            for (var j = 0; j < e.cursos.length; j++) {
                tagsCursos += "<span class='tag-curso'>" + e.cursos[j] + "</span>";
            }
        }

        filas.innerHTML +=
            "<tr>" +
            "<td><img src='" + urlFoto + "' onerror=\"this.src='https://ui-avatars.com/api/?name=" + e.nombres + "&background=5C8374&color=fff'\"></td>" +
            "<td>" + e.codigo + "</td>" +
            "<td>" + e.identificacion + "</td>" +
            "<td>" + e.nombres + "</td>" +
            "<td>" + e.apellidos + "</td>" +
            "<td>" + e.email + "</td>" +
            "<td>" + e.grado + "</td>" +
            "<td>" + tagsCursos + "</td>" +
            "<td>" +
                "<button style='background-color:#1B4242' onclick='editar(" + i + ")'>Editar</button>" +
                "<button style='background-color:#c0392b' onclick='eliminar(" + i + ")'>Eliminar</button>" +
            "</td>" +
            "</tr>";
    }
}

// =============================================================
// EDITAR ESTUDIANTE
// Carga los datos del estudiante seleccionado en el formulario
// y marca los cursos en los que está matriculado.
// =============================================================
function editar(i) {
    var e = estudiantes[i];
    document.getElementById("codigo").value         = e.codigo;
    document.getElementById("identificacion").value = e.identificacion;
    document.getElementById("nombres").value        = e.nombres;
    document.getElementById("apellidos").value      = e.apellidos;
    document.getElementById("email").value          = e.email;
    document.getElementById("foto").value           = e.foto;
    document.getElementById("grado").value          = e.grado;
    document.getElementById("indiceEditar").value   = i;

    // marcar los cursos del estudiante en los checkboxes
    marcarCheckboxes(e.cursos);

    window.scrollTo(0, 0);
}

// =============================================================
// ELIMINAR ESTUDIANTE
// Pide confirmación y elimina el estudiante del arreglo y de
// localStorage. Luego refresca la tabla y el contador.
// =============================================================
function eliminar(i) {
    var confirmar = confirm("¿Seguro que quieres eliminar a " + estudiantes[i].nombres + " " + estudiantes[i].apellidos + "?");
    if (confirmar) {
        estudiantes.splice(i, 1);
        localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
        mostrarTabla();
        actualizarContador();
    }
}

// =============================================================
// LIMPIAR FORMULARIO
// Vacía todos los campos, desmarca los checkboxes, resetea el
// índice de edición a -1 y borra el mensaje de error.
// =============================================================
function limpiar() {
    document.getElementById("codigo").value         = "";
    document.getElementById("identificacion").value = "";
    document.getElementById("nombres").value        = "";
    document.getElementById("apellidos").value      = "";
    document.getElementById("email").value          = "";
    document.getElementById("foto").value           = "";
    document.getElementById("grado").value          = "";
    document.getElementById("indiceEditar").value   = -1;
    document.getElementById("error").textContent    = "";

    // desmarcar todos los checkboxes
    var checkboxes = document.querySelectorAll("#checkboxCursos input[type='checkbox']");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
}

// =============================================================
// BUSCAR ESTUDIANTE
// Filtra las filas de la tabla según el texto ingresado en el
// buscador. Oculta las filas que no coincidan con la búsqueda.
// =============================================================
function buscar() {
    var texto = document.getElementById("buscador").value.toLowerCase();
    var filas = document.querySelectorAll("#filas tr");
    for (var i = 0; i < filas.length; i++) {
        var contenido = filas[i].textContent.toLowerCase();
        if (contenido.indexOf(texto) != -1) {
            filas[i].style.display = "";
        } else {
            filas[i].style.display = "none";
        }
    }
}
