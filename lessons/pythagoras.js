// ===== MathViz · Lección: el teorema de Pitágoras (para ~12 años) =====
// Igual que la de función lineal: capítulos cortos, gráficas que se tocan (el punto tocado muestra sus
// coordenadas y se pinta en la tabla), puntos que se arrastran, animaciones, desafíos con nota y glosario.
// Incluye la relación con la función lineal: la pendiente es un triángulo rectángulo, la distancia entre
// dos puntos y el largo de un tramo de recta se calculan con Pitágoras.
(function () {
  const C = { a: '#8f88ff', b: '#00D4AA', c: '#FF6B9D', y: '#FFA751', line: '#6C63FF', sq: '#FFD166' };
  const A_FILL = 'rgba(143,136,255,0.22)', B_FILL = 'rgba(0,212,170,0.22)', C_FILL = 'rgba(255,107,157,0.22)';
  const f = (v, d = 2) => Plot.fmt(v, d);
  const abs = Math.abs;
  const sq = (v) => v * v;
  // Raíz bonita: exacta si es entera; si no, "√20 ≈ 4,47"
  const rootTxt = (v) => {
    const r = Math.sqrt(v);
    return Math.abs(r - Math.round(r)) < 1e-9 ? f(Math.round(r)) : `√${f(v)} ≈ ${f(r)}`;
  };
  const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;

  const INTRO = 'Descubre el teorema más famoso de la geometría: en un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos. Lo verás con áreas, con una demostración animada, con triángulos que mueves y con problemas de la vida real. Y al final, cómo se une con la <b>función lineal</b>: la pendiente es un triángulo rectángulo. Son 16 capítulos cortos y desafíos con nota.';
  const GROUPS = [
    { name: '🚀 Empezar', chapters: [
      { id: 'py-triangulo', title: 'El triángulo rectángulo', desc: 'Catetos, hipotenusa y ángulo recto: cómo reconocerlos.' }
    ] },
    { name: '📐 El teorema', chapters: [
      { id: 'py-teorema', title: 'a² + b² = c²', desc: 'Qué dice el teorema y qué significa cada parte.' },
      { id: 'py-areas', title: 'Lo vemos con áreas', desc: 'Los cuadrados sobre los lados: cuenta los cuadraditos.' },
      { id: 'py-demo', title: 'Demostración animada', desc: 'Cuatro triángulos se reordenan y lo prueban.' }
    ] },
    { name: '🧮 Calcular', chapters: [
      { id: 'py-hipotenusa', title: 'Calcular la hipotenusa', desc: 'c = √(a² + b²), paso a paso.' },
      { id: 'py-cateto', title: 'Calcular un cateto', desc: 'b = √(c² − a²), paso a paso.' },
      { id: 'py-reciproco', title: '¿Es rectángulo?', desc: 'Con tres medidas, descubre si el triángulo tiene ángulo recto.' }
    ] },
    { name: '🧪 Practicar', chapters: [
      { id: 'py-lab', title: 'Laboratorio', desc: 'Arrastra los vértices y mira cómo cambian los cuadrados.' }
    ] },
    { name: '📈 Pitágoras y la función lineal', chapters: [
      { id: 'py-distancia', title: 'Distancia entre dos puntos', desc: 'La distancia es la hipotenusa de un triángulo escondido.' },
      { id: 'py-pendiente', title: 'La pendiente es un triángulo', desc: 'La escalera de la recta y cuánto mide cada escalón.' },
      { id: 'py-circulo', title: 'Distancia al origen y el círculo', desc: 'x² + y² = r²: todos los puntos a la misma distancia.' }
    ] },
    { name: '🌍 En la vida real', chapters: [
      { id: 'py-vida', title: 'Problemas de la vida real', desc: 'La escalera, la pantalla y el atajo por la plaza.' },
      { id: 'py-ternas', title: 'Ternas pitagóricas', desc: '3, 4, 5 y sus amigas: triángulos con lados enteros.' }
    ] },
    { name: '🛠 Herramientas', chapters: [
      { id: 'py-errores', title: 'Errores comunes', desc: 'Las trampas más típicas y cómo evitarlas.' }
    ] },
    { name: '🏆 Evaluación', chapters: [
      { id: 'py-desafios', title: 'Desafíos', desc: 'Preguntas con números nuevos en cada intento, nota y progreso.' }
    ] },
    { name: '📖 Consulta', chapters: [
      { id: 'py-glosario', title: 'Glosario', desc: 'Todas las palabras importantes, explicadas.' }
    ] }
  ];

  const range = (id, label, cls, min, max, step, value) =>
    `<label><span>${label}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}"><b id="${id}-val" class="${cls}">${value}</b></label>`;

  const LESSON_HTML = `
  <section class="card" id="py-triangulo">
    <h2><span class="num">1</span> El triángulo rectángulo</h2>
    <p>Un <b>triángulo rectángulo</b> es un triángulo que tiene un <b>ángulo recto</b>: un ángulo de <b>90°</b>, como la esquina de una hoja, de una puerta o de una baldosa. El teorema de Pitágoras <b>solo funciona en estos triángulos</b>.</p>
    <p>Toca cada parte para verla en el triángulo:</p>
    <div class="eq-parts" id="py-tri-parts">
      <button data-tp="recto">∟ ángulo recto</button><button data-tp="a" class="t-a">cateto a</button><button data-tp="b" class="t-b">cateto b</button><button data-tp="c" class="t-c">hipotenusa c</button>
    </div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-tri"></canvas></div>
      <div class="part-card" id="py-tri-card"></div>
    </div>
    <div class="btn-row"><button class="lbtn" id="py-tri-rotate">↻ Girar el triángulo</button></div>
    <ul class="facts">
      <li>Los dos lados que <b>forman el ángulo recto</b> se llaman <b>catetos</b> (<span class="t-a">a</span> y <span class="t-b">b</span>).</li>
      <li>El lado que está <b>frente al ángulo recto</b> se llama <b>hipotenusa</b> (<span class="t-c">c</span>). <b>Siempre es el lado más largo.</b></li>
      <li>Aunque gires el triángulo, la hipotenusa sigue siendo la que está frente al ángulo recto. Prueba el botón ↻.</li>
      <li>"Hipotenusa" viene del griego y significa algo así como "la que se extiende por debajo" (del ángulo recto).</li>
    </ul>
  </section>

  <section class="card" id="py-teorema">
    <h2><span class="num">2</span> El teorema: <span class="eq"><span class="t-a">a</span>² + <span class="t-b">b</span>² = <span class="t-c">c</span>²</span></h2>
    <div class="formula-box">En todo triángulo rectángulo: &nbsp;<span class="t-a">cateto</span>² + <span class="t-b">cateto</span>² = <span class="t-c">hipotenusa</span>²</div>
    <p>Toca cada parte de la fórmula para ver qué es:</p>
    <div class="eq-parts" id="py-eq-parts">
      <button data-part="a" class="t-a">a</button><button data-part="pot">²</button><button data-part="mas">+</button><button data-part="b" class="t-b">b</button><button data-part="pot">²</button><button data-part="eq">=</button><button data-part="c" class="t-c">c</button><button data-part="pot">²</button>
    </div>
    <div class="part-card" id="py-part-card"></div>
    <div class="eq-example" id="py-eq-example"></div>
    <div class="tip"><b>¿Qué es "al cuadrado"?</b> El <b>²</b> significa multiplicar un número por sí mismo: 3² = 3 · 3 = 9. Se llama "al cuadrado" porque es el área de un <b>cuadrado</b> de ese lado: un cuadrado de lado 3 tiene 3 · 3 = 9 cuadraditos. Y la <b>raíz cuadrada</b> (√) hace lo contrario: √9 = 3, porque 3 · 3 = 9.</div>
    <p class="small">Se llama así por <b>Pitágoras</b>, un matemático griego que vivió hace unos 2.500 años. Pero los babilonios y los egipcios ya lo usaban antes: con una cuerda de 12 nudos armaban un triángulo de lados 3, 4 y 5 para hacer esquinas perfectamente rectas en sus construcciones.</p>
  </section>

  <section class="card" id="py-areas">
    <h2><span class="num">3</span> Lo vemos con áreas</h2>
    <p>Dibuja un <b>cuadrado sobre cada lado</b> del triángulo. El teorema dice que el cuadrado de la <span class="t-c">hipotenusa</span> tiene <b>exactamente la misma área</b> que los dos cuadrados de los <span class="t-a">catetos</span> juntos.</p>
    <div class="lab-controls">${range('py-ar-a', 'Cateto <b class="t-a">a</b>', 't-a', 1, 8, 1, 3)}${range('py-ar-b', 'Cateto <b class="t-b">b</b>', 't-b', 1, 8, 1, 4)}</div>
    <div class="btn-row"><button class="lbtn" id="py-ar-count">▶ Contar los cuadraditos</button></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-areas"></canvas></div>
      <div><table class="vtable" id="py-tab-areas"></table><div class="explain" id="py-ar-explain"></div></div>
    </div>
  </section>

  <section class="card" id="py-demo">
    <h2><span class="num">4</span> Una demostración animada</h2>
    <p>¿Cómo sabemos que <b>siempre</b> se cumple, y no solo con 3, 4 y 5? Mira esta idea muy antigua: un cuadrado grande de lado <span class="t-a">a</span> + <span class="t-b">b</span> con <b>cuatro triángulos iguales</b> adentro.</p>
    <div class="lab-controls">${range('py-dm-a', 'Cateto <b class="t-a">a</b>', 't-a', 1, 6, 0.5, 2)}${range('py-dm-b', 'Cateto <b class="t-b">b</b>', 't-b', 1, 6, 0.5, 3)}</div>
    <div class="btn-row"><button class="lbtn" id="py-dm-play">▶ Reordenar los triángulos</button><button class="lbtn ghost" id="py-dm-back">↺ Volver</button></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-demo"></canvas></div>
      <ol class="big-steps">
        <li>Al principio, los 4 triángulos están en las esquinas y lo que queda libre (rosado) es un cuadrado inclinado de lado <span class="t-c">c</span>: su área es <span class="t-c">c²</span>.</li>
        <li>Movemos los triángulos <b>sin cambiarles el tamaño</b>: dos se giran y uno se desliza.</li>
        <li>Ahora lo que queda libre son dos cuadrados: uno de lado <span class="t-a">a</span> (área <span class="t-a">a²</span>) y otro de lado <span class="t-b">b</span> (área <span class="t-b">b²</span>).</li>
        <li>El cuadrado grande y los triángulos son los mismos, así que el espacio libre es el mismo: <b><span class="t-a">a²</span> + <span class="t-b">b²</span> = <span class="t-c">c²</span></b>. ¡Para cualquier triángulo rectángulo!</li>
      </ol>
    </div>
  </section>

  <section class="card" id="py-hipotenusa">
    <h2><span class="num">5</span> Calcular la hipotenusa</h2>
    <div class="formula-box"><span class="t-c">c</span> = √(<span class="t-a">a</span>² + <span class="t-b">b</span>²)</div>
    <p>Si conoces los dos catetos: <b>elévalos al cuadrado, súmalos y saca la raíz</b>.</p>
    <div class="lab-controls">${range('py-hi-a', 'Cateto <b class="t-a">a</b>', 't-a', 0.5, 12, 0.5, 6)}${range('py-hi-b', 'Cateto <b class="t-b">b</b>', 't-b', 0.5, 12, 0.5, 8)}</div>
    <div class="btn-row"><button class="lbtn ghost" id="py-hi-random">🎲 Otro triángulo</button></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-hip"></canvas></div>
      <div class="steps" id="py-hi-steps"></div>
    </div>
  </section>

  <section class="card" id="py-cateto">
    <h2><span class="num">6</span> Calcular un cateto</h2>
    <div class="formula-box"><span class="t-b">b</span> = √(<span class="t-c">c</span>² − <span class="t-a">a</span>²)</div>
    <p>Si conoces la hipotenusa y un cateto: <b>a la hipotenusa al cuadrado le restas el cateto al cuadrado</b> y sacas la raíz. (Se despeja de a² + b² = c²: pasamos a² restando al otro lado.)</p>
    <div class="lab-controls">${range('py-ca-c', 'Hipotenusa <b class="t-c">c</b>', 't-c', 1, 15, 0.5, 13)}${range('py-ca-a', 'Cateto <b class="t-a">a</b>', 't-a', 0.5, 14.5, 0.5, 5)}</div>
    <div class="btn-row"><button class="lbtn ghost" id="py-ca-random">🎲 Otro triángulo</button></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-cat"></canvas></div>
      <div class="steps" id="py-ca-steps"></div>
    </div>
  </section>

  <section class="card" id="py-reciproco">
    <h2><span class="num">7</span> ¿Es rectángulo? (el recíproco)</h2>
    <p>El teorema también sirve <b>al revés</b>: si con tres lados se cumple que el cuadrado del <b>más largo</b> es igual a la suma de los cuadrados de los otros dos, el triángulo <b>sí</b> tiene un ángulo recto. Escribe tres medidas:</p>
    <div class="btn-row">
      <label>Lado 1 <input class="num-input" type="number" id="py-rc-1" value="5" min="0.1" step="0.5"></label>
      <label>Lado 2 <input class="num-input" type="number" id="py-rc-2" value="12" min="0.1" step="0.5"></label>
      <label>Lado 3 <input class="num-input" type="number" id="py-rc-3" value="13" min="0.1" step="0.5"></label>
      <button class="lbtn ghost" id="py-rc-random">🎲 Otras medidas</button>
    </div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-rec"></canvas></div>
      <div><div class="steps" id="py-rc-steps"></div><div class="verdict" id="py-rc-verdict"></div></div>
    </div>
    <ul class="facts">
      <li>Si a² + b² es <b>igual</b> a c²: el ángulo es <b>recto</b> (90°) → triángulo <b>rectángulo</b>.</li>
      <li>Si a² + b² es <b>mayor</b> que c²: el ángulo es <b>agudo</b> (menos de 90°) → triángulo <b>acutángulo</b>.</li>
      <li>Si a² + b² es <b>menor</b> que c²: el ángulo es <b>obtuso</b> (más de 90°) → triángulo <b>obtusángulo</b>.</li>
      <li>Si el lado más largo es igual o mayor que la suma de los otros dos, <b>no se puede armar</b> el triángulo.</li>
    </ul>
  </section>

  <section class="card" id="py-lab">
    <h2><span class="num">8</span> Laboratorio: arma tu triángulo</h2>
    <p><b>Arrastra los vértices</b> <b class="t-a">A</b> (sobre el eje x) y <b class="t-b">B</b> (sobre el eje y). El ángulo recto queda en el origen. Toca cualquier punto para ver sus coordenadas.</p>
    <div class="btn-row"><label class="chk"><input type="checkbox" id="py-lab-squares" checked> Mostrar los cuadrados</label><button class="lbtn ghost" id="py-lab-random">🎲 Al azar</button><button class="lbtn ghost" id="py-lab-triple">⭐ Una terna 3-4-5</button></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-lab"></canvas></div>
      <div><table class="vtable" id="py-tab-lab"></table><div class="explain" id="py-lab-explain"></div></div>
    </div>
  </section>

  <section class="card" id="py-distancia">
    <h2><span class="num">9</span> Distancia entre dos puntos</h2>
    <p>¿Cuánto mide el segmento entre dos puntos del plano? Hay un <b>triángulo rectángulo escondido</b>: el avance horizontal y la subida vertical son los <b>catetos</b>, y el segmento es la <b>hipotenusa</b>. <b>Arrastra P y Q:</b></p>
    <div class="formula-box">distancia = √((x₂ − x₁)² + (y₂ − y₁)²)</div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-dist"></canvas></div>
      <div class="steps" id="py-dist-steps"></div>
    </div>
    <div class="tip">🔗 <b>¿Te suena?</b> Son los <b>mismos dos catetos</b> que usamos para la <b>pendiente</b> en la lección de función lineal: pendiente = subida ÷ avance. La pendiente usa los catetos para saber <b>qué tan inclinada</b> está la recta; Pitágoras los usa para saber <b>cuánto mide</b> el tramo.</div>
  </section>

  <section class="card" id="py-pendiente">
    <h2><span class="num">10</span> La pendiente es un triángulo rectángulo</h2>
    <p>En la recta <span class="eq"><span class="t-y">y</span> = <span class="t-c">m</span><span class="t-a">x</span></span>, cada escalón de la "escalera" avanza <span class="t-a">1</span> y sube <span class="t-b">m</span>. ¡Cada escalón es un triángulo rectángulo! Con Pitágoras sabemos cuánto mide su hipotenusa, o sea, <b>cuánto camino se recorre sobre la recta por cada paso</b>:</p>
    <div class="formula-box">largo de un escalón = √(<span class="t-a">1</span>² + <span class="t-b">m</span>²) = √(1 + m²)</div>
    <div class="lab-controls">${range('py-pe-m', 'Pendiente <b class="t-c">m</b>', 't-c', -4, 4, 0.25, 0.75)}</div>
    <div class="btn-row"><button class="lbtn" id="py-pe-walk">▶ Caminar sobre la recta</button></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-pend"></canvas></div>
      <div><table class="vtable" id="py-tab-pend"></table><div class="explain" id="py-pe-explain"></div></div>
    </div>
    <h3>La distancia recorrida es… ¡una función lineal!</h3>
    <p>Si caminas sobre la recta desde x = 0 hasta x, recorres <span class="eq">d = √(1 + m²) · x</span>. Es una <b>proporción directa</b> (una recta que pasa por el origen) y su pendiente es el largo de un escalón. Toca un punto de esta gráfica:</p>
    <div class="plot-wrap"><canvas id="py-plot-pend2"></canvas></div>
    <ul class="facts">
      <li>Con m = 0 (recta horizontal) cada escalón mide exactamente 1: no subes nada.</li>
      <li>Mientras más empinada (m más grande, positiva o negativa), más largo es cada escalón: por eso subir un cerro empinado cansa más.</li>
      <li>Con m = 0,75 = 3/4, cuatro pasos avanzan 4 y suben 3: ¡el triángulo 3-4-5! El tramo mide 5.</li>
    </ul>
  </section>

  <section class="card" id="py-circulo">
    <h2><span class="num">11</span> Distancia al origen y el círculo</h2>
    <p>La distancia de un punto (<span class="t-a">x</span>, <span class="t-b">y</span>) al origen es la hipotenusa de un triángulo de catetos x e y: <b>√(x² + y²)</b>. Si juntamos <b>todos</b> los puntos que están a la misma distancia <span class="t-c">r</span>, ¡se forma un <b>círculo</b>!</p>
    <div class="formula-box"><span class="t-a">x</span>² + <span class="t-b">y</span>² = <span class="t-c">r</span>²</div>
    <div class="lab-controls">${range('py-ci-r', 'Radio <b class="t-c">r</b>', 't-c', 1, 6, 0.5, 5)}</div>
    <div class="btn-row"><button class="lbtn" id="py-ci-play">▶ Dar la vuelta</button></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-circ"></canvas></div>
      <div><table class="vtable" id="py-tab-circ"></table><div class="explain" id="py-ci-explain"></div></div>
    </div>
    <div class="tip">🔗 El círculo <b>no es una función</b>: una misma x tiene <b>dos</b> valores de y (uno arriba y otro abajo), y la "máquina" de una función solo puede devolver uno. Por eso se dibuja con dos mitades: y = √(r² − x²) arriba e y = −√(r² − x²) abajo.</div>
  </section>

  <section class="card" id="py-vida">
    <h2><span class="num">12</span> Problemas de la vida real</h2>
    <div class="mini-tabs" id="py-vida-tabs"><button data-v="escalera" class="is-active">🪜 La escalera</button><button data-v="pantalla">📺 La pantalla</button><button data-v="atajo">🌳 El atajo por la plaza</button></div>
    <p id="py-vida-text"></p>
    <div class="lab-controls" id="py-vida-controls"></div>
    <div class="two-col">
      <div class="plot-wrap"><canvas id="py-plot-vida"></canvas></div>
      <div class="steps" id="py-vida-steps"></div>
    </div>
  </section>

  <section class="card" id="py-ternas">
    <h2><span class="num">13</span> Ternas pitagóricas</h2>
    <p>Una <b>terna pitagórica</b> son tres números <b>enteros</b> que cumplen a² + b² = c². La más famosa es <b>3, 4, 5</b>: 9 + 16 = 25. Si multiplicas una terna por cualquier número, ¡sigue siendo terna! Mueve el multiplicador:</p>
    <div class="lab-controls">${range('py-te-k', 'Multiplicar por <b>k</b>', '', 1, 6, 1, 1)}</div>
    <div class="table-scroll"><table class="vtable" id="py-tab-ternas"></table></div>
    <h3>Para curiosos: una fábrica de ternas</h3>
    <p>Elige dos números enteros <b>p</b> mayor que <b>q</b>. Entonces <span class="t-a">a = p² − q²</span>, <span class="t-b">b = 2·p·q</span> y <span class="t-c">c = p² + q²</span> siempre forman una terna.</p>
    <div class="lab-controls">${range('py-te-p', '<b>p</b>', '', 2, 8, 1, 2)}${range('py-te-q', '<b>q</b>', '', 1, 7, 1, 1)}</div>
    <div class="steps" id="py-te-steps"></div>
  </section>

  <section class="card" id="py-errores">
    <h2><span class="num">14</span> Errores comunes (¡y cómo evitarlos!)</h2>
    <ul class="facts errors">
      <li><b>Sumar los lados sin elevarlos.</b> Con catetos 3 y 4, la hipotenusa <b>no</b> es 3 + 4 = 7: es √(9 + 16) = √25 = 5.</li>
      <li><b>Olvidar la raíz.</b> a² + b² te da c², no c. Con catetos 6 y 8: 36 + 64 = 100 es c²; c = √100 = 10.</li>
      <li><b>Equivocarse de hipotenusa.</b> La hipotenusa es la que está <b>frente al ángulo recto</b> y es la más larga. En la fórmula siempre va sola del lado de c².</li>
      <li><b>Sumar cuando hay que restar.</b> Para un cateto: b² = c² − a² (se resta). Si te da un cateto más largo que la hipotenusa, ¡algo salió mal!</li>
      <li><b>Usarlo en cualquier triángulo.</b> Solo vale si hay un ángulo recto (90°). Para saber si lo hay, usa el recíproco (capítulo 7).</li>
      <li><b>Creer que √(a² + b²) = a + b.</b> La raíz de una suma no es la suma de las raíces: √(9 + 16) = 5, pero √9 + √16 = 7.</li>
    </ul>
  </section>

  <section class="card" id="py-desafios">
    <h2><span class="num">15</span> Desafíos</h2>
    <p>Pon a prueba lo que aprendiste. <b>Cada intento trae números nuevos</b>. Al responder verás la explicación, y al terminar tu <b>nota</b> (de 1,0 a 7,0; con el 60 % se aprueba con 4,0). Todos tus intentos quedan guardados para ver cómo vas mejorando.</p>
    <div id="py-quiz"></div>
  </section>

  <section class="card" id="py-glosario">
    <h2><span class="num">16</span> Glosario</h2>
    <dl class="glossary">
      <dt>Ángulo recto</dt><dd>Ángulo de 90°, como la esquina de una hoja. Se marca con un cuadradito.</dd>
      <dt>Triángulo rectángulo</dt><dd>Triángulo que tiene un ángulo recto.</dd>
      <dt>Catetos (<span class="t-a">a</span>, <span class="t-b">b</span>)</dt><dd>Los dos lados que forman el ángulo recto.</dd>
      <dt>Hipotenusa (<span class="t-c">c</span>)</dt><dd>El lado frente al ángulo recto. Siempre es el más largo.</dd>
      <dt>Teorema de Pitágoras</dt><dd>En todo triángulo rectángulo: a² + b² = c².</dd>
      <dt>Al cuadrado (²)</dt><dd>Multiplicar un número por sí mismo: 5² = 25. Es el área de un cuadrado de ese lado.</dd>
      <dt>Raíz cuadrada (√)</dt><dd>Lo contrario de elevar al cuadrado: √25 = 5 porque 5 · 5 = 25.</dd>
      <dt>Recíproco</dt><dd>El teorema al revés: si a² + b² = c² con el lado más largo c, el triángulo es rectángulo.</dd>
      <dt>Acutángulo / obtusángulo</dt><dd>Triángulo con todos sus ángulos agudos (menos de 90°) / con un ángulo obtuso (más de 90°).</dd>
      <dt>Terna pitagórica</dt><dd>Tres números enteros que cumplen a² + b² = c², como 3, 4, 5.</dd>
      <dt>Distancia entre dos puntos</dt><dd>√((x₂ − x₁)² + (y₂ − y₁)²): Pitágoras con el avance y la subida como catetos.</dd>
      <dt>Pendiente (m)</dt><dd>Subida ÷ avance de una recta. Sus dos catetos forman un triángulo rectángulo.</dd>
      <dt>Círculo</dt><dd>Todos los puntos a la misma distancia r de un centro: x² + y² = r².</dd>
    </dl>
  </section>`;

  const TRI_PARTS = {
    recto: { name: '∟ El ángulo recto', text: 'Mide 90°, como la esquina de un cuaderno. Se marca con un cuadradito en el vértice. Sin ángulo recto no hay Pitágoras.' },
    a: { name: 'Cateto a', text: 'Uno de los dos lados que forman el ángulo recto. En el dibujo es el lado horizontal.' },
    b: { name: 'Cateto b', text: 'El otro lado que forma el ángulo recto. En el dibujo es el lado vertical. Da lo mismo cuál de los catetos llamas a y cuál b.' },
    c: { name: 'Hipotenusa c', text: 'El lado que está frente al ángulo recto, el que "cruza" entre los catetos. Siempre es el más largo: más que cada cateto, pero menos que los dos catetos juntos.' }
  };
  const EQ_PARTS = {
    a: { name: 'a — un cateto', text: 'La medida de uno de los lados que forman el ángulo recto.' },
    b: { name: 'b — el otro cateto', text: 'La medida del otro lado que forma el ángulo recto. Se pueden intercambiar: a² + b² es lo mismo que b² + a².' },
    c: { name: 'c — la hipotenusa', text: 'La medida del lado frente al ángulo recto, el más largo. Siempre va sola en un lado del "=".' },
    pot: { name: '² — "al cuadrado"', text: 'Multiplicar el número por sí mismo. 4² = 4·4 = 16. Es el área del cuadrado que tiene ese lado.' },
    mas: { name: '+ — sumar', text: 'Se suman las dos áreas de los catetos (¡después de elevar al cuadrado, no antes!).' },
    eq: { name: '= — "es igual a"', text: 'Lo de la izquierda (a² + b²) vale exactamente lo mismo que lo de la derecha (c²).' }
  };
  const EQ_EXAMPLES = [{ a: 3, b: 4, c: 5 }, { a: 6, b: 8, c: 10 }, { a: 5, b: 12, c: 13 }, { a: 8, b: 15, c: 17 }];

  // ----- Desafíos (ver quiz.js): números nuevos en cada intento -----
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
  const N = (v) => (v < 0 ? `−${-v}` : String(v));
  const QUIZ_TEMPLATES = [
    { topic: 'Calcular la hipotenusa', make(r) {
      const [a, b, c] = r.pick(TRIPLES), k = r.pick([1, 1, 2, 3]);
      return { q: `Los catetos de un triángulo rectángulo miden <b>${a * k}</b> y <b>${b * k}</b>. ¿Cuánto mide la hipotenusa?`, correct: c * k, wrong: [a * k + b * k, sq(a * k) + sq(b * k), c * k + 1],
        why: `c = √(${a * k}² + ${b * k}²) = √(${sq(a * k)} + ${sq(b * k)}) = √${sq(c * k)} = ${c * k}.` };
    } },
    { topic: 'Calcular un cateto', make(r) {
      const [a, b, c] = r.pick(TRIPLES), k = r.pick([1, 1, 2]);
      return { q: `La hipotenusa mide <b>${c * k}</b> y un cateto <b>${a * k}</b>. ¿Cuánto mide el otro cateto?`, correct: b * k, wrong: [c * k - a * k, Math.round(Math.sqrt(sq(c * k) + sq(a * k))), b * k + 2],
        why: `b = √(${c * k}² − ${a * k}²) = √(${sq(c * k)} − ${sq(a * k)}) = √${sq(b * k)} = ${b * k}.` };
    } },
    { topic: 'Reconocer la hipotenusa', make(r) {
      const [a, b, c] = r.pick(TRIPLES);
      return { q: `Los lados de un triángulo rectángulo miden ${a}, ${b} y ${c}. ¿Cuál es la hipotenusa?`, correct: c, wrong: [a, b, a + b],
        why: `La hipotenusa es siempre el lado más largo: ${c}. Además ${a}² + ${b}² = ${sq(a)} + ${sq(b)} = ${sq(c)} = ${c}².` };
    } },
    { topic: '¿Es rectángulo?', make(r) {
      const [a, b, c] = r.pick(TRIPLES);
      const yes = r.chance(0.5);
      const cc = yes ? c : c + r.pick([1, -1, 2]);
      const s = sq(a) + sq(b);
      return { q: `Un triángulo tiene lados ${a}, ${b} y ${cc}. ¿Es un triángulo rectángulo?`, correct: yes ? 'Sí' : 'No',
        wrong: [yes ? 'No' : 'Sí', 'No se puede saber'],
        why: `${a}² + ${b}² = ${s} y ${cc}² = ${sq(cc)}. ${s === sq(cc) ? 'Son iguales: sí es rectángulo.' : `No son iguales: no es rectángulo (${s > sq(cc) ? 'es acutángulo' : 'es obtusángulo'}).`}` };
    } },
    { topic: 'Distancia entre dos puntos', make(r) {
      const [a, b, c] = r.pick(TRIPLES.slice(0, 5)), x1 = r.int(-5, 3), y1 = r.int(-5, 3);
      const sx = r.pick([1, -1]), sy = r.pick([1, -1]);
      const x2 = x1 + sx * a, y2 = y1 + sy * b;
      return { q: `¿Cuál es la distancia entre <b>(${N(x1)}, ${N(y1)})</b> y <b>(${N(x2)}, ${N(y2)})</b>?`, correct: c, wrong: [a + b, sq(a) + sq(b), abs(b - a) || c + 2],
        why: `Avance = ${a}, subida = ${b}. Distancia = √(${a}² + ${b}²) = √${sq(a) + sq(b)} = ${c}.` };
    } },
    { topic: 'Pendiente y largo de un tramo', make(r) {
      const [a, b, c] = r.pick([[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13]]), k = r.pick([1, 2]);
      return { q: `La recta y = (${b}/${a})·x sube ${b} por cada ${a} que avanza. ¿Cuánto mide el tramo de recta entre x = 0 y x = ${a * k}?`, correct: c * k, wrong: [a * k, b * k, (a + b) * k],
        why: `Avanza ${a * k} y sube ${b * k}: es un triángulo rectángulo. Tramo = √(${a * k}² + ${b * k}²) = √${sq(c * k)} = ${c * k}.` };
    } },
    { topic: 'La escalera', make(r) {
      const [a, b, c] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]);
      return { q: `Una escalera de <b>${c} m</b> está apoyada en una pared con su base a <b>${a} m</b> de la pared. ¿A qué altura llega?`, correct: `${b} m`, wrong: [`${c - a} m`, `${c + a} m`, `${Math.round(Math.sqrt(sq(c) + sq(a)))} m`],
        why: `La escalera es la hipotenusa. Altura = √(${c}² − ${a}²) = √(${sq(c)} − ${sq(a)}) = √${sq(b)} = ${b} m.` };
    } },
    { topic: 'Áreas de los cuadrados', make(r) {
      const A1 = r.int(2, 30), A2 = r.int(2, 30);
      return { q: `Los cuadrados dibujados sobre los catetos tienen áreas <b>${A1}</b> y <b>${A2}</b>. ¿Qué área tiene el cuadrado sobre la hipotenusa?`, correct: A1 + A2, wrong: [abs(A1 - A2) || A1 + A2 + 3, A1 * A2, Math.round(Math.sqrt(A1 + A2) * 10) / 10],
        why: `Por el teorema, el área del cuadrado de la hipotenusa es la suma: ${A1} + ${A2} = ${A1 + A2}.` };
    } },
    { topic: 'Distancia al origen', make(r) {
      const [a, b, c] = r.pick(TRIPLES.slice(0, 5));
      const x = a * r.pick([1, -1]), y = b * r.pick([1, -1]);
      return { q: `¿A qué distancia del origen está el punto <b>(${N(x)}, ${N(y)})</b>?`, correct: c, wrong: [abs(x) + abs(y), sq(x) + sq(y), Math.max(abs(x), abs(y))],
        why: `Distancia = √(${N(x)}² + ${N(y)}²) = √(${sq(x)} + ${sq(y)}) = √${sq(c)} = ${c}.` };
    } },
    { topic: 'La pantalla', make(r) {
      const [a, b, c] = r.pick([[3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20]]), k = r.pick([2, 3, 4]);
      return { q: `Una pantalla mide <b>${b * k} cm</b> de ancho y <b>${a * k} cm</b> de alto. ¿Cuánto mide su diagonal?`, correct: `${c * k} cm`, wrong: [`${(a + b) * k} cm`, `${(c + 1) * k} cm`, `${b * k - a * k} cm`],
        why: `La diagonal es la hipotenusa: √(${b * k}² + ${a * k}²) = √(${sq(b * k)} + ${sq(a * k)}) = √${sq(c * k)} = ${c * k} cm.` };
    } }
  ];

  // ----- Estado (se guarda en ZenBan y en el navegador) -----
  const st = {
    arA: 3, arB: 4, dmA: 2, dmB: 3, hiA: 6, hiB: 8, caC: 13, caA: 5, rc: [5, 12, 13],
    labA: 3, labB: 4, P: { x: -3, y: -2 }, Q: { x: 3, y: 6 }, peM: 0.75, ciR: 5, teK: 1, teP: 2, teQ: 1, vida: 'escalera',
    vEsc: { L: 5, d: 3 }, vPan: { w: 16, h: 9 }, vAta: { w: 8, h: 6 }
  };
  let quiz = null, nav = null, pending = null, rootEl = null;
  const plots = {};
  const stop = {};
  const refreshers = [];
  const cancel = (k) => { if (stop[k]) { stop[k](); stop[k] = null; } };
  const changed = () => MathLessons.changed();

  // Slider unido a una clave del estado: al moverlo actualiza el estado y llama a upd()
  function bindRange(root, id, get, set, upd, fmt = (v) => f(v)) {
    const el = root.querySelector(`#${id}`), out = root.querySelector(`#${id}-val`);
    const show = () => { if (out) out.textContent = fmt(Number(el.value)); };
    el.addEventListener('input', () => { set(Number(el.value)); show(); upd(); changed(); });
    refreshers.push(() => { el.value = String(get()); show(); upd(); });
    show();
    return el;
  }

  // Triángulo rectángulo en el origen con catetos sobre los ejes: O(0,0), A(a,0), B(0,b)
  function drawRightTriangle(p, a, b, { squares = false, tiles = 0, tileStage = null, labels = true } = {}) {
    const O = [0, 0], A = [a, 0], B = [0, b];
    const c = Math.hypot(a, b);
    if (squares) {
      p.poly([[0, 0], [a, 0], [a, -a], [0, -a]], A_FILL, C.a);
      p.poly([[0, 0], [0, b], [-b, b], [-b, 0]], B_FILL, C.b);
      const Hc = [[a, 0], [0, b], [b, a + b], [a + b, a]];
      p.poly(Hc, C_FILL, C.c);
      // Cuadraditos de 1×1 (cuadrícula) dentro de cada cuadrado
      if (tiles) {
        const grid = (x0, y0, sx, sy, n, color) => { for (let i = 1; i < n; i++) { p.segment(x0 + i * sx, y0, x0 + i * sx, y0 + n * sy, color, 1); p.segment(x0, y0 + i * sy, x0 + n * sx, y0 + i * sy, color, 1); } };
        if (isInt(a)) grid(0, 0, 1, -1, a, 'rgba(143,136,255,0.5)');
        if (isInt(b)) grid(0, 0, -1, 1, b, 'rgba(0,212,170,0.5)');
        if (isInt(c)) {
          const u = [-a / c, b / c], v = [b / c, a / c];
          for (let i = 1; i < Math.round(c); i++) {
            p.segment(a + u[0] * i, u[1] * i, a + u[0] * i + v[0] * c, u[1] * i + v[1] * c, 'rgba(255,107,157,0.5)', 1);
            p.segment(a + v[0] * i, v[1] * i, a + v[0] * i + u[0] * c, v[1] * i + u[1] * c, 'rgba(255,107,157,0.5)', 1);
          }
        }
      }
      // Animación de contar: se van llenando los cuadraditos
      if (tileStage) {
        const fillCells = (n, cell, color) => { for (let k = 0; k < n; k++) p.poly(cell(k), color); };
        const nA = Math.min(sq(a), tileStage.a || 0), nB = Math.min(sq(b), tileStage.b || 0);
        fillCells(nA, (k) => { const i = k % a, j = Math.floor(k / a); return [[i, -j], [i + 1, -j], [i + 1, -j - 1], [i, -j - 1]]; }, 'rgba(143,136,255,0.75)');
        fillCells(nB, (k) => { const i = k % b, j = Math.floor(k / b); return [[-i, j], [-i - 1, j], [-i - 1, j + 1], [-i, j + 1]]; }, 'rgba(0,212,170,0.75)');
        if (tileStage.c && isInt(c)) {
          const cn = Math.round(c), u = [-a / c, b / c], v = [b / c, a / c];
          const nC = Math.min(cn * cn, tileStage.c);
          for (let k = 0; k < nC; k++) {
            const i = k % cn, j = Math.floor(k / cn);
            const P0 = [a + u[0] * i + v[0] * j, u[1] * i + v[1] * j];
            p.poly([P0, [P0[0] + u[0], P0[1] + u[1]], [P0[0] + u[0] + v[0], P0[1] + u[1] + v[1]], [P0[0] + v[0], P0[1] + v[1]]], 'rgba(255,107,157,0.75)');
          }
        } else if (tileStage.c) {
          p.poly(Hc, `rgba(255,107,157,${Math.min(0.75, tileStage.c / Math.max(1, sq(c)) * 0.75)})`);
        }
      }
    }
    p.poly([O, A, B], 'rgba(255,255,255,0.06)');
    p.segment(0, 0, a, 0, C.a, 4);
    p.segment(0, 0, 0, b, C.b, 4);
    p.segment(a, 0, 0, b, C.c, 4);
    p.rightAngle(O, A, B, '#fff', Math.min(a, b) * 0.18 + 0.1);
    if (labels) {
      p.text(`a = ${f(a)}`, a / 2, 0, C.a, { dy: squares ? -8 : 18, align: 'center' });
      p.text(`b = ${f(b)}`, 0, b / 2, C.b, { dx: squares ? 8 : -8, align: squares ? 'left' : 'right' });
      p.text(`c = ${isInt(c) ? f(c) : f(c)}`, a / 2, b / 2, C.c, { dx: 10, dy: -6 });
    }
    p.point(0, 0, '#fff');
    p.point(a, 0, C.a);
    p.point(0, b, C.b);
  }

  const viewFor = (a, b, withSquares) => {
    if (!withSquares) { const m = Math.max(a, b) + 1.5; return { xMin: -1.5, xMax: m, yMin: -1.5, yMax: m }; }
    const lo = -Math.max(a, b) - 1, hi = a + b + 1;
    return { xMin: lo, xMax: hi, yMin: lo, yMax: hi, step: hi - lo > 18 ? 2 : 1 };
  };

  // ----- 1. El triángulo y sus partes -----
  function setupTriangle(root) {
    const p = new Plot(root.querySelector('#py-plot-tri'), { xMin: -5, xMax: 5, yMin: -5, yMax: 5, aspect: 1, step: 1, labels: false });
    plots.tri = p;
    let part = 'c', angle = 0;
    const card = root.querySelector('#py-tri-card');
    const draw = () => {
      // Triángulo 3-4-5 girado "angle" alrededor de su centro
      const pts = [[-1.5, -1.3], [2.5, -1.3], [-1.5, 1.7]].map(([x, y]) => [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)]);
      const [O, A, B] = pts;
      p.draw(() => {
        p.grid();
        p.poly(pts, 'rgba(255,255,255,0.06)');
        const w = (k) => (part === k ? 7 : 4);
        p.segment(O[0], O[1], A[0], A[1], C.a, w('a'));
        p.segment(O[0], O[1], B[0], B[1], C.b, w('b'));
        p.segment(A[0], A[1], B[0], B[1], C.c, w('c'));
        p.rightAngle(O, A, B, part === 'recto' ? '#FFD166' : '#fff', 0.5);
        if (part === 'recto') p.text('90°', O[0], O[1], '#FFD166', { dx: 14, dy: -14 });
        const mid = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
        const [ma, mb, mc] = [mid(O, A), mid(O, B), mid(A, B)];
        p.text('a = 4', ma[0], ma[1], C.a, { dy: 18, align: 'center', size: part === 'a' ? 16 : 13 });
        p.text('b = 3', mb[0], mb[1], C.b, { dx: -10, align: 'right', size: part === 'b' ? 16 : 13 });
        p.text('c = 5', mc[0], mc[1], C.c, { dx: 10, dy: -8, size: part === 'c' ? 16 : 13 });
      });
      const t = TRI_PARTS[part];
      card.innerHTML = `<h4>${t.name}</h4><p>${t.text}</p>`;
      root.querySelectorAll('#py-tri-parts button').forEach(b => b.classList.toggle('is-active', b.dataset.tp === part));
    };
    root.querySelector('#py-tri-parts').addEventListener('click', (e) => { const b = e.target.closest('[data-tp]'); if (b) { part = b.dataset.tp; draw(); } });
    root.querySelector('#py-tri-rotate').addEventListener('click', () => {
      cancel('tri');
      const from = angle, to = angle + Math.PI / 2;
      stop.tri = Plot.animate(1200, (t) => { angle = from + (to - from) * Plot.ease(t); draw(); });
    });
    draw();
  }

  // ----- 2. Las partes de la fórmula, con un ejemplo que se destaca -----
  function setupEquation(root) {
    const card = root.querySelector('#py-part-card'), ex = root.querySelector('#py-eq-example');
    let current = 'c', idx = 0;
    const says = (k, e) => ({
      a: `<b>a = ${e.a}</b>: un cateto. Al cuadrado: ${e.a}² = ${sq(e.a)}.`,
      b: `<b>b = ${e.b}</b>: el otro cateto. Al cuadrado: ${e.b}² = ${sq(e.b)}.`,
      c: `<b>c = ${e.c}</b>: la hipotenusa, el lado más largo. Al cuadrado: ${e.c}² = ${sq(e.c)}.`,
      pot: `<b>²</b>: ${e.a}² = ${e.a}·${e.a} = ${sq(e.a)}, ${e.b}² = ${sq(e.b)} y ${e.c}² = ${sq(e.c)}.`,
      mas: `<b>+</b>: se suman las áreas de los catetos: ${sq(e.a)} + ${sq(e.b)} = ${sq(e.a) + sq(e.b)}.`,
      eq: `<b>=</b>: ${sq(e.a) + sq(e.b)} es igual a ${sq(e.c)}. ¡Se cumple!`
    })[k];
    const render = () => {
      const e = EQ_EXAMPLES[idx];
      ex.innerHTML = `
        <div class="ex-head"><span class="ex-label">Ejemplo</span><span class="ex-what">Triángulo de catetos ${e.a} y ${e.b}, hipotenusa ${e.c}</span><button type="button" class="lbtn ghost lq-small" data-ex-next>🎲 Otro ejemplo</button></div>
        <div class="eq ex-eq"><span data-ex="a" class="t-a">${e.a}</span><span data-ex="pot">²</span> <span data-ex="mas">+</span> <span data-ex="b" class="t-b">${e.b}</span><span data-ex="pot">²</span> <span data-ex="eq">=</span> <span data-ex="c" class="t-c">${e.c}</span><span data-ex="pot">²</span></div>
        <div class="ex-calc"><span data-ex="a" class="t-a">${sq(e.a)}</span> <span data-ex="mas">+</span> <span data-ex="b" class="t-b">${sq(e.b)}</span> <span data-ex="eq">=</span> <span data-ex="c" class="t-c">${sq(e.c)}</span></div>
        <p class="ex-says"></p>`;
      hl();
    };
    const hl = () => {
      ex.querySelectorAll('[data-ex]').forEach(s => s.classList.toggle('is-hl', s.dataset.ex === current));
      ex.querySelector('.ex-says').innerHTML = `👉 ${says(current, EQ_EXAMPLES[idx])}`;
    };
    const show = (k) => {
      current = k;
      const t = EQ_PARTS[k];
      root.querySelectorAll('#py-eq-parts button').forEach(b => b.classList.toggle('is-active', b.dataset.part === k));
      card.innerHTML = `<h4>${t.name}</h4><p>${t.text}</p>`;
      hl();
    };
    root.querySelector('#py-eq-parts').addEventListener('click', (e) => { const b = e.target.closest('[data-part]'); if (b) show(b.dataset.part); });
    ex.addEventListener('click', (e) => {
      if (e.target.closest('[data-ex-next]')) { idx = (idx + 1) % EQ_EXAMPLES.length; render(); return; }
      const s = e.target.closest('[data-ex]');
      if (s) show(s.dataset.ex);
    });
    render();
    show('c');
  }

  // ----- 3. Áreas con cuadraditos -----
  function setupAreas(root) {
    const p = new Plot(root.querySelector('#py-plot-areas'), { ...viewFor(3, 4, true), aspect: 1, labels: false });
    plots.areas = p;
    const draw = (tileStage = null) => {
      const { arA: a, arB: b } = st;
      p.setView(viewFor(a, b, true));
      p.draw(() => { p.grid(); p.axes(); drawRightTriangle(p, a, b, { squares: true, tiles: 1, tileStage }); });
    };
    const upd = () => {
      const { arA: a, arB: b } = st;
      const c2 = sq(a) + sq(b), c = Math.sqrt(c2);
      root.querySelector('#py-tab-areas').innerHTML = `<thead><tr><th>Lado</th><th>Mide</th><th>Área de su cuadrado</th></tr></thead><tbody>
        <tr><td class="t-a">Cateto a</td><td>${a}</td><td>${a}² = <b>${sq(a)}</b></td></tr>
        <tr><td class="t-b">Cateto b</td><td>${b}</td><td>${b}² = <b>${sq(b)}</b></td></tr>
        <tr><td class="t-c">Hipotenusa c</td><td>${rootTxt(c2)}</td><td>c² = <b>${c2}</b></td></tr></tbody>`;
      root.querySelector('#py-ar-explain').innerHTML = `<p><span class="t-a">${sq(a)}</span> + <span class="t-b">${sq(b)}</span> = <span class="t-c">${c2}</span> cuadraditos.</p><p>${isInt(c) ? `¡La hipotenusa mide exactamente <b>${c}</b>! Es una terna pitagórica.` : `La hipotenusa mide √${c2} ≈ ${f(c)}: no es un número entero, por eso su cuadrado no se divide en cuadraditos exactos, pero su área igual es ${c2}.`}</p>`;
      draw();
    };
    bindRange(root, 'py-ar-a', () => st.arA, v => { st.arA = v; }, () => { cancel('areas'); upd(); });
    bindRange(root, 'py-ar-b', () => st.arB, v => { st.arB = v; }, () => { cancel('areas'); upd(); });
    root.querySelector('#py-ar-count').addEventListener('click', () => {
      cancel('areas');
      const { arA: a, arB: b } = st, c2 = sq(a) + sq(b);
      stop.areas = Plot.animate(Math.min(9000, 2500 + c2 * 60), (t) => {
        // Primero se cuentan los de a, después los de b, y al final se llena c (con la misma cantidad)
        const total = sq(a) + sq(b);
        const k = Math.floor(t * 1.0001 * (total * 2));
        draw({ a: Math.min(sq(a), k), b: Math.max(0, Math.min(sq(b), k - sq(a))), c: Math.max(0, k - total) });
      }, () => draw({ a: sq(a), b: sq(b), c: c2 }));
    });
    upd();
  }

  // ----- 4. Demostración: cuatro triángulos que se reordenan (movimientos rígidos) -----
  function setupDemo(root) {
    const p = new Plot(root.querySelector('#py-plot-demo'), { xMin: -0.5, xMax: 5.5, yMin: -0.5, yMax: 5.5, aspect: 1, step: 1, labels: false });
    plots.demo = p;
    let t = 0;
    const rot = ([x, y], ang) => [x * Math.cos(ang) - y * Math.sin(ang), x * Math.sin(ang) + y * Math.cos(ang)];
    const draw = () => {
      const a = st.dmA, b = st.dmB, s = a + b;
      p.setView({ xMin: -0.5, xMax: s + 0.5, yMin: -0.5, yMax: s + 0.5, step: s > 9 ? 2 : 1 });
      // Cada triángulo: esquina del ángulo recto, vector del cateto a y del cateto b, y adónde va (esquina y giro)
      const tris = [
        { corner: [0, 0], va: [a, 0], vb: [0, b], to: [a, a], ang: -Math.PI / 2 },
        { corner: [s, 0], va: [0, a], vb: [-b, 0], to: [s, 0], ang: 0 },
        { corner: [s, s], va: [-a, 0], vb: [0, -b], to: [a, s], ang: 0 },
        { corner: [0, s], va: [0, -a], vb: [b, 0], to: [0, a], ang: Math.PI / 2 }
      ];
      const e = Plot.ease(t);
      p.draw(() => {
        p.grid();
        p.poly([[0, 0], [s, 0], [s, s], [0, s]], null, '#fff', 2);
        // Lo libre: al principio el cuadrado c², al final los cuadrados a² y b²
        if (t < 0.5) p.poly([[a, 0], [s, a], [b, s], [0, b]], `rgba(255,107,157,${0.35 * (1 - t * 2)})`, null);
        if (t > 0.5) {
          p.poly([[0, 0], [a, 0], [a, a], [0, a]], `rgba(143,136,255,${0.35 * (t * 2 - 1)})`, null);
          p.poly([[a, a], [s, a], [s, s], [a, s]], `rgba(0,212,170,${0.35 * (t * 2 - 1)})`, null);
        }
        const colors = ['#5b53d6', '#3a3fa8', '#4f46e5', '#6d5ff0'];
        tris.forEach((T, i) => {
          const ang = T.ang * e;
          const corner = [T.corner[0] + (T.to[0] - T.corner[0]) * e, T.corner[1] + (T.to[1] - T.corner[1]) * e];
          const va = rot(T.va, ang), vb = rot(T.vb, ang);
          const pts = [corner, [corner[0] + va[0], corner[1] + va[1]], [corner[0] + vb[0], corner[1] + vb[1]]];
          p.poly(pts, colors[i], '#c7c2ff', 1.5);
        });
        if (t < 0.02) p.text(`c² (rosado)`, s / 2, s / 2, C.c, { align: 'center', size: 15 });
        if (t > 0.98) { p.text('a²', a / 2, a / 2, C.a, { align: 'center', size: 16 }); p.text('b²', a + b / 2, a + b / 2, C.b, { align: 'center', size: 16 }); }
      });
    };
    const go = (to) => {
      cancel('demo');
      const from = t;
      stop.demo = Plot.animate(2600, (k) => { t = from + (to - from) * k; draw(); });
    };
    bindRange(root, 'py-dm-a', () => st.dmA, v => { st.dmA = v; }, () => { cancel('demo'); t = 0; draw(); });
    bindRange(root, 'py-dm-b', () => st.dmB, v => { st.dmB = v; }, () => { cancel('demo'); t = 0; draw(); });
    root.querySelector('#py-dm-play').addEventListener('click', () => go(1));
    root.querySelector('#py-dm-back').addEventListener('click', () => go(0));
    draw();
  }

  // ----- 5 y 6. Calcular la hipotenusa / un cateto -----
  function setupHip(root) {
    const p = new Plot(root.querySelector('#py-plot-hip'), { ...viewFor(6, 8, false), aspect: 1 });
    plots.hip = p;
    const upd = () => {
      const { hiA: a, hiB: b } = st;
      const c2 = sq(a) + sq(b);
      p.setView({ ...viewFor(a, b, false), step: Math.max(a, b) > 9 ? 2 : 1 });
      p.draw(() => { p.grid(); p.axes(); drawRightTriangle(p, a, b); });
      root.querySelector('#py-hi-steps').innerHTML = `
        <p><b>Paso 1 · Eleva los catetos al cuadrado:</b> <span class="t-a">${f(a)}² = ${f(sq(a))}</span> &nbsp; <span class="t-b">${f(b)}² = ${f(sq(b))}</span></p>
        <p><b>Paso 2 · Súmalos:</b> ${f(sq(a))} + ${f(sq(b))} = <b class="t-c">${f(c2)}</b> &nbsp;(eso es c²)</p>
        <p><b>Paso 3 · Saca la raíz:</b> c = √${f(c2)} = <b class="t-c">${rootTxt(c2)}</b></p>
        <p class="result">La hipotenusa mide <b class="t-c">${f(Math.sqrt(c2))}</b>. ${isInt(Math.sqrt(c2)) && isInt(a) && isInt(b) ? '⭐ ¡Los tres lados son enteros: es una terna pitagórica!' : ''}</p>
        <p class="small">Comprueba: es más larga que cada cateto (${f(a)} y ${f(b)}) pero más corta que los dos juntos (${f(a + b)}).</p>`;
    };
    bindRange(root, 'py-hi-a', () => st.hiA, v => { st.hiA = v; }, upd);
    bindRange(root, 'py-hi-b', () => st.hiB, v => { st.hiB = v; }, upd);
    root.querySelector('#py-hi-random').addEventListener('click', () => {
      const useTriple = Math.random() < 0.6;
      const [a, b] = useTriple ? TRIPLES[Math.floor(Math.random() * 5)] : [Math.ceil(Math.random() * 20) / 2, Math.ceil(Math.random() * 20) / 2];
      st.hiA = Math.min(12, a); st.hiB = Math.min(12, b);
      refreshers.forEach(r => r());
      changed();
    });
    upd();
  }

  function setupCat(root) {
    const p = new Plot(root.querySelector('#py-plot-cat'), { ...viewFor(5, 12, false), aspect: 1 });
    plots.cat = p;
    const cIn = () => root.querySelector('#py-ca-c'), aIn = () => root.querySelector('#py-ca-a');
    const upd = () => {
      // El cateto tiene que ser menor que la hipotenusa
      if (st.caA >= st.caC) { st.caA = Math.max(0.5, st.caC - 0.5); aIn().value = String(st.caA); root.querySelector('#py-ca-a-val').textContent = f(st.caA); }
      aIn().max = String(Math.max(0.5, st.caC - 0.5));
      const { caC: c, caA: a } = st;
      const b2 = sq(c) - sq(a), b = Math.sqrt(b2);
      p.setView({ ...viewFor(a, b, false), step: Math.max(a, b) > 9 ? 2 : 1 });
      p.draw(() => { p.grid(); p.axes(); drawRightTriangle(p, a, b); });
      root.querySelector('#py-ca-steps').innerHTML = `
        <p><b>Paso 1 · Al cuadrado:</b> <span class="t-c">${f(c)}² = ${f(sq(c))}</span> &nbsp; <span class="t-a">${f(a)}² = ${f(sq(a))}</span></p>
        <p><b>Paso 2 · Resta</b> (hipotenusa menos cateto): ${f(sq(c))} − ${f(sq(a))} = <b class="t-b">${f(b2)}</b> &nbsp;(eso es b²)</p>
        <p><b>Paso 3 · Saca la raíz:</b> b = √${f(b2)} = <b class="t-b">${rootTxt(b2)}</b></p>
        <p class="result">El otro cateto mide <b class="t-b">${f(b)}</b>.</p>
        <p class="small">Comprueba: ${f(a)}² + ${f(b)}² ≈ ${f(sq(a) + sq(b))} = ${f(c)}² ✅. El cateto siempre es más corto que la hipotenusa.</p>`;
    };
    bindRange(root, 'py-ca-c', () => st.caC, v => { st.caC = v; }, upd);
    bindRange(root, 'py-ca-a', () => st.caA, v => { st.caA = v; }, upd);
    root.querySelector('#py-ca-random').addEventListener('click', () => {
      const [a, , c] = TRIPLES[Math.floor(Math.random() * 4)];
      st.caC = c; st.caA = a;
      refreshers.forEach(r => r());
      changed();
    });
    cIn();
    upd();
  }

  // ----- 7. ¿Es rectángulo? -----
  function setupReciprocal(root) {
    const p = new Plot(root.querySelector('#py-plot-rec'), { xMin: -1, xMax: 14, yMin: -1, yMax: 14, aspect: 1 });
    plots.rec = p;
    const ins = [1, 2, 3].map(i => root.querySelector(`#py-rc-${i}`));
    const upd = () => {
      const v = st.rc.map(Number);
      const [x, y, z] = [...v].sort((m, n) => m - n); // z = el más largo
      const s = sq(x) + sq(y), zz = sq(z);
      const steps = root.querySelector('#py-rc-steps'), verdict = root.querySelector('#py-rc-verdict');
      if (v.some(n => !(n > 0))) { steps.innerHTML = '<p>Escribe tres medidas mayores que 0.</p>'; verdict.className = 'verdict'; verdict.textContent = ''; return; }
      steps.innerHTML = `
        <p>1) El lado más largo es <b class="t-c">${f(z)}</b>; los otros, <b class="t-a">${f(x)}</b> y <b class="t-b">${f(y)}</b>.</p>
        <p>2) Suma de los cuadrados de los cortos: ${f(x)}² + ${f(y)}² = ${f(sq(x))} + ${f(sq(y))} = <b>${f(s)}</b></p>
        <p>3) Cuadrado del más largo: ${f(z)}² = <b>${f(zz)}</b></p>
        <p>4) Comparamos: ${f(s)} ${Math.abs(s - zz) < 1e-9 ? '=' : s > zz ? '>' : '<'} ${f(zz)}</p>`;
      if (x + y <= z) {
        verdict.className = 'verdict is-bad';
        verdict.textContent = `❌ No se puede armar el triángulo: ${f(x)} + ${f(y)} = ${f(x + y)} no alcanza a ser más que ${f(z)}.`;
        p.draw(() => { p.grid(); p.axes(); });
        return;
      }
      const right = Math.abs(s - zz) < 1e-9;
      verdict.className = `verdict ${right ? 'is-yes' : 'is-no'}`;
      verdict.textContent = right ? '✅ ¡Es un triángulo rectángulo! (tiene un ángulo de 90°)' : s > zz ? '🔺 No es rectángulo: es acutángulo (todos sus ángulos miden menos de 90°).' : '🔻 No es rectángulo: es obtusángulo (tiene un ángulo de más de 90°).';
      // Dibujo con las medidas reales: el ángulo entre los dos lados cortos (opuesto al largo)
      const cos = (sq(x) + sq(y) - zz) / (2 * x * y);
      const ang = Math.acos(Math.max(-1, Math.min(1, cos)));
      const B = [y * Math.cos(ang), y * Math.sin(ang)];
      const xs = [0, x, B[0]], ys = [0, 0, B[1]];
      const pad = 1.5;
      const lo = Math.min(...xs, ...ys) - pad, hi = Math.max(...xs, ...ys) + pad;
      p.setView({ xMin: lo, xMax: hi, yMin: Math.min(...ys) - pad, yMax: Math.min(...ys) - pad + (hi - lo), step: hi - lo > 18 ? 2 : 1 });
      p.draw(() => {
        p.grid(); p.axes();
        p.poly([[0, 0], [x, 0], B], 'rgba(255,255,255,0.06)');
        p.segment(0, 0, x, 0, C.a, 4);
        p.segment(0, 0, B[0], B[1], C.b, 4);
        p.segment(x, 0, B[0], B[1], C.c, 4);
        if (right) p.rightAngle([0, 0], [x, 0], B, '#7dffb3', Math.min(x, y) * 0.15 + 0.1);
        p.text(`${f(ang * 180 / Math.PI, 1)}°`, 0, 0, right ? '#7dffb3' : '#FFD166', { dx: 16, dy: -10 });
        p.point(0, 0, '#fff'); p.point(x, 0, C.a); p.point(B[0], B[1], C.b);
      });
    };
    ins.forEach((el, i) => el.addEventListener('input', () => { st.rc[i] = Number(el.value); upd(); changed(); }));
    refreshers.push(() => { ins.forEach((el, i) => { el.value = String(st.rc[i]); }); upd(); });
    root.querySelector('#py-rc-random').addEventListener('click', () => {
      const t = TRIPLES[Math.floor(Math.random() * TRIPLES.length)].slice();
      if (Math.random() < 0.5) t[2] += Math.random() < 0.5 ? 1 : -1;
      st.rc = t.sort(() => Math.random() - 0.5);
      refreshers.forEach(r => r());
      changed();
    });
    upd();
  }

  // ----- 8. Laboratorio: vértices que se arrastran -----
  function setupLab(root) {
    const p = new Plot(root.querySelector('#py-plot-lab'), { ...viewFor(3, 4, true), aspect: 1 });
    plots.lab = p;
    const squares = () => root.querySelector('#py-lab-squares').checked;
    const upd = () => {
      const { labA: a, labB: b } = st;
      const c2 = sq(a) + sq(b), c = Math.sqrt(c2);
      // La vista se agranda solo si hace falta (para no "escaparse" mientras se arrastra)
      const v = viewFor(Math.max(a, 6), Math.max(b, 6), squares());
      p.setView({ ...v, step: v.xMax - v.xMin > 18 ? 2 : 1 });
      p.draw(() => { p.grid(); p.axes(); drawRightTriangle(p, a, b, { squares: squares(), tiles: squares() ? 1 : 0 }); });
      root.querySelector('#py-tab-lab').innerHTML = `<thead><tr><th>Lado</th><th>Mide</th><th>Al cuadrado</th></tr></thead><tbody>
        <tr><td class="t-a">a</td><td>${f(a)}</td><td>${f(sq(a))}</td></tr>
        <tr><td class="t-b">b</td><td>${f(b)}</td><td>${f(sq(b))}</td></tr>
        <tr><td class="t-c">c</td><td>${rootTxt(c2)}</td><td>${f(sq(a))} + ${f(sq(b))} = <b>${f(c2)}</b></td></tr></tbody>`;
      root.querySelector('#py-lab-explain').innerHTML = `<p>La hipotenusa va del punto (<span class="t-a">${f(a)}</span>, 0) al (0, <span class="t-b">${f(b)}</span>) y mide <b class="t-c">${rootTxt(c2)}</b>.</p>
        <p>${isInt(c) && isInt(a) && isInt(b) ? '⭐ ¡Terna pitagórica! Los tres lados son enteros.' : 'Busca catetos que den una hipotenusa entera: prueba 6 y 8, o 5 y 12.'}</p>
        <p class="small">La pendiente de la hipotenusa (como recta) es −${f(b)} ÷ ${f(a)} = ${f(-b / a)}: baja ${f(b)} mientras avanza ${f(a)}.</p>`;
    };
    p.enableDrag(() => [{ id: 'A', x: st.labA, y: 0, lock: 'y' }, { id: 'B', x: 0, y: st.labB, lock: 'x' }], (id, x, y) => {
      if (id === 'A') st.labA = Math.max(0.5, Math.min(9, x));
      if (id === 'B') st.labB = Math.max(0.5, Math.min(9, y));
      upd();
    }, { snap: 0.5, onEnd: changed });
    root.querySelector('#py-lab-squares').addEventListener('change', upd);
    root.querySelector('#py-lab-random').addEventListener('click', () => { st.labA = Math.ceil(Math.random() * 16) / 2; st.labB = Math.ceil(Math.random() * 16) / 2; upd(); changed(); });
    root.querySelector('#py-lab-triple').addEventListener('click', () => { st.labA = 3; st.labB = 4; upd(); changed(); });
    refreshers.push(upd);
    upd();
  }

  // ----- 9. Distancia entre dos puntos -----
  function setupDistance(root) {
    const p = new Plot(root.querySelector('#py-plot-dist'), { xMin: -7, xMax: 7, yMin: -7, yMax: 9, aspect: 1, step: 1 });
    plots.dist = p;
    const upd = () => {
      const { P, Q } = st;
      const dx = Q.x - P.x, dy = Q.y - P.y, d2 = sq(dx) + sq(dy);
      p.draw(() => {
        p.grid(); p.axes();
        if (dx !== 0 && dy !== 0) {
          p.poly([[P.x, P.y], [Q.x, P.y], [Q.x, Q.y]], 'rgba(255,255,255,0.05)');
          p.rightAngle([Q.x, P.y], [P.x, P.y], [Q.x, Q.y], '#fff', 0.4);
        }
        p.segment(P.x, P.y, Q.x, P.y, C.a, 4);
        p.segment(Q.x, P.y, Q.x, Q.y, C.b, 4);
        p.segment(P.x, P.y, Q.x, Q.y, C.c, 4);
        p.text(`avance ${f(abs(dx))}`, (P.x + Q.x) / 2, P.y, C.a, { dy: dy >= 0 ? 18 : -8, align: 'center' });
        p.text(`${dy >= 0 ? 'subida' : 'bajada'} ${f(abs(dy))}`, Q.x, (P.y + Q.y) / 2, C.b, { dx: 8 });
        p.text(`d = ${f(Math.sqrt(d2))}`, (P.x + Q.x) / 2, (P.y + Q.y) / 2, C.c, { dx: -12, dy: -10, align: 'right' });
        p.point(P.x, P.y, C.y, `P(${f(P.x)}, ${f(P.y)})`, { r: 8 });
        p.point(Q.x, Q.y, C.line, `Q(${f(Q.x)}, ${f(Q.y)})`, { r: 8 });
      });
      root.querySelector('#py-dist-steps').innerHTML = `
        <p><b>Paso 1 · Avance (cateto horizontal):</b> x₂ − x₁ = ${f(Q.x)} − ${P.x < 0 ? `(${f(P.x)})` : f(P.x)} = <b class="t-a">${f(dx)}</b></p>
        <p><b>Paso 2 · Subida (cateto vertical):</b> y₂ − y₁ = ${f(Q.y)} − ${P.y < 0 ? `(${f(P.y)})` : f(P.y)} = <b class="t-b">${f(dy)}</b></p>
        <p><b>Paso 3 · Pitágoras:</b> d = √(${f(dx)}² + ${f(dy)}²) = √(${f(sq(dx))} + ${f(sq(dy))}) = √${f(d2)}</p>
        <p class="result">Distancia = <b class="t-c">${rootTxt(d2)}</b></p>
        <p class="small">🔗 Pendiente del segmento: m = ${f(dy)} ÷ ${f(dx)} = ${dx === 0 ? 'no existe (vertical)' : f(dy / dx)}. ¡Los mismos catetos!${dx !== 0 ? ` La recta que pasa por P y Q es y = ${f(dy / dx)}x ${P.y - dy / dx * P.x < 0 ? '−' : '+'} ${f(abs(P.y - dy / dx * P.x))}.` : ''}</p>`;
    };
    p.enableDrag(() => [{ id: 'P', ...st.P }, { id: 'Q', ...st.Q }], (id, x, y) => { st[id] = { x, y }; upd(); }, { snap: 0.5, onEnd: changed });
    refreshers.push(upd);
    upd();
  }

  // ----- 10. La pendiente es un triángulo rectángulo -----
  function setupSlope(root) {
    const p = new Plot(root.querySelector('#py-plot-pend'), { xMin: -1, xMax: 6, yMin: -5, yMax: 7, aspect: 1, step: 1 });
    const p2 = new Plot(root.querySelector('#py-plot-pend2'), { xMin: -0.5, xMax: 6, yMin: -0.5, yMax: 8, aspect: 0.6, step: 1 });
    plots.pend = p; plots.pend2 = p2;
    const draw = (walk = null) => {
      const m = st.peM, step = Math.sqrt(1 + sq(m));
      const yMax = Math.max(6, m * 5 + 1), yMin = Math.min(-1, m * 5 - 1);
      p.setView({ yMin, yMax, step: yMax - yMin > 14 ? 2 : 1 });
      p.draw(() => {
        p.grid(); p.axes();
        p.fn(x => m * x, C.line, { width: 3, xFrom: -1, xTo: 6 });
        // Escalones: avance 1 (cateto a), subida m (cateto b), el tramo de recta es la hipotenusa
        for (let i = 0; i < 5; i++) {
          p.segment(i, m * i, i + 1, m * i, C.a, 3);
          p.segment(i + 1, m * i, i + 1, m * (i + 1), C.b, 3);
          if (i === 0) {
            p.text('1', 0.5, 0, C.a, { dy: m >= 0 ? 16 : -6, align: 'center' });
            p.text(f(m), 1, m / 2, C.b, { dx: 6 });
            p.text(`√(1 + m²) ≈ ${f(step)}`, 0.5, m / 2, C.c, { dx: -8, dy: m >= 0 ? -10 : 14, align: 'right', size: 12 });
          }
        }
        for (let i = 0; i <= 5; i++) p.point(i, m * i, i === 0 ? '#fff' : C.y);
        if (walk !== null) {
          p.segment(0, 0, walk, m * walk, C.c, 6);
          p.point(walk, m * walk, '#fff', `recorrido ${f(walk * step)}`, { r: 8 });
        }
      });
      p2.setView({ yMax: Math.max(6, step * 5.5 + 0.5) });
      p2.draw(() => {
        p2.grid(); p2.axes({ x: 'x', y: 'd' });
        p2.fn(x => step * x, C.c, { width: 3, xFrom: 0, xTo: 5.8 });
        for (let i = 0; i <= 5; i++) p2.point(i, step * i, C.c);
        p2.text(`d = ${f(step)} · x`, 3.2, step * 3.2, C.c, { dx: 10, dy: 18 });
      });
    };
    const upd = () => {
      const m = st.peM, step = Math.sqrt(1 + sq(m));
      root.querySelector('#py-tab-pend').innerHTML = `<thead><tr><th class="t-a">x</th><th>y = ${f(m)}·x</th><th class="t-c">Camino desde x = 0</th></tr></thead><tbody>${[0, 1, 2, 3, 4, 5].map(x => `<tr><td>${x}</td><td>${f(m * x)}</td><td>${x} · ${f(step)} = <b>${f(x * step)}</b></td></tr>`).join('')}</tbody>`;
      root.querySelector('#py-pe-explain').innerHTML = `<p>Cada escalón: avanza <b class="t-a">1</b>, ${m >= 0 ? 'sube' : 'baja'} <b class="t-b">${f(abs(m))}</b> y su hipotenusa mide √(1² + ${f(m)}²) = √${f(1 + sq(m))} ≈ <b class="t-c">${f(step)}</b>.</p>
        <p>${m === 0 ? 'Con m = 0 la recta es horizontal y cada paso mide justo 1.' : `Por cada 1 que avanzas en x, caminas ${f(step)} sobre la recta (${f((step - 1) * 100, 0)} % más).`}</p>`;
      draw();
    };
    bindRange(root, 'py-pe-m', () => st.peM, v => { st.peM = v; }, () => { cancel('pend'); upd(); });
    root.querySelector('#py-pe-walk').addEventListener('click', () => {
      cancel('pend');
      stop.pend = Plot.animate(3500, (t) => draw(5 * t), () => draw());
    });
    upd();
  }

  // ----- 11. Distancia al origen y el círculo -----
  function setupCircle(root) {
    const p = new Plot(root.querySelector('#py-plot-circ'), { xMin: -7, xMax: 7, yMin: -7, yMax: 7, aspect: 1, step: 1 });
    plots.circ = p;
    let ang = Math.atan2(4, 3);
    const draw = () => {
      const r = st.ciR;
      const x = r * Math.cos(ang), y = r * Math.sin(ang);
      p.draw(() => {
        p.grid(); p.axes();
        p.fn(t => Math.sqrt(Math.max(0, r * r - t * t)), C.c, { width: 3, xFrom: -r, xTo: r });
        p.fn(t => -Math.sqrt(Math.max(0, r * r - t * t)), C.c, { width: 3, xFrom: -r, xTo: r });
        p.poly([[0, 0], [x, 0], [x, y]], 'rgba(255,255,255,0.06)');
        p.segment(0, 0, x, 0, C.a, 3);
        p.segment(x, 0, x, y, C.b, 3);
        p.segment(0, 0, x, y, C.c, 3);
        if (abs(x) > 0.3 && abs(y) > 0.3) p.rightAngle([x, 0], [0, 0], [x, y], '#fff', 0.35);
        p.point(x, y, '#fff', `(${f(x, 1)}, ${f(y, 1)})`, { r: 7 });
      });
      root.querySelector('#py-ci-explain').innerHTML = `<p>Punto (<span class="t-a">${f(x, 1)}</span>, <span class="t-b">${f(y, 1)}</span>): ${f(x, 1)}² + ${f(y, 1)}² ≈ ${f(sq(x) + sq(y), 1)} = ${f(r)}² → está a distancia <b class="t-c">${f(r)}</b> del origen.</p>`;
    };
    const table = () => {
      const r = st.ciR;
      // Puntos "enteros" del círculo cuando existen (r = 5: (3,4), (4,3)…) y algunos más
      const xs = [...new Set([0, isInt(r) && r === 5 ? 3 : r / 2, isInt(r) && r === 5 ? 4 : r * 0.8, r].map(v => Math.round(v * 10) / 10))];
      root.querySelector('#py-tab-circ').innerHTML = `<thead><tr><th class="t-a">x</th><th class="t-b">y (arriba)</th><th>x² + y²</th></tr></thead><tbody>${xs.map(x => { const y = Math.sqrt(Math.max(0, r * r - x * x)); return `<tr><td>${f(x)}</td><td>${f(y)}</td><td>${f(x * x + y * y)} = ${f(r)}²</td></tr>`; }).join('')}</tbody>`;
    };
    bindRange(root, 'py-ci-r', () => st.ciR, v => { st.ciR = v; }, () => { cancel('circ'); table(); draw(); });
    root.querySelector('#py-ci-play').addEventListener('click', () => {
      cancel('circ');
      const from = ang;
      stop.circ = Plot.animate(5000, (t) => { ang = from + t * Math.PI * 2; draw(); });
    });
    table();
    draw();
  }

  // ----- 12. Problemas de la vida real -----
  function setupLife(root) {
    const p = new Plot(root.querySelector('#py-plot-vida'), { xMin: -1, xMax: 11, yMin: -1, yMax: 11, aspect: 1, step: 1 });
    plots.vida = p;
    const controls = root.querySelector('#py-vida-controls'), text = root.querySelector('#py-vida-text'), steps = root.querySelector('#py-vida-steps');
    const PROBLEMS = {
      escalera: {
        text: 'Una escalera está apoyada en una pared. Conocemos el <b>largo de la escalera</b> (la hipotenusa) y <b>a qué distancia de la pared</b> está su base (un cateto). ¿A qué altura llega?',
        ctrls: () => `${range('py-v-L', 'Largo de la escalera <b class="t-c">(m)</b>', 't-c', 2, 10, 0.5, st.vEsc.L)}${range('py-v-d', 'Distancia a la pared <b class="t-a">(m)</b>', 't-a', 0.5, 9.5, 0.5, st.vEsc.d)}`,
        bind: () => {
          const L = root.querySelector('#py-v-L'), d = root.querySelector('#py-v-d');
          const u = () => { st.vEsc.L = Number(L.value); st.vEsc.d = Math.min(Number(d.value), st.vEsc.L - 0.5); d.value = st.vEsc.d; root.querySelector('#py-v-L-val').textContent = f(st.vEsc.L); root.querySelector('#py-v-d-val').textContent = f(st.vEsc.d); render(); changed(); };
          L.addEventListener('input', u); d.addEventListener('input', u);
        },
        draw: () => {
          const { L, d } = st.vEsc, h = Math.sqrt(sq(L) - sq(d));
          p.setView({ xMin: -1.5, xMax: Math.max(L, 6) + 1, yMin: -1, yMax: Math.max(L, 6) + 2.5 });
          p.draw(() => {
            p.grid(); p.axes({ x: 'suelo', y: 'pared' });
            p.rect(-0.6, 0, 0, Math.max(L, 6) + 2, 'rgba(255,255,255,0.12)', '#94a3b8');
            p.segment(0, 0, d, 0, C.a, 4);
            p.segment(0, 0, 0, h, C.b, 4);
            // Escalera con peldaños
            p.segment(d, 0, 0, h, C.c, 6);
            for (let k = 1; k < 8; k++) { const t = k / 8; p.point(d * (1 - t), h * t, C.c, '', { r: 3 }); }
            p.rightAngle([0, 0], [1, 0], [0, 1], '#fff', 0.4);
            p.text(`${f(d)} m`, d / 2, 0, C.a, { dy: 18, align: 'center' });
            p.text(`altura ${f(h)} m`, 0, h, C.b, { dx: 8, dy: -4 });
            p.text(`escalera ${f(L)} m`, d / 2, h / 2, C.c, { dx: 10 });
          });
          steps.innerHTML = `<p>La escalera es la <b class="t-c">hipotenusa</b> (${f(L)} m); la distancia al muro es un <b class="t-a">cateto</b> (${f(d)} m). Buscamos el otro <b class="t-b">cateto</b> (la altura).</p>
            <p>altura = √(${f(L)}² − ${f(d)}²) = √(${f(sq(L))} − ${f(sq(d))}) = √${f(sq(L) - sq(d))}</p>
            <p class="result">Llega a <b class="t-b">${rootTxt(sq(L) - sq(d))} m</b> de altura.</p>
            <p class="small">Si alejas la base de la pared, la escalera llega más abajo.</p>`;
        }
      },
      pantalla: {
        text: 'Las pantallas (tele, notebook, celular) se miden por su <b>diagonal</b>, en pulgadas. La diagonal es la hipotenusa del triángulo que forman el <b>ancho</b> y el <b>alto</b>.',
        ctrls: () => `${range('py-v-w', 'Ancho <b class="t-a">(pulgadas)</b>', 't-a', 4, 48, 1, st.vPan.w)}${range('py-v-h', 'Alto <b class="t-b">(pulgadas)</b>', 't-b', 3, 36, 1, st.vPan.h)}`,
        bind: () => {
          const w = root.querySelector('#py-v-w'), h = root.querySelector('#py-v-h');
          const u = () => { st.vPan.w = Number(w.value); st.vPan.h = Number(h.value); root.querySelector('#py-v-w-val').textContent = f(st.vPan.w); root.querySelector('#py-v-h-val').textContent = f(st.vPan.h); render(); changed(); };
          w.addEventListener('input', u); h.addEventListener('input', u);
        },
        draw: () => {
          const { w, h } = st.vPan, dg = Math.hypot(w, h);
          const m = Math.max(w, h) + 3;
          p.setView({ xMin: -2, xMax: m, yMin: -2, yMax: m, step: m > 20 ? 5 : m > 10 ? 2 : 1 });
          p.draw(() => {
            p.grid(); p.axes();
            p.rect(0, 0, w, h, 'rgba(108,99,255,0.18)', '#94a3b8');
            p.segment(0, 0, w, 0, C.a, 4); p.segment(w, 0, w, h, C.b, 4); p.segment(0, 0, w, h, C.c, 4);
            p.text(`${f(w)}"`, w / 2, 0, C.a, { dy: 18, align: 'center' });
            p.text(`${f(h)}"`, w, h / 2, C.b, { dx: 8 });
            p.text(`diagonal ${f(dg, 1)}"`, w / 2, h / 2, C.c, { dx: -10, dy: -8, align: 'right' });
          });
          steps.innerHTML = `<p>diagonal = √(${f(w)}² + ${f(h)}²) = √(${f(sq(w))} + ${f(sq(h))}) = √${f(sq(w) + sq(h))}</p>
            <p class="result">Es una pantalla de <b class="t-c">${f(dg, 1)} pulgadas</b> (1 pulgada = 2,54 cm, o sea ${f(dg * 2.54, 1)} cm de diagonal).</p>
            <p class="small">Una pantalla de 16 × 9 tiene diagonal ≈ 18,4": es el formato "16:9" de casi todas las teles.</p>`;
        }
      },
      atajo: {
        text: 'Una plaza rectangular: puedes ir de una esquina a la opuesta <b>por el borde</b> (ancho + largo) o <b>cortando en diagonal</b>. ¿Cuánto te ahorras?',
        ctrls: () => `${range('py-v-aw', 'Largo de la plaza <b class="t-a">(m)</b>', 't-a', 2, 40, 1, st.vAta.w)}${range('py-v-ah', 'Ancho de la plaza <b class="t-b">(m)</b>', 't-b', 2, 40, 1, st.vAta.h)}`,
        bind: () => {
          const w = root.querySelector('#py-v-aw'), h = root.querySelector('#py-v-ah');
          const u = () => { st.vAta.w = Number(w.value); st.vAta.h = Number(h.value); root.querySelector('#py-v-aw-val').textContent = f(st.vAta.w); root.querySelector('#py-v-ah-val').textContent = f(st.vAta.h); render(); changed(); };
          w.addEventListener('input', u); h.addEventListener('input', u);
        },
        draw: () => {
          const { w, h } = st.vAta, dg = Math.hypot(w, h);
          const m = Math.max(w, h) + 3;
          p.setView({ xMin: -2, xMax: m, yMin: -2, yMax: m, step: m > 20 ? 5 : m > 10 ? 2 : 1 });
          p.draw(() => {
            p.grid(); p.axes();
            p.rect(0, 0, w, h, 'rgba(34,197,94,0.22)', '#22c55e');
            p.segment(0, 0, w, 0, C.a, 4); p.segment(w, 0, w, h, C.b, 4);
            p.segment(0, 0, w, h, C.c, 4);
            p.point(0, 0, '#fff', 'salida'); p.point(w, h, '#fff', 'llegada');
          });
          steps.innerHTML = `<p>Por el borde: ${f(w)} + ${f(h)} = <b>${f(w + h)} m</b></p>
            <p>En diagonal: √(${f(w)}² + ${f(h)}²) = √${f(sq(w) + sq(h))} ≈ <b class="t-c">${f(dg)} m</b></p>
            <p class="result">Te ahorras <b>${f(w + h - dg)} m</b> (${f((1 - dg / (w + h)) * 100, 0)} % menos camino).</p>
            <p class="small">La línea recta siempre es el camino más corto entre dos puntos.</p>`;
        }
      }
    };
    const render = () => PROBLEMS[st.vida].draw();
    const show = (k) => {
      st.vida = k;
      root.querySelectorAll('#py-vida-tabs button').forEach(b => b.classList.toggle('is-active', b.dataset.v === k));
      text.innerHTML = PROBLEMS[k].text;
      controls.innerHTML = PROBLEMS[k].ctrls();
      PROBLEMS[k].bind();
      render();
    };
    root.querySelector('#py-vida-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { show(b.dataset.v); changed(); } });
    refreshers.push(() => show(st.vida));
    show(st.vida);
  }

  // ----- 13. Ternas pitagóricas -----
  function setupTriples(root) {
    const upd = () => {
      const k = st.teK;
      root.querySelector('#py-tab-ternas').innerHTML = `<thead><tr><th>Terna base</th><th class="t-a">a</th><th class="t-b">b</th><th class="t-c">c</th><th>a² + b²</th><th>c²</th></tr></thead><tbody>${TRIPLES.filter(t => !(t[0] === 6 || t[0] === 9)).map(([a, b, c]) => `<tr><td>${a}-${b}-${c}</td><td>${a * k}</td><td>${b * k}</td><td>${c * k}</td><td>${sq(a * k)} + ${sq(b * k)} = ${sq(a * k) + sq(b * k)}</td><td class="good">${sq(c * k)} ✅</td></tr>`).join('')}</tbody>`;
      const p = st.teP, q = Math.min(st.teQ, st.teP - 1);
      const a = sq(p) - sq(q), b = 2 * p * q, c = sq(p) + sq(q);
      root.querySelector('#py-te-steps').innerHTML = `
        <p>a = ${p}² − ${q}² = ${sq(p)} − ${sq(q)} = <b class="t-a">${a}</b> &nbsp; b = 2 · ${p} · ${q} = <b class="t-b">${b}</b> &nbsp; c = ${p}² + ${q}² = <b class="t-c">${c}</b></p>
        <p class="result">Comprueba: ${a}² + ${b}² = ${sq(a)} + ${sq(b)} = ${sq(a) + sq(b)} = ${c}² ✅</p>
        ${q !== st.teQ ? '<p class="small">q tiene que ser menor que p: se usó q = p − 1.</p>' : ''}`;
    };
    bindRange(root, 'py-te-k', () => st.teK, v => { st.teK = v; }, upd, v => `${v}`);
    bindRange(root, 'py-te-p', () => st.teP, v => { st.teP = v; }, upd, v => `${v}`);
    bindRange(root, 'py-te-q', () => st.teQ, v => { st.teQ = v; }, upd, v => `${v}`);
    upd();
  }

  // ----- Registro de la lección -----
  const LOCAL_KEY = 'mathviz_lesson_pitagoras';
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null');
    if (saved && saved.nav) pending = { nav: saved.nav };
  } catch (e) {}
  const saveLocal = () => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify({ nav: nav ? nav.getState() : null })); } catch (e) {} };

  MathLessons.register({
    id: 'pitagoras',
    label: 'Teorema de Pitágoras',
    icon: '📐',
    description: 'Catetos e hipotenusa, a² + b² = c² con áreas y una demostración animada, cómo calcular lados, problemas reales y su relación con la función lineal y la pendiente.',
    render(container) {
      rootEl = container;
      container.innerHTML = LESSON_HTML;
      setupTriangle(container);
      setupEquation(container);
      setupAreas(container);
      setupDemo(container);
      setupHip(container);
      setupCat(container);
      setupReciprocal(container);
      setupLab(container);
      setupDistance(container);
      setupSlope(container);
      setupCircle(container);
      setupLife(container);
      setupTriples(container);
      quiz = LessonQuiz(container.querySelector('#py-quiz'), { id: 'pitagoras', templates: QUIZ_TEMPLATES, onChange: changed });
      // Gráfica ↔ tabla (el punto tocado se pinta en la tabla; la fila tocada se marca en la gráfica)
      Plot.linkTable(plots.pend, container.querySelector('#py-tab-pend'));
      Plot.linkTable(plots.circ, container.querySelector('#py-tab-circ'));
      nav = LessonChapters(container, { lesson: this, intro: INTRO, groups: GROUPS, onChange: () => { saveLocal(); changed(); } });
      if (pending) { const s = pending; pending = null; this.setState(s); }
    },
    onShow() { if (nav) nav.onShow(); },
    goTo(ch) { if (nav) nav.goTo(ch); },
    getState() {
      if (!rootEl) return pending;
      return { ...JSON.parse(JSON.stringify(st)), quiz: quiz ? quiz.getState() : null, nav: nav ? nav.getState() : null };
    },
    setState(s) {
      if (!s) return;
      if (!rootEl) { pending = s; return; }
      Object.keys(st).forEach(k => { if (s[k] !== undefined) st[k] = JSON.parse(JSON.stringify(s[k])); });
      refreshers.forEach(r => r());
      if (quiz && s.quiz) quiz.setState(s.quiz);
      if (nav && s.nav) nav.setState(s.nav);
    },
    summary() {
      const s = rootEl ? this.getState() : pending;
      const total = GROUPS.reduce((n, g) => n + g.chapters.length, 0);
      const visited = (s && s.nav && s.nav.visited) || [];
      const attempts = (s && s.quiz && s.quiz.attempts) || (() => { try { return (JSON.parse(localStorage.getItem('mathviz_quiz_pitagoras') || 'null') || {}).attempts || []; } catch (e) { return []; } })();
      const next = GROUPS.flatMap(g => g.chapters).find(c => !visited.includes(c.id));
      return { visited: visited.length, total, best: attempts.length ? Math.max(...attempts.map(a => a.nota)) : null, current: visited.length && next ? next.title : null };
    }
  });
})();
