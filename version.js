// Versión de MathViz: se muestra en el extremo derecho de la barra superior (visible también dentro de
// la ventana de ZenBan). Súbela en cada cambio que publiques, junto con los ?v= de index.html.
// 1.0 plugin de ZenBan · 1.1 lección lineal y afín · 1.2 desafíos al azar con historial, notas y progreso
// 1.3 versión a la derecha, progreso siempre visible y archivos con ?v= (sin copias viejas en caché)
// 1.4 página de inicio, ruta arriba y lecciones por capítulos (menú lateral, portada, Anterior / Siguiente)
// 1.5 el progreso dentro de ZenBan no se pierde (espera el estado guardado y guarda al cerrar)
window.MATHVIZ_VERSION = '1.5';
(function () {
  const header = document.getElementById('app-header');
  if (!header) return;
  const badge = document.createElement('span');
  badge.className = 'app-version';
  badge.id = 'app-version';
  badge.title = `MathViz versión ${window.MATHVIZ_VERSION}`;
  badge.textContent = `v${window.MATHVIZ_VERSION}`;
  header.appendChild(badge);
})();
