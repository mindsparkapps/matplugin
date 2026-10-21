// ===== MathViz · Lección dividida en capítulos =====
// Toma las secciones (<section class="card" id="…">) de una lección y las muestra de a una:
// - Menú de capítulos a la izquierda, agrupado por bloques, con ✓ en los que ya se vieron
//   (en pantallas angostas se abre con el botón ☰).
// - Portada de la lección: de qué trata, el mapa de capítulos y "Continuar donde quedaste".
// - Barra de avance y botones Anterior / Siguiente al final de cada capítulo.
// Uso: const nav = LessonChapters(container, { lesson, intro, groups, onChange });
//   groups = [{ name: 'Empezar', chapters: [{ id: 'ln-maquina', title: 'La máquina de números', desc: '…' }] }]
//   nav.goTo(id | 'overview'), nav.getState() → { chapter, visited }, nav.setState(s), nav.summary()
(function () {
  window.LessonChapters = function (root, { lesson, intro, groups, onChange = () => {} }) {
    const chapters = groups.flatMap(g => g.chapters.map(c => ({ ...c, group: g.name })));
    let current = 'overview';
    const visited = new Set();

    // Las secciones que ya escribió la lección pasan al área de capítulos
    const sections = new Map();
    chapters.forEach((c, i) => {
      const s = root.querySelector(`#${c.id}`);
      if (!s) return;
      s.classList.add('lx-chapter');
      s.dataset.chapterNo = String(i + 1);
      sections.set(c.id, s);
    });
    const loose = [...root.children];

    root.innerHTML = `
      <div class="lx">
        <aside class="lx-side" aria-label="Capítulos">
          <button type="button" class="lx-side-close" aria-label="Cerrar el menú">×</button>
          <button type="button" class="lx-item lx-item-home" data-ch="overview"><span class="lx-n">🏠</span><span>Portada de la lección</span></button>
          ${groups.map(g => `<div class="lx-group">${g.name}</div>` + g.chapters.map(c => {
            const n = chapters.findIndex(x => x.id === c.id) + 1;
            return `<button type="button" class="lx-item" data-ch="${c.id}"><span class="lx-n">${n}</span><span>${c.title}</span><span class="lx-check" aria-hidden="true"></span></button>`;
          }).join('')).join('')}
        </aside>
        <div class="lx-main">
          <div class="lx-top">
            <button type="button" class="lx-menu-btn" aria-label="Abrir el menú de capítulos">☰ <span class="lx-menu-label"></span></button>
            <div class="lx-progress" title="Capítulos vistos"><span class="lx-bar"><i></i></span><small></small></div>
          </div>
          <section class="lx-overview">
            <header class="lesson-hero">
              <div class="hero-badge">${lesson.icon} Lección</div>
              <h1>${lesson.label}</h1>
              <p class="hero-sub">${intro}</p>
              <div class="btn-row"><button type="button" class="lbtn lx-continue"></button></div>
            </header>
            <h2 class="home-title">🗺 Mapa de la lección</h2>
            <div class="lx-map">${groups.map(g => `<div class="lx-map-group"><h3>${g.name}</h3>${g.chapters.map(c => {
              const n = chapters.findIndex(x => x.id === c.id) + 1;
              return `<button type="button" class="lx-map-item" data-ch="${c.id}"><span class="lx-n">${n}</span><span><b>${c.title}</b><small>${c.desc || ''}</small></span><span class="lx-check" aria-hidden="true"></span></button>`;
            }).join('')}</div>`).join('')}</div>
          </section>
          <div class="lx-content"></div>
          <nav class="lx-pager"></nav>
        </div>
      </div>
      <div class="lx-backdrop"></div>`;
    const content = root.querySelector('.lx-content');
    chapters.forEach(c => { const s = sections.get(c.id); if (s) content.appendChild(s); });
    loose.filter(el => !el.classList.contains('lx-chapter') && !el.classList.contains('lesson-hero')).forEach(el => content.appendChild(el));

    const scroller = () => document.getElementById('lesson-area');
    const closeMenu = () => root.classList.remove('lx-menu-open');

    function render() {
      const idx = chapters.findIndex(c => c.id === current);
      root.querySelector('.lx-overview').hidden = current !== 'overview';
      sections.forEach((s, id) => { s.hidden = id !== current; });
      root.querySelectorAll('[data-ch]').forEach(b => {
        b.classList.toggle('is-current', b.dataset.ch === current);
        b.classList.toggle('is-done', visited.has(b.dataset.ch));
      });
      const pct = Math.round(visited.size / chapters.length * 100);
      root.querySelector('.lx-bar i').style.width = `${pct}%`;
      root.querySelector('.lx-progress small').textContent = `${visited.size} de ${chapters.length} vistos`;
      root.querySelector('.lx-menu-label').textContent = idx >= 0 ? `Capítulo ${idx + 1} de ${chapters.length} · ${chapters[idx].title}` : 'Capítulos';
      // Continuar: el primero sin ver, o el siguiente al último visto
      const next = chapters.find(c => !visited.has(c.id)) || chapters[0];
      root.querySelector('.lx-continue').textContent = visited.size ? `▶ Continuar: ${chapters.indexOf(next) + 1}. ${next.title}` : `▶ Empezar: 1. ${chapters[0].title}`;
      root.querySelector('.lx-continue').dataset.ch = next.id;
      const pager = root.querySelector('.lx-pager');
      if (idx < 0) { pager.innerHTML = ''; }
      else {
        const prev = chapters[idx - 1], nxt = chapters[idx + 1];
        pager.innerHTML = `
          ${prev ? `<button type="button" class="lx-page prev" data-ch="${prev.id}"><small>← Anterior</small><b>${idx}. ${prev.title}</b></button>` : '<button type="button" class="lx-page prev" data-ch="overview"><small>← Volver</small><b>Portada de la lección</b></button>'}
          ${nxt ? `<button type="button" class="lx-page next" data-ch="${nxt.id}"><small>Siguiente →</small><b>${idx + 2}. ${nxt.title}</b></button>` : '<button type="button" class="lx-page next" data-home><small>¡Terminaste! →</small><b>Volver al inicio</b></button>'}`;
      }
      MathLessons.setCrumb(idx >= 0 ? `${idx + 1}. ${chapters[idx].title}` : null);
    }

    function goTo(id, { silent = false } = {}) {
      current = id === 'overview' || chapters.some(c => c.id === id) ? id : 'overview';
      if (current !== 'overview') visited.add(current);
      closeMenu();
      render();
      const sc = scroller();
      if (sc) sc.scrollTop = 0;
      if (!silent) onChange();
    }

    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-home]')) { MathLessons.show('home'); return; }
      const b = e.target.closest('[data-ch]');
      if (b) { goTo(b.dataset.ch); return; }
      if (e.target.closest('.lx-menu-btn')) { root.classList.add('lx-menu-open'); return; }
      if (e.target.closest('.lx-side-close, .lx-backdrop')) { closeMenu(); return; }
      // Links dentro del texto a otro capítulo (href="#ln-…")
      const a = e.target.closest('a[href^="#"]');
      if (a && sections.has(a.getAttribute('href').slice(1))) { e.preventDefault(); goTo(a.getAttribute('href').slice(1)); }
    });

    render();
    return {
      goTo,
      onShow: render,
      getState: () => ({ chapter: current, visited: [...visited] }),
      setState(s) {
        if (!s) return;
        visited.clear();
        (s.visited || []).forEach(id => visited.add(id));
        goTo(s.chapter || 'overview', { silent: true });
      },
      summary() {
        const next = chapters.find(c => !visited.has(c.id));
        return { visited: visited.size, total: chapters.length, current: visited.size && next ? next.title : null };
      }
    };
  };
})();
