// ===== MathViz · Navegación de la app =====
// Al abrir se ve la PÁGINA DE INICIO: las lecciones (con su avance y mejor nota) y las herramientas
// (el graficador 3D). Arriba, la ruta ("Inicio › Lineal y afín › 5. Pendiente"): cada parte se puede tocar.
// El logo también vuelve al inicio.
// Para agregar una lección nueva: crea lessons/<tema>.js con
//   MathLessons.register({ id, label, icon, description, render(container), getState(), setState(state), summary() })
// y súmala a index.html (después de chapters.js). summary() devuelve { visited, total, best, current } para la tarjeta.
(function () {
  const lessons = [];
  const COMING = [
    { icon: '⛲', label: 'Función cuadrática', description: 'Parábolas, vértice, raíces y cómo se mueve la curva.' }
  ];
  let view = 'home';
  let area = null;
  let crumbs = null;
  let extraCrumb = null; // lo agrega la lección (capítulo actual)
  const listeners = [];

  function ensureUi() {
    if (area) return;
    const header = document.getElementById('app-header');
    // Logo y título llevan al inicio
    const left = header.querySelector('.header-left');
    left.classList.add('is-home-link');
    left.title = 'Ir al inicio';
    left.addEventListener('click', () => show('home'));
    crumbs = document.createElement('nav');
    crumbs.id = 'app-crumbs';
    crumbs.setAttribute('aria-label', 'Dónde estás');
    left.after(crumbs);
    crumbs.addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]');
      if (!b) return;
      const [v, chapter] = b.dataset.go.split(':');
      show(v);
      if (chapter) { const l = lessons.find(x => x.id === v); if (l && l.goTo) l.goTo(chapter); }
    });
    area = document.createElement('main');
    area.id = 'lesson-area';
    document.body.appendChild(area);
    area.addEventListener('click', (e) => {
      const b = e.target.closest('[data-open]');
      if (!b) return;
      show(b.dataset.open);
    });
  }

  function lessonById(id) { return lessons.find(l => l.id === id); }

  function renderCrumbs() {
    if (!crumbs) return;
    const parts = [`<button type="button" data-go="home" class="${view === 'home' ? 'is-current' : ''}">🏠 Inicio</button>`];
    if (view === 'graph') parts.push('<span>›</span><button type="button" class="is-current" data-go="graph">🌐 Graficador 3D</button>');
    const l = lessonById(view);
    if (l) {
      parts.push(`<span>›</span><button type="button" data-go="${l.id}:overview" class="${extraCrumb ? '' : 'is-current'}">${l.icon} ${l.label}</button>`);
      if (extraCrumb) parts.push(`<span>›</span><button type="button" class="is-current">${extraCrumb}</button>`);
    }
    crumbs.innerHTML = parts.join('');
  }

  // ----- Página de inicio -----
  function homeHtml() {
    const cards = lessons.map(l => {
      const s = l.summary ? l.summary() : { visited: 0, total: 0 };
      const pct = s.total ? Math.round(s.visited / s.total * 100) : 0;
      const started = s.visited > 0;
      return `<article class="home-card">
        <div class="home-card-icon">${l.icon}</div>
        <div class="home-card-body">
          <h3>${l.label}</h3>
          <p>${l.description || ''}</p>
          <div class="home-progress"><span class="home-bar"><i style="width:${pct}%"></i></span><small>${s.visited} de ${s.total} capítulos</small></div>
          ${s.best != null ? `<p class="home-best">Mejor nota en los desafíos: <b class="${s.best >= 4 ? 'good' : 'bad'}">${String(s.best.toFixed(1)).replace('.', ',')}</b></p>` : ''}
          <button type="button" class="lbtn" data-open="${l.id}">${started ? `▶ Continuar${s.current ? `: ${s.current}` : ''}` : '▶ Empezar'}</button>
        </div>
      </article>`;
    }).join('');
    const coming = COMING.map(c => `<article class="home-card is-soon"><div class="home-card-icon">${c.icon}</div><div class="home-card-body"><h3>${c.label} <span class="soon">Próximamente</span></h3><p>${c.description}</p></div></article>`).join('');
    return `
      <section class="home">
        <header class="home-hero">
          <h1>Aprende matemáticas <span>moviendo gráficas</span></h1>
          <p>Elige una lección: cada una está dividida en capítulos cortos, con ejemplos de la vida real, gráficas que puedes mover, animaciones y desafíos con nota para ver cómo vas mejorando.</p>
        </header>
        <h2 class="home-title">📚 Lecciones</h2>
        <div class="home-grid">${cards}${coming}</div>
        <h2 class="home-title">🧰 Herramientas</h2>
        <div class="home-grid">
          <article class="home-card is-tool"><div class="home-card-icon">🌐</div><div class="home-card-body">
            <h3>Graficador 3D</h3>
            <p>Escribe cualquier función y mira su gráfica en 3D, junto con su derivada, su integral, la recta tangente y el área bajo la curva. Para explorar libremente.</p>
            <button type="button" class="lbtn ghost" data-open="graph">Abrir el graficador</button>
          </div></article>
        </div>
        <h2 class="home-title">🧭 Cómo moverte</h2>
        <ul class="home-help">
          <li>Arriba siempre ves <b>dónde estás</b> (Inicio › Lección › Capítulo). Toca cualquier parte para volver ahí.</li>
          <li>Dentro de una lección, el <b>menú de capítulos</b> está a la izquierda (en pantallas angostas, en el botón ☰). Los capítulos que ya viste quedan con ✓.</li>
          <li>Al final de cada capítulo tienes <b>Anterior</b> y <b>Siguiente</b>. El logo te trae de vuelta a esta página.</li>
        </ul>
      </section>`;
  }

  function show(id) {
    ensureUi();
    const lesson = lessonById(id);
    view = lesson ? id : id === 'graph' ? 'graph' : 'home';
    extraCrumb = null;
    document.body.classList.toggle('lesson-mode', view !== 'graph');
    area.hidden = view === 'graph';
    area.querySelectorAll('.lesson-page, .home-page').forEach(p => { p.hidden = true; });
    if (view === 'home') {
      let page = area.querySelector('.home-page');
      if (!page) { page = document.createElement('div'); page.className = 'home-page'; area.appendChild(page); }
      page.innerHTML = homeHtml(); // siempre al día (avance y notas)
      page.hidden = false;
      area.scrollTop = 0;
    } else if (lesson) {
      let page = area.querySelector(`.lesson-page[data-lesson="${id}"]`);
      if (!page) {
        page = document.createElement('section');
        page.className = 'lesson-page';
        page.dataset.lesson = id;
        area.appendChild(page);
        lesson.render(page);
        if (lesson.pendingState) { lesson.setState(lesson.pendingState); lesson.pendingState = null; }
      }
      page.hidden = false;
      if (lesson.onShow) lesson.onShow();
    } else {
      // El graficador 3D vuelve a medir su tamaño
      window.dispatchEvent(new Event('resize'));
    }
    renderCrumbs();
    listeners.forEach(fn => fn());
  }

  window.MathLessons = {
    register(lesson) {
      lessons.push(lesson);
      ensureUi();
      if (view === 'home') show('home');
    },
    show,
    get active() { return view; },
    // La lección avisa en qué capítulo está (para la ruta de arriba)
    setCrumb(text) { extraCrumb = text || null; renderCrumbs(); },
    // Para guardar en ZenBan: qué se está viendo y el estado de cada lección
    getState() {
      const out = { tab: view, lessons: {} };
      lessons.forEach(l => {
        const s = l.getState ? l.getState() : l.pendingState;
        if (s) out.lessons[l.id] = s;
      });
      return out;
    },
    setState(state) {
      if (!state) return;
      lessons.forEach(l => {
        const s = state.lessons && state.lessons[l.id];
        if (!s) return;
        // La lección guarda el estado aunque todavía no esté abierta (así el inicio muestra su avance)
        if (l.setState) l.setState(s); else l.pendingState = s;
      });
      show(state.tab || 'home');
    },
    onChange(fn) { listeners.push(fn); },
    // Las lecciones avisan cuando cambian algo que conviene guardar
    changed() { listeners.forEach(fn => fn()); }
  };

  // Al abrir: la página de inicio (no el graficador 3D)
  document.addEventListener('DOMContentLoaded', () => { if (!area) show('home'); });
  ensureUi();
  show('home');
})();
