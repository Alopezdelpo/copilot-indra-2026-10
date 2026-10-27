# Mis tareas

Aplicación web sencilla para organizar tareas pendientes. Permite añadir tareas, marcarlas como completadas y eliminarlas. La lista se guarda automáticamente en el almacenamiento local del navegador.

## Funcionalidades

- Añadir tareas de hasta 120 caracteres.
- Marcar tareas como completadas o pendientes.
- Eliminar tareas de la lista.
- Consultar cuántas tareas siguen pendientes.
- Conservar la lista en el dispositivo mediante `localStorage`.
- Ver un reloj analógico que muestra la hora local y se actualiza cada segundo; hasta 972 px de ancho aparece en el flujo de la página para no tapar contenido.
- Usar una interfaz adaptable a pantallas pequeñas y compatible con las preferencias de movimiento reducido.

## Cómo empezar

No es necesario instalar dependencias ni compilar el proyecto:

1. Descarga o clona este repositorio.
2. Abre `index.html` en un navegador web moderno.
3. Escribe una tarea y pulsa **Añadir**.

También puedes servir la carpeta con cualquier servidor web estático. La aplicación no necesita una conexión a un servidor para gestionar las tareas. La tipografía se carga desde Google Fonts; si no hay conexión, se utilizará la fuente alternativa del sistema.

## Uso

- **Añadir:** escribe una descripción y pulsa **Añadir**. No se guardan entradas vacías.
- **Completar:** pulsa el círculo junto a una tarea para cambiar su estado.
- **Eliminar:** pulsa el botón **×** de la tarea.

Los cambios se guardan en el navegador y dispositivo actuales. No se sincronizan entre dispositivos ni perfiles, y pueden borrarse al limpiar los datos del navegador.

## Estructura del proyecto

| Archivo | Descripción |
| --- | --- |
| `index.html` | Estructura de la página y elementos de la interfaz. |
| `styles.css` | Estilos, diseño adaptable y presentación del reloj. |
| `app.js` | Gestión de tareas, persistencia local y actualización del reloj. |

## Tecnologías

- HTML
- CSS
- JavaScript nativo
- `localStorage` del navegador