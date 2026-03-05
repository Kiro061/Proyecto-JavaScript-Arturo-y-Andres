# 🎓 LMS — Sistema de Gestión de Aprendizaje
### Institución Educativa ABC

> Proyecto desarrollado por **Arturo Ojeda** y **Andrés Castellanos**  
> Skill: Desarrollo Web con JavaScript · Campuslands

---

## 📋 Descripción del Proyecto

LMS (Learning Management System) es una aplicación web de gestión académica desarrollada con tecnologías front-end puras. Permite a los coordinadores administrar cursos, docentes, módulos, lecciones y personal administrativo desde un panel centralizado. Los visitantes externos pueden explorar el catálogo de cursos público sin necesidad de autenticarse.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura y semántica de todas las vistas |
| **CSS3** | Estilos, diseño responsivo, dark mode, animaciones |
| **JavaScript (ES5/ES6)** | Lógica de negocio, manipulación del DOM, validaciones |
| **localStorage** | Persistencia de datos en el navegador (sin servidor) |
| **Google Fonts — Nunito** | Tipografía principal de la interfaz |
| **ui-avatars.com** | Generación de avatares automáticos para docentes sin foto |
| **Git / GitHub** | Control de versiones y alojamiento del repositorio |

> **Motor de base de datos:** No se utiliza una base de datos tradicional.  
> Los datos se persisten en el `localStorage` del navegador como objetos JSON.

---

## 📁 Estructura del Proyecto

```
Proyecto JavaScript Arturo y Andres/
│
├── Index.html                  # Catálogo público de cursos (sin login)
├── README.md
│
├── pages/
│   ├── Login.html              # Inicio de sesión con selección de rol
│   ├── principal.html          # Dashboard del coordinador
│   ├── Cursos.html             # Gestión de cursos, módulos y lecciones
│   ├── Docentes.html           # Gestión de docentes
│   ├── administrativos.html    # Gestión de administrativos
│   └── perfil.html             # Perfil del usuario en sesión
│
├── Scripts/
│   ├── barraNav.js             # Navbar: protección de rutas, sesión, dark mode
│   ├── loginIndex.js           # Autenticación y redirección por rol
│   ├── ScriptIndex.js          # Lógica del catálogo público
│   ├── Scriptsprincipal.js     # Estadísticas y cursos recientes del dashboard
│   ├── Scriptcursos.js         # CRUD de cursos, módulos y lecciones
│   ├── Scriptdocentes.js       # CRUD de docentes con validación de asignación
│   ├── admins.js               # CRUD de administrativos con sincronización de login
│   └── perfil.js               # Vista de perfil
│
├── Styles/
│   ├── Styles.css              # Estilos globales y navbar
│   ├── stylesLogin.css         # Estilos de la pantalla de login
│   ├── StylesIndex.css         # Estilos del catálogo público
│   ├── Stylesprincipal.css     # Estilos del dashboard
│   ├── Stylescursos.css        # Estilos de la gestión de cursos
│   ├── Stylesdocentes.css      # Estilos de la gestión de docentes
│   ├── StylesAdmin.css         # Estilos del módulo administrativo
│   └── Stylesperfil.css        # Estilos de la vista de perfil
│
└── images/
    ├── logo_blanco.png
    ├── logo_negro.png
    ├── logo_transparente.png
    ├── ImagenPerfil.png
    ├── user.svg / logout.svg / settings.svg
    └── favicon/
```

---

## 🚀 Manual de Instrucciones — Cómo Ejecutar la Aplicación

### Opción 1 — Abrir directamente en el navegador (más simple)

1. Descarga o clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/Proyecto-JavaScript-Arturo-y-Andres.git
   ```
2. Abre la carpeta del proyecto en tu explorador de archivos.
3. Haz doble clic sobre **`Index.html`** para ver el catálogo público.
4. Para acceder al panel de administración, haz clic en **"Iniciar sesión"**.

### Opción 2 — Servidor local con Live Server (recomendado)

1. Instala la extensión **Live Server** en Visual Studio Code.
2. Abre la carpeta del proyecto en VS Code.
3. Clic derecho sobre `Index.html` → **"Open with Live Server"**.
4. El navegador abrirá la aplicación automáticamente en `http://127.0.0.1:5500`.

### Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| **Coordinador** | admin@abc.edu.co | admin123 |
| Docente | docente@abc.edu.co | 123456 |
| Estudiante | estudiante@abc.edu.co | 123456 |

> ⚠️ Solo el rol **Coordinador** accede al panel de gestión. Docentes y estudiantes son redirigidos al catálogo público.

### Limpiar datos de prueba

Si deseas reiniciar todos los datos guardados, abre la consola del navegador (`F12`) y ejecuta:
```javascript
localStorage.clear();
location.reload();
```

---

## 📖 Documentación de Módulos

### 1. 🔐 Login — `pages/Login.html`

Pantalla de autenticación con selección de rol. El usuario elige entre **Estudiante**, **Docente** o **Coordinador**, ingresa correo y contraseña, y es redirigido según su rol.

- Los usuarios se almacenan en `localStorage["usuarios"]`.
- Se inicializan 3 usuarios de prueba al primer acceso.
- Los coordinadores creados desde el módulo de Administrativos se agregan automáticamente a la lista de usuarios.
- **Protección de rutas:** todas las páginas internas verifican la existencia de `localStorage["sesion"]` al cargar. Si no existe, redirigen a Login.

---

### 2. 📊 Dashboard — `pages/principal.html`

Panel principal del coordinador con:

- **Saludo personalizado** con el nombre leído de la sesión activa.
- **5 tarjetas de estadísticas** en tiempo real: total de cursos, módulos, lecciones, docentes y administrativos.
- **Cursos recientes:** lista de los últimos 5 cursos registrados con su docente y número de módulos.
- **Accesos rápidos:** botones directos a Cursos, Docentes, Administrativos y al catálogo público.

---

### 3. 📚 Gestión de Cursos — `pages/Cursos.html`

Vista de pestañas con tres secciones:

#### Cursos
- Formulario con: código, nombre, descripción y asignación de docente.
- El select de docentes se carga dinámicamente desde `localStorage["docentes"]`.
- Tabla con CRUD completo (crear, editar, eliminar).

#### Módulos
- Formulario con: código, nombre, descripción y asignación al curso.
- Solo disponible si existen cursos registrados.

#### Lecciones
- Formulario con: título, horas, contenido, URL multimedia y asignación al módulo.
- El campo multimedia acepta URLs de videos, PDFs, imágenes o cualquier enlace externo.
- Solo disponible si existen módulos registrados.

---

### 4. 👨‍🏫 Gestión de Docentes — `pages/Docentes.html`

- Formulario con: código, identificación, nombres, apellidos, email, foto (URL) y área académica.
- Tabla con foto de perfil (fallback automático si no hay URL).
- **Protección de eliminación:** no permite borrar un docente asignado a un curso activo. Muestra alerta con los cursos afectados.

---

### 5. 🏢 Módulo Administrativo — `pages/administrativos.html`

- Modal de registro y edición con: identificación, nombres, apellidos, email, teléfono, cargo y contraseña.
- **Sincronización con login:** al crear un administrativo se crea automáticamente un usuario con rol `coordinador`. Al eliminar, se revoca el acceso.
- Buscador en tiempo real por nombre, email, cargo, identificación y teléfono.
- Contador de registros visible.
- Selector de cargo dinámico (`<select>`), valor mostrado correctamente en tabla.

---

### 6. 🌐 Catálogo Público — `Index.html`

Página pública accesible sin login que muestra todos los cursos registrados.

- Buscador por nombre, código, descripción o docente.
- Filtro por área académica.
- Tarjetas con foto del docente (con fallback), área y cantidad de módulos.
- Modal de detalle con información completa del curso: descripción, docente, módulos expandibles y lecciones con enlace multimedia.
- Dark mode disponible.

---

## 👥 Autores

| Nombre | GitHub |
|---|---|
| Arturo Ojeda | [@ArturoOjeda](https://github.com/ArturoOjeda) |
| Andrés Castellanos | [@AndresCastellanos](https://github.com/AndresCastellanos) |

---

## 📄 Licencia

Proyecto académico desarrollado en **Campuslands** — 2025.  
Uso exclusivamente educativo.
