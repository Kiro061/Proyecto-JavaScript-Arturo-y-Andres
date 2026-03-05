// ── DATOS ─────────────────────────────────────────
var administrativos = [];

if (localStorage.getItem("administrativos") != null) {
    administrativos = JSON.parse(localStorage.getItem("administrativos"));
}

// ── INICIO ────────────────────────────────────────
mostrarTabla();
actualizarContador();



// ── MODAL ────────────────────────────────────────

// =============================================================
// ABRIR FORMULARIO
// Abre el modal en modo "creación". Limpia los campos, pone el
// título "Nuevo Administrativo" y muestra el campo contraseña.
// =============================================================
function abrirFormulario() {
    document.getElementById("tituloModal").textContent = "Nuevo Administrativo";
    limpiar();
    document.getElementById("modalOverlay").classList.add("activo");

    // Mostrar campo contraseña al crear nuevo
    document.getElementById("contrasena").closest(".form-group").style.display = "";
}

// =============================================================
// CERRAR FORMULARIO
// Cierra el modal quitando la clase "activo" y limpia todos
// los campos del formulario.
// =============================================================
function cerrarFormulario() {
    document.getElementById("modalOverlay").classList.remove("activo");
    limpiar();
}

// =============================================================
// CERRAR MODAL AL HACER CLIC EN EL FONDO (OVERLAY)
// Solo cierra el modal si el clic fue sobre el fondo oscuro,
// no sobre el contenido del formulario.
// =============================================================
function cerrarModalOverlay(event) {
    if (event.target === document.getElementById("modalOverlay")) {
        cerrarFormulario();
    }
}

// =============================================================
// MOSTRAR / OCULTAR CONTRASEÑA
// Alterna el campo contraseña entre tipo "password" (oculto)
// y tipo "text" (visible).
// =============================================================
function togglePass() {
    var input = document.getElementById("contrasena");
    input.type = input.type === "password" ? "text" : "password";
}

// ── GUARDAR ───────────────────────────────────────

// =============================================================
// GUARDAR ADMINISTRATIVO
// Valida todos los campos y guarda un nuevo administrativo o
// actualiza uno existente. Validaciones:
//   - Campos obligatorios completos
//   - Email con formato válido
//   - Teléfono entre 7 y 15 dígitos numéricos
//   - Contraseña mínimo 6 caracteres (solo al crear)
//   - Email no duplicado
// También sincroniza el registro con "usuarios" en localStorage
// para habilitar el acceso al sistema como coordinador.
// =============================================================
function guardar() {
    var identificacion = document.getElementById("identificacion").value.trim();
    var nombres        = document.getElementById("nombres").value.trim();
    var apellidos      = document.getElementById("apellidos").value.trim();
    var email          = document.getElementById("email").value.trim();
    var telefono       = document.getElementById("telefono").value.trim();
    var cargo          = document.getElementById("cargo").value;
    var contrasena     = document.getElementById("contrasena").value;
    var indice         = document.getElementById("indiceEditar").value;
    var error          = document.getElementById("errorAdmin");

    // Validaciones
    if (identificacion === "" || nombres === "" || apellidos === "" ||
        email === "" || telefono === "") {
        error.textContent = "Por favor completa todos los campos obligatorios.";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        error.textContent = "Ingresa un email válido.";
        return;
    }

    if (!/^\d{7,15}$/.test(telefono)) {
        error.textContent = "El teléfono debe tener entre 7 y 15 dígitos numéricos.";
        return;
    }

    // Al crear nuevo, contraseña es obligatoria
    if (indice == -1 && contrasena.length < 6) {
        error.textContent = "La contraseña debe tener al menos 6 caracteres.";
        return;
    }

    // Verificar email duplicado (excepto al editar el mismo registro)
    for (var i = 0; i < administrativos.length; i++) {
        if (administrativos[i].email === email && i != indice) {
            error.textContent = "Ya existe un administrativo con ese email.";
            return;
        }
    }

    error.textContent = "";

    var admin = {
        identificacion: identificacion,
        nombres:        nombres,
        apellidos:      apellidos,
        email:          email,
        telefono:       telefono,
        cargo:          cargo
    };

    // Guardar o actualizar en lista de administrativos
    if (indice == -1) {
        administrativos.push(admin);
    } else {
        administrativos[indice] = admin;
    }
    localStorage.setItem("administrativos", JSON.stringify(administrativos));

    // ── Sincronizar con usuarios (para login) ──────
    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (indice == -1) {
        // Nuevo: agregar usuario con rol coordinador
        usuarios.push({
            correo:    email,
            contrasena: contrasena,
            rol:       "coordinador",
            nombre:    nombres + " " + apellidos
        });
    } else {
        // Editar: actualizar datos del usuario existente
        // Buscamos por la identificación previa (usamos el email original guardado)
        var emailAnterior = administrativos[indice] ? administrativos[indice].email : null;
        var idxUsuario = usuarios.findIndex(function(u) {
            return u.correo === document.getElementById("email").value.trim() ||
                (emailAnterior && u.correo === emailAnterior);
        });

        // Buscar por nombre completo anterior como fallback
        var nombreAnterior = administrativos[indice]
            ? administrativos[indice].nombres + " " + administrativos[indice].apellidos
            : null;

        idxUsuario = usuarios.findIndex(function(u) {
            return u.rol === "coordinador" && u.nombre === nombreAnterior;
        });

        if (idxUsuario !== -1) {
            usuarios[idxUsuario].correo = email;
            usuarios[idxUsuario].nombre = nombres + " " + apellidos;
            if (contrasena.length >= 6) {
                usuarios[idxUsuario].contrasena = contrasena;
            }
        } else {
            // No encontrado: crear igual
            var pass = contrasena.length >= 6 ? contrasena : "admin123";
            usuarios.push({
                correo:    email,
                contrasena: pass,
                rol:       "coordinador",
                nombre:    nombres + " " + apellidos
            });
        }
    }
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    cerrarFormulario();
    mostrarTabla();
    actualizarContador();
}

