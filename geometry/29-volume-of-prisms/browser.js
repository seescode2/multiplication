'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const state = { length: 4, width: 3, height: 2, layers: 2 };
  let timer = null;
  const volume = () => state.length * state.width * state.height;
  function stop() {
    if (timer !== null) clearInterval(timer);
    timer = null;
    $('play').textContent = 'Build layer by layer';
  }
  function element(tag, attributes, text) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    if (text !== undefined) node.textContent = text;
    $('drawing').appendChild(node);
  }
  function draw() {
    const { length: l, width: w, height: h, layers: n } = state;
    $('drawing').replaceChildren();
    // Equal unit edges in an isometric projection; fit the FULL prism at all fill levels.
    const unit = Math.min(43, 530 / ((l + w) * .866), 340 / (h + (l + w) * .5));
    const left = 340 - (l - w) * .866 * unit / 2;
    const top = 220 - (h + (l + w) * .5) * unit / 2;
    const project = ([x,y,z]) => [left + (x-y)*.866*unit, top + (h-z+(x+y)*.5)*unit];
    const points = vertices => vertices.map(v => project(v).join(',')).join(' ');
    const face = (vertices, fill) => element('polygon', { points: points(vertices), fill, stroke: '#315b60', 'stroke-width': .8, 'stroke-linejoin': 'round' });
    // Only exterior faces are needed: every surface square represents one unit cube.
    for (let z=0; z<n; z++) {
      const gold = z === n-1;
      for (let y=0; y<w; y++) face([[l,y,z],[l,y+1,z],[l,y+1,z+1],[l,y,z+1]], gold ? '#daa441' : '#53a6a0');
      for (let x=0; x<l; x++) face([[x,w,z],[x+1,w,z],[x+1,w,z+1],[x,w,z+1]], gold ? '#ebbb5d' : '#79c3b9');
    }
    if (n>0) for (let x=0; x<l; x++) for (let y=0; y<w; y++) face([[x,y,n],[x+1,y,n],[x+1,y+1,n],[x,y+1,n]], '#ffda82');
    const corners = [[0,0,0],[l,0,0],[l,w,0],[0,w,0],[0,0,h],[l,0,h],[l,w,h],[0,w,h]];
    for (const [a,b] of [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]) {
      element('polyline', {points: points([corners[a],corners[b]]), fill:'none', stroke:'#365660','stroke-width':1.3,'stroke-dasharray':'5 5',opacity:.65});
    }
    const label = (position, text, dx, dy) => {
      const [x,y] = project(position);
      element('text',{x:x+dx,y:y+dy,'text-anchor':'middle',fill:'#18323b','font-size':14,'font-family':'system-ui, sans-serif','paint-order':'stroke',stroke:'white','stroke-width':4},text);
    };
    label([l/2,w,0],`Length ${l}`, -8, 28);
    label([l,w/2,0],`Width ${w}`, 14, 28);
    label([l,0,h/2],`Height ${h}`, 46, 0);
    $('modelDescription').textContent = `A ${l} by ${w} by ${h} rectangular prism. ${n} of ${h} layers filled, with ${l*w} unit cubes per layer: ${l*w*n} cubes shown in a prism with volume ${volume()} cubic units. Dashed lines mark the full prism.`;
  }
  function render() {
    for (const key of ['length','width','height']) {
      $(key).value = state[key];
      $(key+'Value').textContent = `${state[key]} ${state[key] === 1 ? 'unit' : 'units'}`;
    }
    $('layers').max = state.height;
    $('layers').value = state.layers;
    $('layersValue').textContent = `${state.layers} / ${state.height}`;
    $('double').disabled = state.height > 10;
    $('dimensions').textContent = `${state.length} × ${state.width} × ${state.height}`;
    $('base').textContent = state.length * state.width;
    $('filled').textContent = state.length * state.width * state.layers;
    $('volume').textContent = volume();
    $('equation').textContent = `${state.length} × ${state.width} × ${state.height} = ${volume()} cubic units`;
    $('explanation').textContent = `Each layer holds ${state.length} × ${state.width} = ${state.length*state.width} cubes. ${state.layers} of ${state.height} layers filled (${state.length*state.width*state.layers} cubes). The full prism holds ${volume()} cubes.`;
    draw();
  }
  for (const key of ['length','width','height','layers']) $(key).addEventListener('input', () => {
    stop();
    const value = Number($(key).value);
    const max = key === 'layers' ? state.height : key === 'height' ? 20 : 10;
    if (!Number.isInteger(value) || value < (key === 'layers' ? 0 : 1) || value > max) return;
    state[key] = value;
    if (key !== 'layers') state.layers = state.height;
    $('notice').textContent = key === 'layers' ? 'Count equal layers to find the number of cubes filled so far.' : 'Predict the full volume, then compare it with the calculation.';
    render();
  });
  $('swap').addEventListener('click', () => {
    stop();
    [state.length,state.width] = [state.width,state.length];
    $('notice').textContent = `Same volume: ${volume()} cubic units. Swapping length and width keeps the number of cubes per layer the same.`;
    render();
  });
  $('double').addEventListener('click', () => {
    if (state.height > 10) return;
    stop();
    const before = volume();
    state.height *= 2;
    state.layers = state.height;
    $('notice').textContent = `Twice as many layers: ${before} → ${volume()} cubic units. The base area stays the same.`;
    render();
  });
  $('fill').addEventListener('click', () => { stop(); state.layers = state.height; render(); });
  $('play').addEventListener('click', () => {
    if (timer !== null) { stop(); return; }
    if (state.layers === state.height) state.layers = 0;
    $('play').textContent = 'Pause building';
    render();
    timer = setInterval(() => {
      state.layers++;
      if (state.layers >= state.height) stop();
      render();
    }, 800);
  });
  $('reset').addEventListener('click', () => {
    stop();
    Object.assign(state, {length:4,width:3,height:2,layers:2});
    $('notice').textContent = 'Try swapping length and width. Will the volume change?';
    render();
  });
  render();
})();
