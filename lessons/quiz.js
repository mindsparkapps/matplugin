// ===== MathViz · Desafíos con números al azar, historial de intentos, notas y progreso =====
// Componente reutilizable para cualquier lección:
//   const quiz = LessonQuiz(container, { id: 'lineal', templates, onChange });
//   quiz.getState() / quiz.setState(state)   (se guarda en ZenBan y, fuera de ZenBan, en este navegador)
// Cada plantilla genera una pregunta con números nuevos en cada intento:
//   { topic: 'Pendiente', make(r) { return { q, correct, wrong: [..], why }; } }
//   r = { int(a, b), nz(a, b), pick(arr), chance(p) } usa la "semilla" del intento: así un intento viejo
//   se vuelve a mostrar exactamente igual al revisarlo.
(function () {
  const MAX_ATTEMPTS = 60;

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomTools(seed) {
    const rnd = mulberry32(seed);
    const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    return {
      rnd,
      int,
      nz: (a, b) => { let v = 0; while (v === 0) v = int(a, b); return v; },
      pick: (arr) => arr[Math.floor(rnd() * arr.length)],
      chance: (p) => rnd() < p
    };
  }

  // Nota chilena de 1,0 a 7,0 con 60 % de exigencia (4,0 = 60 % de las respuestas)
  function grade(good, total) {
    if (!total) return 1;
    const p = good / total;
    const g = p >= 0.6 ? 4 + 3 * (p - 0.6) / 0.4 : 1 + 3 * p / 0.6;
    return Math.round(g * 10) / 10;
  }
  const gradeTxt = (g) => g.toFixed(1).replace('.', ',');

  // Los intentos viejos no guardaban qué preguntas tocaron: eran las primeras 10 plantillas, en orden
  const legacyIdx = (templates) => templates.slice(0, 10).map((_, i) => i);

  function generate(templates, seed, idx) {
    const r = randomTools(seed);
    const list = (idx || legacyIdx(templates)).map(i => templates[i]).filter(Boolean);
    return list.map((t) => {
      let item = null;
      for (let tries = 0; tries < 8 && !item; tries++) {
        const made = t.make(r);
        const opts = [String(made.correct), ...made.wrong.map(String)];
        const unique = [...new Set(opts)];
        if (unique.length >= 3) item = { ...made, opts: unique.slice(0, 4) };
      }
      // Mezcla las opciones (la correcta queda en un lugar al azar)
      const opts = item.opts.slice();
      for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(r.rnd() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
      return { topic: t.topic, chapter: t.chapter, q: item.q, graph: item.graph || null, a: opts, ok: opts.indexOf(String(item.correct)), why: item.why };
    });
  }

  // Elige qué preguntas tocan en un intento nuevo: van rotando (primero las que hace más tiempo no salen o
  // las que más fallaste), siempre hay algunas con gráfico, y se mezclan en un orden distinto cada vez.
  function choose(templates, attempts, n, minVisual = 3) {
    const info = templates.map(() => ({ seen: 0, fail: 0, last: -1 }));
    attempts.forEach((a, ai) => (a.idx || legacyIdx(templates)).forEach((t, pos) => {
      const s = info[t];
      if (!s) return;
      s.seen++; s.last = ai;
      if ((a.failed || []).includes(pos)) s.fail++;
    }));
    const scored = templates.map((t, i) => {
      const s = info[i];
      return { i, visual: !!t.visual, sc: (s.seen ? Math.min(attempts.length - s.last, 6) : 8) + (s.seen ? 4 * s.fail / s.seen : 0) + Math.random() * 3 };
    }).sort((a, b) => b.sc - a.sc);
    n = Math.min(n, templates.length);
    const picked = scored.filter(x => x.visual).slice(0, Math.min(minVisual, n));
    scored.forEach(x => { if (picked.length < n && !picked.includes(x)) picked.push(x); });
    const ids = picked.map(x => x.i);
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    return ids;
  }

  // Dibuja el gráfico de cada pregunta que lo trae (q.graph = { view, draw(p) })
  function drawGraphs(box, qs) {
    box.querySelectorAll('.quiz-q').forEach((el) => {
      const q = qs[Number(el.dataset.q)];
      const cv = el.querySelector('canvas.lq-g');
      if (!q || !q.graph || !cv) return;
      const p = new Plot(cv, Object.assign({ aspect: 0.7, step: 1 }, q.graph.view));
      p.draw(() => q.graph.draw(p));
    });
  }

  const newSeed = () => Math.floor(Math.random() * 2 ** 31);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  window.LessonQuiz = function (root, { id, templates, perAttempt = 10, onChange = () => {} }) {
    const storeKey = `mathviz_quiz_${id}`;
    let state = { attempts: [], current: { seed: newSeed(), idx: null, answers: {} } };
    const newCurrent = () => ({ seed: newSeed(), idx: choose(templates, state.attempts, perAttempt), answers: {} });
    const gen = (o) => generate(templates, o.seed, o.idx);
    let viewing = null; // índice del intento que se está revisando
    try { const saved = JSON.parse(localStorage.getItem(storeKey) || 'null'); if (saved && saved.current) state = saved; } catch (e) {}
    if (!state.current.idx && !Object.keys(state.current.answers).length) state.current = newCurrent();

    root.innerHTML = `
      <div class="lq-bar"><span class="lq-title"></span><button type="button" class="lbtn" data-lq="new">🎲 Nuevo intento (otros números)</button></div>
      <div class="lq-questions"></div>
      <div class="lq-result"></div>
      <div class="lq-progress">
        <h3>📈 Tu progreso · 🗂 historial de intentos</h3>
        <p class="lq-empty">Todavía no terminas ningún intento. Cuando respondas las 10 preguntas, aquí aparecerán tu <b>nota</b>, el <b>gráfico</b> de cómo vas mejorando, los <b>temas donde más te equivocas</b> y el <b>historial</b> de todos tus intentos (con botón para revisar cada uno). Si cambias de intento a medias, también se guarda.</p>
        <div class="lq-progress-body">
          <div class="two-col"><div class="plot-wrap"><canvas class="lq-chart"></canvas></div><div class="lq-summary"></div></div>
          <h3>🔍 Dónde te equivocas más</h3>
          <div class="lq-topics"></div>
          <h3>🗂 Historial de intentos</h3>
          <div class="table-scroll"><table class="vtable lq-history"></table></div>
          <div class="btn-row"><button type="button" class="lbtn ghost" data-lq="clear">Borrar el historial</button></div>
        </div>
      </div>`;
    const chart = new Plot(root.querySelector('.lq-chart'), { xMin: 0, xMax: 6, yMin: 0.5, yMax: 7.5, aspect: 0.62, step: 1 });

    const persist = () => {
      try { localStorage.setItem(storeKey, JSON.stringify(state)); } catch (e) {}
      onChange();
    };

    // Guarda el intento cuando se respondió todo (o, con force, aunque falten: las que faltan cuentan como malas)
    function saveAttemptIfDone(force = false) {
      const qs = gen(state.current);
      const answered = Object.keys(state.current.answers).length;
      if (state.current.saved || !answered || (answered < qs.length && !force)) return;
      const good = qs.filter((q, i) => state.current.answers[i] === q.ok).length;
      state.attempts.push({
        n: (state.attempts.at(-1)?.n || 0) + 1,
        seed: state.current.seed,
        idx: state.current.idx || undefined,
        at: Date.now(),
        answers: { ...state.current.answers },
        good,
        total: qs.length,
        nota: grade(good, qs.length),
        failed: qs.map((q, i) => (state.current.answers[i] === q.ok ? null : i)).filter(i => i !== null),
        partial: answered < qs.length
      });
      if (state.attempts.length > MAX_ATTEMPTS) state.attempts.shift();
      state.current.saved = true;
    }

    function questionsHtml(qs, answers, locked) {
      return qs.map((q, i) => {
        const ans = answers[i];
        const done = ans !== undefined;
        return `<div class="quiz-q${done ? (ans === q.ok ? ' is-ok' : ' is-bad') : ''}" data-q="${i}">
          <p><b>${i + 1}.</b> <span class="lq-topic">${esc(q.topic)}</span> ${q.q}</p>
          ${q.graph ? '<div class="plot-wrap lq-gwrap"><canvas class="lq-g"></canvas></div>' : ''}
          <div class="quiz-a">${q.a.map((a, j) => `<button type="button" data-a="${j}" ${done || locked ? 'disabled' : ''} class="${done && j === q.ok ? 'is-right' : ''}${ans === j && j !== q.ok ? ' is-wrong' : ''}">${a}</button>`).join('')}</div>
          ${done ? `<p class="why">${ans === q.ok ? '✅ ¡Correcto!' : `❌ Elegiste ${q.a[ans]}; la respuesta es <b>${q.a[q.ok]}</b>.`} ${q.why}${ans !== q.ok && q.chapter ? ` <a class="lq-link" href="#${q.chapter}">📖 Repasar en la lección</a>` : ''}</p>` : ''}
        </div>`;
      }).join('');
    }

    function render() {
      const last = state.attempts.at(-1);
      const attemptNo = state.current.saved ? last.n : (last ? last.n + 1 : 1);
      const reviewing = viewing !== null && state.attempts[viewing];
      const title = root.querySelector('.lq-title');
      const qBox = root.querySelector('.lq-questions');
      const result = root.querySelector('.lq-result');
      if (reviewing) {
        const at = state.attempts[viewing];
        title.innerHTML = `Revisando el <b>intento ${at.n}</b> (${new Date(at.at).toLocaleString()}) · nota <b class="${at.nota >= 4 ? 'good' : 'bad'}">${gradeTxt(at.nota)}</b> <button type="button" class="lbtn ghost" data-lq="back">Volver al intento actual</button>`;
        const rq = gen(at);
        qBox.innerHTML = questionsHtml(rq, at.answers, true);
        drawGraphs(qBox, rq);
        result.innerHTML = '';
      } else {
        const qs = gen(state.current);
        const answered = Object.keys(state.current.answers).length;
        const lastTxt = last ? ` · intentos guardados: <b>${state.attempts.length}</b> (última nota <b class="${last.nota >= 4 ? 'good' : 'bad'}">${gradeTxt(last.nota)}</b>)` : '';
        title.innerHTML = `<b>Intento ${attemptNo}</b> · ${answered} de ${qs.length} respondidas · cada intento trae otras preguntas y números nuevos${lastTxt}`;
        qBox.innerHTML = questionsHtml(qs, state.current.answers, false);
        drawGraphs(qBox, qs);
        if (state.current.saved && last) {
          const failed = last.failed.map(i => `<li><a href="#" data-goto="${i}">Pregunta ${i + 1}</a> · ${esc(qs[i].topic)}${qs[i].chapter ? ` · <a class="lq-link" href="#${qs[i].chapter}">📖 ir a la lección</a>` : ''}</li>`).join('');
          const msg = last.nota >= 6.5 ? '🏆 ¡Excelente!' : last.nota >= 5.5 ? '🌟 ¡Muy bien!' : last.nota >= 4 ? '👍 Aprobado, ¡sigue practicando!' : '💪 Revisa las explicaciones y vuelve a intentarlo.';
          const prev = state.attempts.at(-2);
          const diff = prev ? Math.round((last.nota - prev.nota) * 10) / 10 : null;
          result.innerHTML = `<div class="lq-card ${last.nota >= 4 ? 'is-pass' : 'is-fail'}">
            <div class="lq-grade">${gradeTxt(last.nota)}</div>
            <div><p><b>${last.good} de ${last.total}</b> correctas · ${msg}</p>
            ${diff !== null ? `<p>${diff > 0 ? `📈 Subiste ${gradeTxt(diff)} respecto del intento anterior.` : diff < 0 ? `📉 Bajaste ${gradeTxt(-diff)} respecto del intento anterior.` : 'Igual que el intento anterior.'}</p>` : ''}
            ${failed ? `<p>Fallaste en:</p><ul class="lq-failed">${failed}</ul>` : '<p>¡No fallaste ninguna!</p>'}
            <button type="button" class="lbtn" data-lq="new">🎲 Otro intento</button></div></div>`;
        } else result.innerHTML = '';
      }
      renderProgress();
    }

    function renderProgress() {
      const at = state.attempts;
      const summary = root.querySelector('.lq-summary');
      // Siempre a la vista: sin intentos terminados, explica qué va a aparecer
      root.querySelector('.lq-empty').hidden = at.length > 0;
      root.querySelectorAll('.lq-progress-body').forEach(el => { el.hidden = !at.length; });
      if (!at.length) return;
      const notas = at.map(a => a.nota);
      const best = Math.max(...notas);
      const avg = notas.reduce((s, v) => s + v, 0) / notas.length;
      const lastN = at.slice(-3).reduce((s, a) => s + a.nota, 0) / Math.min(3, at.length);
      const firstN = at.slice(0, 3).reduce((s, a) => s + a.nota, 0) / Math.min(3, at.length);
      summary.innerHTML = `<p>Intentos: <b>${at.length}</b></p><p>Mejor nota: <b class="good">${gradeTxt(best)}</b></p><p>Promedio: <b>${gradeTxt(Math.round(avg * 10) / 10)}</b></p>
        <p>Última nota: <b class="${notas.at(-1) >= 4 ? 'good' : 'bad'}">${gradeTxt(notas.at(-1))}</b></p>
        ${at.length >= 4 ? `<p>${lastN > firstN + 0.05 ? `📈 Vas mejorando: tus 3 últimos intentos promedian ${gradeTxt(Math.round(lastN * 10) / 10)} y los 3 primeros ${gradeTxt(Math.round(firstN * 10) / 10)}.` : lastN < firstN - 0.05 ? '📉 Tus últimos intentos van más bajo: revisa los temas donde fallas más.' : 'Te mantienes parejo.'}</p>` : ''}`;
      // Gráfico: nota de cada intento, con la línea del 4,0 (aprobado)
      chart.setView({ xMin: 0.4, xMax: Math.max(6, at.length + 0.6), step: 1 });
      chart.draw(() => {
        chart.grid();
        chart.axes({ x: 'intento', y: 'nota' });
        chart.segment(0.4, 4, Math.max(6, at.length + 0.6), 4, 'rgba(255,209,102,0.7)', 1.5, [6, 6]);
        chart.text('4,0 aprobado', Math.max(6, at.length + 0.6), 4, '#FFD166', { dx: -88, dy: -6, size: 11 });
        for (let i = 1; i < at.length; i++) chart.segment(i, at[i - 1].nota, i + 1, at[i].nota, '#00D4AA', 3);
        at.forEach((a, i) => chart.point(i + 1, a.nota, a.nota >= 4 ? '#7dffb3' : '#ff8a8a', at.length <= 12 ? gradeTxt(a.nota) : '', { r: 5 }));
      });
      // Temas con más errores (todos los intentos)
      const stats = {};
      at.forEach(a => {
        const qs = gen(a);
        qs.forEach((q, i) => {
          stats[q.topic] = stats[q.topic] || { fail: 0, total: 0, chapter: q.chapter };
          stats[q.topic].total++;
          if (a.answers[i] !== q.ok) stats[q.topic].fail++;
        });
      });
      const rows = Object.entries(stats).sort((x, y) => y[1].fail / y[1].total - x[1].fail / x[1].total);
      root.querySelector('.lq-topics').innerHTML = rows.map(([topic, s]) => {
        const pct = Math.round(s.fail / s.total * 100);
        return `<div class="lq-topic-row"><span>${esc(topic)}</span><span class="lq-bar-track"><i style="width:${pct}%" class="${pct >= 50 ? 'is-bad' : pct > 0 ? 'is-mid' : 'is-ok'}"></i></span><span>${s.fail} de ${s.total} mal${s.fail && s.chapter ? ` · <a class="lq-link" href="#${s.chapter}">📖 Ir a la lección</a>` : ''}</span></div>`;
      }).join('');
      root.querySelector('.lq-history').innerHTML = `<thead><tr><th>#</th><th>Fecha</th><th>Correctas</th><th>Nota</th><th>Falló en</th><th></th></tr></thead><tbody>${at.map((a, i) => `<tr>
        <td>${a.n}</td><td>${new Date(a.at).toLocaleDateString()} ${new Date(a.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
        <td>${a.good}/${a.total}${a.partial ? ' <small title="Quedó a medias: las que faltaron cuentan como malas">(a medias)</small>' : ''}</td><td><b class="${a.nota >= 4 ? 'good' : 'bad'}">${gradeTxt(a.nota)}</b></td>
        <td>${a.failed.length ? a.failed.map(x => x + 1).join(', ') : '—'}</td>
        <td><button type="button" class="lbtn ghost lq-small" data-view="${i}">Ver</button></td></tr>`).reverse().join('')}</tbody>`;
    }

    root.addEventListener('click', (e) => {
      const ans = e.target.closest('[data-a]');
      if (ans && viewing === null) {
        const i = Number(ans.closest('[data-q]').dataset.q);
        if (state.current.answers[i] !== undefined) return;
        state.current.answers[i] = Number(ans.dataset.a);
        saveAttemptIfDone();
        render();
        persist();
        return;
      }
      const cmd = e.target.closest('[data-lq]');
      if (cmd) {
        if (cmd.dataset.lq === 'new') {
          // Si el intento actual quedó a medias, se guarda igual (con lo respondido) para no perderlo
          saveAttemptIfDone(true);
          state.current = newCurrent();
          viewing = null;
          render();
          persist();
          root.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (cmd.dataset.lq === 'back') { viewing = null; render(); }
        if (cmd.dataset.lq === 'clear' && confirm('¿Borrar todos los intentos guardados?')) {
          state.attempts = [];
          viewing = null;
          render();
          persist();
        }
        return;
      }
      const view = e.target.closest('[data-view]');
      if (view) { viewing = Number(view.dataset.view); render(); root.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      const go = e.target.closest('[data-goto]');
      if (go) {
        e.preventDefault();
        const q = root.querySelector(`.quiz-q[data-q="${go.dataset.goto}"]`);
        if (q) q.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    render();
    return {
      getState: () => JSON.parse(JSON.stringify(state)),
      setState(s) {
        if (!s || !s.current) return;
        state = JSON.parse(JSON.stringify(s));
        if (!state.current.idx && !Object.keys(state.current.answers).length) state.current = newCurrent();
        viewing = null;
        try { localStorage.setItem(storeKey, JSON.stringify(state)); } catch (e) {}
        render();
      },
      render,
      grade
    };
  };

  // ===== Tarjetas con gráficos (como MemoSpark): una tarjeta a la vez, con el gráfico y una pregunta para
  // interpretarlo. Las que fallas vuelven a salir más seguido; un tema se "domina" con 3 aciertos seguidos.
  //   const cards = LessonCards(container, { id: 'lineal', templates, onChange });  (plantillas con graph)
  window.LessonCards = function (root, { id, templates, onChange = () => {} }) {
    const storeKey = `mathviz_cards_${id}`;
    let state = { stats: {}, total: 0, good: 0, streak: 0, best: 0 };
    try { const saved = JSON.parse(localStorage.getItem(storeKey) || 'null'); if (saved && saved.stats) state = saved; } catch (e) {}
    let card = null; // { i, q, answer }
    let lastI = -1;

    root.innerHTML = `
      <div class="lq-bar"><span class="lc-info"></span><button type="button" class="lbtn ghost" data-lc="reset">Borrar mi avance</button></div>
      <div class="lc-card"></div>
      <h3>🎯 Cómo vas en cada tipo de tarjeta</h3>
      <div class="lc-topics"></div>`;

    const persist = () => {
      try { localStorage.setItem(storeKey, JSON.stringify(state)); } catch (e) {}
      onChange();
    };

    // Elige la siguiente: pesa más lo que fallas o aún no ves; evita repetir la anterior
    function next() {
      const w = templates.map((t, i) => {
        const s = state.stats[t.topic];
        if (i === lastI && templates.length > 1) return 0;
        if (!s) return 4;
        const rate = s.fail / Math.max(1, s.ok + s.fail);
        return 1 + 5 * rate + (s.run >= 3 ? 0 : 1.5);
      });
      let r = Math.random() * w.reduce((a, b) => a + b, 0), i = 0;
      for (; i < w.length - 1; i++) { r -= w[i]; if (r <= 0) break; }
      lastI = i;
      card = { i, q: generate(templates, newSeed(), [i])[0], answer: undefined };
      render();
    }

    function render() {
      const mastered = templates.filter(t => (state.stats[t.topic] || {}).run >= 3).length;
      root.querySelector('.lc-info').innerHTML = `🃏 Tarjetas vistas: <b>${state.total}</b> · aciertos <b class="good">${state.good}</b> · racha <b>${state.streak}</b> (récord ${state.best}) · dominados <b>${mastered} de ${templates.length}</b>`;
      const box = root.querySelector('.lc-card');
      if (!card) { box.innerHTML = '<p>Cargando tarjeta…</p>'; return; }
      const q = card.q, done = card.answer !== undefined;
      box.innerHTML = `
        <div class="quiz-q${done ? (card.answer === q.ok ? ' is-ok' : ' is-bad') : ''}">
          <p><span class="lq-topic">${esc(q.topic)}</span> ${q.q}</p>
          ${q.graph ? '<div class="plot-wrap lq-gwrap"><canvas class="lq-g"></canvas></div>' : ''}
          <div class="quiz-a">${q.a.map((a, j) => `<button type="button" data-ca="${j}" ${done ? 'disabled' : ''} class="${done && j === q.ok ? 'is-right' : ''}${done && card.answer === j && j !== q.ok ? ' is-wrong' : ''}">${a}</button>`).join('')}</div>
          ${done ? `<p class="why">${card.answer === q.ok ? '✅ ¡Correcto!' : `❌ La respuesta es <b>${q.a[q.ok]}</b>.`} ${q.why}${card.answer !== q.ok && q.chapter ? ` <a class="lq-link" href="#${q.chapter}">📖 Repasar en la lección</a>` : ''}</p>
          <div class="btn-row"><button type="button" class="lbtn" data-lc="next">Siguiente tarjeta →</button></div>` : '<p class="small">Mira el gráfico y elige la respuesta.</p>'}
        </div>`;
      if (q.graph) {
        const p = new Plot(box.querySelector('canvas.lq-g'), Object.assign({ aspect: 0.7, step: 1 }, q.graph.view));
        p.draw(() => q.graph.draw(p));
      }
      root.querySelector('.lc-topics').innerHTML = templates.map((t) => {
        const s = state.stats[t.topic];
        const tot = s ? s.ok + s.fail : 0;
        const pct = tot ? Math.round(s.ok / tot * 100) : 0;
        return `<div class="lq-topic-row"><span>${s && s.run >= 3 ? '⭐ ' : ''}${esc(t.topic)}</span><span class="lq-bar-track"><i style="width:${Math.max(pct, tot ? 4 : 0)}%" class="${pct >= 70 ? 'is-good' : pct >= 40 ? 'is-mid' : 'is-bad'}"></i></span><span>${tot ? `${s.ok} de ${tot} bien` : 'sin ver'}${s && s.fail && t.chapter ? ` · <a class="lq-link" href="#${t.chapter}">📖 lección</a>` : ''}</span></div>`;
      }).join('');
    }

    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-ca]');
      if (a && card && card.answer === undefined) {
        card.answer = Number(a.dataset.ca);
        const ok = card.answer === card.q.ok, t = card.q.topic;
        const s = state.stats[t] = state.stats[t] || { ok: 0, fail: 0, run: 0 };
        state.total++;
        if (ok) { state.good++; state.streak++; s.ok++; s.run++; state.best = Math.max(state.best, state.streak); }
        else { state.streak = 0; s.fail++; s.run = 0; }
        render();
        persist();
        return;
      }
      const cmd = e.target.closest('[data-lc]');
      if (!cmd) return;
      if (cmd.dataset.lc === 'next') { next(); root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      if (cmd.dataset.lc === 'reset' && confirm('¿Borrar el avance de las tarjetas?')) {
        state = { stats: {}, total: 0, good: 0, streak: 0, best: 0 };
        persist();
        next();
      }
    });

    next();
    return {
      getState: () => JSON.parse(JSON.stringify(state)),
      setState(s) {
        if (!s || !s.stats) return;
        state = JSON.parse(JSON.stringify(s));
        try { localStorage.setItem(storeKey, JSON.stringify(state)); } catch (e) {}
        render();
      }
    };
  };
})();
