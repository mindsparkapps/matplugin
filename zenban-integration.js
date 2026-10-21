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

  ZenBanPlugin.onInit(({ state }) => {
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
  const save = () => {
    if (restoring) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const state = collect();
      ZenBanPlugin.setState(state);
      ZenBanPlugin.setTitle(titleFor(state.inputs));
    }, 500);
  };
  if (window.MathLessons) MathLessons.onChange(save);
  document.addEventListener('input', save, true);
  document.addEventListener('change', save, true);
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('.preset-btn')) save(); }, true);
})();
