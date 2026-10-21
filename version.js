// Versión de MathViz: se muestra a la izquierda del logo. Súbela en cada cambio que publiques.
// 1.0 plugin de ZenBan · 1.1 lección lineal y afín · 1.2 desafíos al azar con historial, notas y progreso
window.MATHVIZ_VERSION = '1.2';
(function () {
  const left = document.querySelector('#app-header .header-left');
  if (!left) return;
  const badge = document.createElement('span');
  badge.className = 'app-version';
  badge.id = 'app-version';
  badge.title = `MathViz versión ${window.MATHVIZ_VERSION}`;
  badge.textContent = `v${window.MATHVIZ_VERSION}`;
  left.insertBefore(badge, left.firstChild);
})();
