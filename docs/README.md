# Documentación Técnica — Todolist (Rama `LUIS`)

Este repositorio contiene una aplicación web para gestionar una lista de tareas (`todolist`) con almacenamiento directo y exclusivo en un archivo físico JSON (`tasks.json`) mediante un servidor ligero en Node.js.

---

## 1. Arquitectura y Estructura del Proyecto

- `index.html` — Estructura principal de la interfaz de usuario.
- `src/css/styles.css` — Estilos visuales y diseño responsivo.
- `src/js/app.js` — Lógica del cliente, manejo del DOM y comunicación con `/api/tasks`.
- `server.js` — Servidor HTTP nativo en Node.js (sin dependencias externas) para servir archivos estáticos y leer/escribir `tasks.json`.
- `tasks.json` — Almacenamiento persistente en formato JSON para las tareas.
- `package.json` — Configuración del proyecto y script de inicio (`npm start`).

---

## 2. Mapa Técnico de Funcionalidades por Espacio de Código

### A. Backend y Persistencia en Disco (`server.js`)
| Líneas | Componente / Función | Descripción Técnica |
| :--- | :--- | :--- |
| `L1-L15` | Configuración y MIME Types | Importación de módulos nativos (`http`, `fs`, `path`), definición del puerto (`PORT = 3000`), ruta de `tasks.json` (`TASKS_FILE`) y cabeceras MIME. |
| `L17-L29` | `readTasksFile()` | Verifica la existencia de `tasks.json` (lo inicializa con `[]` si no existe), lee el contenido en UTF-8 y deserializa el arreglo JSON. |
| `L31-L33` | `writeTasksFile(items)` | Serializa el arreglo de tareas (`JSON.stringify(items, null, 2)`) y lo escribe directamente en `tasks.json`. |
| `L39-L45` | Endpoint `GET /api/tasks` | Invoca `readTasksFile()` y responde con código HTTP `200` y el listado actual de tareas en formato JSON. |
| `L47-L69` | Endpoint `PUT \| POST /api/tasks` | Recibe el arreglo de tareas, valida que sea un `Array` válido y actualiza `tasks.json` mediante `writeTasksFile()`. |
| `L76-L98` | Servidor de Archivos Estáticos | Normaliza la ruta solicitada y sirve `index.html`, CSS y JS con su `Content-Type` correspondiente. |
| `L101-L103` | Inicialización (`server.listen`) | Inicia el servidor mostrando únicamente la URL local (`http://localhost:3000`) sin exponer rutas internas en consola. |

### B. Lógica del Cliente (`src/js/app.js`)
| Líneas | Componente / Función | Descripción Técnica |
| :--- | :--- | :--- |
| `L1-L6` | Referencias del DOM | Captura de elementos (`#todo-form`, `#todo-input`, `#todo-list`, `#clear-completed`, `#clear-all`). |
| `L8-L14` | `init()` | Inicialización asíncrona: carga las tareas desde `tasks.json` (`await loadItems()`) y ejecuta `render()`. |
| `L16-L25` | Creación de tarea (`submit`) | Captura el evento del formulario, genera `{ id, text, done, created }`, lo inserta al inicio (`items.unshift`) y llama a `saveItems()`. |
| `L27-L35` | Delegación de eventos (`click`) | Detecta clics sobre los botones `.toggle` y `.delete` dentro de `#todo-list`. |
| `L37-L48` | Limpieza de tareas | Eventos para eliminar tareas completadas (`clearCompletedBtn`) o vaciar toda la lista (`clearAllBtn`). |
| `L50-L90` | `render()` | Reconstruye dinámicamente los nodos `<li>` del DOM. |
| `L92-L102` | `saveItems()` | Envía una petición `PUT /api/tasks` con `fetch` para guardar el arreglo de tareas directamente en `tasks.json`. |
| `L104-L114` | `loadItems()` | Realiza `GET /api/tasks` para leer las tareas directamente desde `tasks.json`. |
| `L116-L126` | `toggleItem(id)` y `deleteItem(id)` | Actualiza o filtra el arreglo `items`, guarda en `tasks.json` con `saveItems()` y vuelve a renderizar. |
| `L128-L133` | `cryptoRandomId()` | Generador de identificadores únicos mediante Web Crypto API. |

---

## 3. Cómo Ejecutar el Proyecto

1. Iniciar el servidor local:
   ```bash
   npm start
   ```
2. Abrir en el navegador:
   ```text
   http://localhost:3000
   ```
3. Todas las tareas se guardan directamente en `tasks.json`.
