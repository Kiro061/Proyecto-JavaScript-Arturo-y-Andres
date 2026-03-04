var docentes = [];

// cargar datos guardados
if (localStorage.getItem("docentes") != null) {
    docentes = JSON.parse(localStorage.getItem("docentes"));
}

mostrarTabla();

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

function eliminar(i) {
    var confirmar = confirm("¿Seguro que quieres eliminar este docente?");
    if (confirmar) {
        docentes.splice(i, 1);
        localStorage.setItem("docentes", JSON.stringify(docentes));
        mostrarTabla();
    }
}

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