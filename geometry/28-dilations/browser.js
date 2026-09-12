'use strict';
const $ = id => document.getElementById(id);
const svg = $('graph');
const defaults = { x: 3, y: 2, cx: 0, cy: 0, k: 2 };
const state = { ...defaults };
const fmt = n => Number(n.toFixed(2)).toString();
const coord = p => `(${fmt(p.x)}, ${fmt(p.y)})`;
let extent = 10;
let drag = null;
function node(tag, attributes, text) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes)) el.setAttribute(key, value);
  if (text !== undefined) el.textContent = text;
  $('drawing').appendChild(el);
  return el;
}
const px = x => 320 + x * 280 / extent;
const py = y => 320 - y * 280 / extent;
function line(a, b, attrs = {}) {
  node('line', { x1: px(a.x), y1: py(a.y), x2: px(b.x), y2: py(b.y), ...attrs });
}
function render() {
  const { x, y, cx, cy, k } = state;
  const center = { x: cx, y: cy };
  const points = [{ x, y }];
  if ($('shape').value === 'triangle') points.push({ x: x - 2, y }, { x: x - 1, y: y + 2 });
  const images = points.map(p => ({ x: cx + k * (p.x - cx), y: cy + k * (p.y - cy) }));
  if (!drag) extent = Math.max(5, Math.ceil(Math.max(...[center, ...points, ...images].flatMap(p => [Math.abs(p.x), Math.abs(p.y)])) + 2));
  $('drawing').replaceChildren();
  const step = extent <= 12 ? 1 : extent <= 24 ? 2 : 5;
  for (let v = -Math.floor(extent / step) * step; v <= extent; v += step) {
    line({ x: v, y: -extent }, { x: v, y: extent }, { stroke: v === 0 ? '#839aa3' : '#e5edef' });
    line({ x: -extent, y: v }, { x: extent, y: v }, { stroke: v === 0 ? '#839aa3' : '#e5edef' });
    if (v !== 0) {
      node('text', { x: px(v), y: 337, 'text-anchor': 'middle', fill: '#617982', 'font-size': 10 }, v);
      node('text', { x: 312, y: py(v) + 4, 'text-anchor': 'end', fill: '#617982', 'font-size': 10 }, v);
    }
  }
  node('text', { x: 610, y: 315, fill: '#526c75' }, 'x');
  node('text', { x: 328, y: 25, fill: '#526c75' }, 'y');
  if ($('guides').checked) points.forEach((p, i) => {
    const far = k > 1 ? images[i] : p;
    line(k < 0 ? images[i] : center, far, { stroke: '#9baeb5', 'stroke-dasharray': '5 5' });
  });
  if (points.length === 3) {
    for (const [vertices, color, dash] of [[points, '#176ac1', ''], [images, '#b84b19', '7 4']]) {
      node('polygon', { points: vertices.map(p => `${px(p.x)},${py(p.y)}`).join(' '), fill: color, 'fill-opacity': '.09', stroke: color, 'stroke-width': 2, 'stroke-dasharray': dash });
    }
  }
  points.forEach((p, i) => {
    node('circle', { cx: px(p.x), cy: py(p.y), r: 6, fill: '#176ac1' });
    node('text', { x: px(p.x) - 12, y: py(p.y) - 12, fill: '#176ac1', 'font-size': 15, 'font-weight': 700 }, ['P', 'Q', 'R'][i]);
  });
  images.forEach((p, i) => {
    node('path', { d: `M ${px(p.x)} ${py(p.y) - 7} l 7 7 l -7 7 l -7 -7 Z`, fill: 'white', stroke: '#b84b19', 'stroke-width': 2 });
    node('text', { x: px(p.x) + 10, y: py(p.y) + 22, fill: '#b84b19', 'font-size': 15, 'font-weight': 700 }, ['P′', 'Q′', 'R′'][i]);
  });
  node('path', { d: `M ${px(cx) - 7} ${py(cy)} h 14 M ${px(cx)} ${py(cy) - 7} v 14`, stroke: '#18323b', 'stroke-width': 3 });
  node('text', { x: px(cx) + 12, y: py(cy) - 12, fill: '#18323b', 'font-weight': 700 }, 'C');
  // Large invisible targets keep points easy to drag on touchscreens.
  for (const [p, target] of [[points[0], 'point'], [center, 'center']]) node('circle', { cx: px(p.x), cy: py(p.y), r: 16, fill: 'transparent', class: 'handle', 'data-target': target });
  $('kValue').textContent = fmt(k);
  $('before').textContent = coord(points[0]);
  $('after').textContent = coord(images[0]);
  const distance = Math.hypot(x - cx, y - cy);
  $('distance').textContent = `${fmt(distance)} → ${fmt(Math.abs(k) * distance)}`;
  $('status').textContent = k === 0 ? 'Collapsed to the center' : k === 1 ? 'Unchanged' : Math.abs(k) === 1 ? 'Same size, opposite side' : Math.abs(k) > 1 ? 'Enlargement' : 'Reduction';
  $('rule').textContent = cx === 0 && cy === 0 ? `P′ = ${fmt(k)} × ${coord(points[0])} = ${coord(images[0])}` : `P′ = ${coord(center)} + ${fmt(k)} × (P − ${coord(center)}) = ${coord(images[0])}`;
  $('explanation').textContent = k === 0 ? 'Every point maps to C. The figure loses its size and shape.' : `Distances from C are multiplied by ${fmt(Math.abs(k))}.${k < 0 ? ' A negative factor places each image on the opposite side of C.' : ''}${distance === 0 ? ' P is at the center, so it stays fixed.' : ''}`;
  $('triangleInfo').textContent = points.length === 3 ? `Side PQ: 2 → ${fmt(2 * Math.abs(k))} units. Area: 2 → ${fmt(2 * k * k)} square units.${k !== 0 ? ' All corresponding angles stay equal.' : ''}` : '';
  $('graphDescription').textContent = `Center C ${coord(center)}. Original P ${coord(points[0])}, image P′ ${coord(images[0])}, scale factor ${fmt(k)}. Axes range from −${extent} to ${extent}.`;
}
for (const id of Object.keys(defaults)) {
  $(id).addEventListener('input', () => {
    const input = $(id);
    if (input.value === '' || !Number.isFinite(input.valueAsNumber) || !input.validity.valid) return;
    state[id] = input.valueAsNumber;
    render();
  });
  $(id).addEventListener('change', () => { $(id).value = state[id]; });
}
for (const id of ['shape', 'guides']) $(id).addEventListener('change', render);
document.querySelectorAll('[data-scale]').forEach(button => button.addEventListener('click', () => {
  state.k = Number(button.dataset.scale); $('k').value = state.k; render();
}));
$('reset').addEventListener('click', () => {
  Object.assign(state, defaults);
  for (const id of Object.keys(defaults)) $(id).value = state[id];
  $('shape').value = 'point'; $('guides').checked = true; render();
});
svg.addEventListener('pointerdown', event => {
  if (!event.target.dataset.target) return;
  drag = event.target.dataset.target;
  svg.setPointerCapture(event.pointerId);
});
svg.addEventListener('pointermove', event => {
  if (!drag) return;
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
  const snap = n => Math.max(-5, Math.min(5, Math.round(n * 2) / 2));
  const ids = drag === 'point' ? ['x', 'y'] : ['cx', 'cy'];
  state[ids[0]] = snap((point.x - 320) * extent / 280);
  state[ids[1]] = snap((320 - point.y) * extent / 280);
  ids.forEach(id => { $(id).value = state[id]; });
  render();
});
function endDrag() { if (drag) { drag = null; render(); } }
svg.addEventListener('pointerup', endDrag);
svg.addEventListener('pointercancel', endDrag);
svg.addEventListener('lostpointercapture', endDrag);
render();
