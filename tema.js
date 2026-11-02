// Tema (claro / oscuro) y estilo (propio / de ZenBan) de MathViz.
// - estilo 'propio': los colores de MathViz (violeta y verde). 'zenban': la paleta de ZenBan.
// - tema 'auto': dentro de ZenBan sigue el tema de ZenBan, solo sigue el del sistema; 'claro' / 'oscuro' lo fijan.
// Dentro de ZenBan se guarda en el objeto (zenban-integration.js); solo, en localStorage.
(function () {
  const KEY = 'mathviz_tema';
  const IN_ZENBAN = !!(window.ZenBanPlugin && ZenBanPlugin.inZenBan);
  const TEMAS = ['auto', 'claro', 'oscuro'];
  const ajustes = { estilo: IN_ZENBAN ? 'zenban' : 'propio', tema: 'auto' };
  let temaHost = null;
  const listeners = [];
  const mq = window.matchMedia ? matchMedia('(prefers-color-scheme: light)') : null;

  if (!IN_ZENBAN) {
    try { Object.assign(ajustes, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  }

  const claro = () => {
    if (ajustes.tema === 'claro') return true;
    if (ajustes.tema === 'oscuro') return false;
    if (IN_ZENBAN && temaHost) return temaHost === 'light';
    return !!(mq && mq.matches);
  };

  function aplicar() {
    const r = document.documentElement;
    r.dataset.estilo = ajustes.estilo === 'zenban' ? 'zenban' : 'propio';
    r.dataset.theme = claro() ? 'light' : 'dark';
    const z = ajustes.estilo === 'zenban';
    const lblE = z ? '🎨 ZenBan' : '🎨 Propio';
    const ttlE = z ? 'Estilo de ZenBan. Toca para usar el estilo propio de MathViz' : 'Estilo propio de MathViz. Toca para usar el de ZenBan';
    const lblT = { auto: '🌗 Auto', claro: '☀️ Claro', oscuro: '🌙 Oscuro' }[ajustes.tema];
    document.querySelectorAll('.btn-estilo').forEach(b => { b.textContent = lblE; b.title = ttlE; });
    document.querySelectorAll('.btn-tema').forEach(b => { b.textContent = lblT; b.title = 'Tema: ' + ajustes.tema + '. Toca para cambiar (auto, claro, oscuro)'; });
    if (IN_ZENBAN && ZenBanPlugin.setBarButton) ZenBanPlugin.setBarButton(lblE, ttlE);
  }

  function cambio(guardar) {
    aplicar();
    if (!IN_ZENBAN && guardar) { try { localStorage.setItem(KEY, JSON.stringify(ajustes)); } catch (e) {} }
    listeners.forEach(fn => { try { fn(claro(), ajustes, guardar); } catch (e) { console.error(e); } });
  }

  const api = window.MathVizTema = {
    isLight: claro,
    get: () => ({ estilo: ajustes.estilo, tema: ajustes.tema }),
    // fn(esClaro, ajustes, cambioDelUsuario)
    onChange(fn) { listeners.push(fn); },
    // Estado guardado en el objeto de ZenBan
    load(s) {
      if (s && (s.estilo === 'zenban' || s.estilo === 'propio')) ajustes.estilo = s.estilo;
      if (s && TEMAS.includes(s.tema)) ajustes.tema = s.tema;
      cambio(false);
    },
    setHost(t) { temaHost = t === 'light' ? 'light' : 'dark'; cambio(false); },
    cambiarEstilo() { ajustes.estilo = ajustes.estilo === 'zenban' ? 'propio' : 'zenban'; cambio(true); },
    cambiarTema() { ajustes.tema = TEMAS[(TEMAS.indexOf(ajustes.tema) + 1) % TEMAS.length]; cambio(true); },
  };

  if (mq) (mq.addEventListener ? mq.addEventListener('change', () => cambio(false)) : mq.addListener(() => cambio(false)));
  aplicar();
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-estilo').forEach(b => b.onclick = api.cambiarEstilo);
    document.querySelectorAll('.btn-tema').forEach(b => b.onclick = api.cambiarTema);
    aplicar();
  });
  if (IN_ZENBAN && ZenBanPlugin.onBarClick) ZenBanPlugin.onBarClick(api.cambiarEstilo);
})();