// ── MOSTRAR TABLA ─────────────────────────────────

// =============================================================
// MOSTRAR TABLA
// Renderiza las filas HTML de la tabla. Si se pasa un arreglo
// "lista" lo usa (para resultados de búsqueda); si no, usa el
// arreglo global. Muestra mensaje especial si no hay registros.
// =============================================================
function mostrarTabla(lista) {
    var datos = lista !== undefined ? lista : administrativos;
    var filas = document.getElementById("filasAdmins");
    filas.innerHTML = "";

    if (datos.length === 0) {
        filas.innerHTML =
            "<tr class='fila-vacia'>" +
            "<td colspan='7'>No hay administrativos registrados. Haz clic en <strong>+ Nuevo Administrativo</strong> para agregar uno.</td>" +
            "</tr>";
        return;
    }

    for (var i = 0; i < datos.length; i++) {
        var a = datos[i];
        // Necesitamos el índice real en el arreglo original
        var indiceReal = administrativos.indexOf(a);

        filas.innerHTML +=
            "<tr>" +
            "<td>" + a.identificacion + "</td>" +
            "<td>" + a.nombres + "</td>" +
            "<td>" + a.apellidos + "</td>" +
            "<td>" + a.email + "</td>" +
            "<td>" + a.telefono + "</td>" +
            "<td><span class='badge-cargo'>" + (a.cargo || "Sin cargo") + "</span></td>" +
            "<td>" +
                "<button class='btn-editar' onclick='editar(" + indiceReal + ")'>Editar</button>" +
                "<button class='btn-eliminar' onclick='eliminar(" + indiceReal + ")'>Eliminar</button>" +
            "</td>" +
            "</tr>";
    }
}

// ── EDITAR ────────────────────────────────────────

