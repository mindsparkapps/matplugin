// ===== MathViz · Lección: función lineal y función afín (para ~12 años) =====
// Todo explicado paso a paso: qué es una función, la ecuación y cada uno de sus términos, la pendiente,
// dónde corta los ejes, laboratorio con gráfica y animaciones, proporción directa e inversa,
// cómo encontrar la ecuación con dos puntos, errores comunes, desafíos y glosario.
(function () {
  const C = { m: '#FF6B9D', n: '#00D4AA', x: '#6C63FF', y: '#FFA751', line: '#6C63FF', afin: '#00D4AA', inv: '#FFD166' };
  const f = (v, d = 2) => Plot.fmt(v, d);
  const sgn = (v) => (v < 0 ? '−' : '+');
  const abs = Math.abs;

  // Ecuación con colores: y = m·x + n
  function eqHtml(m, n, { big = false } = {}) {
    const mTxt = m === 1 ? '' : m === -1 ? '−' : f(m);
    const xPart = m === 0 ? '' : `<span class="t-m">${mTxt}</span><span class="t-x">x</span>`;
    const nPart = n === 0 ? (m === 0 ? '<span class="t-n">0</span>' : '') : `${m === 0 ? '' : ` ${sgn(n)} `}<span class="t-n">${m === 0 ? f(n) : f(abs(n))}</span>`;
    return `<span class="eq${big ? ' is-big' : ''}"><span class="t-y">y</span> = ${xPart}${nPart}</span>`;
  }

  // Capítulos de la lección, agrupados por bloques (menú lateral y mapa de la portada: chapters.js)
  const INTRO = 'Aprende qué es una función, cómo se dibuja una recta, qué significa cada parte de su ecuación y cómo se relaciona con la <b>proporción directa</b> y la <b>proporción inversa</b>. Son 15 capítulos cortos, con gráficas que puedes mover, animaciones y desafíos con nota al final. Puedes ir en orden o saltar al que quieras desde el menú.';
  const GROUPS = [
    { name: '🚀 Empezar', chapters: [
      { id: 'ln-maquina', title: '¿Qué es una función?', desc: 'La máquina de números: entra x, sale y.' }
    ] },
    { name: '📏 Las funciones', chapters: [
      { id: 'ln-lineal', title: 'Función lineal', desc: 'y = m·x: los lápices y la recta que pasa por el origen.' },
      { id: 'ln-afin', title: 'Función afín', desc: 'y = m·x + n: el taxi y la recta desplazada.' },
      { id: 'ln-partes', title: 'Cada parte de la ecuación', desc: 'Qué significan y, =, m, x, + y n.' }
    ] },
    { name: '🔍 La recta por dentro', chapters: [
      { id: 'ln-pendiente', title: 'La pendiente', desc: 'La escalera: cuánto sube la recta. Con puntos que mueves.' },
      { id: 'ln-ejes', title: 'Cortes con los ejes', desc: 'Dónde cruza el eje y y dónde el eje x, paso a paso.' }
    ] },
    { name: '🧪 Practicar', chapters: [
      { id: 'ln-lab', title: 'Laboratorio', desc: 'Arma tu propia recta con m y n, y mírala dibujarse.' }
    ] },
    { name: '⚖️ Proporciones', chapters: [
      { id: 'ln-directa', title: 'Proporción directa', desc: 'Si una se duplica, la otra también: ¡es una función lineal!' },
      { id: 'ln-inversa', title: 'Proporción inversa', desc: 'Si una se duplica, la otra se reduce a la mitad: la hipérbola.' },
      { id: 'ln-compara', title: 'Comparación', desc: 'Lineal, afín e inversa, lado a lado.' }
    ] },
    { name: '🛠 Herramientas', chapters: [
      { id: 'ln-dospuntos', title: 'Ecuación con dos puntos', desc: 'Encuentra la ecuación en 3 pasos.' },
      { id: 'ln-errores', title: 'Errores comunes', desc: 'Las trampas más típicas y cómo evitarlas.' }
    ] },
    { name: '🏆 Evaluación', chapters: [
      { id: 'ln-tarjetas', title: 'Tarjetas con gráficos', desc: 'Mira el gráfico y descubre: ¿afín o lineal?, ¿pendiente positiva o negativa?…' },
      { id: 'ln-desafios', title: 'Desafíos', desc: 'Preguntas con números nuevos en cada intento, nota y progreso.' }
    ] },
    { name: '📖 Consulta', chapters: [
      { id: 'ln-glosario', title: 'Glosario', desc: 'Todas las palabras importantes, explicadas.' }
    ] }
  ];

  const LESSON_HTML = `
  <section class="card" id="ln-maquina">
    <h2><span class="num">1</span> ¿Qué es una función? La máquina de números</h2>
    <p>Imagina una <b>máquina</b>: tú le metes un número, la máquina sigue siempre la <b>misma regla</b> y te devuelve otro número. Eso es una <b>función</b>.</p>
    <div class="machine">
      <div class="machine-in"><label>Número que entra (<span class="t-x">x</span>)</label><input type="range" id="ln-mx" min="-5" max="5" step="1" value="3"><b id="ln-mx-val" class="t-x">3</b></div>
      <div class="machine-box" id="ln-machine"><div class="machine-ball in" id="ln-ball-in">3</div><div class="machine-rule">Regla: <b>multiplica por 2</b> y <b>suma 1</b></div><div class="machine-gears">⚙️⚙️</div><div class="machine-ball out" id="ln-ball-out">7</div></div>
      <div class="machine-out" id="ln-machine-text"></div>
    </div>
    <div class="tip"><b>Palabras importantes</b>
      <ul>
        <li><span class="t-x"><b>x</b></span> es la <b>entrada</b>. Se llama <b>variable independiente</b> porque <i>tú</i> eliges su valor.</li>
        <li><span class="t-y"><b>y</b></span> es la <b>salida</b>. Se llama <b>variable dependiente</b> porque su valor <i>depende</i> de x.</li>
        <li>A veces se escribe <b>f(x)</b> en vez de y. Se lee "f de x" y significa "lo que sale de la máquina f cuando entra x". Por ejemplo, f(3) = 7.</li>
        <li>Regla de oro: a cada entrada le corresponde <b>una sola</b> salida. Si metes 3, siempre sale 7, nunca otra cosa.</li>
      </ul>
    </div>
  </section>

  <section class="card" id="ln-lineal">
    <h2><span class="num">2</span> La función lineal: <span class="eq"><span class="t-y">y</span> = <span class="t-m">m</span>·<span class="t-x">x</span></span></h2>
    <p><b>Ejemplo:</b> en la librería cada lápiz cuesta <b>$2</b>. Si compras <span class="t-x">x</span> lápices, pagas <span class="t-y">y</span> = <span class="t-m">2</span>·<span class="t-x">x</span> pesos.</p>
    <div class="two-col">
      <table class="vtable" id="ln-tab-lineal"></table>
      <div class="plot-wrap"><canvas id="ln-plot-lineal"></canvas></div>
    </div>
    <div class="btn-row"><button class="lbtn" id="ln-anim-lineal">▶ Ver cómo se forma la recta</button></div>
    <ul class="facts">
      <li>Cada punto de la gráfica es una fila de la tabla: (<span class="t-x">lápices</span>, <span class="t-y">precio</span>).</li>
      <li>Todos los puntos quedan <b>en línea recta</b>: por eso se llama función <b>lineal</b> (de "línea").</li>
      <li>Pasa por el <b>origen (0, 0)</b>: si compras 0 lápices, pagas $0. ¡Toda función lineal pasa por el origen!</li>
      <li>Cada lápiz más, el precio sube <b>siempre lo mismo</b>: $2. Ese "cuánto sube" es la <b>pendiente</b>.</li>
    </ul>
  </section>

  <section class="card" id="ln-afin">
    <h2><span class="num">3</span> La función afín: <span class="eq"><span class="t-y">y</span> = <span class="t-m">m</span>·<span class="t-x">x</span> + <span class="t-n">n</span></span></h2>
    <p><b>Ejemplo:</b> un taxi cobra <b>$3 solo por subirte</b> (aunque no avances nada) y luego <b>$2 por cada kilómetro</b>. Si viajas <span class="t-x">x</span> km pagas <span class="t-y">y</span> = <span class="t-m">2</span>·<span class="t-x">x</span> + <span class="t-n">3</span>.</p>
    <div class="two-col">
      <table class="vtable" id="ln-tab-afin"></table>
      <div class="plot-wrap"><canvas id="ln-plot-afin"></canvas></div>
    </div>
    <div class="btn-row"><button class="lbtn" id="ln-anim-afin">▶ Ver cómo la lineal se convierte en afín</button></div>
    <ul class="facts">
      <li>Es igual que la de los lápices, pero <b>empieza en 3</b>: con 0 km ya pagas $3.</li>
      <li>La recta <b>no pasa por el origen</b>: corta el eje <span class="t-y">y</span> en el punto (0, <span class="t-n">3</span>).</li>
      <li>Es la recta lineal <b>desplazada hacia arriba</b> <span class="t-n">3</span> unidades. Por eso las dos rectas son <b>paralelas</b>: tienen la misma inclinación.</li>
      <li>Una función lineal es una afín con <span class="t-n">n = 0</span>. O sea: toda lineal es afín, pero no toda afín es lineal.</li>
    </ul>
  </section>

  <section class="card" id="ln-partes">
    <h2><span class="num">4</span> ¿Qué significa cada parte de la ecuación?</h2>
    <p>Toca cada parte de la ecuación para ver qué es:</p>
    <div class="eq-parts" id="ln-eq-parts">
      <button data-part="y" class="t-y">y</button><button data-part="eq">=</button><button data-part="m" class="t-m">m</button><button data-part="por">·</button><button data-part="x" class="t-x">x</button><button data-part="mas">+</button><button data-part="n" class="t-n">n</button>
    </div>
    <div class="part-card" id="ln-part-card"></div>
    <div class="eq-example" id="ln-eq-example"></div>
    <div class="tip"><b>Leer una ecuación en voz alta:</b> <span class="eq"><span class="t-y">y</span> = <span class="t-m">2</span><span class="t-x">x</span> + <span class="t-n">3</span></span> se lee "y es igual a dos x más tres" y quiere decir: <i>"para saber y, multiplica x por 2 y después súmale 3"</i>. Ojo: primero se multiplica y después se suma.</div>
  </section>

  <section class="card" id="ln-pendiente">
    <h2><span class="num">5</span> La pendiente <span class="t-m">m</span>: ¿cuánto sube la recta?</h2>
    <p>Piensa en una <b>escalera</b>: desde cualquier punto de la recta, si avanzas <b>1 paso a la derecha</b>, subes <span class="t-m">m</span> pasos (o bajas, si m es negativa).</p>
    <div class="formula-box">pendiente = <span class="frac"><span>lo que sube</span><span>lo que avanza</span></span> &nbsp;⟹&nbsp; <span class="t-m">m</span> = <span class="frac"><span>y₂ − y₁</span><span>x₂ − x₁</span></span></div>
    <p><b>Mueve los puntos</b> <b class="t-y">A</b> y <b class="t-x">B</b> (arrástralos) y mira cómo se calcula la pendiente:</p>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="ln-plot-slope"></canvas></div>
      <div class="steps" id="ln-slope-steps"></div>
    </div>
    <h3>Los cuatro casos de la pendiente</h3>
    <div class="cases">
      <figure><canvas data-case="2"></canvas><figcaption><b class="t-m">m &gt; 0</b>: la recta <b>sube</b> (de izquierda a derecha). Ej: m = 2</figcaption></figure>
      <figure><canvas data-case="-1.5"></canvas><figcaption><b class="t-m">m &lt; 0</b>: la recta <b>baja</b>. Ej: m = −1,5</figcaption></figure>
      <figure><canvas data-case="0"></canvas><figcaption><b class="t-m">m = 0</b>: la recta es <b>horizontal</b>: y no cambia. Ej: y = 2</figcaption></figure>
      <figure><canvas data-case="steep"></canvas><figcaption>Mientras más grande es m (sin importar el signo), más <b>empinada</b>. m = 4 es más empinada que m = 0,5</figcaption></figure>
    </div>
    <div class="tip">Una recta <b>vertical</b> (de arriba abajo) <b>no es función</b>: para una misma x habría muchísimos valores de y, y la máquina solo puede devolver uno.</div>
  </section>

  <section class="card" id="ln-ejes">
    <h2><span class="num">6</span> ¿Dónde corta la recta a los ejes?</h2>
    <p>Mueve <span class="t-m">m</span> y <span class="t-n">n</span> y mira dónde cruza la recta cada eje. Con <b>▶ Encontrar los cortes</b> un punto recorre la recta y se detiene en cada cruce.</p>
    <div class="lab-eq" id="ln-ejes-eq"></div>
    <div class="lab-controls">
      <label><span>Pendiente <b class="t-m">m</b></span><input type="range" id="ln-em" min="-5" max="5" step="0.5" value="1.5"><b id="ln-em-val" class="t-m">1,5</b></label>
      <label><span>Corte <b class="t-n">n</b></span><input type="range" id="ln-en" min="-6" max="6" step="0.5" value="-3"><b id="ln-en-val" class="t-n">-3</b></label>
    </div>
    <div class="btn-row">
      <button class="lbtn" id="ln-ejes-anim">▶ Encontrar los cortes</button>
      <button class="lbtn ghost" id="ln-ejes-random">🎲 Otra recta</button>
    </div>
    <div class="two-col">
      <div>
        <h3>Corte con el eje <span class="t-y">y</span> (ordenada al origen)</h3>
        <p>Es donde <span class="t-x">x = 0</span>. Reemplazando: y = m·0 + n = <span class="t-n">n</span>. Por eso el punto es <b>(0, <span class="t-n">n</span>)</b>. ¡La <span class="t-n">n</span> te dice directo dónde cruza!</p>
        <div class="steps" id="ln-yint-steps"></div>
        <h3>Corte con el eje <span class="t-x">x</span> (raíz o cero)</h3>
        <p>Es donde <span class="t-y">y = 0</span>. Hay que resolver una ecuación:</p>
        <div class="steps" id="ln-root-steps"></div>
        <p class="small">Si m = 0 y n ≠ 0 la recta es horizontal y <b>nunca</b> toca el eje x.</p>
      </div>
      <div class="plot-wrap"><canvas id="ln-plot-ejes"></canvas></div>
    </div>
  </section>

  <section class="card" id="ln-lab">
    <h2><span class="num">7</span> Laboratorio: arma tu propia recta</h2>
    <div class="lab-eq" id="ln-lab-eq"></div>
    <div class="lab-controls">
      <label><span>Pendiente <b class="t-m">m</b></span><input type="range" id="ln-m" min="-5" max="5" step="0.5" value="2"><b id="ln-m-val" class="t-m">2</b></label>
      <label><span>Corte <b class="t-n">n</b></span><input type="range" id="ln-n" min="-6" max="6" step="0.5" value="1"><b id="ln-n-val" class="t-n">1</b></label>
    </div>
    <div class="btn-row">
      <button class="lbtn" id="ln-lab-draw">▶ Dibujar la recta</button>
      <button class="lbtn" id="ln-lab-stairs">🧗 Ver la escalera</button>
      <button class="lbtn" id="ln-lab-random">🎲 Recta al azar</button>
      <label class="chk"><input type="checkbox" id="ln-lab-cuts" checked> Mostrar cortes con los ejes</label>
    </div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="ln-plot-lab"></canvas></div>
      <div>
        <table class="vtable" id="ln-tab-lab"></table>
      </div>
    </div>
    <div class="explain" id="ln-lab-explain"></div>
  </section>

  <section class="card" id="ln-directa">
    <h2><span class="num">8</span> Proporción directa: ¡es una función lineal!</h2>
    <p>Dos cantidades son <b>directamente proporcionales</b> cuando, al <b>dividir</b> una por la otra, <b>siempre</b> da el mismo número. Ese número se llama <b>constante de proporcionalidad</b> (<span class="t-m">k</span>).</p>
    <div class="formula-box"><span class="frac"><span class="t-y">y</span><span class="t-x">x</span></span> = <span class="t-m">k</span> &nbsp;⟺&nbsp; <span class="t-y">y</span> = <span class="t-m">k</span>·<span class="t-x">x</span> &nbsp; ← ¡es la función lineal con <span class="t-m">m = k</span>!</div>
    <p><b>Ejemplo:</b> una bicicleta avanza <b>3 metros por segundo</b>. En <span class="t-x">x</span> segundos recorre <span class="t-y">y</span> = <span class="t-m">3</span><span class="t-x">x</span> metros.</p>
    <div class="two-col">
      <table class="vtable" id="ln-tab-directa"></table>
      <div class="plot-wrap"><canvas id="ln-plot-directa"></canvas></div>
    </div>
    <div class="btn-row"><button class="lbtn" id="ln-anim-doble">▶ Ver qué pasa si duplico el tiempo</button><button class="lbtn ghost" id="ln-toggle-afin-ratio">¿Y si fuera el taxi (afín)?</button></div>
    <ul class="facts">
      <li><b>Si una se duplica, la otra también</b> se duplica. Si una se reduce a la mitad, la otra también.</li>
      <li>La columna <span class="t-y">y</span> ÷ <span class="t-x">x</span> de la tabla da <b>siempre</b> <span class="t-m">3</span>.</li>
      <li>Su gráfica es una <b>recta que pasa por el origen</b>. Por eso: proporción directa = función lineal.</li>
      <li>La función <b>afín</b> (con n ≠ 0) <b>no</b> es proporción directa: prueba el botón del taxi y mira que la división ya no da siempre lo mismo.</li>
    </ul>
  </section>

  <section class="card" id="ln-inversa">
    <h2><span class="num">9</span> Proporción inversa: cuando una sube, la otra baja</h2>
    <p>Dos cantidades son <b>inversamente proporcionales</b> cuando, al <b>multiplicarlas</b>, <b>siempre</b> da el mismo número <span class="t-m">k</span>.</p>
    <div class="formula-box"><span class="t-x">x</span> · <span class="t-y">y</span> = <span class="t-m">k</span> &nbsp;⟺&nbsp; <span class="t-y">y</span> = <span class="frac"><span class="t-m">k</span><span class="t-x">x</span></span></div>
    <p><b>Ejemplo:</b> tienes una pizza de <b>12 trozos</b> para repartir en partes iguales. Si son <span class="t-x">x</span> amigos, a cada uno le tocan <span class="t-y">y</span> = <span class="t-m">12</span> ÷ <span class="t-x">x</span> trozos.</p>
    <div class="lab-controls"><label><span>Total <b class="t-m">k</b></span><input type="range" id="ln-k" min="4" max="24" step="1" value="12"><b id="ln-k-val" class="t-m">12</b></label>
      <label><span>Amigos <b class="t-x">x</b></span><input type="range" id="ln-kx" min="1" max="12" step="0.5" value="3"><b id="ln-kx-val" class="t-x">3</b></label></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="ln-plot-inversa"></canvas></div>
      <div><table class="vtable" id="ln-tab-inversa"></table><div class="explain" id="ln-inv-explain"></div></div>
    </div>
    <div class="btn-row"><button class="lbtn" id="ln-anim-inversa">▶ Mover el punto por la curva</button></div>
    <ul class="facts">
      <li><b>Si una se duplica, la otra se reduce a la mitad.</b> Si una se triplica, la otra queda en un tercio.</li>
      <li>El rectángulo amarillo va del origen al punto: su área es <span class="t-x">x</span>·<span class="t-y">y</span> = <span class="t-m">k</span>. ¡Cambia de forma pero <b>siempre tiene la misma área</b>!</li>
      <li>Su gráfica <b>no es una recta</b>: es una curva llamada <b>hipérbola</b>. Por eso la proporción inversa <b>no</b> es una función lineal ni afín.</li>
      <li>La curva nunca toca los ejes: x no puede ser 0 (no se puede repartir entre 0 amigos) y y nunca llega a 0.</li>
    </ul>
  </section>

  <section class="card" id="ln-compara">
    <h2><span class="num">10</span> Comparación lado a lado</h2>
    <div class="table-scroll"><table class="compare">
      <thead><tr><th></th><th>Función lineal</th><th>Función afín</th><th>Proporción inversa</th></tr></thead>
      <tbody>
        <tr><th>Ecuación</th><td><span class="t-y">y</span> = <span class="t-m">m</span><span class="t-x">x</span></td><td><span class="t-y">y</span> = <span class="t-m">m</span><span class="t-x">x</span> + <span class="t-n">n</span></td><td><span class="t-y">y</span> = <span class="t-m">k</span> ÷ <span class="t-x">x</span></td></tr>
        <tr><th>Gráfica</th><td>Recta</td><td>Recta</td><td>Curva (hipérbola)</td></tr>
        <tr><th>¿Pasa por (0,0)?</th><td>✅ Sí</td><td>❌ No (corta el eje y en n)</td><td>❌ No toca los ejes</td></tr>
        <tr><th>Lo que no cambia</th><td>y ÷ x = m</td><td>Lo que sube por cada paso (m)</td><td>x · y = k</td></tr>
        <tr><th>Si x se duplica…</th><td>y se duplica</td><td>y aumenta, pero no al doble</td><td>y se reduce a la mitad</td></tr>
        <tr><th>¿Proporción?</th><td>Directa</td><td>Ninguna</td><td>Inversa</td></tr>
        <tr><th>Ejemplo</th><td>Lápices a $2 c/u</td><td>Taxi: $3 + $2 por km</td><td>Pizza de 12 trozos entre amigos</td></tr>
      </tbody>
    </table></div>
  </section>

  <section class="card" id="ln-dospuntos">
    <h2><span class="num">11</span> Encontrar la ecuación si conozco dos puntos</h2>
    <p>Si sabes dos puntos por donde pasa la recta, puedes encontrar su ecuación en 3 pasos. Ejemplo con <b class="t-y">A(1, 3)</b> y <b class="t-x">B(3, 7)</b>:</p>
    <ol class="big-steps">
      <li><b>Calcula la pendiente:</b> <span class="t-m">m</span> = (7 − 3) ÷ (3 − 1) = 4 ÷ 2 = <b class="t-m">2</b>. "Por cada paso a la derecha, sube 2".</li>
      <li><b>Calcula n</b> usando uno de los puntos en y = mx + n. Con A(1, 3): 3 = 2·1 + n → 3 = 2 + n → <b class="t-n">n = 1</b>.</li>
      <li><b>Escribe la ecuación:</b> <span class="eq"><span class="t-y">y</span> = <span class="t-m">2</span><span class="t-x">x</span> + <span class="t-n">1</span></span>.</li>
      <li><b>Comprueba</b> con el otro punto: con x = 3 → y = 2·3 + 1 = 7 ✅ ¡Coincide con B!</li>
    </ol>
    <p class="small">En la sección 5 (pendiente) puedes mover A y B: allí se hacen estos mismos pasos con los puntos que elijas.</p>
  </section>

  <section class="card" id="ln-errores">
    <h2><span class="num">12</span> Errores comunes (¡y cómo evitarlos!)</h2>
    <ul class="facts errors">
      <li><b>Confundir m con n.</b> La <span class="t-m">m</span> siempre va <b>pegada a la x</b> (la multiplica). La <span class="t-n">n</span> va <b>sola</b>. En y = 5 + 2x, m = 2 y n = 5 (el orden no importa, importa quién acompaña a x).</li>
      <li><b>Olvidar el signo.</b> En y = −3x + 1 la pendiente es <b>−3</b> (negativa: la recta baja). En y = 2x − 4, n = <b>−4</b>.</li>
      <li><b>Sumar antes de multiplicar.</b> Para x = 3 en y = 2x + 1: primero 2·3 = 6 y después 6 + 1 = 7 (no 2·4).</li>
      <li><b>Pensar que toda recta es proporción directa.</b> Solo las que pasan por (0, 0). El taxi es una recta, pero no es proporción directa.</li>
      <li><b>Pensar que "una sube y la otra baja" siempre es proporción inversa.</b> Una recta con pendiente negativa también baja, pero x·y no da siempre lo mismo.</li>
      <li><b>Restar al revés en la pendiente.</b> Si arriba haces y₂ − y₁, abajo debes hacer x₂ − x₁ (en el mismo orden).</li>
    </ul>
  </section>

  <section class="card" id="ln-tarjetas">
    <h2><span class="num">13</span> Tarjetas con gráficos</h2>
    <p>Aquí practicas <b>interpretando dibujos</b>: cada tarjeta te muestra una gráfica y te pregunta algo (¿es lineal o afín?, ¿la pendiente es positiva o negativa?, ¿dónde corta los ejes?, ¿cuál es la ecuación?…). Las que fallas <b>vuelven a salir más seguido</b>, y un tipo de tarjeta queda <b>dominado ⭐</b> cuando lo aciertas 3 veces seguidas. Toca la gráfica para ver las coordenadas de un punto.</p>
    <div id="ln-cards"></div>
  </section>

  <section class="card" id="ln-desafios">
    <h2><span class="num">14</span> Desafíos</h2>
    <p>Pon a prueba lo que aprendiste. <b>Cada intento trae 10 preguntas distintas</b> (van rotando entre muchas, en otro orden y con números nuevos), así que no sirve memorizar: hay que entender. Algunas traen gráficos para interpretar. Al responder verás la explicación, y al terminar tu <b>nota</b> (de 1,0 a 7,0; con el 60 % se aprueba con 4,0). Todos tus intentos quedan guardados: puedes revisar en qué fallaste y ver en el gráfico cómo vas mejorando.</p>
    <div id="ln-quiz"></div>
  </section>

  <section class="card" id="ln-glosario">
    <h2><span class="num">15</span> Glosario</h2>
    <dl class="glossary">
      <dt>Función</dt><dd>Regla que a cada número de entrada (x) le asigna un solo número de salida (y).</dd>
      <dt>Variable independiente (<span class="t-x">x</span>)</dt><dd>La entrada: el valor que eliges tú.</dd>
      <dt>Variable dependiente (<span class="t-y">y</span>)</dt><dd>La salida: su valor depende de x.</dd>
      <dt>Función lineal</dt><dd>y = m·x. Su gráfica es una recta que pasa por el origen. Es lo mismo que una proporción directa.</dd>
      <dt>Función afín</dt><dd>y = m·x + n. Su gráfica es una recta que corta el eje y en (0, n).</dd>
      <dt>Pendiente (<span class="t-m">m</span>)</dt><dd>Cuánto sube (o baja) y cuando x aumenta 1. También se llama coeficiente de x. Mide qué tan inclinada está la recta.</dd>
      <dt>Ordenada al origen (<span class="t-n">n</span>)</dt><dd>Donde la recta corta el eje y. También se llama coeficiente de posición o intercepto.</dd>
      <dt>Raíz o cero</dt><dd>Donde la recta corta el eje x (cuando y = 0). Se calcula como x = −n ÷ m.</dd>
      <dt>Origen</dt><dd>El punto (0, 0), donde se cruzan los ejes.</dd>
      <dt>Proporción directa</dt><dd>y ÷ x da siempre lo mismo (k). Si una se duplica, la otra también.</dd>
      <dt>Proporción inversa</dt><dd>x · y da siempre lo mismo (k). Si una se duplica, la otra se reduce a la mitad. Su gráfica es una hipérbola.</dd>
      <dt>Constante de proporcionalidad (<span class="t-m">k</span>)</dt><dd>El número que no cambia en una proporción.</dd>
      <dt>Rectas paralelas</dt><dd>Rectas con la misma pendiente: nunca se cruzan.</dd>
    </dl>
  </section>`;

  const PARTS = {
    y: { name: 'y — la salida (variable dependiente)', text: 'Es el resultado que entrega la función. Su valor depende de lo que valga x. En la gráfica se mide hacia arriba (eje vertical).', ex: 'En el taxi: lo que pagas.' },
    eq: { name: '= — "es igual a"', text: 'Dice que lo de la izquierda (y) vale exactamente lo mismo que el cálculo de la derecha.', ex: 'Lo que pagas es igual a 2·km + 3.' },
    m: { name: 'm — la pendiente', text: 'Es el número que multiplica a x. Dice cuánto sube (si es positiva) o baja (si es negativa) y cada vez que x aumenta 1. Mientras más grande, más empinada la recta. Si es 0, la recta es horizontal.', ex: 'En el taxi: m = 2, cada km más pagas $2 más.' },
    por: { name: '· — multiplicar', text: 'El punto significa "por". m·x es "m por x". Muchas veces se escribe sin el punto: 2x significa 2·x.', ex: '2·5 = 10, así que 5 km cuestan 10 por los kilómetros.' },
    x: { name: 'x — la entrada (variable independiente)', text: 'Es el valor que eliges tú. En la gráfica se mide hacia la derecha (eje horizontal).', ex: 'En el taxi: los kilómetros que viajas.' },
    mas: { name: '+ — sumar', text: 'Después de multiplicar m·x, se suma n. Si n es negativo, en realidad se resta (y = 2x − 4).', ex: 'A lo que cobran por los km, se le suma lo de subirte.' },
    n: { name: 'n — la ordenada al origen (coeficiente de posición)', text: 'Es el número que va solo, sin x. Dice dónde corta la recta al eje y: en el punto (0, n). Si n = 0, la recta pasa por el origen y la función es lineal.', ex: 'En el taxi: n = 3, lo que pagas aunque no avances.' }
  };

  // ----- Desafíos: cada plantilla arma una pregunta con números nuevos en cada intento (ver quiz.js) -----
  const N = (v) => (v < 0 ? `−${-v}` : String(v));             // número con signo menos tipográfico
  const P = (v) => (v < 0 ? `(${N(v)})` : String(v));          // entre paréntesis si es negativo
  const eqTxt = (m, n) => {                                     // "y = 3x − 2"
    const mx = m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '−x' : `${N(m)}x`;
    if (!mx) return `y = ${N(n)}`;
    return n === 0 ? `y = ${mx}` : `y = ${mx} ${n < 0 ? '−' : '+'} ${Math.abs(n)}`;
  };
  const QUIZ_TEMPLATES = [
    { topic: 'Pendiente en la ecuación', make(r) {
      const m = r.nz(-9, 9), n = r.nz(-9, 9);
      return { q: `En <b>${eqTxt(m, n)}</b>, ¿cuál es la pendiente?`, correct: N(m), wrong: [N(n), N(m + n), N(-m)],
        why: `La pendiente es el número que multiplica a x: ${N(m)}. El ${N(n)} que va solo es n (dónde corta el eje y).` };
    } },
    { topic: 'Corte con el eje y', make(r) {
      const m = r.nz(-6, 6), n = r.nz(-9, 9);
      return { q: `¿En qué punto corta la recta <b>${eqTxt(m, n)}</b> al eje y?`, correct: `(0, ${N(n)})`, wrong: [`(${N(n)}, 0)`, `(0, ${N(m)})`, `(${N(m)}, ${N(n)})`],
        why: `Al eje y se llega con x = 0: y = ${N(m)}·0 ${n < 0 ? '−' : '+'} ${Math.abs(n)} = ${N(n)}. El punto es (0, ${N(n)}).` };
    } },
    { topic: 'Proporción directa', make(r) {
      const k = r.int(2, 9), c = r.nz(1, 9);
      return { q: '¿Cuál de estas funciones es una <b>proporción directa</b>?', correct: `y = ${k}x`, wrong: [`y = ${k}x + ${c}`, `y = ${k * 6} ÷ x`, `y = ${c}`],
        why: `Solo y = ${k}x pasa por el origen: y ÷ x da siempre ${k}. La afín (con + ${c}) no pasa por (0, 0) y y = ${k * 6} ÷ x es proporción inversa.` };
    } },
    { topic: 'Signo de la pendiente', make(r) {
      const kind = r.pick(['sube', 'baja', 'baja', 'sube', 'horizontal']);
      const m = kind === 'sube' ? r.int(1, 7) : kind === 'baja' ? -r.int(1, 7) : 0;
      const n = r.int(-5, 5);
      const right = { sube: 'Sube (de izquierda a derecha)', baja: 'Baja (de izquierda a derecha)', horizontal: 'Es horizontal' }[kind];
      return { q: `¿Cómo es la recta <b>${eqTxt(m, n)}</b>?`, correct: right,
        wrong: ['Sube (de izquierda a derecha)', 'Baja (de izquierda a derecha)', 'Es horizontal', 'Es vertical'].filter(x => x !== right),
        why: m > 0 ? `La pendiente ${N(m)} es positiva: cada paso a la derecha, sube ${m}.` : m < 0 ? `La pendiente ${N(m)} es negativa: cada paso a la derecha, baja ${-m}.` : 'No hay x (la pendiente es 0): y vale siempre lo mismo, así que es horizontal.' };
    } },
    { topic: 'Calcular y para un x', make(r) {
      const m = r.nz(-6, 6), n = r.nz(-9, 9), x = r.nz(-5, 6);
      const y = m * x + n;
      return { q: `Si <b>${eqTxt(m, n)}</b>, ¿cuánto vale y cuando x = ${N(x)}?`, correct: N(y), wrong: [N(m * (x + n)), N(m * x - n), N(m + x + n)],
        why: `Primero multiplicas: ${N(m)}·${P(x)} = ${N(m * x)}. Después ${n < 0 ? 'restas' : 'sumas'} ${Math.abs(n)}: ${N(m * x)} ${n < 0 ? '−' : '+'} ${Math.abs(n)} = ${N(y)}.` };
    } },
    { topic: 'Pendiente con dos puntos', make(r) {
      const m = r.nz(-5, 5), x1 = r.int(-4, 3), dx = r.int(1, 4), y1 = r.int(-6, 6);
      const x2 = x1 + dx, y2 = y1 + m * dx;
      return { q: `Una recta pasa por <b>(${N(x1)}, ${N(y1)})</b> y <b>(${N(x2)}, ${N(y2)})</b>. ¿Cuál es su pendiente?`, correct: N(m), wrong: [N(m * dx), N(-m), N(dx), N(y2 - y1 + 1)],
        why: `m = (${N(y2)} − ${P(y1)}) ÷ (${N(x2)} − ${P(x1)}) = ${N(y2 - y1)} ÷ ${dx} = ${N(m)}.` };
    } },
    { topic: 'Proporción inversa', make(r) {
      const w = r.int(2, 6), d = r.pick([4, 6, 8, 12]), f = r.pick([2, 2, 3, 4]);
      if ((d % f) !== 0) return this.make(r);
      return { q: `${w} obreros pintan una casa en ${d} días. Si son ${w * f} obreros (${f === 2 ? 'el doble' : f === 3 ? 'el triple' : 'cuatro veces más'}), ¿cuántos días tardan?`, correct: `${d / f} días`,
        wrong: [`${d * f} días`, `${d} días`, `${d - f} días`],
        why: `Es proporción inversa: obreros · días = ${w}·${d} = ${w * d}, y eso no cambia. Con ${w * f} obreros: ${w * d} ÷ ${w * f} = ${d / f} días.` };
    } },
    { topic: 'Corte con el eje x (raíz)', make(r) {
      const m = r.nz(-5, 5), root = r.nz(-6, 6), n = -m * root;
      return { q: `¿Dónde corta el eje x la recta <b>${eqTxt(m, n)}</b>?`, correct: `x = ${N(root)}`, wrong: [`x = ${N(-root)}`, `x = ${N(n)}`, `x = ${N(m)}`],
        why: `Con y = 0: 0 = ${N(m)}x ${n < 0 ? '−' : '+'} ${Math.abs(n)} → ${N(-n)} = ${N(m)}x → x = ${N(-n)} ÷ ${P(m)} = ${N(root)}.` };
    } },
    { topic: 'Rectas paralelas', make(r) {
      const m = r.nz(-6, 6), n = r.nz(-8, 8);
      let c = r.nz(-8, 8); if (c === n) c = n + 3;
      return { q: `¿Cuál de estas rectas es <b>paralela</b> a <b>${eqTxt(m, n)}</b>?`, correct: eqTxt(m, c), wrong: [eqTxt(n, m), eqTxt(-m, n), eqTxt(m + 2, n)],
        why: `Las rectas paralelas tienen la misma pendiente (${N(m)}) y distinto corte con el eje y: ${eqTxt(m, c)}.` };
    } },
    { topic: 'Problema de proporción directa', make(r) {
      const price = r.int(2, 9) * 100, a = r.int(2, 4), b = r.int(5, 9);
      return { q: `${a} kg de manzanas cuestan $${(price * a).toLocaleString('es-CL')}. Si el precio por kilo es siempre el mismo, ¿cuánto cuestan ${b} kg?`, correct: `$${(price * b).toLocaleString('es-CL')}`,
        wrong: [`$${(price * a + b * 100).toLocaleString('es-CL')}`, `$${(price * (a + b)).toLocaleString('es-CL')}`, `$${Math.round(price * a * a / b).toLocaleString('es-CL')}`],
        why: `Es proporción directa: 1 kg cuesta $${(price * a).toLocaleString('es-CL')} ÷ ${a} = $${price.toLocaleString('es-CL')} (eso es k). Entonces ${b} kg cuestan ${b} · $${price.toLocaleString('es-CL')} = $${(price * b).toLocaleString('es-CL')}.` };
    } }
  ];

  // A cada tema de las 10 preguntas originales se le asigna el capítulo donde se explica (el link "ir a la lección")
  const CH_ORIGINAL = {
    'Pendiente en la ecuación': 'ln-partes', 'Corte con el eje y': 'ln-ejes', 'Proporción directa': 'ln-directa', 'Signo de la pendiente': 'ln-pendiente',
    'Calcular y para un x': 'ln-afin', 'Pendiente con dos puntos': 'ln-pendiente', 'Proporción inversa': 'ln-inversa', 'Corte con el eje x (raíz)': 'ln-ejes',
    'Rectas paralelas': 'ln-pendiente', 'Problema de proporción directa': 'ln-directa'
  };
  QUIZ_TEMPLATES.forEach(t => { t.chapter = CH_ORIGINAL[t.topic]; });

  const money = (v) => `$${v.toLocaleString('es-CL')}`;

  // Más problemas de comprensión (historias con números nuevos): se suman a las 10 de arriba y rotan entre intentos
  QUIZ_TEMPLATES.push(
    { topic: 'Problema del taxi', chapter: 'ln-afin', make(r) {
      const b = r.int(2, 6) * 100, c = r.int(2, 5) * 100, k = r.int(3, 9);
      return { q: `Un taxi cobra <b>${money(b)}</b> por subirte y <b>${money(c)}</b> por cada kilómetro. ¿Cuánto pagas por un viaje de <b>${k} km</b>?`,
        correct: money(b + c * k), wrong: [money((b + c) * k), money(c * k), money(b * k + c)],
        why: `Los kilómetros se multiplican: ${c}·${k} = ${c * k}. La bajada se suma una sola vez: ${c * k} + ${b} = ${b + c * k}. Es una función afín: y = ${c}x + ${b}.` };
    } },
    { topic: 'Armar la ecuación de un problema', chapter: 'ln-afin', make(r) {
      const M = r.int(2, 9) * 1000, c = r.int(2, 9) * 500;
      return { q: `Un gimnasio cobra <b>${money(M)}</b> de matrícula (una sola vez) y <b>${money(c)}</b> por cada mes. ¿Qué ecuación da lo que pagas (y) después de x meses?`,
        correct: `y = ${c}x + ${M}`, wrong: [`y = ${M}x + ${c}`, `y = ${c + M}x`, `y = ${c}x`],
        why: `Lo que se repite cada mes va multiplicando a x (m = ${c}); la matrícula se paga una sola vez, así que va sumada y sola (n = ${M}).` };
    } },
    { topic: 'Significado de n en un problema', chapter: 'ln-partes', make(r) {
      const ctx = r.pick([
        { who: 'un taxi', x: 'kilómetros', fixed: 'la bajada (lo que cobran apenas te subes)', unit: 'cada kilómetro' },
        { who: 'un gimnasio', x: 'meses', fixed: 'la matrícula (se paga una sola vez)', unit: 'cada mes' },
        { who: 'un plan de internet', x: 'GB', fixed: 'el cargo fijo mensual', unit: 'cada GB extra' }
      ]);
      const c = r.int(2, 9) * 100, n = r.int(2, 9) * 1000;
      return { q: `Con ${ctx.who}, lo que pagas es <b>y = ${c}x + ${n}</b>, donde x son los ${ctx.x}. ¿Qué significa el <b>${n}</b>?`,
        correct: `Lo que pagas aunque x sea 0: ${ctx.fixed}`, wrong: [`Lo que cuesta ${ctx.unit}`, `La cantidad de ${ctx.x}`, 'El total que pagas al final'],
        why: `El número que va solo (n) es el valor de y cuando x = 0: el cobro fijo. Lo que se repite ${ctx.unit} es el ${c}, que multiplica a x.` };
    } },
    { topic: 'Significado de m en un problema', chapter: 'ln-pendiente', make(r) {
      const ctx = r.pick([
        { x: 'minutos de llamada', per: 'cada minuto de llamada' },
        { x: 'kilos de pan', per: 'cada kilo de pan' },
        { x: 'horas de arriendo de una bici', per: 'cada hora de arriendo' }
      ]);
      const c = r.int(2, 9) * 100, n = r.int(1, 5) * 500;
      return { q: `El costo es <b>y = ${c}x + ${n}</b>, con x = ${ctx.x}. ¿Qué significa el <b>${c}</b>?`,
        correct: `Lo que aumenta el costo por ${ctx.per}`, wrong: [`Lo que pagas aunque x sea 0`, `El costo total`, `Cuántos ${ctx.x} hay que comprar`],
        why: `El número que multiplica a x es la pendiente: cuánto sube y cada vez que x aumenta 1. Aquí, ${money(c)} más por ${ctx.per}.` };
    } },
    { topic: 'Ecuación con un punto y la pendiente', chapter: 'ln-dospuntos', make(r) {
      const m = r.nz(-4, 4), n = r.nz(-6, 6), x1 = r.int(1, 4), y1 = m * x1 + n;
      return { q: `Una recta tiene pendiente <b>${N(m)}</b> y pasa por el punto <b>(${x1}, ${N(y1)})</b>. ¿Cuál es su ecuación?`,
        correct: eqTxt(m, n), wrong: [eqTxt(m, y1), eqTxt(m, -n), eqTxt(n, m)],
        why: `Usa y = ${N(m)}x + n con el punto: ${N(y1)} = ${N(m)}·${x1} + n → ${N(y1)} = ${N(m * x1)} + n → n = ${N(n)}. La ecuación es ${eqTxt(m, n)}.` };
    } },
    { topic: '¿Qué tipo de función muestra la tabla?', chapter: 'ln-compara', make(r) {
      const kind = r.pick(['directa', 'afin', 'inversa']);
      let xs = [1, 2, 3, 4], ys;
      if (kind === 'directa') { const m = r.int(2, 9); ys = xs.map(x => m * x); }
      else if (kind === 'afin') { const m = r.int(2, 6), n = r.int(1, 7); ys = xs.map(x => m * x + n); }
      else { xs = [1, 2, 3, 6]; const k = 6 * r.int(1, 5); ys = xs.map(x => k / x); }
      const right = { directa: 'Proporción directa (lineal)', afin: 'Función afín (recta, pero no es proporción)', inversa: 'Proporción inversa' }[kind];
      return { q: `En una tabla, x = ${xs.join(', ')} y entonces y = ${ys.join(', ')}. ¿Qué tipo de relación es?`, correct: right,
        wrong: Object.values({ directa: 'Proporción directa (lineal)', afin: 'Función afín (recta, pero no es proporción)', inversa: 'Proporción inversa' }).filter(v => v !== right),
        why: kind === 'directa' ? 'y ÷ x da siempre el mismo número: es proporción directa.' : kind === 'afin' ? 'y sube siempre lo mismo cuando x sube 1, pero y ÷ x cambia: es afín.' : 'x · y da siempre lo mismo (y baja cuando x sube): es proporción inversa.' };
    } },
    { topic: 'Problema de velocidad y tiempo', chapter: 'ln-inversa', make(r) {
      const D = r.pick([120, 180, 240, 360]);
      const divs = [20, 30, 40, 45, 60, 80, 90, 120].filter(d => D % d === 0);
      const v1 = r.pick(divs); let v2 = r.pick(divs); if (v2 === v1) v2 = divs.find(d => d !== v1);
      const t1 = D / v1, t2 = D / v2;
      return { q: `Un auto va a <b>${v1} km/h</b> y tarda <b>${f(t1, 1)} horas</b> en llegar. ¿Cuánto tarda si va a <b>${v2} km/h</b>?`, correct: `${f(t2, 1)} horas`,
        wrong: [`${f(t1 * v2 / v1, 1)} horas`, `${f(t1 + (v2 - v1) / 10, 1)} horas`, `${f(t2 + 1, 1)} horas`],
        why: `Más rapidez, menos tiempo: es proporción inversa. La distancia no cambia: ${v1}·${f(t1, 1)} = ${D} km. Entonces ${D} ÷ ${v2} = ${f(t2, 1)} horas.` };
    } },
    { topic: 'Litros por minuto (pendiente)', chapter: 'ln-pendiente', make(r) {
      const rate = r.int(3, 9), t1 = r.int(1, 3), t2 = t1 + r.int(2, 4), L0 = r.int(1, 4) * 10;
      const L1 = L0 + rate * t1, L2 = L0 + rate * t2;
      return { q: `Una piscina se llena con una manguera. A los ${t1} min hay <b>${L1} L</b> y a los ${t2} min hay <b>${L2} L</b>. ¿Cuántos litros entran por minuto?`, correct: `${rate} L/min`,
        wrong: [`${L2 - L1} L/min`, `${Math.round(L2 / t2)} L/min`, `${rate + 2} L/min`],
        why: `Es la pendiente: (${L2} − ${L1}) ÷ (${t2} − ${t1}) = ${L2 - L1} ÷ ${t2 - t1} = ${rate} L por minuto.` };
    } },
    { topic: 'Despejar x en un problema', chapter: 'ln-afin', make(r) {
      const h0 = r.int(5, 20), g = r.int(2, 6), w = r.int(3, 9), H = h0 + g * w;
      return { q: `Una planta mide <b>${h0} cm</b> y crece <b>${g} cm</b> por semana. ¿En cuántas semanas mide <b>${H} cm</b>?`, correct: `${w} semanas`,
        wrong: [`${w + 1} semanas`, `${Math.round(H / g)} semanas`, `${H - h0} semanas`],
        why: `y = ${g}x + ${h0}. Con y = ${H}: ${H} = ${g}x + ${h0} → ${H - h0} = ${g}x → x = ${H - h0} ÷ ${g} = ${w} semanas.` };
    } },
    { topic: '¿Cuál sube más rápido?', chapter: 'ln-pendiente', make(r) {
      const m1 = r.int(1, 6); let m2 = r.int(1, 6); if (m2 === m1) m2 = m1 + 2;
      const n1 = r.int(-5, 5), n2 = r.int(-5, 5);
      return { q: `Recta A: <b>${eqTxt(m1, n1)}</b>. Recta B: <b>${eqTxt(m2, n2)}</b>. ¿Cuál sube más rápido?`, correct: m1 > m2 ? 'La recta A' : 'La recta B',
        wrong: [m1 > m2 ? 'La recta B' : 'La recta A', 'Suben igual de rápido', 'Ninguna sube'],
        why: `Importa la pendiente (el número que multiplica a x): A tiene ${m1} y B tiene ${m2}. Sube más rápido la de mayor pendiente.` };
    } },
    { topic: 'Un punto sobre la recta', chapter: 'ln-lineal', make(r) {
      const m = r.nz(-4, 4), n = r.nz(-6, 6), x0 = r.nz(-4, 4), y0 = m * x0 + n;
      return { q: `¿Cuál de estos puntos está sobre la recta <b>${eqTxt(m, n)}</b>?`, correct: `(${N(x0)}, ${N(y0)})`,
        wrong: [`(${N(x0)}, ${N(y0 + 1)})`, `(${N(y0)}, ${N(x0)})`, `(${N(x0)}, ${N(m * x0 - n)})`],
        why: `Reemplaza x = ${N(x0)}: y = ${N(m)}·${P(x0)} ${n < 0 ? '−' : '+'} ${Math.abs(n)} = ${N(y0)}. Solo (${N(x0)}, ${N(y0)}) cumple la ecuación.` };
    } },
    { topic: 'Planes: ¿cuál conviene?', chapter: 'ln-compara', make(r) {
      const fixed = r.int(3, 6) * 1000, c = r.int(2, 4) * 500, d = r.int(5, 9) * 500, g = r.int(2, 9);
      const A = fixed + c * g, B = d * g;
      if (A === B) return this.make(r);
      return { q: `Plan A: <b>${money(fixed)}</b> fijos + <b>${money(c)}</b> por GB. Plan B: <b>${money(d)}</b> por GB, sin cargo fijo. Si usarás <b>${g} GB</b>, ¿cuál es más barato?`,
        correct: A < B ? 'El plan A' : 'El plan B', wrong: [A < B ? 'El plan B' : 'El plan A', 'Cuestan lo mismo', 'No se puede saber'],
        why: `Plan A: ${money(fixed)} + ${c}·${g} = ${money(A)}. Plan B (lineal): ${d}·${g} = ${money(B)}. Es más barato el ${A < B ? 'A' : 'B'}.` };
    } },
    { topic: 'Proporción directa con 0', chapter: 'ln-lineal', make(r) {
      const p = r.int(2, 9) * 50;
      return { q: `Los lápices cuestan <b>y = ${p}x</b> pesos (x = cantidad). ¿Cuánto cuesta no comprar ninguno (x = 0) y qué tipo de función es?`, correct: '$0 · es lineal (proporción directa)',
        wrong: [`${money(p)} · es afín`, '$0 · es afín', `${money(p)} · es lineal (proporción directa)`],
        why: `Con x = 0: y = ${p}·0 = 0. Como no hay número sumado (n = 0), la recta pasa por el origen: es lineal.` };
    } },
    { topic: 'Reparto (proporción inversa)', chapter: 'ln-inversa', make(r) {
      const T = r.pick([24, 36, 48, 60]);
      const divs = [2, 3, 4, 6, 8, 12].filter(d => T % d === 0);
      const p = r.pick(divs); let q = r.pick(divs); if (q === p) q = divs.find(d => d !== p);
      return { q: `Se reparten <b>${T} caramelos</b> en partes iguales entre <b>${p} amigos</b> (${T / p} cada uno). Si en vez de ${p} fueran <b>${q} amigos</b>, ¿cuántos le tocan a cada uno?`, correct: String(T / q),
        wrong: [String(T / p), String(T / q + 2), String(T - q)],
        why: `Más amigos, menos para cada uno: x·y = ${T} siempre. Con ${q} amigos: ${T} ÷ ${q} = ${T / q}.` };
    } },
    { topic: 'Rapidez constante (proporción directa)', chapter: 'ln-directa', make(r) {
      const v = r.int(3, 9), t1 = r.int(2, 5), mult = r.int(2, 4), T = t1 * mult;
      return { q: `Una ciclista recorre <b>${v * t1} m</b> en <b>${t1} s</b> con rapidez constante. ¿Cuántos metros recorre en <b>${T} s</b>?`, correct: `${v * T} m`,
        wrong: [`${v * t1 + T} m`, `${v * t1 * T} m`, `${v * (T - 1)} m`],
        why: `Es proporción directa: ${v * t1} ÷ ${t1} = ${v} m por segundo (k). En ${T} s: ${v}·${T} = ${v * T} m.` };
    } },
    { topic: 'Recta que baja en un problema', chapter: 'ln-pendiente', make(r) {
      const g = r.int(2, 9);
      return { q: `Un celular tiene <b>100 %</b> de batería y gasta <b>${g} %</b> cada hora. ¿Qué ecuación da la batería y después de x horas?`, correct: eqTxt(-g, 100),
        wrong: [eqTxt(g, 100), eqTxt(-g, 0), eqTxt(100, -g)],
        why: `Parte de 100 (n = 100) y baja ${g} por hora, así que la pendiente es negativa (m = −${g}): ${eqTxt(-g, 100)}.` };
    } }
  );

  // ----- Tarjetas con gráficos (la parte matemática se interpreta mirando el dibujo) -----
  const GV = { xMin: -6, xMax: 6, yMin: -10, yMax: 10, aspect: 1, step: 1 };
  const lineGraph = (m, n, extra) => ({ view: GV, draw(p) { p.grid(); p.axes(); p.fn(x => m * x + n, C.line); if (extra) extra(p); } });
  const hyper = (p, k, color = C.inv) => { p.fn(x => k / x, color, { xFrom: 0.03, width: 3.5 }); p.fn(x => k / x, color, { xTo: -0.03, width: 3.5 }); };

  const CARD_TEMPLATES = [
    { topic: 'Signo de la pendiente (gráfico)', chapter: 'ln-pendiente', visual: true, make(r) {
      const kind = r.pick(['sube', 'baja', 'horizontal']);
      const m = kind === 'sube' ? r.int(1, 3) : kind === 'baja' ? -r.int(1, 3) : 0, n = r.int(-4, 4);
      const right = { sube: 'Positiva: la recta sube', baja: 'Negativa: la recta baja', horizontal: 'Cero: la recta es horizontal' }[kind];
      return { q: 'Mira la recta. ¿Cómo es su <b>pendiente</b>?', graph: lineGraph(m, n), correct: right,
        wrong: ['Positiva: la recta sube', 'Negativa: la recta baja', 'Cero: la recta es horizontal'].filter(v => v !== right),
        why: m > 0 ? 'De izquierda a derecha la recta sube, así que la pendiente es positiva.' : m < 0 ? 'De izquierda a derecha la recta baja, así que la pendiente es negativa.' : 'La recta no sube ni baja: es horizontal y su pendiente es 0.' };
    } },
    { topic: '¿Lineal, afín o inversa? (gráfico)', chapter: 'ln-compara', visual: true, make(r) {
      const kind = r.pick(['lineal', 'afin', 'inversa']);
      const m = r.nz(-2, 2), n = r.nz(-5, 5), k = r.nz(-6, 6);
      const opts = { lineal: 'Función lineal (recta por el origen)', afin: 'Función afín (recta que no pasa por el origen)', inversa: 'Proporción inversa (hipérbola)' };
      const graph = kind === 'inversa' ? { view: GV, draw(p) { p.grid(); p.axes(); hyper(p, k); } } : lineGraph(m, kind === 'lineal' ? 0 : n);
      return { q: '¿Qué tipo de relación dibuja este gráfico?', graph, correct: opts[kind], wrong: Object.values(opts).filter(v => v !== opts[kind]),
        why: kind === 'lineal' ? 'Es una recta que pasa por el origen (0, 0): función lineal, o proporción directa.' : kind === 'afin' ? `Es una recta, pero corta el eje y en (0, ${N(n)}), no en el origen: función afín.` : 'No es una recta sino una curva con dos ramas que no toca los ejes: es una hipérbola, la gráfica de la proporción inversa.' };
    } },
    { topic: 'Pendiente desde el gráfico', chapter: 'ln-pendiente', visual: true, make(r) {
      const m = r.nz(-2, 2), n = r.int(-3, 3), a = r.int(-3, 0), dx = r.int(1, 3), b = a + dx;
      const ya = m * a + n, yb = m * b + n;
      return { q: `La recta pasa por <b>A(${N(a)}, ${N(ya)})</b> y <b>B(${N(b)}, ${N(yb)})</b>. ¿Cuál es su pendiente?`,
        graph: lineGraph(m, n, p => { p.point(a, ya, C.y, 'A'); p.point(b, yb, C.x, 'B'); }),
        correct: N(m), wrong: [N(-m), N(m * dx), N(m + 1)],
        why: `m = (${N(yb)} − ${P(ya)}) ÷ (${N(b)} − ${P(a)}) = ${N(yb - ya)} ÷ ${dx} = ${N(m)}. Mirando el gráfico: por cada paso a la derecha, la recta ${m > 0 ? 'sube' : 'baja'} ${abs(m)}.` };
    } },
    { topic: 'Corte con el eje y (gráfico)', chapter: 'ln-ejes', visual: true, make(r) {
      const m = r.nz(-2, 2), n = r.nz(-5, 5);
      return { q: '¿En qué punto corta esta recta al <b>eje y</b> (el eje vertical)?', graph: lineGraph(m, n), correct: `(0, ${N(n)})`,
        wrong: [`(${N(n)}, 0)`, `(0, ${N(-n)})`, `(0, ${N(m)})`],
        why: `Donde la recta cruza el eje vertical x vale 0 y y vale ${N(n)}: el punto es (0, ${N(n)}). Ese número es la n de y = mx + n.` };
    } },
    { topic: 'Ecuación desde el gráfico', chapter: 'ln-dospuntos', visual: true, make(r) {
      const m = r.nz(-2, 2), n = r.nz(-5, 5);
      return { q: '¿Cuál es la <b>ecuación</b> de esta recta?', graph: lineGraph(m, n), correct: eqTxt(m, n),
        wrong: [eqTxt(-m, n), eqTxt(m, -n), eqTxt(n, m)],
        why: `Corta el eje y en (0, ${N(n)}), así que n = ${N(n)}. Y ${m > 0 ? 'sube' : 'baja'} ${abs(m)} por cada paso a la derecha: m = ${N(m)}. Ecuación: ${eqTxt(m, n)}.` };
    } },
    { topic: 'Corte con el eje x (gráfico)', chapter: 'ln-ejes', visual: true, make(r) {
      const m = r.nz(-2, 2), root = r.nz(-4, 4), n = -m * root;
      return { q: '¿En qué valor de <b>x</b> corta esta recta al eje horizontal (la raíz)?', graph: lineGraph(m, n), correct: `x = ${N(root)}`,
        wrong: [`x = ${N(-root)}`, `x = ${N(n)}`, `x = ${N(m)}`],
        why: `En el eje horizontal y vale 0. La recta lo cruza en x = ${N(root)}, es decir, en el punto (${N(root)}, 0).` };
    } },
    { topic: 'Comparar pendientes (gráfico)', chapter: 'ln-pendiente', visual: true, make(r) {
      const same = r.chance(0.25);
      const m1 = r.int(1, 3); let m2 = same ? m1 : r.int(1, 3); if (!same && m2 === m1) m2 = m1 === 3 ? 1 : m1 + 1;
      const n1 = r.int(-4, 0), n2 = same ? n1 + r.pick([-3, 3]) : r.int(0, 4);
      const right = same ? 'Tienen la misma pendiente' : m1 > m2 ? 'La recta violeta' : 'La recta naranja';
      return { q: 'Hay dos rectas, una <b style="color:#6C63FF">violeta</b> y una <b style="color:#FFA751">naranja</b>. ¿Cuál tiene <b>mayor pendiente</b>?',
        graph: { view: GV, draw(p) { p.grid(); p.axes(); p.fn(x => m1 * x + n1, C.line); p.fn(x => m2 * x + n2, C.y); } },
        correct: right, wrong: ['La recta violeta', 'La recta naranja', 'Tienen la misma pendiente'].filter(v => v !== right),
        why: same ? 'Las dos rectas suben igual de inclinadas (son paralelas): tienen la misma pendiente.' : `La más inclinada es la ${m1 > m2 ? 'violeta' : 'naranja'}: avanza lo mismo hacia la derecha pero sube más.` };
    } },
    { topic: 'Leer y en el gráfico', chapter: 'ln-lineal', visual: true, make(r) {
      const m = r.nz(-2, 2), n = r.int(-3, 3), x0 = r.int(1, 3), y0 = m * x0 + n;
      return { q: `Mira el punto marcado sobre la recta. ¿Cuánto vale <b>y</b> cuando <b>x = ${x0}</b>?`,
        graph: lineGraph(m, n, p => { p.segment(x0, 0, x0, y0, 'rgba(255,255,255,0.5)', 1.5, [4, 4]); p.point(x0, y0, C.m); }),
        correct: N(y0), wrong: [N(-y0), N(x0), N(y0 + 1)],
        why: `Subes (o bajas) desde x = ${x0} hasta la recta y lees la altura en el eje vertical: y = ${N(y0)}.` };
    } },
    { topic: 'Hipérbola: signo de k (gráfico)', chapter: 'ln-inversa', visual: true, make(r) {
      const k = r.nz(-6, 6);
      const right = k > 0 ? 'k es positivo (ramas en los cuadrantes 1 y 3)' : 'k es negativo (ramas en los cuadrantes 2 y 4)';
      return { q: 'Este gráfico es de la proporción inversa <b>y = k ÷ x</b>. ¿Cómo es k?', graph: { view: GV, draw(p) { p.grid(); p.axes(); hyper(p, k); } },
        correct: right, wrong: ['k es positivo (ramas en los cuadrantes 1 y 3)', 'k es negativo (ramas en los cuadrantes 2 y 4)', 'k es cero'].filter(v => v !== right),
        why: k > 0 ? 'Las ramas están arriba a la derecha y abajo a la izquierda: x e y tienen el mismo signo, así que k = x·y es positivo.' : 'Las ramas están arriba a la izquierda y abajo a la derecha: x e y tienen signos opuestos, así que k = x·y es negativo.' };
    } },
    { topic: '¿Son paralelas? (gráfico)', chapter: 'ln-pendiente', visual: true, make(r) {
      const par = r.chance(0.5);
      const m1 = r.nz(-2, 2), n1 = r.int(-4, -1), n2 = r.int(1, 4);
      const m2 = par ? m1 : -m1;
      const right = par ? 'Sí, son paralelas' : 'No, se cruzan';
      return { q: '¿Estas dos rectas son <b>paralelas</b>?', graph: { view: GV, draw(p) { p.grid(); p.axes(); p.fn(x => m1 * x + n1, C.line); p.fn(x => m2 * x + n2, C.y); } },
        correct: right, wrong: ['Sí, son paralelas', 'No, se cruzan', 'Son la misma recta'].filter(v => v !== right),
        why: par ? 'Las dos suben (o bajan) igual: misma pendiente y distinto corte con el eje y. Nunca se cruzan.' : 'Tienen pendientes distintas (una sube y la otra baja), así que en algún punto se cruzan.' };
    } },
    { topic: 'Gráfico de un taxi', chapter: 'ln-afin', visual: true, make(r) {
      const n = r.int(1, 4), m = r.int(1, 3), ask = r.pick(['bajada', 'km']);
      return { q: ask === 'bajada' ? 'Este gráfico muestra lo que cobra un taxi (y, en miles de pesos) según los kilómetros (x). ¿Cuánto cobra solo por <b>subirte</b> (0 km)?' : 'Este gráfico muestra lo que cobra un taxi (y, en miles de pesos) según los kilómetros (x). ¿Cuánto <b>aumenta el cobro por cada km</b>?',
        graph: { view: { xMin: -0.5, xMax: 7, yMin: -1, yMax: 16, aspect: 0.8, step: 1 }, draw(p) { p.grid(); p.axes({ x: 'km', y: 'miles $' }); p.fn(x => m * x + n, C.afin, { xFrom: 0, xTo: 7 }); p.point(0, n, C.y); p.point(1, m + n, C.x); } },
        correct: ask === 'bajada' ? `${n} mil pesos` : `${m} mil pesos`,
        wrong: ask === 'bajada' ? [`${m} mil pesos`, `${n + m} mil pesos`, '0 pesos'] : [`${n} mil pesos`, `${n + m} mil pesos`, `${m + 1} mil pesos`],
        why: ask === 'bajada' ? `La recta parte en (0, ${n}): ese es el cobro fijo (n = ${n}).` : `Del km 0 al km 1 la recta sube de ${n} a ${n + m}: aumenta ${m} por cada km (la pendiente).` };
    } }
  ];
  QUIZ_TEMPLATES.push(...CARD_TEMPLATES);

  const state = { m: 2, n: 1, em: 1.5, en: -3, k: 12, kx: 3, A: { x: 1, y: 3 }, B: { x: 3, y: 7 } };
  let quiz = null;
  let cards = null;
  let nav = null;      // capítulos (chapters.js)
  let pending = null;  // estado guardado que llegó antes de abrir la lección
  let plots = {};
  let stop = {}; // animaciones en curso

  function cancel(name) { if (stop[name]) { stop[name](); stop[name] = null; } }

  // ----- 1. Máquina -----
  function renderMachine(root, animate = true) {
    const x = Number(root.querySelector('#ln-mx').value);
    const y = 2 * x + 1;
    root.querySelector('#ln-mx-val').textContent = x;
    const bin = root.querySelector('#ln-ball-in'), bout = root.querySelector('#ln-ball-out');
    bin.textContent = x;
    bout.textContent = y;
    root.querySelector('#ln-machine-text').innerHTML = `Entra <b class="t-x">${x}</b> → 2 · ${x < 0 ? `(${x})` : x} = ${2 * x} → ${2 * x} + 1 = <b class="t-y">${y}</b>. Se escribe <b>f(${x}) = ${y}</b>.`;
    if (!animate) return;
    const box = root.querySelector('#ln-machine');
    box.classList.remove('is-running');
    void box.offsetWidth;
    box.classList.add('is-running');
  }

  // ----- Tablas -----
  // Une una tabla con su gráfica (plot.js): el punto tocado se pinta en la tabla y la fila tocada se marca
  const linkTable = Plot.linkTable;

  function tableHtml(rows, cols) {
    return `<thead><tr>${cols.map(c => `<th>${c.h}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => `<tr data-row="${i}">${cols.map(c => `<td>${c.v(r)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  }

  // ----- 2 y 3. Lineal y afín -----
  function setupLinealAfin(root) {
    const xs = [0, 1, 2, 3, 4, 5];
    root.querySelector('#ln-tab-lineal').innerHTML = tableHtml(xs, [
      { h: '<span class="t-x">Lápices (x)</span>', v: x => x },
      { h: 'Cálculo', v: x => `2 · ${x}` },
      { h: '<span class="t-y">Precio (y)</span>', v: x => `$${2 * x}` }
    ]);
    root.querySelector('#ln-tab-afin').innerHTML = tableHtml(xs, [
      { h: '<span class="t-x">Km (x)</span>', v: x => x },
      { h: 'Cálculo', v: x => `2 · ${x} + 3` },
      { h: '<span class="t-y">Pago (y)</span>', v: x => `$${2 * x + 3}` }
    ]);
    const pl = new Plot(root.querySelector('#ln-plot-lineal'), { xMin: -1, xMax: 6, yMin: -1, yMax: 14, aspect: 0.8, step: 1 });
    const pa = new Plot(root.querySelector('#ln-plot-afin'), { xMin: -1, xMax: 6, yMin: -1, yMax: 14, aspect: 0.8, step: 1 });
    plots.lineal = pl; plots.afin = pa;
    const drawLineal = (shown = 6, progress = 1) => pl.draw(() => {
      pl.grid(); pl.axes({ x: 'lápices', y: '$' });
      pl.fn(x => 2 * x, C.line, { xFrom: 0, xTo: 5.6, progress });
      xs.slice(0, shown).forEach(x => pl.point(x, 2 * x, C.y, `(${x}, ${2 * x})`));
    });
    const drawAfin = (shift = 3, progress = 1) => pa.draw(() => {
      pa.grid(); pa.axes({ x: 'km', y: '$' });
      pa.fn(x => 2 * x, 'rgba(108,99,255,0.45)', { xFrom: 0, xTo: 5.6, dash: [6, 6] });
      pa.fn(x => 2 * x + shift, C.afin, { xFrom: 0, xTo: 5.6, progress });
      if (shift > 0.1) pa.arrow(0.25, 0.4, 0.25, shift - 0.2, C.n);
      if (shift > 2.9) {
        xs.forEach(x => pa.point(x, 2 * x + 3, C.y, x === 0 ? '(0, 3) ← n' : ''));
        pa.text('y = 2x (lineal)', 4.1, 6.3, 'rgba(160,155,255,0.95)');
        pa.text('y = 2x + 3 (afín)', 2.3, 11.6, C.afin);
      }
    });
    drawLineal(); drawAfin();
    root.querySelector('#ln-anim-lineal').addEventListener('click', () => {
      cancel('lineal');
      stop.lineal = Plot.animate(3200, t => {
        const shown = Math.min(6, Math.floor(t * 9));
        drawLineal(shown, Math.max(0, (t - 0.6) / 0.4));
        root.querySelectorAll('#ln-tab-lineal tbody tr').forEach((tr, i) => tr.classList.toggle('is-lit', i === shown - 1));
      }, () => root.querySelectorAll('#ln-tab-lineal tbody tr').forEach(tr => tr.classList.remove('is-lit')));
    });
    root.querySelector('#ln-anim-afin').addEventListener('click', () => {
      cancel('afin');
      stop.afin = Plot.animate(2600, t => drawAfin(3 * Plot.ease(t)));
    });
  }

  // ----- 4. Partes -----
  // Ejemplo debajo de la ecuación general: al tocar una parte se destaca su valor en el ejemplo
  const EXAMPLES = [
    { m: 2, n: 3, x: 4, what: 'El taxi: $3 por subirte y $2 por cada km', xName: 'km', yName: 'pagas' },
    { m: 3, n: 0, x: 5, what: 'La bicicleta: 3 metros por segundo', xName: 'segundos', yName: 'metros' },
    { m: -2, n: 10, x: 3, what: 'Una vela de 10 cm que se acorta 2 cm por hora', xName: 'horas', yName: 'cm de vela' },
    { m: 0.5, n: -1, x: 6, what: 'Una recta cualquiera', xName: 'x', yName: 'y' }
  ];
  function setupParts(root) {
    const card = root.querySelector('#ln-part-card');
    const exBox = root.querySelector('#ln-eq-example');
    let current = 'm';
    let exIdx = 0;

    const exSays = (k, e) => {
      const y = e.m * e.x + e.n;
      return {
        y: `<b>y</b> es el resultado: con x = ${f(e.x)}, y = <b>${f(y)}</b> (${e.yName}).`,
        eq: '<b>=</b> dice que y vale lo mismo que la cuenta de la derecha.',
        m: `<b>m = ${f(e.m)}</b>: cada vez que x aumenta 1, y ${e.m > 0 ? `sube ${f(e.m)}` : e.m < 0 ? `baja ${f(abs(e.m))}` : 'no cambia'}.`,
        por: `<b>${f(e.m)}·x</b> significa "${f(e.m)} por x": con x = ${f(e.x)} da ${f(e.m)}·${f(e.x)} = ${f(e.m * e.x)}.`,
        x: `<b>x</b> es lo que eliges tú (${e.xName}): en el ejemplo probamos x = <b>${f(e.x)}</b>.`,
        mas: e.n === 0 ? 'Aquí n = 0, así que no se suma nada: es una función <b>lineal</b> (pasa por el origen).'
          : e.n < 0 ? `Como n es negativo, el <b>+</b> se ve como <b>−</b>: se resta ${f(abs(e.n))}.` : `Después de multiplicar, se <b>suma</b> ${f(e.n)}.`,
        n: `<b>n = ${f(e.n)}</b>: cuando x = 0, y = ${f(e.n)}. La recta corta el eje y en (0, ${f(e.n)}).`
      }[k];
    };

    const renderExample = () => {
      const e = EXAMPLES[exIdx];
      const y = e.m * e.x + e.n;
      const op = e.n < 0 ? '−' : '+';
      const nTok = e.n === 0 ? '' : ` <span data-ex="mas">${op}</span> <span data-ex="n" class="t-n">${f(abs(e.n))}</span>`;
      exBox.innerHTML = `
        <div class="ex-head"><span class="ex-label">Ejemplo</span><span class="ex-what">${e.what}</span><button type="button" class="lbtn ghost lq-small" data-ex-next>🎲 Otro ejemplo</button></div>
        <div class="eq ex-eq"><span data-ex="y" class="t-y">y</span> <span data-ex="eq">=</span> <span data-ex="m" class="t-m">${f(e.m)}</span><span data-ex="por">·</span><span data-ex="x" class="t-x">x</span>${nTok}</div>
        <div class="ex-calc">Si <span data-ex="x" class="t-x">x</span> = ${f(e.x)}: &nbsp;<span data-ex="y" class="t-y">y</span> = <span data-ex="m" class="t-m">${f(e.m)}</span><span data-ex="por">·</span><span data-ex="x" class="t-x">${f(e.x)}</span>${e.n === 0 ? '' : ` <span data-ex="mas">${op}</span> <span data-ex="n" class="t-n">${f(abs(e.n))}</span>`} = <span data-ex="y" class="t-y">${f(y)}</span></div>
        <p class="ex-says"></p>`;
      highlight();
    };

    const highlight = () => {
      exBox.querySelectorAll('[data-ex]').forEach(s => s.classList.toggle('is-hl', s.dataset.ex === current));
      // Si la parte no está en este ejemplo (n = 0), igual se explica
      exBox.querySelector('.ex-says').innerHTML = `👉 ${exSays(current, EXAMPLES[exIdx])}`;
    };

    const showPart = (k) => {
      current = k;
      const p = PARTS[k];
      root.querySelectorAll('#ln-eq-parts button').forEach(b => b.classList.toggle('is-active', b.dataset.part === k));
      card.innerHTML = `<h4>${p.name}</h4><p>${p.text}</p><p class="ex">📌 ${p.ex}</p>`;
      highlight();
    };
    root.querySelector('#ln-eq-parts').addEventListener('click', (e) => {
      const b = e.target.closest('[data-part]');
      if (b) showPart(b.dataset.part);
    });
    exBox.addEventListener('click', (e) => {
      if (e.target.closest('[data-ex-next]')) { exIdx = (exIdx + 1) % EXAMPLES.length; renderExample(); return; }
      const s = e.target.closest('[data-ex]');
      if (s) showPart(s.dataset.ex);
    });
    renderExample();
    showPart('m');
  }

  // ----- 5. Pendiente con dos puntos que se arrastran -----
  function setupSlope(root) {
    const p = new Plot(root.querySelector('#ln-plot-slope'), { xMin: -6, xMax: 6, yMin: -6, yMax: 10, aspect: 1, step: 1 });
    plots.slope = p;
    const stepsEl = root.querySelector('#ln-slope-steps');
    const draw = () => {
      const { A, B } = state;
      const dx = B.x - A.x, dy = B.y - A.y;
      const m = dx === 0 ? NaN : dy / dx;
      const n = A.y - m * A.x;
      p.draw(() => {
        p.grid(); p.axes();
        if (isFinite(m)) p.fn(x => m * x + n, C.line, { width: 2.5 });
        else p.segment(A.x, -6, A.x, 10, '#ff5c5c', 2.5);
        // Triángulo: avance (horizontal) y subida (vertical)
        p.arrow(A.x, A.y, B.x, A.y, C.x, 3);
        p.arrow(B.x, A.y, B.x, B.y, C.m, 3);
        p.text(`avanza ${f(dx)}`, (A.x + B.x) / 2, A.y, C.x, { dy: dy >= 0 ? 18 : -8, align: 'center' });
        p.text(`${dy >= 0 ? 'sube' : 'baja'} ${f(abs(dy))}`, B.x, (A.y + B.y) / 2, C.m, { dx: 8 });
        p.point(A.x, A.y, C.y, `A(${f(A.x)}, ${f(A.y)})`, { r: 8 });
        p.point(B.x, B.y, C.x, `B(${f(B.x)}, ${f(B.y)})`, { r: 8 });
      });
      if (!isFinite(m)) {
        stepsEl.innerHTML = `<p>⚠️ A y B están en la misma vertical (x₂ − x₁ = 0). No se puede dividir por 0: una recta vertical <b>no es función</b> y no tiene pendiente.</p>`;
        return;
      }
      stepsEl.innerHTML = `
        <p><b>Paso 1 · Lo que sube:</b> y₂ − y₁ = ${f(B.y)} − ${A.y < 0 ? `(${f(A.y)})` : f(A.y)} = <b class="t-m">${f(dy)}</b></p>
        <p><b>Paso 2 · Lo que avanza:</b> x₂ − x₁ = ${f(B.x)} − ${A.x < 0 ? `(${f(A.x)})` : f(A.x)} = <b class="t-x">${f(dx)}</b></p>
        <p><b>Paso 3 · Divide:</b> m = ${f(dy)} ÷ ${f(dx)} = <b class="t-m">${f(m)}</b></p>
        <p><b>Paso 4 · Busca n</b> con el punto A: ${f(A.y)} = ${f(m)}·${A.x < 0 ? `(${f(A.x)})` : f(A.x)} + n → n = <b class="t-n">${f(n)}</b></p>
        <p class="result">Ecuación: ${eqHtml(Math.round(m * 100) / 100, Math.round(n * 100) / 100)}</p>
        <p class="small">${m > 0 ? 'Como m es positiva, la recta sube.' : m < 0 ? 'Como m es negativa, la recta baja.' : 'Como m = 0, la recta es horizontal.'} Por cada 1 que avanzas, ${m >= 0 ? 'sube' : 'baja'} ${f(abs(m))}.</p>`;
    };
    // Arrastrar los puntos (se ajustan a medios enteros)
    let dragging = null;
    const canvas = root.querySelector('#ln-plot-slope');
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: Math.round(p.toX(e.clientX - r.left) * 2) / 2, y: Math.round(p.toY(e.clientY - r.top) * 2) / 2 }; };
    canvas.addEventListener('pointerdown', (e) => {
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left, py = e.clientY - r.top;
      const near = (P) => Math.hypot(p.X(P.x) - px, p.Y(P.y) - py) < 22;
      dragging = near(state.B) ? 'B' : near(state.A) ? 'A' : null;
      if (dragging) { canvas.setPointerCapture(e.pointerId); e.preventDefault(); }
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!dragging) {
        const r = canvas.getBoundingClientRect();
        const near = [state.A, state.B].some(P => Math.hypot(p.X(P.x) - (e.clientX - r.left), p.Y(P.y) - (e.clientY - r.top)) < 22);
        canvas.style.cursor = near ? 'grab' : 'default';
        return;
      }
      const q = pos(e);
      state[dragging] = { x: Math.max(-6, Math.min(6, q.x)), y: Math.max(-6, Math.min(10, q.y)) };
      draw();
    });
    const end = () => { if (dragging) { dragging = null; MathLessons.changed(); } };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.style.touchAction = 'none';
    setupSlope.draw = draw;
    draw();
    // Casos
    root.querySelectorAll('canvas[data-case]').forEach(cv => {
      const pc = new Plot(cv, { xMin: -4, xMax: 4, yMin: -4, yMax: 4, aspect: 0.8, step: 1, labels: false });
      const c = cv.dataset.case;
      pc.draw(() => {
        pc.grid(); pc.axes();
        if (c === 'steep') {
          pc.fn(x => 4 * x, C.m, { width: 3 }); pc.fn(x => 0.5 * x, C.n, { width: 3 });
          pc.text('m = 4', 0.9, 3.6, C.m); pc.text('m = 0,5', 2.2, 1.8, C.n);
        } else {
          const m = Number(c), n = m === 0 ? 2 : 0;
          pc.fn(x => m * x + n, C.line, { width: 3 });
          if (m !== 0) { pc.arrow(1, m, 2, m, C.x, 2); pc.arrow(2, m, 2, 2 * m, C.m, 2); }
        }
      });
    });
  }

  // ----- 6. Cortes con los ejes (con sus propios m y n) y 7. Laboratorio -----
  function labView(m = state.m, n = state.n) {
    const root = m !== 0 ? -n / m : null;
    const ys = [n, m * 4 + n, m * -4 + n, 0];
    return { xMin: -6, xMax: 6, yMin: Math.min(-6, ...ys) - 1, yMax: Math.max(6, ...ys) + 1, root };
  }

  function setupEjes(root) {
    const pe = new Plot(root.querySelector('#ln-plot-ejes'), { xMin: -6, xMax: 6, yMin: -8, yMax: 8, aspect: 1, step: 1 });
    plots.ejes = pe;
    const mIn = root.querySelector('#ln-em'), nIn = root.querySelector('#ln-en');

    // stage: null (todo), o la animación: { x, found: ['y'] / ['y','x'] }
    const draw = (anim = null) => {
      const m = state.em, n = state.en;
      const v = labView(m, n);
      pe.setView({ yMin: Math.max(-14, v.yMin), yMax: Math.min(14, v.yMax), step: (v.yMax - v.yMin) > 18 ? 2 : 1 });
      pe.draw(() => {
        pe.grid(); pe.axes();
        pe.fn(x => m * x + n, C.line, { width: 3 });
        const found = anim ? anim.found : ['y', 'x'];
        if (found.includes('y')) pe.point(0, n, C.n, `corta eje y: (0, ${f(n)})`);
        if (found.includes('x') && v.root !== null && abs(v.root) <= 6) pe.point(v.root, 0, C.y, `corta eje x: (${f(v.root)}, 0)`, { dy: 20 });
        if (anim) {
          const y = m * anim.x + n;
          pe.segment(anim.x, 0, anim.x, y, 'rgba(255,255,255,0.4)', 1.5, [4, 4]);
          pe.segment(0, y, anim.x, y, 'rgba(255,255,255,0.4)', 1.5, [4, 4]);
          pe.point(anim.x, y, '#fff', `(${f(anim.x, 1)}, ${f(y, 1)})`, { r: 8 });
          if (anim.msg) pe.text(anim.msg, -5.8, pe.opts.yMax - 0.6, '#FFD166', { size: 14 });
        }
      });
    };

    const steps = () => {
      const m = state.em, n = state.en;
      root.querySelector('#ln-ejes-eq').innerHTML = eqHtml(m, n, { big: true });
      root.querySelector('#ln-em-val').textContent = f(m);
      root.querySelector('#ln-en-val').textContent = f(n);
      root.querySelector('#ln-yint-steps').innerHTML = `
        <p>1) Pon x = 0: &nbsp; y = ${f(m)} · 0 ${sgn(n)} ${f(abs(n))}</p>
        <p>2) ${f(m)} · 0 = 0, así que: &nbsp; y = <b class="t-n">${f(n)}</b></p>
        <p class="result">La recta corta el eje y en (0, <b>${f(n)}</b>).</p>`;
      const stepsEl = root.querySelector('#ln-root-steps');
      if (m === 0) {
        stepsEl.innerHTML = n === 0 ? '<p>Con m = 0 y n = 0 la recta es el propio eje x (y = 0): lo toca en todas partes.</p>'
          : `<p>Como m = 0, y = ${f(n)} siempre. La recta es horizontal y <b>nunca</b> corta el eje x.</p>`;
        return;
      }
      stepsEl.innerHTML = `
        <p>1) Pon y = 0: &nbsp; 0 = ${f(m)}x ${sgn(n)} ${f(abs(n))}</p>
        <p>2) Pasa ${n === 0 ? 'nada' : `el ${f(abs(n))} al otro lado (${n > 0 ? 'restando' : 'sumando'})`}: &nbsp; ${f(-n)} = ${f(m)}x</p>
        <p>3) Divide por ${f(m)}: &nbsp; x = ${f(-n)} ÷ ${m < 0 ? `(${f(m)})` : f(m)} = <b class="t-y">${f(-n / m)}</b></p>
        <p class="result">La recta corta el eje x en (<b>${f(-n / m)}</b>, 0).</p>`;
    };

    const update = () => {
      state.em = Number(mIn.value);
      state.en = Number(nIn.value);
      steps();
      draw();
    };
    const onInput = () => { cancel('ejes'); update(); MathLessons.changed(); };
    mIn.addEventListener('input', onInput);
    nIn.addEventListener('input', onInput);

    // Un punto recorre la recta: se detiene en el eje y (x = 0) y después en el eje x (y = 0)
    root.querySelector('#ln-ejes-anim').addEventListener('click', () => {
      cancel('ejes');
      const m = state.em, n = state.en;
      const r = m !== 0 ? -n / m : null;
      const hasRoot = r !== null && abs(r) <= 6;
      const start = -6;
      const firstStop = 0;
      const secondStop = hasRoot ? r : null;
      // Tramo 1: de -6 a 0 (corte con el eje y); pausa; tramo 2: de 0 a la raíz (corte con el eje x)
      stop.ejes = Plot.animate(hasRoot ? 6200 : 3400, t => {
        const T1 = hasRoot ? 0.38 : 0.7, P1 = hasRoot ? 0.5 : 1;
        if (t < T1) draw({ x: start + (firstStop - start) * Plot.ease(t / T1), found: [], msg: 'Buscando dónde x = 0…' });
        else if (t < P1 || !hasRoot) draw({ x: firstStop, found: ['y'], msg: `¡x = 0! Corta el eje y en (0, ${f(n)})` });
        else {
          const k = Math.min(1, (t - P1) / (0.88 - P1));
          const x = firstStop + (secondStop - firstStop) * Plot.ease(k);
          draw({ x, found: ['y', ...(k >= 1 ? ['x'] : [])], msg: k >= 1 ? `¡y = 0! Corta el eje x en (${f(r)}, 0)` : 'Buscando dónde y = 0…' });
        }
      }, () => draw());
    });
    root.querySelector('#ln-ejes-random').addEventListener('click', () => {
      // Rectas con un corte en x "lindo" (entero) para que se pueda comprobar a mano
      const m = (Math.round(Math.random() * 8) + 1) / 2 * (Math.random() < 0.5 ? -1 : 1);
      const rootX = Math.round(Math.random() * 8) - 4;
      const n = Math.max(-6, Math.min(6, Math.round(-m * rootX * 2) / 2));
      mIn.value = String(m);
      nIn.value = String(n);
      onInput();
    });
    setupEjes.update = update;
    setupEjes.inputs = { mIn, nIn };
    update();
  }

  function setupLab(root) {
    const p = new Plot(root.querySelector('#ln-plot-lab'), { xMin: -6, xMax: 6, yMin: -8, yMax: 8, aspect: 1, step: 1 });
    plots.lab = p;
    const mIn = root.querySelector('#ln-m'), nIn = root.querySelector('#ln-n');
    const showCuts = () => root.querySelector('#ln-lab-cuts').checked;

    const drawLab = ({ progress = 1, stairs = 0, mover = null } = {}) => {
      const { m, n } = state;
      const v = labView();
      p.setView({ yMin: Math.max(-14, v.yMin), yMax: Math.min(14, v.yMax), step: (v.yMax - v.yMin) > 18 ? 2 : 1 });
      p.draw(() => {
        p.grid(); p.axes();
        p.fn(x => m * x + n, C.line, { width: 3.5, progress });
        // Escalera: desde (0, n), pasos de 1 a la derecha y m hacia arriba
        for (let i = 0; i < Math.floor(stairs); i++) {
          p.segment(i, m * i + n, i + 1, m * i + n, C.x, 3);
          p.segment(i + 1, m * i + n, i + 1, m * (i + 1) + n, C.m, 3);
          if (i === 0) { p.text('1', i + 0.5, m * i + n, C.x, { dy: m >= 0 ? 16 : -6, align: 'center' }); p.text(`${f(m)}`, i + 1, m * i + n + m / 2, C.m, { dx: 6 }); }
        }
        if (showCuts()) {
          p.point(0, n, C.n, `(0, ${f(n)})`);
          if (v.root !== null && abs(v.root) <= 6) p.point(v.root, 0, C.y, `(${f(v.root)}, 0)`, { dy: 18 });
        }
        if (mover !== null) {
          const y = m * mover + n;
          p.segment(mover, 0, mover, y, 'rgba(255,255,255,0.35)', 1.5, [4, 4]);
          p.segment(0, y, mover, y, 'rgba(255,255,255,0.35)', 1.5, [4, 4]);
          p.point(mover, y, '#fff', `(${f(mover, 1)}, ${f(y, 1)})`, { r: 7 });
        }
      });
    };

    const update = () => {
      state.m = Number(mIn.value);
      state.n = Number(nIn.value);
      const { m, n } = state;
      root.querySelector('#ln-m-val').textContent = f(m);
      root.querySelector('#ln-n-val').textContent = f(n);
      root.querySelector('#ln-lab-eq').innerHTML = eqHtml(m, n, { big: true });
      const xs = [-3, -2, -1, 0, 1, 2, 3];
      root.querySelector('#ln-tab-lab').innerHTML = tableHtml(xs, [
        { h: '<span class="t-x">x</span>', v: x => f(x) },
        { h: 'Cálculo', v: x => `${f(m)} · ${x < 0 ? `(${x})` : x} ${sgn(n)} ${f(abs(n))}` },
        { h: '<span class="t-y">y</span>', v: x => `<b>${f(m * x + n)}</b>` }
      ]);
      const v = labView();
      const kind = n === 0
        ? `Como <span class="t-n">n = 0</span>, la recta pasa por el origen: es una <b>función lineal</b> y una <b>proporción directa</b> (y ÷ x = ${f(m)} siempre${m === 0 ? ', salvo que todo vale 0' : ''}).`
        : `Como <span class="t-n">n = ${f(n)}</span> no es 0, es una <b>función afín</b>: no pasa por el origen y <b>no</b> es proporción directa.`;
      const slope = m > 0 ? `Como <span class="t-m">m = ${f(m)}</span> es positiva, la recta <b>sube</b>: cada vez que x aumenta 1, y aumenta ${f(m)}.`
        : m < 0 ? `Como <span class="t-m">m = ${f(m)}</span> es negativa, la recta <b>baja</b>: cada vez que x aumenta 1, y disminuye ${f(abs(m))}.`
          : 'Como <span class="t-m">m = 0</span>, la recta es <b>horizontal</b>: y vale siempre lo mismo.';
      const steep = abs(m) >= 3 ? ' Es bastante <b>empinada</b>.' : abs(m) > 0 && abs(m) <= 0.5 ? ' Es bastante <b>suave</b> (casi plana).' : '';
      root.querySelector('#ln-lab-explain').innerHTML = `<p>${slope}${steep}</p><p>Corta el eje y en <b>(0, ${f(n)})</b>${v.root !== null ? ` y el eje x en <b>(${f(v.root)}, 0)</b>` : ''}.</p><p>${kind}</p>`;
      drawLab();
    };

    const onInput = () => { cancel('lab'); update(); MathLessons.changed(); };
    mIn.addEventListener('input', onInput);
    nIn.addEventListener('input', onInput);
    root.querySelector('#ln-lab-cuts').addEventListener('change', () => drawLab());
    root.querySelector('#ln-lab-draw').addEventListener('click', () => {
      cancel('lab');
      stop.lab = Plot.animate(3000, t => drawLab({ progress: t, mover: -6 + 12 * t }), () => drawLab());
    });
    root.querySelector('#ln-lab-stairs').addEventListener('click', () => {
      cancel('lab');
      stop.lab = Plot.animate(3600, t => drawLab({ stairs: t * 5.99 }));
    });
    root.querySelector('#ln-lab-random').addEventListener('click', () => {
      mIn.value = String((Math.round(Math.random() * 16) - 8) / 2);
      nIn.value = String(Math.round(Math.random() * 12) - 6);
      onInput();
    });
    setupLab.update = update;
    setupLab.inputs = { mIn, nIn };
    update();
  }

  // ----- 8. Proporción directa -----
  function setupDirecta(root) {
    const p = new Plot(root.querySelector('#ln-plot-directa'), { xMin: -0.5, xMax: 6.5, yMin: -1, yMax: 20, aspect: 0.8, step: 1 });
    plots.directa = p;
    let afin = false;
    const tab = root.querySelector('#ln-tab-directa');
    const render = () => {
      const fx = afin ? (x => 2 * x + 3) : (x => 3 * x);
      tab.innerHTML = tableHtml([1, 2, 3, 4, 5, 6], [
        { h: `<span class="t-x">${afin ? 'Km' : 'Segundos'} (x)</span>`, v: x => x },
        { h: `<span class="t-y">${afin ? 'Pago' : 'Metros'} (y)</span>`, v: x => fx(x) },
        { h: '<span class="t-y">y</span> ÷ <span class="t-x">x</span>', v: x => `<b class="${afin ? 'bad' : 'good'}">${f(fx(x) / x)}</b>` }
      ]);
      root.querySelector('#ln-toggle-afin-ratio').textContent = afin ? 'Volver a la bicicleta (proporción directa)' : '¿Y si fuera el taxi (afín)?';
      p.draw(() => {
        p.grid(); p.axes({ x: afin ? 'km' : 's', y: afin ? '$' : 'm' });
        p.fn(fx, afin ? C.afin : C.line, { xFrom: 0, xTo: 6.3 });
        [1, 2, 3, 4, 5, 6].forEach(x => p.point(x, fx(x), C.y));
        p.text(afin ? 'y ÷ x cambia: NO es proporción directa' : 'y ÷ x = 3 siempre: proporción directa', 0.3, 18.6, afin ? '#ff8a8a' : '#7dffb3');
      });
    };
    root.querySelector('#ln-toggle-afin-ratio').addEventListener('click', () => { afin = !afin; cancel('directa'); render(); });
    root.querySelector('#ln-anim-doble').addEventListener('click', () => {
      afin = false; render();
      cancel('directa');
      stop.directa = Plot.animate(3000, t => {
        p.redraw();
        const e = Plot.ease(Math.min(1, t * 1.3));
        const x = 2 + 2 * e;
        p.segment(2, 0, 2, 6, 'rgba(255,255,255,0.5)', 1.5, [4, 4]);
        p.segment(0, 6, 2, 6, 'rgba(255,255,255,0.5)', 1.5, [4, 4]);
        p.point(2, 6, C.x, '2 s → 6 m', { r: 8 });
        p.segment(x, 0, x, 3 * x, 'rgba(255,255,255,0.5)', 1.5, [4, 4]);
        p.segment(0, 3 * x, x, 3 * x, 'rgba(255,255,255,0.5)', 1.5, [4, 4]);
        p.point(x, 3 * x, C.m, `${f(x, 1)} s → ${f(3 * x, 1)} m`, { r: 8 });
        if (t > 0.8) p.text('¡El doble de tiempo, el doble de metros!', 0.3, 15.5, '#ffd166');
      });
    });
    render();
  }

  // ----- 9. Proporción inversa -----
  function setupInversa(root) {
    const p = new Plot(root.querySelector('#ln-plot-inversa'), { xMin: -0.5, xMax: 13, yMin: -0.5, yMax: 13, aspect: 1, step: 1 });
    plots.inversa = p;
    const kIn = root.querySelector('#ln-k'), xIn = root.querySelector('#ln-kx');
    const draw = (xv = state.kx) => {
      const k = state.k;
      const y = k / xv;
      p.setView({ yMax: Math.max(13, k + 1) > 25 ? 25 : Math.max(13, Math.min(25, k + 1)), xMax: 13 });
      p.draw(() => {
        p.grid(); p.axes({ x: 'amigos', y: 'trozos' });
        p.rect(0, 0, xv, y, 'rgba(255,209,102,0.22)', '#FFD166');
        p.text(`área = ${f(xv, 1)} · ${f(y, 2)} = ${k}`, xv / 2, y / 2, '#FFD166', { align: 'center' });
        p.fn(x => k / x, C.inv, { xFrom: 0.3, xTo: 13, width: 3.5 });
        p.point(xv, y, C.m, `(${f(xv, 1)}, ${f(y, 2)})`, { r: 8 });
      });
      root.querySelector('#ln-kx-val').textContent = f(xv, 1);
      root.querySelector('#ln-inv-explain').innerHTML = `<p>Con <b class="t-x">${f(xv, 1)}</b> amigos, a cada uno le tocan <b class="t-y">${state.k} ÷ ${f(xv, 1)} = ${f(y, 2)}</b> trozos.</p><p>Comprueba: ${f(xv, 1)} · ${f(y, 2)} = <b class="t-m">${state.k}</b> ✅</p>`;
    };
    const table = () => {
      const k = state.k;
      const xs = [1, 2, 3, 4, 6, 12].filter(x => x <= 12);
      root.querySelector('#ln-tab-inversa').innerHTML = tableHtml(xs, [
        { h: '<span class="t-x">Amigos (x)</span>', v: x => x },
        { h: '<span class="t-y">Trozos (y)</span>', v: x => f(k / x) },
        { h: '<span class="t-x">x</span> · <span class="t-y">y</span>', v: x => `<b class="good">${f(x * (k / x))}</b>` }
      ]);
    };
    const update = () => {
      state.k = Number(kIn.value);
      state.kx = Number(xIn.value);
      root.querySelector('#ln-k-val').textContent = state.k;
      table();
      draw();
    };
    kIn.addEventListener('input', () => { cancel('inversa'); update(); MathLessons.changed(); });
    xIn.addEventListener('input', () => { cancel('inversa'); update(); MathLessons.changed(); });
    root.querySelector('#ln-anim-inversa').addEventListener('click', () => {
      cancel('inversa');
      stop.inversa = Plot.animate(5000, t => {
        const xv = 1 + 11 * (0.5 - 0.5 * Math.cos(t * Math.PI * 2));
        draw(Math.max(1, xv));
      }, () => draw());
    });
    setupInversa.update = update;
    setupInversa.inputs = { kIn, xIn };
    update();
  }

  // ----- 13. Desafíos (preguntas al azar, historial, notas y progreso: lessons/quiz.js) -----
  function setupQuiz(root) {
    quiz = LessonQuiz(root.querySelector('#ln-quiz'), { id: 'lineal', templates: QUIZ_TEMPLATES, onChange: () => MathLessons.changed() });
    cards = LessonCards(root.querySelector('#ln-cards'), { id: 'lineal', templates: CARD_TEMPLATES, onChange: () => MathLessons.changed() });
  }

  let rootEl = null;
  // Fuera de ZenBan, el avance se guarda en este navegador (se lee antes de registrarse: el inicio lo muestra)
  const LOCAL_KEY = 'mathviz_lesson_lineal';
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null');
    if (saved && saved.nav) pending = { nav: saved.nav };
  } catch (e) {}
  MathLessons.register({
    id: 'lineal',
    label: 'Función lineal y afín',
    icon: '📏',
    description: 'Qué es una función, la recta y su ecuación, la pendiente, los cortes con los ejes y la proporción directa e inversa. Para 12 años en adelante.',
    render(container) {
      rootEl = container;
      container.innerHTML = LESSON_HTML;
      container.querySelector('#ln-mx').addEventListener('input', () => renderMachine(container));
      renderMachine(container, false);
      setupLinealAfin(container);
      setupParts(container);
      setupSlope(container);
      setupEjes(container);
      setupLab(container);
      setupDirecta(container);
      setupInversa(container);
      setupQuiz(container);
      // Gráfica ↔ tabla: el punto tocado se pinta en la tabla y la fila tocada se marca en la gráfica
      [['lineal', '#ln-tab-lineal'], ['afin', '#ln-tab-afin'], ['lab', '#ln-tab-lab'], ['directa', '#ln-tab-directa'], ['inversa', '#ln-tab-inversa']]
        .forEach(([k, sel]) => linkTable(plots[k], container.querySelector(sel)));
      // Un capítulo a la vez, con menú lateral, portada, avance y Anterior / Siguiente
      nav = LessonChapters(container, {
        lesson: this, intro: INTRO, groups: GROUPS,
        onChange: () => { saveLocal(); MathLessons.changed(); }
      });
      // Lo guardado antes de abrir la lección (de ZenBan o de este navegador)
      if (pending) { const s = pending; pending = null; this.setState(s); }
      // La máquina se anima al entrar a su capítulo
      container.querySelector('.lx-side').addEventListener('click', (e) => {
        if (e.target.closest('[data-ch="ln-maquina"]')) setTimeout(() => renderMachine(container), 150);
      });
    },
    onShow() { if (nav) nav.onShow(); },
    goTo(chapter) { if (nav) nav.goTo(chapter); },
    getState() {
      if (!rootEl) return pending;
      return { m: state.m, n: state.n, em: state.em, en: state.en, k: state.k, kx: state.kx, A: state.A, B: state.B, quiz: quiz ? quiz.getState() : null, cards: cards ? cards.getState() : null, nav: nav ? nav.getState() : null };
    },
    setState(s) {
      if (!s) return;
      // Antes de abrir la lección se guarda para aplicarlo al abrirla (la portada del inicio igual muestra el avance)
      if (!rootEl) { pending = s; return; }
      Object.assign(state, {
        A: s.A || state.A, B: s.B || state.B,
        m: s.m ?? state.m, n: s.n ?? state.n, em: s.em ?? state.em, en: s.en ?? state.en, k: s.k ?? state.k, kx: s.kx ?? state.kx
      });
      setupLab.inputs.mIn.value = state.m;
      setupLab.inputs.nIn.value = state.n;
      setupInversa.inputs.kIn.value = state.k;
      setupInversa.inputs.xIn.value = state.kx;
      setupEjes.inputs.mIn.value = state.em;
      setupEjes.inputs.nIn.value = state.en;
      setupEjes.update();
      setupLab.update();
      setupInversa.update();
      if (quiz && s.quiz) quiz.setState(s.quiz);
      if (cards && s.cards) cards.setState(s.cards);
      if (setupSlope.draw) setupSlope.draw();
      if (nav && s.nav) nav.setState(s.nav);
    },
    // Para la tarjeta de la página de inicio
    summary() {
      const s = rootEl ? this.getState() : pending;
      const total = GROUPS.reduce((n, g) => n + g.chapters.length, 0);
      const visitedIds = (s && s.nav && s.nav.visited) || [];
      const attempts = (s && s.quiz && s.quiz.attempts) || (() => { try { return (JSON.parse(localStorage.getItem('mathviz_quiz_lineal') || 'null') || {}).attempts || []; } catch (e) { return []; } })();
      const all = GROUPS.flatMap(g => g.chapters);
      const next = all.find(c => !visitedIds.includes(c.id));
      return {
        visited: visitedIds.length, total,
        best: attempts.length ? Math.max(...attempts.map(a => a.nota)) : null,
        current: visitedIds.length && next ? next.title : null
      };
    }
  });

  function saveLocal() {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify({ nav: nav ? nav.getState() : null })); } catch (e) {}
  }
})();
