'use strict';
const $ = id => document.getElementById(id);
const svg = $('graph');
const NS = 'http://www.w3.org/2000/svg';
const fmt = n => Number(n.toFixed(6)).toString();
const px = x => 300 + x * 26;
const py = y => 300 - y * 26;
function element(tag, attrs, parent = svg) {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  parent.appendChild(node);
  return node;
}
function line(x1, y1, x2, y2, attrs = {}, parent = svg) {
  return element('line', {x1: px(x1), y1: py(y1), x2: px(x2), y2: py(y2), ...attrs}, parent);
}
function read(id) {
  return {m: Number($('m' + id).value), b: Number($('b' + id).value), vertical: $('vertical' + id).checked};
}
function render() {
  for (const id of ['A', 'B']) {
    const vertical = $('vertical' + id).checked;
    $('m' + id).disabled = $('rangeM' + id).disabled = vertical;
    $('labelB' + id).textContent = vertical ? 'Position c' : 'Intercept b';
    for (const key of ['m', 'b']) {
      const input = $(key + id);
      if (!(vertical && key === 'm') && (input.value === '' || !input.validity.valid)) {
        $('status').textContent = 'Enter values between −10 and 10.';
        $('detail').textContent = 'The graph shows the last valid values.';
        return;
      }
    }
  }
  const a = read('A'), b = read('B');
  svg.querySelectorAll(':scope > :not(title):not(desc)').forEach(node => node.remove());
  const defs = element('defs', {});
  const clip = element('clipPath', {id: 'plotClip'}, defs);
  element('rect', {x: 40, y: 40, width: 520, height: 520}, clip);
  for (let i = -10; i <= 10; i++) {
    line(i, -10, i, 10, {stroke: i === 0 ? '#8491a7' : '#e6eaf1', 'stroke-width': i === 0 ? 1.5 : 1});
    line(-10, i, 10, i, {stroke: i === 0 ? '#8491a7' : '#e6eaf1', 'stroke-width': i === 0 ? 1.5 : 1});
    if (i % 2 === 0 && i !== 0) {
      element('text', {x: px(i), y: 318, 'text-anchor': 'middle', fill: '#637087', 'font-size': 11}).textContent = i;
      element('text', {x: 290, y: py(i) + 4, 'text-anchor': 'end', fill: '#637087', 'font-size': 11}).textContent = i;
    }
  }
  element('text', {x: 578, y: 305, fill: '#526078'}).textContent = 'x';
  element('text', {x: 295, y: 23, fill: '#526078'}).textContent = 'y';
  const plot = element('g', {'clip-path': 'url(#plotClip)'});
  [a, b].forEach((value, i) => {
    const id = i ? 'B' : 'A';
    const equation = value.vertical ? `x = ${fmt(value.b)}` : `y = ${fmt(value.m)}x ${value.b < 0 ? '−' : '+'} ${fmt(Math.abs(value.b))}`;
    $('equation' + id).textContent = equation;
    const attrs = {stroke: i ? '#c35418' : '#245bd6', 'stroke-width': 3, 'stroke-dasharray': i ? '9 5' : 'none'};
    if (value.vertical) line(value.b, -10, value.b, 10, attrs, plot);
    else line(-10, -10 * value.m + value.b, 10, 10 * value.m + value.b, attrs, plot);
    element('circle', {cx: px(value.vertical ? value.b : 0), cy: py(value.vertical ? 0 : value.b), r: 4, fill: attrs.stroke}, plot);
  });
  const parallel = a.vertical && b.vertical || !a.vertical && !b.vertical && a.m === b.m;
  const same = parallel && a.b === b.b;
  const product = a.m * b.m;
  const perpendicular = a.vertical ? !b.vertical && b.m === 0 : b.vertical ? a.m === 0 : Math.abs(product + 1) < 1e-9;
  let angle = Math.abs((a.vertical ? Math.PI / 2 : Math.atan(a.m)) - (b.vertical ? Math.PI / 2 : Math.atan(b.m)));
  angle = Math.min(angle, Math.PI - angle) * 180 / Math.PI;
  $('status').textContent = same ? 'Same line' : parallel ? 'Parallel lines' : perpendicular ? 'Perpendicular · 90°' : `Not perpendicular · ${fmt(angle)}°`;
  $('detail').textContent = (a.vertical || b.vertical ? 'A vertical line has undefined slope. Its perpendicular partner is horizontal.' : `Slope product: ${fmt(a.m)} × ${fmt(b.m)} = ${fmt(product)}. Perpendicular slopes multiply to −1.`) + ' Angle shown is the smaller angle; measurements are rounded.';
  if (parallel) {
    $('intersection').textContent = same ? 'Every point is shared; there is no unique intersection.' : 'No intersection.';
  } else {
    const x = a.vertical ? a.b : b.vertical ? b.b : (b.b - a.b) / (a.m - b.m);
    const y = a.vertical ? b.m * x + b.b : a.m * x + a.b;
    const visible = Math.abs(x) <= 10 && Math.abs(y) <= 10;
    $('intersection').textContent = `Intersection: (${fmt(x)}, ${fmt(y)})${visible ? '' : ' — outside the visible graph'}.`;
    element('circle', {cx: px(x), cy: py(y), r: 5, fill: '#18243b', stroke: 'white', 'stroke-width': 2}, plot);
    if (perpendicular) {
      const theta = a.vertical ? Math.PI / 2 : Math.atan(a.m);
      const u = [Math.cos(theta) * 0.6, Math.sin(theta) * 0.6];
      const v = [-u[1], u[0]];
      element('polyline', {points: [[x+u[0],y+u[1]],[x+u[0]+v[0],y+u[1]+v[1]],[x+v[0],y+v[1]]].map(([cx,cy]) => `${px(cx)},${py(cy)}`).join(' '), fill: 'none', stroke: '#18243b', 'stroke-width': 2}, plot);
    }
  }
  $('graphDescription').textContent = `Line A: ${$('equationA').textContent}. Line B: ${$('equationB').textContent}. ${$('status').textContent}. ${$('intersection').textContent}`;
}
for (const id of ['A', 'B']) {
  for (const key of ['m', 'b']) {
    const number = $(key + id), slider = $('range' + key.toUpperCase() + id);
    number.addEventListener('input', () => { if (number.value !== '' && number.validity.valid) slider.value = number.value; render(); });
    slider.addEventListener('input', () => { number.value = slider.value; render(); });
  }
  $('vertical' + id).addEventListener('change', render);
}
const presets = {origin: [2,0,-0.5,0,false,false], shifted: [2,3,-0.5,8,false,false], parallel: [2,-3,2,3,false,false], vertical: [0,2,0,-3,false,true]};
document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
  const values = presets[button.dataset.preset];
  ['mA','bA','mB','bB'].forEach((id, i) => { $(id).value = values[i]; $('range' + id[0].toUpperCase() + id[1]).value = values[i]; });
  $('verticalA').checked = values[4]; $('verticalB').checked = values[5]; render();
}));
render();