// =============================================================
// EDITAR ADMINISTRATIVO
// Abre el modal en modo "edición" precargando los datos del
// registro seleccionado. Deja la contraseña en blanco para que
// pueda mantenerse la actual si no se modifica.
// =============================================================
function editar(i) {
    var a = administrativos[i];
    document.getElementById("tituloModal").textContent = "Editar Administrativo";
    document.getElementById("identificacion").value = a.identificacion;
    document.getElementById("nombres").value         = a.nombres;
    document.getElementById("apellidos").value       = a.apellidos;
    document.getElementById("email").value           = a.email;
    document.getElementById("telefono").value        = a.telefono;
    document.getElementById("contrasena").value      = "";
    document.getElementById("indiceEditar").value    = i;
    document.getElementById("errorAdmin").textContent = "";

    // Hint distinto al editar
    var hint = document.querySelector(".hint");
    if (hint) hint.innerHTML = "Deja en blanco para mantener la contraseña actual.";

    document.getElementById("modalOverlay").classList.add("activo");
}

// ── ELIMINAR ──────────────────────────────────────

// =============================================================
// ELIMINAR ADMINISTRATIVO
// Pide confirmación y elimina el administrativo del arreglo y
// de localStorage. También elimina su usuario de "usuarios"
// en localStorage, revocando su acceso al sistema.
// =============================================================
function eliminar(i) {
    var a = administrativos[i];
    var confirmar = confirm("¿Seguro que quieres eliminar a " + a.nombres + " " + a.apellidos + "?\nTambién se eliminará su acceso al sistema.");
    if (!confirmar) return;

    // Eliminar usuario de login
    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.filter(function(u) {
        return !(u.correo === a.email && u.rol === "coordinador");
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Eliminar administrativo
    administrativos.splice(i, 1);
    localStorage.setItem("administrativos", JSON.stringify(administrativos));

    mostrarTabla();
    actualizarContador();
}

// ── BÚSQUEDA / FILTRO ─────────────────────────────

// =============================================================
// FILTRAR TABLA
// Lee el texto del input de búsqueda y filtra por: nombres,
// apellidos, email, cargo, identificación y teléfono (sin
// distinguir mayúsculas). Si el campo está vacío, restaura
// la tabla completa y el contador normal.
// =============================================================
function filtrarTabla() {
    var texto = document.getElementById("busqueda").value.toLowerCase();

    if (texto === "") {
        mostrarTabla();
        actualizarContador();
        return;
    }

    var filtrados = administrativos.filter(function(a) {
        return (
            a.nombres.toLowerCase().includes(texto)        ||
            a.apellidos.toLowerCase().includes(texto)      ||
            a.email.toLowerCase().includes(texto)          ||
            a.cargo.toLowerCase().includes(texto)          ||
            a.identificacion.toLowerCase().includes(texto) ||
            a.telefono.includes(texto)
        );
    });

    mostrarTabla(filtrados);
    document.getElementById("contador").textContent = filtrados.length + " de " + administrativos.length + " registros";
}

// ── CONTADOR ──────────────────────────────────────

// =============================================================
// ACTUALIZAR CONTADOR
// Actualiza el texto del contador con el total de registros.
// Usa "registro" en singular o "registros" en plural según
// la cantidad.
// =============================================================
function actualizarContador() {
    var c = document.getElementById("contador");
    if (c) c.textContent = administrativos.length + (administrativos.length === 1 ? " registro" : " registros");
}

// ── LIMPIAR FORMULARIO ────────────────────────────

// =============================================================
// LIMPIAR FORMULARIO
// Vacía todos los campos del formulario modal, resetea el índice
// de edición a -1 (sin edición activa), borra el mensaje de
// error y restaura el hint de contraseña al texto por defecto.
// =============================================================
function limpiar() {
    document.getElementById("identificacion").value  = "";
    document.getElementById("nombres").value          = "";
    document.getElementById("apellidos").value        = "";
    document.getElementById("email").value            = "";
    document.getElementById("telefono").value         = "";
    document.getElementById("contrasena").value       = "";
    document.getElementById("indiceEditar").value     = -1;
    document.getElementById("errorAdmin").textContent = "";

    var hint = document.querySelector(".hint");
    if (hint) hint.innerHTML = "Esta contraseña le permitirá iniciar sesión como <strong>coordinador</strong>.";
}