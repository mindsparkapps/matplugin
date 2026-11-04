// ===== MathViz · Lección: proporción inversa y función racional y = k ÷ x (para ~12 años) =====
// Capítulos cortos con gráficas que se tocan, tabla unida a la curva, asíntotas, área constante, simetría,
// la función racional trasladada y = k ÷ (x − h) + v, cómo encontrar k, problemas, tarjetas con gráficos
// y desafíos con nota. Se relaciona con la lección de función lineal (proporción directa vs inversa).
(function () {
  const C = { x: '#6C63FF', y: '#FFA751', k: '#FF6B9D', h: '#00D4AA', inv: '#FFD166', line: '#6C63FF', asym: '#FF6B9D' };
  const f = (v, d = 2) => Plot.fmt(v, d);
  const abs = Math.abs;
  const N = (v) => (v < 0 ? `−${-v}` : String(v));
  const P = (v) => (v < 0 ? `(${N(v)})` : String(v));
  const money = (v) => `$${v.toLocaleString('es-CL')}`;
  const changed = () => MathLessons.changed();
  const kTxt = (k) => `y = ${N(k)} ÷ x`;

  // Las dos ramas de y = k ÷ (x − h) + v, cada una por su lado de la asíntota (así nunca se unen con una raya)
  function branches(p, k, h = 0, v = 0, color = C.inv, width = 3.5) {
    const o = p.opts, g = (x) => k / (x - h) + v;
    p.fn(g, color, { xFrom: o.xMin, xTo: h - 0.03, width });
    p.fn(g, color, { xFrom: h + 0.03, xTo: o.xMax, width });
  }

  const INTRO = 'Descubre qué pasa cuando <b>una cantidad sube y la otra baja</b> de una forma muy especial: su producto no cambia. Verás la ecuación <b>y = k ÷ x</b>, cómo se dibuja la curva (la <b>hipérbola</b>), por qué nunca toca los ejes (<b>asíntotas</b>), qué hace el número <b>k</b>, cómo se mueve la curva con <b>y = k ÷ (x − h) + v</b> (la <b>función racional</b>) y cómo se compara con la proporción directa. Son 14 capítulos cortos, con gráficas que puedes mover, tarjetas con gráficos y desafíos con nota.';
  const GROUPS = [
    { name: '🚀 Empezar', chapters: [
      { id: 'iv-idea', title: 'Cuando uno sube, el otro baja', desc: 'Galletas entre amigos: más amigos, menos para cada uno.' },
      { id: 'iv-ecuacion', title: 'La ecuación y = k ÷ x', desc: 'Qué significa cada parte y por qué se llama función racional.' }
    ] },
    { name: '📈 La gráfica', chapters: [
      { id: 'iv-tabla', title: 'De la tabla a la curva', desc: 'Los puntos se unen y aparece la hipérbola.' },
      { id: 'iv-k', title: 'El papel de k', desc: 'k positivo, negativo, grande o pequeño: cómo cambia la curva.' },
      { id: 'iv-asintotas', title: 'Asíntotas: la curva que no toca', desc: 'Qué pasa cuando x se acerca a 0 o se hace enorme.' },
      { id: 'iv-area', title: 'Área constante y simetría', desc: 'El rectángulo cambia de forma, pero no de área.' }
    ] },
    { name: '⚖️ Comparar y mover', chapters: [
      { id: 'iv-compara', title: 'Directa vs inversa', desc: 'Si x se duplica: una se duplica, la otra se reduce a la mitad.' },
      { id: 'iv-trasladada', title: 'La función racional trasladada', desc: 'y = k ÷ (x − h) + v: las asíntotas se mueven.' }
    ] },
    { name: '🛠 Herramientas', chapters: [
      { id: 'iv-encontrar', title: 'Encontrar k con un punto', desc: 'Arrastra un punto y arma la ecuación en 3 pasos.' },
      { id: 'iv-vida', title: 'Problemas de la vida real', desc: 'Obreros, velocidad, grifos y reparto de gastos.' },
      { id: 'iv-errores', title: 'Errores comunes', desc: 'Las trampas más típicas y cómo evitarlas.' }
    ] },
    { name: '🏆 Evaluación', chapters: [
      { id: 'iv-tarjetas', title: 'Tarjetas con gráficos', desc: 'Mira la curva y descubre k, las asíntotas, el signo…' },
      { id: 'iv-desafios', title: 'Desafíos', desc: 'Preguntas que rotan, con nota y progreso.' }
    ] },
    { name: '📖 Consulta', chapters: [
      { id: 'iv-glosario', title: 'Glosario', desc: 'Todas las palabras importantes, explicadas.' }
    ] }
  ];

  const LESSON_HTML = `
  <section class="card" id="iv-idea">
    <h2><span class="num">1</span> Cuando uno sube, el otro baja</h2>
    <p>Tienes <b class="t-m">12 galletas</b> para repartir en partes iguales entre tus amigos. ¿Qué pasa si llegan más amigos? ¡A cada uno le tocan <b>menos</b>! Toca cuántos amigos hay:</p>
    <div class="btn-row" id="iv-fr-btns">
      <button class="lbtn ghost" data-fr="1">1 amigo</button><button class="lbtn ghost" data-fr="2">2</button><button class="lbtn ghost" data-fr="3">3</button><button class="lbtn ghost" data-fr="4">4</button><button class="lbtn ghost" data-fr="6">6</button><button class="lbtn ghost" data-fr="12">12</button>
    </div>
    <div class="iv-friends" id="iv-friends"></div>
    <div class="explain" id="iv-idea-info"></div>
    <div class="formula-box"><span class="t-x">x</span> · <span class="t-y">y</span> = <span class="t-m">k</span> &nbsp;⟹&nbsp; amigos · galletas de cada uno = <span class="t-m">12</span></div>
    <p>A esto se le llama <b>proporción inversa</b>: cuando una cantidad <b>se multiplica</b> por un número, la otra se <b>divide</b> por ese mismo número. Si los amigos se duplican, a cada uno le toca la mitad; si se triplican, la tercera parte.</p>
    <ul class="facts">
      <li>🚌 <b>Velocidad y tiempo</b> (misma distancia): al doble de velocidad, la mitad del tiempo.</li>
      <li>👷 <b>Obreros y días</b> (mismo trabajo): al doble de obreros, la mitad de días.</li>
      <li>🚰 <b>Grifos y horas</b> para llenar una piscina: más grifos, menos horas.</li>
      <li>💸 <b>Reparto de un gasto</b>: más personas, menos paga cada una.</li>
    </ul>
    <div class="tip"><b>Ojo:</b> no basta con que "una suba y la otra baje". En la proporción inversa, al <b>multiplicar</b> las dos cantidades siempre da <b>el mismo número</b> (k).</div>
  </section>

  <section class="card" id="iv-ecuacion">
    <h2><span class="num">2</span> La ecuación <span class="t-y">y</span> = <span class="t-m">k</span> ÷ <span class="t-x">x</span></h2>
    <p>La proporción inversa se escribe con una <b>fracción</b>. Toca cada parte de la ecuación para ver qué es:</p>
    <div class="eq-parts" id="iv-eq-parts">
      <button data-part="y" class="t-y">y</button><button data-part="eq">=</button><button data-part="k" class="t-m">k</button><button data-part="div">÷</button><button data-part="x" class="t-x">x</button>
    </div>
    <div class="part-card" id="iv-part-card"></div>
    <div class="eq-example" id="iv-eq-example">
      <div class="ex-head"><span class="ex-label">Ejemplo</span><span class="ex-what">12 galletas entre 3 amigos</span></div>
      <div class="eq ex-eq"><span data-ex="y" class="t-y">y</span> <span data-ex="eq">=</span> <span data-ex="k" class="t-m">12</span> <span data-ex="div">÷</span> <span data-ex="x" class="t-x">3</span> <span data-ex="eq">=</span> <span data-ex="y" class="t-y">4</span></div>
      <p class="ex-says"></p>
    </div>
    <h3>Tres formas de escribir lo mismo</h3>
    <ul class="facts">
      <li><span class="eq"><span class="t-y">y</span> = <span class="frac"><span class="t-m">k</span><span class="t-x">x</span></span></span> &nbsp;(la fracción)</li>
      <li><span class="eq"><span class="t-x">x</span> · <span class="t-y">y</span> = <span class="t-m">k</span></span> &nbsp;(el producto siempre da k)</li>
      <li><span class="eq"><span class="t-y">y</span> = <span class="t-m">k</span> · <span class="t-x">x</span><sup>−1</sup></span> &nbsp;(con potencia: x elevado a −1 es 1 ÷ x)</li>
    </ul>
    <h3>¿Por qué se llama función racional?</h3>
    <p>Una <b>razón</b> es una división entre dos cosas. Como en <span class="t-y">y</span> = <span class="t-m">k</span> ÷ <span class="t-x">x</span> la <b>x aparece dentro de una fracción</b> (abajo, en el denominador), a estas funciones se les llama <b>funciones racionales</b>. La proporción inversa es la más simple de todas.</p>
    <h3>Pruébala tú</h3>
    <p>Con <b class="t-m">k = 12</b>, escribe un valor de <span class="t-x">x</span> y mira qué sale. Prueba también con <b>0</b>:</p>
    <div class="lab-controls"><label><span>x =</span><input type="number" id="iv-try" value="3" step="any" style="width:110px"></label></div>
    <div class="explain" id="iv-try-out"></div>
    <div class="tip"><b>Dominio:</b> x puede ser cualquier número <b>menos el 0</b>, porque no se puede dividir por cero. Se escribe <b>x ≠ 0</b>. Y como k ÷ x nunca da 0 (si k no es 0), tampoco <b>y</b> puede ser 0.</div>
  </section>

  <section class="card" id="iv-tabla">
    <h2><span class="num">3</span> De la tabla a la curva</h2>
    <p>Para dibujar una función se arma una <b>tabla de valores</b>, se marcan los puntos y se unen. Elige <span class="t-m">k</span> y mira la tabla y la gráfica (toca un punto o una fila):</p>
    <div class="lab-controls"><label><span>Valor de <b class="t-m">k</b></span><input type="range" id="iv-tk" min="1" max="12" step="1" value="6"><b id="iv-tk-val" class="t-m">6</b></label></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="iv-plot-tabla"></canvas></div>
      <div><table class="vtable" id="iv-tab-tabla"></table><div class="explain" id="iv-tabla-explain"></div></div>
    </div>
    <div class="btn-row"><button class="lbtn" id="iv-anim-tabla">▶ Dibujarla paso a paso</button></div>
    <ul class="facts">
      <li>Para <b>x positivos</b> la curva está arriba a la derecha; para <b>x negativos</b>, abajo a la izquierda.</li>
      <li>Son <b>dos ramas separadas</b>: no hay punto en x = 0, así que no se pueden unir con una línea. La figura completa se llama <b>hipérbola</b>.</li>
      <li>Fíjate en la tabla: a medida que x crece, y <b>baja</b> (pero nunca llega a 0).</li>
    </ul>
  </section>

  <section class="card" id="iv-k">
    <h2><span class="num">4</span> El papel de <span class="t-m">k</span></h2>
    <p><span class="t-m">k</span> decide <b>en qué lado</b> están las ramas y <b>qué tan lejos</b> del centro quedan. Mira cuatro casos:</p>
    <div class="iv-minis">
      <div><h4>k = 2 (positivo, chico)</h4><div class="plot-wrap"><canvas id="iv-mini-1"></canvas></div></div>
      <div><h4>k = 8 (positivo, grande)</h4><div class="plot-wrap"><canvas id="iv-mini-2"></canvas></div></div>
      <div><h4>k = −2 (negativo, chico)</h4><div class="plot-wrap"><canvas id="iv-mini-3"></canvas></div></div>
      <div><h4>k = −8 (negativo, grande)</h4><div class="plot-wrap"><canvas id="iv-mini-4"></canvas></div></div>
    </div>
    <ul class="facts">
      <li><b>k positivo</b> → x e y tienen el <b>mismo signo</b> → ramas en los cuadrantes <b>1 y 3</b> (arriba-derecha y abajo-izquierda).</li>
      <li><b>k negativo</b> → x e y tienen <b>signos opuestos</b> → ramas en los cuadrantes <b>2 y 4</b>.</li>
      <li><b>Mientras más grande sea |k|</b> (sin importar el signo), <b>más lejos del centro</b> quedan las ramas.</li>
    </ul>
    <h3>Laboratorio de k</h3>
    <div class="lab-controls"><label><span>Valor de <b class="t-m">k</b></span><input type="range" id="iv-ck" min="-12" max="12" step="1" value="6"><b id="iv-ck-val" class="t-m">6</b></label></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="iv-plot-k"></canvas></div>
      <div><table class="vtable" id="iv-tab-k"></table><div class="explain" id="iv-k-explain"></div></div>
    </div>
  </section>

  <section class="card" id="iv-asintotas">
    <h2><span class="num">5</span> Asíntotas: la curva que no toca los ejes</h2>
    <p>Una <b>asíntota</b> es una línea a la que la curva <b>se acerca cada vez más, pero nunca toca</b>. En <span class="t-y">y</span> = <span class="t-m">k</span> ÷ <span class="t-x">x</span> los dos ejes son asíntotas. Con <b class="t-m">k = 4</b>, mueve <span class="t-x">x</span> y mira qué le pasa a <span class="t-y">y</span>:</p>
    <div class="lab-controls"><label><span>Valor de <b class="t-x">x</b></span><input type="range" id="iv-as" min="0" max="11" step="1" value="6"><b id="iv-as-val" class="t-x">1</b></label></div>
    <div class="btn-row"><button class="lbtn" id="iv-as-near">▶ Acercarme al 0 (x → 0)</button><button class="lbtn ghost" id="iv-as-far">▶ Alejarme (x muy grande)</button></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="iv-plot-as"></canvas></div>
      <div><table class="vtable" id="iv-tab-as"></table><div class="explain" id="iv-as-explain"></div></div>
    </div>
    <ul class="facts">
      <li><b>x se acerca a 0</b> (0,5 → 0,1 → 0,01…): y se hace <b>enorme</b> (8 → 40 → 400…). La curva "se pega" al eje y: es la <b>asíntota vertical</b>, la recta <b>x = 0</b>.</li>
      <li><b>x se hace enorme</b> (10 → 100 → 1000…): y se hace <b>diminuto</b> (0,4 → 0,04 → 0,004…). La curva "se pega" al eje x: es la <b>asíntota horizontal</b>, la recta <b>y = 0</b>.</li>
      <li>Nunca llega: para que y fuera 0 haría falta 4 ÷ x = 0, y eso no pasa con ningún x.</li>
    </ul>
  </section>

  <section class="card" id="iv-area">
    <h2><span class="num">6</span> Área constante y simetría</h2>
    <p>Dibuja un rectángulo desde el origen hasta un punto de la curva. Su área es <span class="t-x">x</span> · <span class="t-y">y</span> = <span class="t-m">k</span>: ¡<b>siempre la misma</b>! Cambia de forma (alto y flaco, o bajo y ancho), pero su área no.</p>
    <div class="lab-controls">
      <label><span>Valor de <b class="t-m">k</b></span><input type="range" id="iv-sk" min="2" max="12" step="1" value="6"><b id="iv-sk-val" class="t-m">6</b></label>
      <label><span>Valor de <b class="t-x">x</b></span><input type="range" id="iv-sx" min="1" max="12" step="0.5" value="2"><b id="iv-sx-val" class="t-x">2</b></label>
    </div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="iv-plot-area"></canvas></div>
      <div class="explain" id="iv-area-explain"></div>
    </div>
    <div class="btn-row"><button class="lbtn" id="iv-anim-area">▶ Mover el punto por la curva</button></div>
    <h3>Dos simetrías</h3>
    <ul class="facts">
      <li><b>Respecto del origen:</b> si (x, y) está en la curva, también está <b>(−x, −y)</b>. Es el punto "al otro lado del centro" (rectángulo apagado).</li>
      <li><b>Respecto de la recta y = x:</b> si (x, y) está en la curva, también está <b>(y, x)</b>. Es el punto "espejo" (naranja) en la diagonal punteada.</li>
    </ul>
  </section>

  <section class="card" id="iv-compara">
    <h2><span class="num">7</span> Proporción directa vs inversa</h2>
    <p>En la <b>directa</b> (<span class="t-y">y</span> = <span class="t-m">a</span>·<span class="t-x">x</span>, una recta por el origen) todo crece junto. En la <b>inversa</b> (<span class="t-y">y</span> = <span class="t-m">k</span> ÷ <span class="t-x">x</span>) uno crece y el otro decrece. Mira qué pasa cuando <b>x se duplica</b>:</p>
    <div class="lab-controls">
      <label><span>Directa: <b class="t-m">a</b></span><input type="range" id="iv-ca" min="1" max="3" step="0.5" value="2"><b id="iv-ca-val" class="t-m">2</b></label>
      <label><span>Inversa: <b class="t-m">k</b></span><input type="range" id="iv-cc" min="2" max="16" step="1" value="8"><b id="iv-cc-val" class="t-m">8</b></label>
      <label><span>x inicial</span><input type="range" id="iv-cx" min="1" max="4" step="0.5" value="2"><b id="iv-cx-val" class="t-x">2</b></label>
    </div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="iv-plot-compara"></canvas></div>
      <div class="explain" id="iv-compara-explain"></div>
    </div>
    <div class="table-scroll"><table class="compare">
      <thead><tr><th></th><th>Proporción directa</th><th>Proporción inversa</th></tr></thead>
      <tbody>
        <tr><th>Ecuación</th><td><span class="t-y">y</span> = <span class="t-m">a</span>·<span class="t-x">x</span></td><td><span class="t-y">y</span> = <span class="t-m">k</span> ÷ <span class="t-x">x</span></td></tr>
        <tr><th>Gráfica</th><td>Recta por el origen</td><td>Hipérbola (dos ramas)</td></tr>
        <tr><th>Lo que no cambia</th><td>y ÷ x = a</td><td>x · y = k</td></tr>
        <tr><th>Si x se duplica…</th><td>y se duplica</td><td>y se reduce a la mitad</td></tr>
        <tr><th>¿Toca los ejes?</th><td>Pasa por (0, 0)</td><td>Nunca los toca (asíntotas)</td></tr>
        <tr><th>Ejemplo</th><td>Lápices a $200 c/u</td><td>Galletas entre amigos</td></tr>
      </tbody>
    </table></div>
    <p class="small">Más sobre la directa en la lección <button type="button" class="lbtn ghost lq-small" data-open="lineal">📏 Función lineal y afín</button></p>
  </section>

  <section class="card" id="iv-trasladada">
    <h2><span class="num">8</span> La función racional trasladada</h2>
    <p>Si a <span class="t-y">y</span> = <span class="t-m">k</span> ÷ <span class="t-x">x</span> le <b>restas h dentro</b> de la fracción y le <b>sumas v fuera</b>, toda la curva se <b>desliza</b>:</p>
    <div class="formula-box"><span class="t-y">y</span> = <span class="frac"><span class="t-m">k</span><span>x <b>−</b> <span class="t-n">h</span></span></span> <b>+</b> <span style="color:#FFA751"><b>v</b></span></div>
    <ul class="facts">
      <li><b class="t-n">h</b> mueve la curva hacia los lados. La asíntota vertical pasa a ser <b>x = h</b> (¡con el signo que tiene h, no el contrario!).</li>
      <li><b style="color:#FFA751">v</b> mueve la curva hacia arriba o abajo. La asíntota horizontal pasa a ser <b>y = v</b>.</li>
      <li>El "centro" de la hipérbola se mueve del origen al punto <b>(h, v)</b>.</li>
    </ul>
    <div class="lab-controls">
      <label><span>Valor de <b class="t-m">k</b></span><input type="range" id="iv-tk2" min="-8" max="8" step="1" value="4"><b id="iv-tk2-val" class="t-m">4</b></label>
      <label><span>Valor de <b class="t-n">h</b></span><input type="range" id="iv-th" min="-6" max="6" step="1" value="2"><b id="iv-th-val" class="t-n">2</b></label>
      <label><span>Valor de <b style="color:#FFA751">v</b></span><input type="range" id="iv-tv" min="-6" max="6" step="1" value="1"><b id="iv-tv-val" style="color:#FFA751">1</b></label>
    </div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="iv-plot-tras"></canvas></div>
      <div class="explain" id="iv-tras-explain"></div>
    </div>
    <div class="tip"><b>Dominio y recorrido:</b> x puede ser cualquier número menos <b>h</b> (x ≠ h). Y y puede ser cualquier número menos <b>v</b> (y ≠ v). Cuando h = 0 y v = 0 volvemos a la función de siempre.</div>
  </section>

  <section class="card" id="iv-encontrar">
    <h2><span class="num">9</span> Encontrar k con un punto</h2>
    <p>Si sabes que dos cantidades son inversamente proporcionales y conoces <b>un punto</b>, ya puedes armar la ecuación. <b>Arrastra el punto</b> <b class="t-m">P</b> por la cuadrícula:</p>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="iv-plot-enc"></canvas></div>
      <div class="steps" id="iv-enc-steps"></div>
    </div>
    <div class="btn-row"><button class="lbtn ghost" id="iv-enc-rand">🎲 Otro punto</button></div>
    <ol class="big-steps">
      <li><b>Multiplica</b> las coordenadas del punto: <span class="t-m">k</span> = <span class="t-x">x</span> · <span class="t-y">y</span>.</li>
      <li><b>Escribe la ecuación:</b> <span class="t-y">y</span> = <span class="t-m">k</span> ÷ <span class="t-x">x</span>.</li>
      <li><b>Comprueba</b> con otro punto de la curva: su x·y también debe dar k.</li>
    </ol>
    <div class="table-scroll"><table class="vtable" id="iv-tab-enc"></table></div>
  </section>

  <section class="card" id="iv-vida">
    <h2><span class="num">10</span> Problemas de la vida real</h2>
    <p>El truco siempre es el mismo: <b>1)</b> calcula k (lo que no cambia) y <b>2)</b> divide k por el nuevo valor.</p>
    <div class="iv-prob"><h4>👷 Obreros</h4><p>6 obreros hacen un muro en <b>10 días</b>. ¿Cuántos días tardan <b>15 obreros</b>?</p>
      <p>① k = 6 · 10 = <b class="t-m">60</b> (trabajo total, en "obrero-días"). ② días = 60 ÷ 15 = <b class="t-y">4 días</b>. ✅ (Más obreros, menos días.)</p></div>
    <div class="iv-prob"><h4>🚗 Velocidad</h4><p>Un auto a <b>80 km/h</b> tarda <b>3 horas</b>. ¿Cuánto tarda a <b>60 km/h</b>?</p>
      <p>① k = 80 · 3 = <b class="t-m">240 km</b> (la distancia). ② tiempo = 240 ÷ 60 = <b class="t-y">4 horas</b>. ✅ (Más lento, más tiempo.)</p></div>
    <div class="iv-prob"><h4>🚰 Grifos</h4><p>2 grifos llenan una piscina en <b>9 horas</b>. ¿Y <b>6 grifos</b>?</p>
      <p>① k = 2 · 9 = <b class="t-m">18</b>. ② horas = 18 ÷ 6 = <b class="t-y">3 horas</b>. ✅</p></div>
    <div class="iv-prob"><h4>🎉 Paseo del curso</h4><p>Con <b>12 alumnos</b>, cada uno paga <b>$5.000</b>. Si van <b>15</b>, ¿cuánto paga cada uno?</p>
      <p>① k = 12 · 5.000 = <b class="t-m">$60.000</b> (el costo total). ② cada uno = 60.000 ÷ 15 = <b class="t-y">$4.000</b>. ✅</p></div>
    <h3>Calculadora de obreros y días</h3>
    <div class="lab-controls">
      <label><span>Obreros</span><input type="number" id="iv-p1" value="6" min="1" style="width:80px"></label>
      <label><span>tardan (días)</span><input type="number" id="iv-p2" value="10" min="1" style="width:80px"></label>
      <label><span>Si son (obreros)</span><input type="number" id="iv-p3" value="15" min="1" style="width:80px"></label>
    </div>
    <div class="explain" id="iv-p-out"></div>
  </section>

  <section class="card" id="iv-errores">
    <h2><span class="num">11</span> Errores comunes (¡y cómo evitarlos!)</h2>
    <ul class="facts errors">
      <li><b>Multiplicar en vez de dividir.</b> En la inversa es <span class="t-y">y</span> = <span class="t-m">k</span> <b>÷</b> <span class="t-x">x</span>. Si multiplicas (k·x) obtienes una recta, ¡la proporción directa!</li>
      <li><b>Creer que "el doble" baja de 2 en 2.</b> Si x se duplica, y se reduce a la <b>mitad</b> (se divide por 2), no se le resta 2.</li>
      <li><b>Pensar que cualquier recta que baja es proporción inversa.</b> y = −x + 5 también baja, pero x·y no es constante: es afín.</li>
      <li><b>Unir las dos ramas</b> con una línea o hacer que la curva toque los ejes. Hay un "hueco" en x = 0 y las asíntotas nunca se tocan.</li>
      <li><b>Olvidar que x = 0 no existe.</b> No puedes repartir entre 0 amigos: dividir por cero no se puede.</li>
      <li><b>Cambiar el signo de h.</b> En y = k ÷ (x − 3) la asíntota vertical es x = <b>+3</b> (la x que hace cero al denominador). En y = k ÷ (x + 3) es x = −3.</li>
      <li><b>Confundir v con h.</b> h se resta <i>dentro</i> de la fracción (mueve hacia los lados); v se suma <i>fuera</i> (mueve hacia arriba o abajo).</li>
      <li><b>Olvidar las unidades de k.</b> En "80 km/h × 3 h", k son <b>240 km</b>: es la distancia, que no cambia.</li>
    </ul>
  </section>

  <section class="card" id="iv-tarjetas">
    <h2><span class="num">12</span> Tarjetas con gráficos</h2>
    <p>Practica <b>interpretando la curva</b>: cada tarjeta te muestra un gráfico y te pregunta algo (¿k positivo o negativo?, ¿cuál es k?, ¿dónde está la asíntota?, ¿es directa o inversa?…). Las que fallas <b>vuelven a salir más seguido</b>, y un tipo de tarjeta queda <b>dominado ⭐</b> con 3 aciertos seguidos.</p>
    <div id="iv-cards"></div>
  </section>

  <section class="card" id="iv-desafios">
    <h2><span class="num">13</span> Desafíos</h2>
    <p>Pon a prueba lo que aprendiste. <b>Cada intento trae 10 preguntas distintas</b> (rotan entre muchas, en otro orden y con números nuevos, algunas con gráficos). Al terminar verás tu <b>nota</b> (de 1,0 a 7,0; con el 60 % se aprueba con 4,0), en qué fallaste y un link para ir a repasar esa parte de la lección.</p>
    <div id="iv-quiz"></div>
  </section>

  <section class="card" id="iv-glosario">
    <h2><span class="num">14</span> Glosario</h2>
    <dl class="glossary">
      <dt>Proporción inversa</dt><dd>Dos cantidades cuyo producto x · y es siempre el mismo (k). Si una se multiplica, la otra se divide.</dd>
      <dt>Constante de proporcionalidad (<span class="t-m">k</span>)</dt><dd>El número que no cambia: k = x · y.</dd>
      <dt>Función racional</dt><dd>Función en la que x aparece en el denominador de una fracción. y = k ÷ x es la más simple.</dd>
      <dt>Hipérbola</dt><dd>La curva de dos ramas que dibuja y = k ÷ x.</dd>
      <dt>Rama</dt><dd>Cada una de las dos partes separadas de la hipérbola.</dd>
      <dt>Asíntota</dt><dd>Recta a la que la curva se acerca sin tocarla nunca. Vertical: x = h. Horizontal: y = v.</dd>
      <dt>Dominio</dt><dd>Los valores que puede tomar x. Aquí: todos menos el que anula el denominador (x ≠ 0, o x ≠ h).</dd>
      <dt>Recorrido</dt><dd>Los valores que puede tomar y. Aquí: todos menos v (y ≠ 0 si no hay traslación).</dd>
      <dt>Cuadrante</dt><dd>Cada una de las 4 zonas del plano. k positivo: cuadrantes 1 y 3. k negativo: 2 y 4.</dd>
      <dt>Simetría</dt><dd>La hipérbola se ve igual al girarla media vuelta alrededor del origen, y al reflejarla en la recta y = x.</dd>
      <dt>Traslación</dt><dd>Deslizar la curva sin cambiarle la forma: h a los lados, v hacia arriba o abajo.</dd>
      <dt>Proporción directa</dt><dd>y ÷ x es constante. Su gráfica es una recta por el origen.</dd>
    </dl>
  </section>`;

  // ----- Desafíos y tarjetas -----
  const GV = { xMin: -8, xMax: 8, yMin: -8, yMax: 8, aspect: 1, step: 1 };
  const hyperGraph = (k, extra, view = GV) => ({ view, draw(p) { p.grid(); p.axes(); branches(p, k, 0, 0); if (extra) extra(p); } });
  const DIVS = [1, 2, 3, 4, 6, 8, 12];
  const kOf = (r) => r.pick([6, 8, 12, 12, 18, 24]);
  const divsOf = (k) => DIVS.filter(d => k % d === 0);

  const QUIZ_TEMPLATES = [
    { topic: 'Calcular k', chapter: 'iv-ecuacion', make(r) {
      const x = r.int(2, 9), y = r.int(2, 9);
      return { q: `Dos cantidades son inversamente proporcionales. Cuando x = ${x}, y = ${y}. ¿Cuánto vale <b>k</b>?`, correct: x * y, wrong: [x + y, x * y + x, x * y - 1],
        why: `En la proporción inversa k = x · y = ${x} · ${y} = ${x * y}.` };
    } },
    { topic: 'Calcular y con k', chapter: 'iv-ecuacion', make(r) {
      const k = kOf(r), x = r.pick(divsOf(k).filter(d => d > 1));
      return { q: `Si <b>${kTxt(k)}</b>, ¿cuánto vale y cuando x = ${x}?`, correct: k / x, wrong: [k * x, k - x, x / k < 1 ? k / x + 2 : x],
        why: `y = ${k} ÷ ${x} = ${k / x}. Se divide k por x (no se multiplica).` };
    } },
    { topic: 'Si x se multiplica…', chapter: 'iv-idea', make(r) {
      const m = r.pick([2, 3, 4, 5]);
      const right = m === 2 ? 'Se reduce a la mitad' : `Se divide por ${m}`;
      return { q: `En una proporción inversa, x se multiplica por <b>${m}</b>. ¿Qué le pasa a y?`, correct: right,
        wrong: [`Se multiplica por ${m}`, `Disminuye en ${m}`, 'No cambia'],
        why: `Como x · y es siempre k, si x se multiplica por ${m}, y tiene que dividirse por ${m} para que el producto no cambie.` };
    } },
    { topic: 'Reconocer una proporción inversa', chapter: 'iv-idea', make(r) {
      const inv = r.pick(['Más obreros en una obra, menos días para terminarla', 'Más velocidad en un viaje, menos tiempo en llegar', 'Más grifos abiertos, menos horas para llenar la piscina', 'Más personas que pagan un regalo, menos paga cada una']);
      const dir = ['Más kilos de pan, más dinero que pagas', 'Más horas caminando, más kilómetros recorridos', 'Más lápices comprados, más pesos gastados', 'Más litros de bencina, más km que puede recorrer el auto'];
      return { q: '¿Cuál de estas situaciones es una <b>proporción inversa</b>?', correct: inv, wrong: [r.pick(dir.slice(0, 2)), dir[2], dir[3]],
        why: 'En la inversa, cuando una cantidad aumenta, la otra disminuye, y su producto es constante. En las otras, si una aumenta la otra también (directa).' };
    } },
    { topic: 'Obreros y días', chapter: 'iv-vida', make(r) {
      const o = r.pick([2, 3, 4, 6]), d = r.pick([12, 18, 24, 30]), m = r.pick([2, 3]);
      if ((o * d) % (o * m) !== 0) return this.make(r);
      return { q: `${o} obreros construyen una bodega en ${d} días. ¿Cuántos días tardan <b>${o * m} obreros</b> (al mismo ritmo)?`, correct: `${d / m} días`, wrong: [`${d * m} días`, `${d} días`, `${d - m} días`],
        why: `k = ${o} · ${d} = ${o * d} obrero-días. Con ${o * m} obreros: ${o * d} ÷ ${o * m} = ${d / m} días.` };
    } },
    { topic: 'Grifos y piscina', chapter: 'iv-vida', make(r) {
      const g = r.pick([2, 3, 4]), h = r.pick([12, 18, 24]), m = r.pick([2, 3, 6]);
      if ((g * h) % (g * m) !== 0) return this.make(r);
      return { q: `${g} grifos llenan una piscina en ${h} horas. Si se abren <b>${g * m} grifos</b> iguales, ¿cuánto tarda?`, correct: `${h / m} horas`, wrong: [`${h * m} horas`, `${h - m} horas`, `${h + m} horas`],
        why: `Más grifos, menos horas. k = ${g} · ${h} = ${g * h}. Entonces ${g * h} ÷ ${g * m} = ${h / m} horas.` };
    } },
    { topic: 'Reparto de un gasto', chapter: 'iv-vida', make(r) {
      const T = r.pick([24000, 36000, 48000, 60000]), p = r.pick([4, 6, 8, 12]), q = r.pick([3, 4, 6, 8, 12].filter(v => v !== p && T % v === 0));
      return { q: `Un curso reúne <b>${money(T)}</b> para un paseo, repartido en partes iguales entre <b>${p} alumnos</b>. Si en vez de ${p} van <b>${q}</b>, ¿cuánto paga cada uno?`, correct: money(T / q),
        wrong: [money(T / p), money(T / q + 2000), money(T - q * 1000)],
        why: `El gasto total (k) no cambia: ${money(T)}. Cada uno paga ${money(T)} ÷ ${q} = ${money(T / q)}.` };
    } },
    { topic: 'El valor prohibido', chapter: 'iv-ecuacion', make(r) {
      const k = r.nz(-9, 9);
      return { q: `En <b>${kTxt(k)}</b>, ¿qué valor <b>no</b> puede tomar x?`, correct: '0', wrong: ['1', N(-1), N(k)],
        why: 'No se puede dividir por 0, así que x ≠ 0. Cualquier otro valor sí sirve.' };
    } },
    { topic: 'Qué pasa cerca del 0', chapter: 'iv-asintotas', make(r) {
      const near = r.chance(0.5), k = r.int(2, 9);
      return { q: near ? `En y = ${k} ÷ x, ¿qué le pasa a y cuando x se acerca cada vez más a <b>0</b> (por ejemplo 0,1 → 0,01 → 0,001)?` : `En y = ${k} ÷ x, ¿qué le pasa a y cuando x se hace <b>muy grande</b> (100 → 1.000 → 10.000)?`,
        correct: near ? 'y se hace enorme' : 'y se acerca a 0 sin llegar',
        wrong: near ? ['y se acerca a 0', `y vale siempre ${k}`, 'y se vuelve 0'] : ['y se hace enorme', `y vale siempre ${k}`, 'y se vuelve negativa'],
        why: near ? `${k} ÷ 0,1 = ${k * 10}; ${k} ÷ 0,01 = ${k * 100}; ${k} ÷ 0,001 = ${k * 1000}: crece sin parar. La curva se pega al eje y (asíntota vertical).`
          : `${k} ÷ 100 = ${f(k / 100)}; ${k} ÷ 1.000 = ${f(k / 1000, 3)}: casi 0, pero nunca llega. La curva se pega al eje x (asíntota horizontal).` };
    } },
    { topic: 'Ecuación con un punto', chapter: 'iv-encontrar', make(r) {
      const a = r.int(2, 8), b = r.int(2, 9);
      return { q: `Una proporción inversa pasa por el punto <b>(${a}, ${b})</b>. ¿Cuál es su ecuación?`, correct: kTxt(a * b), wrong: [`y = ${a * b}x`, kTxt(a + b), `y = ${a} ÷ x`],
        why: `k = x · y = ${a} · ${b} = ${a * b}. La ecuación es y = ${a * b} ÷ x.` };
    } },
    { topic: 'Un punto de la curva', chapter: 'iv-ecuacion', make(r) {
      const k = kOf(r), x = r.pick(divsOf(k).filter(d => d > 1));
      return { q: `¿Cuál de estos puntos está sobre la curva <b>${kTxt(k)}</b>?`, correct: `(${x}, ${k / x})`, wrong: [`(${x}, ${k * x})`, `(${x}, ${k - x})`, `(${k / x}, ${x + 1})`],
        why: `Reemplaza x = ${x}: y = ${k} ÷ ${x} = ${k / x}. El punto es (${x}, ${k / x}); en él x · y = ${k}.` };
    } },
    { topic: '¿Directa o inversa? (tabla)', chapter: 'iv-compara', make(r) {
      const inv = r.chance(0.5), xs = [1, 2, 3, 6];
      const ys = inv ? xs.map(x => 12 / x) : xs.map(x => 3 * x);
      return { q: `x = ${xs.join(', ')} → y = ${ys.join(', ')}. ¿Qué relación es?`, correct: inv ? 'Proporción inversa' : 'Proporción directa', wrong: [inv ? 'Proporción directa' : 'Proporción inversa', 'Ninguna de las dos', 'Función cuadrática'],
        why: inv ? `x · y = ${xs[0] * ys[0]} en todas las filas: es inversa.` : `y ÷ x = ${ys[0] / xs[0]} en todas las filas: es directa.` };
    } },
    { topic: 'Área del rectángulo', chapter: 'iv-area', make(r) {
      const k = kOf(r), x = r.pick(divsOf(k).filter(d => d > 1 && d < k));
      return { q: `El punto (${x}, ${k / x}) está en la curva <b>${kTxt(k)}</b>. Se dibuja el rectángulo desde el origen hasta ese punto. ¿Cuál es su área?`, correct: k, wrong: [x + k / x, 2 * (x + k / x), k + x],
        why: `Área = base · altura = ${x} · ${k / x} = ${k}. ¡Es k! En esta curva el rectángulo siempre tiene área ${k}.` };
    } },
    { topic: 'El punto simétrico', chapter: 'iv-area', make(r) {
      const k = kOf(r), a = r.pick(divsOf(k).filter(d => d > 1 && d * d !== k)), b = k / a;
      return { q: `El punto <b>(${a}, ${b})</b> está en <b>${kTxt(k)}</b>. ¿Cuál de estos puntos también está en la curva, al otro lado del centro?`, correct: `(${N(-a)}, ${N(-b)})`, wrong: [`(${N(-a)}, ${b})`, `(${a}, ${N(-b)})`, `(${a + 1}, ${b})`],
        why: `Por la simetría respecto del origen, también está (−${a}, −${b}): (−${a})·(−${b}) = ${k}.` };
    } },
    { topic: 'Signo de k por los cuadrantes', chapter: 'iv-k', make(r) {
      const pos = r.chance(0.5);
      return { q: `Las ramas de y = k ÷ x están en los cuadrantes <b>${pos ? '1 y 3' : '2 y 4'}</b>. ¿Cómo es k?`, correct: pos ? 'Positivo' : 'Negativo', wrong: [pos ? 'Negativo' : 'Positivo', 'Cero', 'No se puede saber'],
        why: pos ? 'En los cuadrantes 1 y 3, x e y tienen el mismo signo, y k = x · y es positivo.' : 'En los cuadrantes 2 y 4, x e y tienen signos opuestos, y k = x · y es negativo.' };
    } },
    { topic: 'Asíntotas de la trasladada', chapter: 'iv-trasladada', make(r) {
      const k = r.nz(-6, 6), h = r.nz(-5, 5), v = r.nz(-5, 5);
      const den = h > 0 ? `(x − ${h})` : `(x + ${-h})`;
      return { q: `¿Cuáles son las asíntotas de <b>y = ${N(k)} ÷ ${den} ${v < 0 ? '−' : '+'} ${abs(v)}</b>?`, correct: `x = ${N(h)} e y = ${N(v)}`, wrong: [`x = ${N(-h)} e y = ${N(v)}`, `x = ${N(h)} e y = ${N(-v)}`, `x = ${N(v)} e y = ${N(h)}`],
        why: `La vertical es el x que hace 0 el denominador: ${den} = 0 → x = ${N(h)}. La horizontal es el número que se suma fuera: y = ${N(v)}.` };
    } },
    { topic: 'Evaluar la función racional', chapter: 'iv-trasladada', make(r) {
      const h = r.int(1, 3), v = r.int(-3, 3), d = r.pick([1, 2, 3, 4]), k = d * r.int(1, 3) * r.pick([1, -1]), x = h + d;
      const y = k / d + v;
      return { q: `Si <b>y = ${N(k)} ÷ (x − ${h}) ${v < 0 ? '−' : '+'} ${abs(v)}</b>, ¿cuánto vale y cuando x = ${x}?`, correct: N(y), wrong: [N(k / d - v), N(k / (x + h) + v), N(k * d + v)],
        why: `x − ${h} = ${d}, entonces y = ${N(k)} ÷ ${d} ${v < 0 ? '−' : '+'} ${abs(v)} = ${N(k / d)} ${v < 0 ? '−' : '+'} ${abs(v)} = ${N(y)}.` };
    } },

    // ----- Con gráficos -----
    { topic: 'Signo de k (gráfico)', chapter: 'iv-k', visual: true, make(r) {
      const k = r.nz(-9, 9);
      const right = k > 0 ? 'k es positivo (ramas en los cuadrantes 1 y 3)' : 'k es negativo (ramas en los cuadrantes 2 y 4)';
      return { q: 'Este gráfico es de <b>y = k ÷ x</b>. ¿Cómo es k?', graph: hyperGraph(k), correct: right,
        wrong: ['k es positivo (ramas en los cuadrantes 1 y 3)', 'k es negativo (ramas en los cuadrantes 2 y 4)', 'k es cero'].filter(v => v !== right),
        why: k > 0 ? 'Las ramas están arriba a la derecha y abajo a la izquierda: x e y con el mismo signo, así que k = x·y es positivo.' : 'Las ramas están arriba a la izquierda y abajo a la derecha: x e y con signos opuestos, así que k = x·y es negativo.' };
    } },
    { topic: 'Leer k en el gráfico', chapter: 'iv-encontrar', visual: true, make(r) {
      const k = kOf(r), a = r.pick(divsOf(k).filter(d => d <= 8 && k / d <= 8 && d > 1)) || 2, b = k / a;
      return { q: `La curva pasa por el punto marcado <b>(${a}, ${b})</b>. ¿Cuánto vale <b>k</b>?`, graph: hyperGraph(k, p => p.point(a, b, C.k, `(${a}, ${b})`)), correct: k, wrong: [a + b, k + a, Math.round(a / b * 10) / 10],
        why: `k = x · y = ${a} · ${b} = ${k}.` };
    } },
    { topic: 'Ecuación desde el gráfico', chapter: 'iv-encontrar', visual: true, make(r) {
      const k = r.pick([2, 3, 4, 6, 8, -4, -6]), a = r.pick(divsOf(abs(k)).filter(d => d <= 6 && d > 0)), b = k / a;
      return { q: '¿Cuál es la <b>ecuación</b> de esta curva?', graph: hyperGraph(k, p => p.point(a, b, C.k, `(${a}, ${N(b)})`)), correct: kTxt(k), wrong: [`y = ${N(k)}x`, kTxt(-k), `y = ${N(a + b)} ÷ x`],
        why: `El punto (${a}, ${N(b)}) da k = ${a} · ${P(b)} = ${N(k)}. Ecuación: ${kTxt(k)}.` };
    } },
    { topic: 'Asíntotas (gráfico)', chapter: 'iv-trasladada', visual: true, make(r) {
      const k = r.nz(-4, 4), h = r.nz(-4, 4), v = r.nz(-4, 4), ask = r.pick(['vertical', 'horizontal', 'dominio']);
      const graph = { view: { xMin: -8, xMax: 8, yMin: -8, yMax: 8, aspect: 1, step: 1 }, draw(p) {
        p.grid(); p.axes();
        p.segment(h, -8, h, 8, 'rgba(255,107,157,0.8)', 2, [6, 5]); p.segment(-8, v, 8, v, 'rgba(255,107,157,0.8)', 2, [6, 5]);
        branches(p, k, h, v);
      } };
      const qs = { vertical: 'La curva se acerca a una recta <b>vertical</b> (punteada) sin tocarla. ¿Cuál es su ecuación?', horizontal: 'La curva se acerca a una recta <b>horizontal</b> (punteada) sin tocarla. ¿Cuál es su ecuación?', dominio: 'Mira la asíntota vertical punteada. ¿Qué valor <b>no puede tomar x</b> en esta función?' };
      const ans = ask === 'horizontal' ? `y = ${N(v)}` : `x = ${N(h)}`;
      const wrong = ask === 'horizontal' ? [`y = ${N(-v)}`, `x = ${N(v)}`, 'y = 0'] : [`x = ${N(-h)}`, `y = ${N(h)}`, 'x = 0'];
      return { q: qs[ask], graph, correct: ans, wrong, why: ask === 'horizontal' ? `La recta horizontal punteada cruza el eje y en ${N(v)}: y = ${N(v)}.` : `La recta vertical punteada cruza el eje x en ${N(h)}: x = ${N(h)}. La función no existe ahí.` };
    } },
    { topic: '¿Directa o inversa? (gráfico)', chapter: 'iv-compara', visual: true, make(r) {
      const kind = r.pick(['directa', 'inversa', 'afin']);
      const m = r.int(1, 2) * r.pick([1, -1]), k = r.nz(-6, 6), n = r.nz(-4, 4);
      const opts = { directa: 'Proporción directa (recta por el origen)', inversa: 'Proporción inversa (hipérbola)', afin: 'Ninguna: es una recta que no pasa por el origen' };
      const graph = kind === 'inversa' ? hyperGraph(k) : { view: GV, draw(p) { p.grid(); p.axes(); p.fn(x => m * x + (kind === 'afin' ? n : 0), C.line); } };
      return { q: '¿Qué relación muestra este gráfico?', graph, correct: opts[kind], wrong: Object.values(opts).filter(v => v !== opts[kind]),
        why: kind === 'directa' ? 'Una recta que pasa por el origen: y ÷ x es constante, proporción directa.' : kind === 'inversa' ? 'Una curva de dos ramas que no toca los ejes: x · y es constante, proporción inversa.' : 'Es una recta, pero no pasa por (0, 0): no es proporción directa ni inversa.' };
    } },
    { topic: 'Punto simétrico (gráfico)', chapter: 'iv-area', visual: true, make(r) {
      const k = r.pick([4, 6, 8]), a = r.pick(divsOf(k).filter(d => d > 1 && d < k)), b = k / a;
      return { q: `El punto <b>P(${a}, ${b})</b> está en la curva. ¿Qué otro punto de la lista también está en ella?`, graph: hyperGraph(k, p => p.point(a, b, C.k, `P(${a}, ${b})`)),
        correct: `(${N(-a)}, ${N(-b)})`, wrong: [`(${N(-a)}, ${b})`, `(${a}, ${N(-b)})`, `(${a}, ${a})`],
        why: `La curva es simétrica respecto del origen: junto con (${a}, ${b}) está (${N(-a)}, ${N(-b)}), porque (${N(-a)})·(${N(-b)}) = ${k}.` };
    } },
    { topic: 'Leer y en la curva', chapter: 'iv-tabla', visual: true, make(r) {
      const k = r.pick([6, 8, 12]), x0 = r.pick(divsOf(k).filter(d => d > 1 && d <= 6)), y0 = k / x0;
      return { q: `Mira el punto marcado sobre la curva (en x = ${x0}). ¿Cuánto vale <b>y</b>?`,
        graph: { view: { xMin: -1, xMax: 9, yMin: -1, yMax: 9, aspect: 1, step: 1 }, draw(p) { p.grid(); p.axes(); p.fn(x => k / x, C.inv, { xFrom: 0.8, width: 3.5 }); p.segment(x0, 0, x0, y0, 'rgba(255,255,255,0.5)', 1.5, [4, 4]); p.point(x0, y0, C.k); } },
        correct: String(y0), wrong: [String(k), String(x0), String(y0 + 1)],
        why: `Desde x = ${x0} subes hasta la curva y lees la altura: y = ${y0}. Comprueba: ${x0} · ${y0} = ${k} = k.` };
    } }
  ];
  const CARD_TEMPLATES = QUIZ_TEMPLATES.filter(t => t.visual);

  // ----- Estado -----
  const st = { fr: 3, tk: 6, ck: 6, as: 6, sk: 6, sx: 2, ca: 2, cc: 8, cx: 2, tk2: 4, th: 2, tv: 1, P: { x: 3, y: 4 }, part: 'k', p1: 6, p2: 10, p3: 15, tryX: 3 };
  let quiz = null, cards = null, nav = null, pending = null, rootEl = null;
  const plots = {};
  const stop = {};
  const refreshers = [];
  const cancel = (k) => { if (stop[k]) { stop[k](); stop[k] = null; } };

  function bind(root, id, key, upd, fmt = (v) => f(v, 1)) {
    const el = root.querySelector(`#${id}`), out = root.querySelector(`#${id}-val`);
    const show = () => { el.value = st[key]; if (out) out.textContent = fmt(Number(el.value)); };
    el.addEventListener('input', () => { st[key] = Number(el.value); show(); upd(); changed(); });
    refreshers.push(() => { show(); upd(); });
    show();
  }
  function tableHtml(rows, cols) {
    return `<thead><tr>${cols.map(c => `<th>${c.h}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => `<tr data-row="${i}">${cols.map(c => `<td>${c.v(r, i)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  }

  // ----- 1. Idea -----
  function setupIdea(root) {
    const box = root.querySelector('#iv-friends'), info = root.querySelector('#iv-idea-info'), btns = root.querySelectorAll('[data-fr]');
    const show = () => {
      const x = st.fr, y = 12 / x;
      box.innerHTML = Array.from({ length: x }, () => `<div class="iv-friend"><span>🙂</span><span class="iv-cookies">${'🍪'.repeat(y)}</span><b class="t-y">${y}</b></div>`).join('');
      info.innerHTML = `<p><b class="t-x">${x}</b> ${x === 1 ? 'amigo' : 'amigos'}: a cada uno le tocan <span class="t-m">12</span> ÷ <span class="t-x">${x}</span> = <b class="t-y">${y}</b> galletas.</p><p>Comprueba: ${x} · ${y} = <b class="t-m">12</b> ✅ (¡siempre da 12!)</p>`;
      btns.forEach(b => b.classList.toggle('is-on', Number(b.dataset.fr) === x));
    };
    btns.forEach(b => b.addEventListener('click', () => { st.fr = Number(b.dataset.fr); show(); changed(); }));
    refreshers.push(show);
    show();
  }

  // ----- 2. Ecuación -----
  const PARTS = {
    y: { name: 'y — la salida', text: 'Es el resultado: lo que le toca a cada uno. Depende de x. En la gráfica se mide hacia arriba.', says: 'y es lo que sale: aquí, 4 galletas para cada amigo.' },
    eq: { name: '= — "es igual a"', text: 'Dice que y vale exactamente lo mismo que la división de la derecha.', says: 'El = une lo que sale (y) con la cuenta 12 ÷ 3.' },
    k: { name: 'k — la constante de proporcionalidad', text: 'Es el número que no cambia nunca. Es lo que se reparte, el trabajo total, la distancia… Se calcula multiplicando x · y. Si es positivo las ramas están en los cuadrantes 1 y 3; si es negativo, en el 2 y el 4.', says: 'k = 12 es el total de galletas: lo que se reparte, no cambia.' },
    div: { name: '÷ — dividir', text: 'La clave de la proporción inversa: k se DIVIDE entre x. Por eso, cuando x crece, y se achica.', says: '12 ÷ 3: el total entre el número de amigos.' },
    x: { name: 'x — la entrada', text: 'Es el valor que eliges (el número de amigos, de obreros…). Puede ser cualquiera menos el 0, porque no se puede dividir por cero.', says: 'x = 3 es la cantidad de amigos que elegimos.' }
  };
  function setupParts(root) {
    const card = root.querySelector('#iv-part-card'), ex = root.querySelector('#iv-eq-example');
    const show = () => {
      const p = PARTS[st.part] || PARTS.k;
      card.innerHTML = `<h4>${p.name}</h4><p>${p.text}</p>`;
      root.querySelectorAll('#iv-eq-parts [data-part]').forEach(b => b.classList.toggle('is-on', b.dataset.part === st.part));
      ex.querySelectorAll('[data-ex]').forEach(s => s.classList.toggle('is-hl', s.dataset.ex === st.part));
      ex.querySelector('.ex-says').innerHTML = `👉 ${p.says}`;
    };
    root.querySelector('#iv-eq-parts').addEventListener('click', (e) => { const b = e.target.closest('[data-part]'); if (!b) return; st.part = b.dataset.part; show(); changed(); });
    ex.addEventListener('click', (e) => { const s = e.target.closest('[data-ex]'); if (!s) return; st.part = s.dataset.ex; show(); changed(); });
    refreshers.push(show);
    show();
    const inp = root.querySelector('#iv-try'), out = root.querySelector('#iv-try-out');
    const tryIt = () => {
      const x = Number(inp.value);
      st.tryX = x;
      if (inp.value === '' || !isFinite(x)) { out.innerHTML = '<p>Escribe un número.</p>'; return; }
      out.innerHTML = x === 0
        ? '<p class="bad">❌ <b>¡Error!</b> 12 ÷ 0 no existe. No se puede repartir entre 0 amigos: x = 0 está prohibido.</p>'
        : `<p>y = <span class="t-m">12</span> ÷ <span class="t-x">${f(x)}</span> = <b class="t-y">${f(12 / x, 3)}</b></p><p>x · y = ${f(x)} · ${f(12 / x, 3)} = <b class="t-m">12</b> ✅</p>`;
    };
    inp.addEventListener('input', () => { tryIt(); changed(); });
    refreshers.push(() => { inp.value = st.tryX; tryIt(); });
    tryIt();
  }

  // ----- 3. Tabla → curva -----
  function setupTabla(root) {
    const p = new Plot(root.querySelector('#iv-plot-tabla'), { xMin: -8, xMax: 8, yMin: -13, yMax: 13, aspect: 1, step: 1 });
    plots.tabla = p;
    const xs = [-6, -4, -3, -2, -1, 1, 2, 3, 4, 6];
    const draw = (prog = 1) => {
      const k = st.tk, n = Math.ceil(Math.min(1, prog / 0.6) * xs.length), cp = Math.max(0, (prog - 0.6) / 0.4);
      p.draw(() => {
        p.grid(); p.axes({ x: 'x', y: 'y' });
        if (cp > 0) {
          const g = x => k / x;
          p.fn(g, C.inv, { xFrom: -8, xTo: -0.03, width: 3.5, progress: cp });
          p.fn(g, C.inv, { xFrom: 0.03, xTo: 8, width: 3.5, progress: cp });
        }
        xs.slice(0, n).forEach(x => p.point(x, k / x, C.k, '', { r: 5 }));
      });
    };
    const table = () => {
      root.querySelector('#iv-tab-tabla').innerHTML = tableHtml(xs, [
        { h: '<span class="t-x">x</span>', v: x => N(x) },
        { h: `<span class="t-m">${st.tk}</span> ÷ <span class="t-x">x</span>`, v: x => `${st.tk} ÷ ${P(x)}` },
        { h: '<span class="t-y">y</span>', v: x => f(st.tk / x) }
      ]);
      root.querySelector('#iv-tabla-explain').innerHTML = `<p>Con <b class="t-m">k = ${st.tk}</b>: cada fila se calcula dividiendo ${st.tk} entre x. Si x es negativo, y también (positivo ÷ negativo = negativo).</p>`;
    };
    const upd = () => { cancel('tabla'); table(); draw(); };
    bind(root, 'iv-tk', 'tk', upd, v => String(v));
    root.querySelector('#iv-anim-tabla').addEventListener('click', () => { cancel('tabla'); stop.tabla = Plot.animate(4500, t => draw(t), () => draw()); });
    Plot.linkTable(p, root.querySelector('#iv-tab-tabla'));
  }

  // ----- 4. k -----
  function setupK(root) {
    [[2, 'iv-mini-1'], [8, 'iv-mini-2'], [-2, 'iv-mini-3'], [-8, 'iv-mini-4']].forEach(([k, id]) => {
      const p = new Plot(root.querySelector(`#${id}`), { xMin: -8, xMax: 8, yMin: -8, yMax: 8, aspect: 1, step: 2 });
      plots[id] = p;
      p.draw(() => { p.grid(); p.axes(); branches(p, k, 0, 0, k > 0 ? C.inv : C.h); p.point(1, k, C.k, `(1, ${N(k)})`, { r: 4 }); p.point(-1, -k, C.k, '', { r: 4 }); });
    });
    const p = new Plot(root.querySelector('#iv-plot-k'), { xMin: -13, xMax: 13, yMin: -13, yMax: 13, aspect: 1, step: 2 });
    plots.k = p;
    const upd = () => {
      const k = st.ck;
      p.draw(() => {
        p.grid(); p.axes();
        if (k === 0) p.segment(-13, 0, 13, 0, C.inv, 3.5);
        else { branches(p, k, 0, 0, k > 0 ? C.inv : C.h); [1, 2, 3, 4, 6].forEach(x => { if (abs(k / x) <= 13) p.point(x, k / x, C.k, '', { r: 4 }); }); }
      });
      const xs = [-6, -3, -2, -1, 1, 2, 3, 6];
      root.querySelector('#iv-tab-k').innerHTML = tableHtml(xs, [{ h: '<span class="t-x">x</span>', v: x => N(x) }, { h: '<span class="t-y">y</span>', v: x => k === 0 ? '0' : f(k / x) }]);
      root.querySelector('#iv-k-explain').innerHTML = k === 0
        ? '<p>Con <b class="t-m">k = 0</b>, y = 0 ÷ x = 0 para todo x: es solo la recta y = 0. <b>No es una proporción inversa</b> (k tiene que ser distinto de 0).</p>'
        : `<p><b class="t-m">k = ${k}</b> es ${k > 0 ? 'positivo' : 'negativo'}: ramas en los cuadrantes <b>${k > 0 ? '1 y 3' : '2 y 4'}</b>.</p><p>En x = 1, y = ${N(k)} (igual a k). ${abs(k) >= 8 ? 'Con |k| grande la curva queda lejos del centro.' : abs(k) <= 3 ? 'Con |k| chico la curva queda pegada a los ejes.' : ''}</p>`;
    };
    bind(root, 'iv-ck', 'ck', upd, v => String(v));
    Plot.linkTable(p, root.querySelector('#iv-tab-k'));
  }

  // ----- 5. Asíntotas -----
  const XS_NEAR = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.01];
  function setupAsintotas(root) {
    const p = new Plot(root.querySelector('#iv-plot-as'), { xMin: -1, xMax: 10, yMin: -1, yMax: 14, aspect: 0.9, step: 1 });
    plots.as = p;
    const K = 4;
    root.querySelector('#iv-tab-as').innerHTML = tableHtml(XS_NEAR, [
      { h: '<span class="t-x">x</span>', v: x => f(x, 2) }, { h: '<span class="t-y">y = 4 ÷ x</span>', v: x => f(K / x, 2) }
    ]);
    const upd = () => {
      const x = XS_NEAR[st.as], y = K / x;
      root.querySelector('#iv-as-val').textContent = f(x, 2);
      p.draw(() => {
        p.grid(); p.axes({ x: 'x', y: 'y' });
        p.segment(0, -1, 0, 14, 'rgba(255,107,157,0.85)', 2.5, [7, 5]); p.segment(-1, 0, 10, 0, 'rgba(255,107,157,0.85)', 2.5, [7, 5]);
        p.text('asíntota vertical x = 0', 0, 13.2, C.asym, { dx: 8, size: 12 }); p.text('asíntota horizontal y = 0', 10, 0, C.asym, { align: 'right', dy: -8, size: 12 });
        p.fn(g => K / g, C.inv, { xFrom: 0.28, xTo: 10, width: 3.5 });
        if (x <= 10 && y <= 14) { p.segment(x, 0, x, y, 'rgba(255,255,255,0.45)', 1.5, [4, 4]); p.segment(0, y, x, y, 'rgba(255,255,255,0.45)', 1.5, [4, 4]); p.point(x, y, C.k, `(${f(x, 2)}, ${f(y, 2)})`, { r: 7 }); }
      });
      root.querySelectorAll('#iv-tab-as tbody tr').forEach((tr, i) => tr.classList.toggle('is-mark', i === st.as));
      root.querySelector('#iv-as-explain').innerHTML = `<p>x = <b class="t-x">${f(x, 2)}</b> → y = 4 ÷ ${f(x, 2)} = <b class="t-y">${f(y, 2)}</b></p>` + (x < 1
        ? `<p>${y > 14 ? '🔝 El punto ya se salió del gráfico por arriba: ' : ''}x está <b>muy cerca de 0</b> y y se hace <b>enorme</b>. ¡Pegándose al eje y!</p>`
        : x > 10 ? '<p>x es <b>muy grande</b> (el punto está fuera, a la derecha) y y es <b>casi 0</b>. ¡Pegándose al eje x!</p>' : '<p>Sigue moviendo x hacia 0 o hacia números enormes.</p>');
    };
    const sl = root.querySelector('#iv-as');
    sl.addEventListener('input', () => { cancel('as'); st.as = Number(sl.value); upd(); changed(); });
    refreshers.push(() => { sl.value = st.as; upd(); });
    const run = (from, to) => { cancel('as'); stop.as = Plot.animate(Math.abs(to - from) * 700, t => { st.as = Math.round(from + (to - from) * t); sl.value = st.as; upd(); }, changed); };
    root.querySelector('#iv-as-near').addEventListener('click', () => run(6, 11));
    root.querySelector('#iv-as-far').addEventListener('click', () => run(6, 0));
    sl.value = st.as; upd();
    Plot.linkTable(p, root.querySelector('#iv-tab-as'));
  }

  // ----- 6. Área y simetría -----
  function setupArea(root) {
    const p = new Plot(root.querySelector('#iv-plot-area'), { xMin: -13, xMax: 13, yMin: -13, yMax: 13, aspect: 1, step: 2 });
    plots.area = p;
    const draw = (xv = st.sx) => {
      const k = st.sk, y = k / xv;
      p.draw(() => {
        p.grid(); p.axes();
        p.segment(-13, -13, 13, 13, 'rgba(255,255,255,0.35)', 1.5, [6, 6]); p.text('y = x', 9.5, 10, 'rgba(255,255,255,0.7)', { size: 12 });
        p.rect(0, 0, xv, y, 'rgba(255,209,102,0.22)', '#FFD166');
        p.rect(0, 0, -xv, -y, 'rgba(255,209,102,0.08)', 'rgba(255,209,102,0.4)');
        branches(p, k, 0, 0, C.inv);
        p.text(`área = ${f(xv, 1)} · ${f(y, 2)} = ${k}`, xv / 2, y / 2, '#FFD166', { align: 'center', size: 12 });
        p.segment(xv, y, -xv, -y, 'rgba(255,255,255,0.3)', 1, [3, 4]);
        p.point(xv, y, C.k, `(${f(xv, 1)}, ${f(y, 2)})`); p.point(-xv, -y, C.k, '', { r: 5 }); p.point(y, xv, C.y, `(${f(y, 2)}, ${f(xv, 1)})`);
      });
      root.querySelector('#iv-area-explain').innerHTML = `<p>Punto <b class="t-m">(${f(xv, 1)}, ${f(y, 2)})</b>: el rectángulo mide ${f(xv, 1)} de ancho y ${f(y, 2)} de alto.</p><p>Área = ${f(xv, 1)} · ${f(y, 2)} = <b class="t-m">${k}</b> ✅ (siempre k)</p><p>Simétrico del origen: <b>(${f(-xv, 1)}, ${f(-y, 2)})</b> · Espejo en y = x: <b style="color:#FFA751">(${f(y, 2)}, ${f(xv, 1)})</b></p>`;
    };
    const upd = () => { cancel('area'); draw(); };
    bind(root, 'iv-sk', 'sk', upd, v => String(v));
    bind(root, 'iv-sx', 'sx', upd, v => f(v, 1));
    root.querySelector('#iv-anim-area').addEventListener('click', () => { cancel('area'); stop.area = Plot.animate(5000, t => draw(Math.max(1, 1 + 11 * (0.5 - 0.5 * Math.cos(t * Math.PI * 2)))), () => draw()); });
  }

  // ----- 7. Directa vs inversa -----
  function setupCompara(root) {
    const p = new Plot(root.querySelector('#iv-plot-compara'), { xMin: -0.5, xMax: 9, yMin: -1, yMax: 26, aspect: 1, step: 2 });
    plots.compara = p;
    const upd = () => {
      const a = st.ca, k = st.cc, x1 = st.cx, x2 = x1 * 2;
      const d1 = a * x1, d2 = a * x2, i1 = k / x1, i2 = k / x2;
      p.draw(() => {
        p.grid(); p.axes({ x: 'x', y: 'y' });
        p.fn(x => a * x, C.line, { xFrom: 0, xTo: 9 }); p.fn(x => k / x, C.inv, { xFrom: 0.5, xTo: 9, width: 3.5 });
        [[x1, d1, C.line], [x2, d2, C.line], [x1, i1, C.inv], [x2, i2, C.inv]].forEach(([x, y, col]) => { p.segment(x, 0, x, y, 'rgba(255,255,255,0.35)', 1.2, [4, 4]); p.point(x, y, col, `${f(y, 1)}`, { r: 6 }); });
        p.text('directa', 6.5, a * 6.5, '#8f88ff', { dy: -8 }); p.text('inversa', 5, k / 5, '#FFD166', { dy: -8 });
      });
      root.querySelector('#iv-compara-explain').innerHTML = `
        <p>x pasa de <b class="t-x">${f(x1, 1)}</b> a <b class="t-x">${f(x2, 1)}</b> (se <b>duplica</b>).</p>
        <p>📏 <b>Directa</b> (y = ${f(a, 1)}·x): y pasa de ${f(d1, 1)} a <b>${f(d2, 1)}</b> → ¡se duplica!</p>
        <p>🔁 <b>Inversa</b> (y = ${k} ÷ x): y pasa de ${f(i1, 2)} a <b>${f(i2, 2)}</b> → ¡se reduce a la mitad!</p>
        <p>Las dos curvas se cruzan en x = √(${k} ÷ ${f(a, 1)}) ≈ ${f(Math.sqrt(k / a), 2)}.</p>`;
    };
    bind(root, 'iv-ca', 'ca', upd, v => f(v, 1));
    bind(root, 'iv-cc', 'cc', upd, v => String(v));
    bind(root, 'iv-cx', 'cx', upd, v => f(v, 1));
  }

  // ----- 8. Trasladada -----
  function setupTras(root) {
    const p = new Plot(root.querySelector('#iv-plot-tras'), { xMin: -10, xMax: 10, yMin: -10, yMax: 10, aspect: 1, step: 2 });
    plots.tras = p;
    const upd = () => {
      const k = st.tk2, h = st.th, v = st.tv;
      p.draw(() => {
        p.grid(); p.axes();
        p.segment(h, -10, h, 10, 'rgba(255,107,157,0.85)', 2, [7, 5]); p.segment(-10, v, 10, v, 'rgba(255,107,157,0.85)', 2, [7, 5]);
        if (k === 0) p.segment(-10, v, 10, v, C.inv, 3.5); else branches(p, k, h, v);
        p.point(h, v, C.h, `centro (${N(h)}, ${N(v)})`, { r: 5 });
      });
      const den = h === 0 ? 'x' : h > 0 ? `(x − <span class="t-n">${h}</span>)` : `(x + <span class="t-n">${-h}</span>)`;
      const eq = `<span class="t-y">y</span> = <span class="t-m">${N(k)}</span> ÷ ${den}${v === 0 ? '' : ` ${v < 0 ? '−' : '+'} <b style="color:#FFA751">${abs(v)}</b>`}`;
      const xi = v !== 0 && k !== 0 ? h - k / v : null, yi = h !== 0 && k !== 0 ? v - k / h : null;
      root.querySelector('#iv-tras-explain').innerHTML = k === 0 ? '<p>Con k = 0 no hay hipérbola: queda solo la recta y = v.</p>' : `
        <div class="eq">${eq}</div>
        <p>🟥 Asíntota vertical: <b>x = ${N(h)}</b> (el x que hace 0 el denominador).</p>
        <p>🟥 Asíntota horizontal: <b>y = ${N(v)}</b>.</p>
        <p>Dominio: x ≠ ${N(h)} · Recorrido: y ≠ ${N(v)}</p>
        <p>Corte con el eje y (x = 0): ${yi === null ? 'no existe (x = 0 es justo la asíntota)' : `y = ${N(k)} ÷ ${P(-h)} ${v < 0 ? '−' : '+'} ${abs(v)} = <b>${f(yi, 2)}</b>`}</p>
        <p>Corte con el eje x (y = 0): ${xi === null ? (v === 0 ? 'no corta (y nunca es 0)' : 'no existe') : `${N(k)} ÷ (x − ${P(h)}) = ${N(-v)} → x = <b>${f(xi, 2)}</b>`}</p>`;
    };
    bind(root, 'iv-tk2', 'tk2', upd, v => String(v));
    bind(root, 'iv-th', 'th', upd, v => String(v));
    bind(root, 'iv-tv', 'tv', upd, v => String(v));
  }

  // ----- 9. Encontrar k -----
  function setupEncontrar(root) {
    const p = new Plot(root.querySelector('#iv-plot-enc'), { xMin: -0.5, xMax: 13, yMin: -0.5, yMax: 13, aspect: 1, step: 1 });
    plots.enc = p;
    const upd = () => {
      const { x, y } = st.P, k = x * y;
      p.draw(() => {
        p.grid(); p.axes({ x: 'x', y: 'y' });
        p.rect(0, 0, x, y, 'rgba(255,209,102,0.2)', '#FFD166');
        p.fn(g => k / g, C.inv, { xFrom: Math.max(0.3, k / 13), xTo: 13, width: 3.5 });
        p.point(x, y, C.k, `P(${x}, ${y})`, { r: 9 });
      });
      root.querySelector('#iv-enc-steps').innerHTML = `
        <p><b>Paso 1.</b> <span class="t-m">k</span> = <span class="t-x">${x}</span> · <span class="t-y">${y}</span> = <b class="t-m">${k}</b></p>
        <p><b>Paso 2.</b> La ecuación es <b><span class="t-y">y</span> = <span class="t-m">${k}</span> ÷ <span class="t-x">x</span></b></p>
        <p><b>Paso 3.</b> Comprueba: con x = ${x}, y = ${k} ÷ ${x} = ${y} ✅</p>`;
      const ds = DIVS.concat([5, 7, 9, 10, 11]).filter(d => k % d === 0 && d <= 12).sort((a, b) => a - b);
      root.querySelector('#iv-tab-enc').innerHTML = tableHtml(ds, [
        { h: 'Otro punto de la curva: <span class="t-x">x</span>', v: d => d }, { h: `<span class="t-y">y</span> = ${k} ÷ x`, v: d => k / d }, { h: '<span class="t-x">x</span> · <span class="t-y">y</span>', v: d => `<b class="good">${d * (k / d)}</b>` }
      ]);
    };
    p.enableDrag(() => [{ id: 'P', ...st.P }], (id, x, y) => { st.P = { x, y }; upd(); }, { snap: 1, bounds: { xMin: 1, xMax: 12, yMin: 1, yMax: 12 }, onEnd: changed });
    root.querySelector('#iv-enc-rand').addEventListener('click', () => { st.P = { x: 1 + Math.floor(Math.random() * 9), y: 1 + Math.floor(Math.random() * 9) }; upd(); changed(); });
    refreshers.push(upd);
    upd();
    Plot.linkTable(p, root.querySelector('#iv-tab-enc'));
  }

  // ----- 10. Calculadora -----
  function setupVida(root) {
    const ins = ['iv-p1', 'iv-p2', 'iv-p3'].map(id => root.querySelector(`#${id}`)), out = root.querySelector('#iv-p-out');
    const upd = () => {
      const [a, b, c] = ins.map(i => Number(i.value));
      st.p1 = a; st.p2 = b; st.p3 = c;
      if (!(a > 0 && b > 0 && c > 0)) { out.innerHTML = '<p>Escribe números mayores que 0.</p>'; return; }
      out.innerHTML = `<p>① k = ${a} · ${b} = <b class="t-m">${f(a * b)}</b></p><p>② días = ${f(a * b)} ÷ ${c} = <b class="t-y">${f(a * b / c, 2)} días</b></p><p>${c > a ? 'Más obreros → menos días ✅' : c < a ? 'Menos obreros → más días ✅' : 'Los mismos obreros: los mismos días.'}</p>`;
    };
    ins.forEach(i => i.addEventListener('input', () => { upd(); changed(); }));
    refreshers.push(() => { ins[0].value = st.p1; ins[1].value = st.p2; ins[2].value = st.p3; upd(); });
    upd();
  }

  // ----- Registro -----
  const LOCAL_KEY = 'mathviz_lesson_inversa';
  try { const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null'); if (saved && saved.nav) pending = { nav: saved.nav }; } catch (e) {}
  const saveLocal = () => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify({ nav: nav ? nav.getState() : null })); } catch (e) {} };

  MathLessons.register({
    id: 'inversa',
    label: 'Proporción inversa y función racional',
    icon: '🔁',
    description: 'Cuando una cantidad sube y la otra baja: y = k ÷ x, la hipérbola, las asíntotas, qué hace k y cómo se traslada la función racional. Para 12 años en adelante.',
    render(container) {
      rootEl = container;
      container.innerHTML = LESSON_HTML;
      setupIdea(container); setupParts(container); setupTabla(container); setupK(container); setupAsintotas(container);
      setupArea(container); setupCompara(container); setupTras(container); setupEncontrar(container); setupVida(container);
      quiz = LessonQuiz(container.querySelector('#iv-quiz'), { id: 'inversa', templates: QUIZ_TEMPLATES, onChange: changed });
      cards = LessonCards(container.querySelector('#iv-cards'), { id: 'inversa', templates: CARD_TEMPLATES, onChange: changed });
      nav = LessonChapters(container, { lesson: this, intro: INTRO, groups: GROUPS, onChange: () => { saveLocal(); changed(); } });
      if (pending) { const s = pending; pending = null; this.setState(s); }
    },
    onShow() { if (nav) nav.onShow(); },
    goTo(ch) { if (nav) nav.goTo(ch); },
    getState() {
      if (!rootEl) return pending;
      return { ...JSON.parse(JSON.stringify(st)), quiz: quiz ? quiz.getState() : null, cards: cards ? cards.getState() : null, nav: nav ? nav.getState() : null };
    },
    setState(s) {
      if (!s) return;
      if (!rootEl) { pending = s; return; }
      Object.keys(st).forEach(k => { if (s[k] !== undefined) st[k] = JSON.parse(JSON.stringify(s[k])); });
      refreshers.forEach(r => r());
      if (quiz && s.quiz) quiz.setState(s.quiz);
      if (cards && s.cards) cards.setState(s.cards);
      if (nav && s.nav) nav.setState(s.nav);
    },
    summary() {
      const s = rootEl ? this.getState() : pending;
      const all = GROUPS.flatMap(g => g.chapters);
      const visitedIds = (s && s.nav && s.nav.visited) || [];
      const attempts = (s && s.quiz && s.quiz.attempts) || (() => { try { return (JSON.parse(localStorage.getItem('mathviz_quiz_inversa') || 'null') || {}).attempts || []; } catch (e) { return []; } })();
      const next = all.find(c => !visitedIds.includes(c.id));
      return { visited: visitedIds.length, total: all.length, best: attempts.length ? Math.max(...attempts.map(a => a.nota)) : null, current: visitedIds.length && next ? next.title : null };
    }
  });
})();
