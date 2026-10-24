// Integración con ZenBan: guarda y restaura la función y los controles dentro del objeto del lienzo
// (así se sincronizan con Drive junto con el resto de los datos de ZenBan).
(function () {
  if (!window.ZenBanPlugin) return;
  const ids = ['function-input', 'x-min', 'x-max', 'resolution', 'show-original', 'show-derivative',
    'show-integral', 'show-tangent', 'tangent-x', 'show-area', 'area-a', 'area-b'];
  let restoring = false;

  function collect() {
    const inputs = {};
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) inputs[id] = el.type === 'checkbox' ? el.checked : el.value;
    });
    // Pestaña abierta y lo que se movió en cada lección
    return { inputs, lessons: window.MathLessons ? MathLessons.getState() : null };
  }

  const titleFor = (inputs) => `MathViz 3D · f(x) = ${(inputs && inputs['function-input']) || ''}`;

  // No se guarda nada hasta recibir el estado guardado en ZenBan: si no, un clic mientras carga pisaría
  // el progreso con uno vacío. (Si ZenBan no contesta en 5 s, se guarda igual.)
  let gotInit = false;
  setTimeout(() => { gotInit = true; }, 5000);

  ZenBanPlugin.onInit(({ state }) => {
    gotInit = true;
    if (!state || !state.inputs) return;
    restoring = true;
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el || !(id in state.inputs)) return;
      if (el.type === 'checkbox') el.checked = !!state.inputs[id];
      else el.value = state.inputs[id];
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const fn = document.getElementById('function-input');
    if (fn) fn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    if (state.lessons && window.MathLessons) MathLessons.setState(state.lessons);
    restoring = false;
    ZenBanPlugin.setTitle(titleFor(state.inputs));
  });

  let timer = null;
  const sendNow = () => {
    clearTimeout(timer);
    timer = null;
    const state = collect();
    ZenBanPlugin.setState(state);
    ZenBanPlugin.setTitle(titleFor(state.inputs));
  };
  const save = () => {
    if (restoring || !gotInit) return;
    clearTimeout(timer);
    timer = setTimeout(sendNow, 250);
  };
  // Al ocultarse o cerrarse la página, lo pendiente se manda enseguida
  const flush = () => { if (timer) sendNow(); };
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  if (window.MathLessons) MathLessons.onChange(save);
  document.addEventListener('input', save, true);
  document.addEventListener('change', save, true);
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('.preset-btn')) save(); }, true);
})();
