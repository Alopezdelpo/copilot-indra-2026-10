# Instrucciones para GitHub Copilot

## Contexto del proyecto

Este repositorio contiene **Mis tareas**, una aplicación web pequeña y estática para gestionar tareas en el navegador. Está implementada con HTML, CSS y JavaScript nativo, sin framework, herramientas de compilación ni dependencias de ejecución.

## Estructura

- `index.html`: estructura semántica y elementos de la interfaz.
- `styles.css`: estilos, diseño adaptable, reloj analógico y preferencias de movimiento reducido.
- `app.js`: interacción de tareas, persistencia con `localStorage` y actualización del reloj.
- `README.md`: descripción, funcionalidades e instrucciones de uso.

## Guías de implementación

- Mantén la solución sencilla y utiliza las API nativas del navegador. No añadas frameworks, dependencias, procesos de compilación o servicios de backend sin una necesidad clara.
- Conserva la separación entre estructura (HTML), presentación (CSS) y comportamiento (JavaScript).
- Mantén la interfaz y los textos visibles en español.
- Respeta el diseño existente, su adaptación a pantallas pequeñas y el soporte para `prefers-reduced-motion`.
- Preserva la accesibilidad: HTML semántico, etiquetas accesibles, estados anunciados cuando corresponda y controles utilizables con teclado.
- Para insertar texto proporcionado por el usuario, utiliza APIs seguras del DOM como `textContent`; no lo interpretes como HTML.
- Mantén el guardado de tareas en el dispositivo mediante `localStorage`. No afirmes que existe sincronización o almacenamiento remoto.
- Si cambias una funcionalidad, actualiza la documentación del `README.md` cuando sea pertinente.
- Aquellos headers llamativos escribelos en rojo para que el usuario lo vea bien

## Validación

No hay un proceso de compilación ni una suite de pruebas configurada. Para cambios de interfaz o comportamiento, comprueba la aplicación en un navegador: añadir, completar y eliminar tareas; persistencia al recargar; y presentación en pantallas estrechas. Revisa también que no haya errores en la consola.