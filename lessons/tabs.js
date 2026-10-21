// ===== MathViz · Pestañas de lecciones =====
// La primera pestaña es el graficador 3D; cada lección (función lineal y afín, cuadrática…) es otra pestaña.
// Para agregar una lección nueva: crea lessons/<tema>.js con
//   MathLessons.register({ id, label, icon, render(container), getState(), setState(state) })
// y súmalo a index.html (después de tabs.js).
(function () {
  const lessons = [];
  let active = 'graph';
  let bar = null;
  let area = null;
  const listeners = [];

  function ensureUi() {
    if (bar) return;
    bar = document.createElement('nav');
    bar.id = 'lesson-tabs';
    bar.setAttribute('role', 'tablist');
    const header = document.getElementById('app-header');
    header.querySelector('.header-left').after(bar);
    area = document.createElement('main');
    area.id = 'lesson-area';
    area.hidden = true;
    document.body.appendChild(area);
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tab]');
      if (b) show(b.dataset.tab);
    });
    renderBar();
  }

  function renderBar() {
    if (!bar) return;
    const tabs = [{ id: 'graph', label: 'Graficador 3D', icon: '🌐' }, ...lessons];
    bar.innerHTML = tabs.map(t => `<button type="button" role="tab" data-tab="${t.id}" aria-selected="${t.id === active}" class="lesson-tab${t.id === active ? ' is-active' : ''}"><span aria-hidden="true">${t.icon}</span><span>${t.label}</span></button>`).join('');
  }

  function show(id) {
    ensureUi();
    const lesson = lessons.find(l => l.id === id);
    active = lesson ? id : 'graph';
    document.body.classList.toggle('lesson-mode', !!lesson);
    area.hidden = !lesson;
    if (lesson) {
      area.querySelectorAll('.lesson-page').forEach(p => { p.hidden = p.dataset.lesson !== id; });
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
      area.scrollTop = 0;
    } else {
      // El graficador 3D vuelve a medir su tamaño
      window.dispatchEvent(new Event('resize'));
    }
    renderBar();
    listeners.forEach(fn => fn());
  }

  window.MathLessons = {
    register(lesson) {
      lessons.push(lesson);
      ensureUi();
      renderBar();
    },
    show,
    get active() { return active; },
    // Para guardar en ZenBan: pestaña activa y el estado de cada lección abierta
    getState() {
      const out = { tab: active, lessons: {} };
      lessons.forEach(l => {
        const page = area && area.querySelector(`.lesson-page[data-lesson="${l.id}"]`);
        if (page && l.getState) out.lessons[l.id] = l.getState();
        else if (l.pendingState) out.lessons[l.id] = l.pendingState;
      });
      return out;
    },
    setState(state) {
      if (!state) return;
      lessons.forEach(l => {
        const s = state.lessons && state.lessons[l.id];
        if (!s) return;
        const page = area && area.querySelector(`.lesson-page[data-lesson="${l.id}"]`);
        if (page && l.setState) l.setState(s); else l.pendingState = s;
      });
      if (state.tab) show(state.tab);
    },
    onChange(fn) { listeners.push(fn); },
    // Las lecciones avisan cuando cambian algo que conviene guardar
    changed() { listeners.forEach(fn => fn()); }
  };
})();
