// ===== MathViz · Plot: gráfica 2D en un <canvas> para las lecciones =====
// Uso:
//   const p = new Plot(canvas, { xMin: -6, xMax: 6, yMin: -6, yMax: 6 });
//   p.draw(ctx => { p.grid(); p.axes(); p.fn(x => 2 * x + 1, '#6C63FF'); p.point(1, 3, '#FFA751', 'P'); });
// La gráfica se adapta al ancho de su contenedor y a pantallas de alta densidad.
(function () {
  class Plot {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.opts = Object.assign({ xMin: -6, xMax: 6, yMin: -6, yMax: 6, aspect: 1, step: 1, labels: true }, opts);
      this.painter = null;
      // Punto marcado al tocar la gráfica: líneas segmentadas hasta los ejes x e y, con sus coordenadas
      this.marker = null;      // { x, y, fn: índice de la curva o null si es un punto }
      this._fns = [];
      this._pts = [];
      this.setupTapMarker();
      this.resize();
      // Al cambiar el ancho del contenedor se vuelve a dibujar (en el siguiente cuadro, para no encadenar avisos)
      this._ro = new ResizeObserver(() => requestAnimationFrame(() => {
        const parent = this.canvas.parentElement || this.canvas;
        if (Math.abs((parent.clientWidth || 0) - this._lastParentW) < 1) return;
        this.resize();
        this.redraw();
      }));
      this._ro.observe(canvas.parentElement || canvas);
    }

    resize() {
      const parent = this.canvas.parentElement || this.canvas;
      // Con el capítulo oculto no hay ancho que medir: se espera a que se muestre
      if (!parent.clientWidth && this.w) return;
      this._lastParentW = parent.clientWidth || 0;
      const w = Math.max(120, Math.min(parent.clientWidth || 400, 720));
      const h = Math.round(w * this.opts.aspect);
      const dpr = window.devicePixelRatio || 1;
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w;
      this.h = h;
    }

    setView(v) { Object.assign(this.opts, v); this.redraw(); }

    // Coordenadas de la gráfica → píxeles
    X(x) { const o = this.opts; return (x - o.xMin) / (o.xMax - o.xMin) * this.w; }
    Y(y) { const o = this.opts; return this.h - (y - o.yMin) / (o.yMax - o.yMin) * this.h; }
    // Píxeles → coordenadas
    toX(px) { const o = this.opts; return o.xMin + px / this.w * (o.xMax - o.xMin); }
    toY(py) { const o = this.opts; return o.yMin + (this.h - py) / this.h * (o.yMax - o.yMin); }

    draw(painter) { this.painter = painter; this.redraw(); }

    redraw() {
      if (!this.painter) return;
      const c = this.ctx;
      c.clearRect(0, 0, this.w, this.h);
      c.fillStyle = '#0f0f1a';
      c.fillRect(0, 0, this.w, this.h);
      this._fns = [];
      this._pts = [];
      this.painter(c, this);
      this.drawMarker();
    }

    // ----- Tocar la gráfica: marca el punto más cercano de una curva o un punto dibujado -----
    setupTapMarker() {
      const cv = this.canvas;
      if (!cv.title) cv.title = 'Toca la línea o un punto para ver sus coordenadas';
      let down = null;
      cv.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
      cv.addEventListener('pointerup', (e) => {
        if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) { down = null; return; }
        down = null;
        const r = cv.getBoundingClientRect();
        this.markAt(e.clientX - r.left, e.clientY - r.top);
      });
    }

    markAt(px, py) {
      const near = 18;
      // Primero los puntos dibujados (A, B, los de la tabla…)
      let best = null;
      this._pts.forEach(p => {
        const d = Math.hypot(this.X(p.x) - px, this.Y(p.y) - py);
        if (d < near && (!best || d < best.d)) best = { d, x: p.x, y: p.y, fn: null };
      });
      // Si no, la curva más cercana en esa x
      if (!best) {
        const x = this.toX(px);
        this._fns.forEach((f, i) => {
          if (x < f.xFrom || x > f.xTo) return;
          const y = f.f(x);
          if (!isFinite(y)) return;
          const d = Math.abs(this.Y(y) - py);
          if (d < near && (!best || d < best.d)) best = { d, x, y, fn: i };
        });
        // Se ajusta a décimas para que los números se lean fácil
        if (best) { best.x = Math.round(best.x * 10) / 10; best.y = this._fns[best.fn].f(best.x); }
      }
      this.marker = best ? { x: best.x, y: best.y, fn: best.fn } : null;
      this.redraw();
    }

    // Marca el punto de la curva en esa x (lo usan las tablas: tocar una fila marca su punto)
    markX(x) {
      const i = this._fns.findIndex(f => x >= f.xFrom - 1e-9 && x <= f.xTo + 1e-9 && isFinite(f.f(x)));
      this.marker = i >= 0 ? { x, y: this._fns[i].f(x), fn: i } : null;
      this.redraw();
    }

    drawMarker() {
      const m = this.marker;
      // Aviso a quien quiera saber qué punto está marcado (p. ej. para resaltar la fila de la tabla)
      if (this.onMark) this.onMark(m);
      if (!m) return;
      // Si es de una curva, sigue a la curva cuando cambia (p. ej. al mover m o n)
      if (m.fn !== null && this._fns[m.fn]) m.y = this._fns[m.fn].f(m.x);
      if (!isFinite(m.y)) return;
      const c = this.ctx;
      const col = '#FFD166';
      this.segment(m.x, 0, m.x, m.y, col, 1.8, [6, 5]);
      this.segment(0, m.y, m.x, m.y, col, 1.8, [6, 5]);
      c.fillStyle = col;
      [[m.x, 0], [0, m.y]].forEach(([x, y]) => { c.beginPath(); c.arc(this.X(x), this.Y(y), 4, 0, Math.PI * 2); c.fill(); });
      const fx = Plot.fmt(m.x), fy = Plot.fmt(m.y);
      this.text(`x = ${fx}`, m.x, 0, col, { dy: m.y >= 0 ? 18 : -8, align: 'center', size: 12 });
      this.text(`y = ${fy}`, 0, m.y, col, { dx: m.x >= 0 ? -8 : 8, dy: 4, align: m.x >= 0 ? 'right' : 'left', size: 12 });
      c.fillStyle = '#fff';
      c.strokeStyle = col;
      c.lineWidth = 3;
      c.beginPath(); c.arc(this.X(m.x), this.Y(m.y), 7, 0, Math.PI * 2); c.fill(); c.stroke();
      this.text(`(${fx}, ${fy})`, m.x, m.y, '#fff', { dx: 10, dy: -12, size: 13 });
    }

    grid() {
      const c = this.ctx, o = this.opts;
      c.lineWidth = 1;
      for (let x = Math.ceil(o.xMin / o.step) * o.step; x <= o.xMax; x += o.step) {
        c.strokeStyle = 'rgba(255,255,255,0.07)';
        c.beginPath(); c.moveTo(this.X(x), 0); c.lineTo(this.X(x), this.h); c.stroke();
      }
      for (let y = Math.ceil(o.yMin / o.step) * o.step; y <= o.yMax; y += o.step) {
        c.strokeStyle = 'rgba(255,255,255,0.07)';
        c.beginPath(); c.moveTo(0, this.Y(y)); c.lineTo(this.w, this.Y(y)); c.stroke();
      }
    }

    axes(names = { x: 'x', y: 'y' }) {
      const c = this.ctx, o = this.opts;
      c.strokeStyle = 'rgba(255,255,255,0.55)';
      c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(0, this.Y(0)); c.lineTo(this.w, this.Y(0)); c.stroke();
      c.beginPath(); c.moveTo(this.X(0), 0); c.lineTo(this.X(0), this.h); c.stroke();
      // Flechas
      c.fillStyle = 'rgba(255,255,255,0.7)';
      c.beginPath(); c.moveTo(this.w, this.Y(0)); c.lineTo(this.w - 9, this.Y(0) - 5); c.lineTo(this.w - 9, this.Y(0) + 5); c.fill();
      c.beginPath(); c.moveTo(this.X(0), 0); c.lineTo(this.X(0) - 5, 9); c.lineTo(this.X(0) + 5, 9); c.fill();
      c.font = '600 13px Inter, sans-serif';
      c.fillText(names.x, this.w - 16, this.Y(0) - 10);
      c.fillText(names.y, this.X(0) + 10, 14);
      if (!o.labels) return;
      c.font = '11px "JetBrains Mono", monospace';
      c.fillStyle = 'rgba(255,255,255,0.45)';
      const every = Math.max(o.step, Math.ceil((o.xMax - o.xMin) / 12));
      for (let x = Math.ceil(o.xMin / every) * every; x <= o.xMax; x += every) {
        if (Math.abs(x) < 1e-9) continue;
        c.fillText(String(x), this.X(x) - (x < 0 ? 8 : 3), this.Y(0) + 14);
      }
      const everyY = Math.max(o.step, Math.ceil((o.yMax - o.yMin) / 12));
      for (let y = Math.ceil(o.yMin / everyY) * everyY; y <= o.yMax; y += everyY) {
        if (Math.abs(y) < 1e-9) continue;
        c.fillText(String(y), this.X(0) + 6, this.Y(y) + 4);
      }
      c.fillText('0', this.X(0) + 4, this.Y(0) + 14);
    }

    // Dibuja f entre xFrom y xTo (por defecto todo el ancho); progress 0..1 dibuja solo una parte
    fn(f, color, { width = 3, xFrom = this.opts.xMin, xTo = this.opts.xMax, progress = 1, dash = null } = {}) {
      const c = this.ctx;
      const end = xFrom + (xTo - xFrom) * progress;
      this._fns.push({ f, xFrom, xTo: end });
      c.strokeStyle = color;
      c.lineWidth = width;
      c.lineCap = 'round';
      c.setLineDash(dash || []);
      c.beginPath();
      let started = false;
      const steps = Math.max(60, Math.round(this.w));
      for (let i = 0; i <= steps; i++) {
        const x = xFrom + (end - xFrom) * i / steps;
        const y = f(x);
        if (!isFinite(y) || Math.abs(y) > 1e6) { started = false; continue; }
        const py = this.Y(y);
        if (py < -2000 || py > this.h + 2000) { started = false; continue; }
        if (!started) { c.moveTo(this.X(x), py); started = true; } else c.lineTo(this.X(x), py);
      }
      c.stroke();
      c.setLineDash([]);
    }

    segment(x1, y1, x2, y2, color, width = 2, dash = null) {
      const c = this.ctx;
      c.strokeStyle = color;
      c.lineWidth = width;
      c.setLineDash(dash || []);
      c.beginPath(); c.moveTo(this.X(x1), this.Y(y1)); c.lineTo(this.X(x2), this.Y(y2)); c.stroke();
      c.setLineDash([]);
    }

    arrow(x1, y1, x2, y2, color, width = 2.5) {
      this.segment(x1, y1, x2, y2, color, width);
      const c = this.ctx;
      const a = Math.atan2(this.Y(y2) - this.Y(y1), this.X(x2) - this.X(x1));
      const px = this.X(x2), py = this.Y(y2);
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(px, py);
      c.lineTo(px - 10 * Math.cos(a - 0.45), py - 10 * Math.sin(a - 0.45));
      c.lineTo(px - 10 * Math.cos(a + 0.45), py - 10 * Math.sin(a + 0.45));
      c.fill();
    }

    rect(x1, y1, x2, y2, fill, stroke = null) {
      const c = this.ctx;
      const px = Math.min(this.X(x1), this.X(x2)), py = Math.min(this.Y(y1), this.Y(y2));
      const pw = Math.abs(this.X(x2) - this.X(x1)), ph = Math.abs(this.Y(y2) - this.Y(y1));
      c.fillStyle = fill;
      c.fillRect(px, py, pw, ph);
      if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.5; c.strokeRect(px, py, pw, ph); }
    }

    // Polígono relleno (triángulos, cuadrados sobre los lados…): pts = [[x, y], …]
    poly(pts, fill, stroke = null, width = 2) {
      const c = this.ctx;
      c.beginPath();
      pts.forEach(([x, y], i) => (i ? c.lineTo(this.X(x), this.Y(y)) : c.moveTo(this.X(x), this.Y(y))));
      c.closePath();
      if (fill) { c.fillStyle = fill; c.fill(); }
      if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.setLineDash([]); c.stroke(); }
    }

    // Cuadradito del ángulo recto en el vértice v, entre las direcciones hacia p1 y p2
    rightAngle(v, p1, p2, color = '#fff', size = 0.35) {
      const u = (p) => { const dx = p[0] - v[0], dy = p[1] - v[1], l = Math.hypot(dx, dy) || 1; return [dx / l * size, dy / l * size]; };
      const a = u(p1), b = u(p2);
      this.poly([[v[0] + a[0], v[1] + a[1]], [v[0] + a[0] + b[0], v[1] + a[1] + b[1]], [v[0] + b[0], v[1] + b[1]], v], null, color, 1.6);
    }

    point(x, y, color, label = '', { r = 6, labelColor = '#fff', dx = 10, dy = -10 } = {}) {
      const c = this.ctx;
      this._pts.push({ x, y });
      c.fillStyle = color;
      c.strokeStyle = '#0f0f1a';
      c.lineWidth = 2;
      c.beginPath(); c.arc(this.X(x), this.Y(y), r, 0, Math.PI * 2); c.fill(); c.stroke();
      if (label) this.text(label, x, y, labelColor, { dx, dy });
    }

    text(str, x, y, color = '#fff', { dx = 0, dy = 0, size = 13, weight = 600, align = 'left', bg = 'rgba(15,15,26,0.75)' } = {}) {
      const c = this.ctx;
      c.font = `${weight} ${size}px Inter, sans-serif`;
      c.textAlign = align;
      const px = this.X(x) + dx, py = this.Y(y) + dy;
      if (bg) {
        const w = c.measureText(str).width;
        const left = align === 'center' ? px - w / 2 : align === 'right' ? px - w : px;
        c.fillStyle = bg;
        c.fillRect(left - 3, py - size, w + 6, size + 5);
      }
      c.fillStyle = color;
      c.fillText(str, px, py);
      c.textAlign = 'left';
    }

    // Anima de 0 a 1 en ms milisegundos llamando a frame(t); devuelve una función para cancelar
    static animate(ms, frame, done) {
      let raf = 0;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / ms);
        frame(t);
        if (t < 1) raf = requestAnimationFrame(tick);
        else if (done) done();
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    static ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  }

  // Une una tabla con su gráfica: al tocar un punto se pinta su fila (misma x en la primera columna)
  // y al tocar una fila se marca su punto en la gráfica
  const parseNum = (s) => Number(String(s).replace(/−/g, '-').replace(/[^\d,.\-]/g, '').replace(',', '.'));
  Plot.linkTable = (plot, table) => {
    if (!plot || !table) return;
    plot.onMark = (mk) => {
      table.querySelectorAll('tbody tr').forEach(tr => {
        const x = parseNum(tr.cells[0] ? tr.cells[0].textContent : NaN);
        tr.classList.toggle('is-mark', !!mk && Math.abs(x - mk.x) < 1e-6);
      });
    };
    table.classList.add('is-linked');
    table.addEventListener('click', (e) => {
      const tr = e.target.closest('tbody tr');
      if (!tr) return;
      const x = parseNum(tr.cells[0].textContent);
      if (isFinite(x)) plot.markX(x);
    });
    plot.redraw();
  };

  // Puntos que se arrastran con el dedo o el mouse (se ajustan a la grilla "snap")
  //   plot.enableDrag(() => [{ id: 'A', x, y, lock: 'y' }], (id, x, y) => {…}, { snap: 0.5, onEnd })
  //   lock: 'x' deja fija la x, 'y' deja fija la y
  Plot.prototype.enableDrag = function (getPts, onDrag, { snap = 0.5, onEnd = null, bounds = null } = {}) {
    const cv = this.canvas;
    let dragging = null;
    cv.style.touchAction = 'none';
    const local = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const nearest = (px, py) => {
      let best = null;
      getPts().forEach(p => {
        const d = Math.hypot(this.X(p.x) - px, this.Y(p.y) - py);
        if (d < 24 && (!best || d < best.d)) best = { d, p };
      });
      return best && best.p;
    };
    cv.addEventListener('pointerdown', (e) => {
      const [px, py] = local(e);
      const p = nearest(px, py);
      if (!p) return;
      dragging = p;
      cv.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    cv.addEventListener('pointermove', (e) => {
      const [px, py] = local(e);
      if (!dragging) { cv.style.cursor = nearest(px, py) ? 'grab' : 'default'; return; }
      const o = this.opts, b = bounds || { xMin: o.xMin, xMax: o.xMax, yMin: o.yMin, yMax: o.yMax };
      let x = Math.round(this.toX(px) / snap) * snap, y = Math.round(this.toY(py) / snap) * snap;
      x = Math.max(b.xMin, Math.min(b.xMax, x));
      y = Math.max(b.yMin, Math.min(b.yMax, y));
      if (dragging.lock === 'x') x = dragging.x;
      if (dragging.lock === 'y') y = dragging.y;
      onDrag(dragging.id, x, y);
    });
    const end = () => { if (dragging) { dragging = null; if (onEnd) onEnd(); } };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
  };

  // Número bonito: 2, -1.5, 0.33…
  Plot.fmt = (v, d = 2) => {
    if (!isFinite(v)) return '—';
    const r = Math.round(v * 10 ** d) / 10 ** d;
    return String(r).replace('.', ',');
  };

  window.Plot = Plot;
})();
