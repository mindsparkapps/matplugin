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
      this.painter(c, this);
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

    point(x, y, color, label = '', { r = 6, labelColor = '#fff', dx = 10, dy = -10 } = {}) {
      const c = this.ctx;
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

  // Número bonito: 2, -1.5, 0.33…
  Plot.fmt = (v, d = 2) => {
    if (!isFinite(v)) return '—';
    const r = Math.round(v * 10 ** d) / 10 ** d;
    return String(r).replace('.', ',');
  };

  window.Plot = Plot;
})();
