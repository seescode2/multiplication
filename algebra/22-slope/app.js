'use strict';

function num(index, fallback) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) stop(`Input ${index - 1} must be a number.`);
  return value;
}
function stop(message) { console.error(message); process.exit(1); }
function fmt(value) { return Number(Number(value).toFixed(6)); }
function graph(x1, y1, x2, y2) {
  // Include the origin, and keep the graph small enough for a terminal.
  const minX = Math.min(0, x1, x2), maxX = Math.max(0, x1, x2) || 1;
  const minY = Math.min(0, y1, y2), maxY = Math.max(0, y1, y2) || 1;
  const width = 41, height = 17;
  const spanX = maxX - minX, spanY = maxY - minY;
  if (!Number.isFinite(spanX) || !Number.isFinite(spanY)) {
    console.log('Coordinates are too large to graph. Try smaller numbers.');
    return;
  }
  const column = x => Math.round((x - minX) / spanX * (width - 1));
  const row = y => Math.round((maxY - y) / spanY * (height - 1));
  const grid = Array.from({length: height}, () => Array(width).fill(' '));
  const originX = column(0), originY = row(0);
  for (let r = 0; r < height; r++) grid[r][originX] = '|';
  for (let c = 0; c < width; c++) grid[originY][c] = '-';
  grid[originY][originX] = '+';

  const startX = column(x1), startY = row(y1);
  const endX = column(x2), endY = row(y2);
  const steps = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
  for (let step = 0; step <= steps; step++) {
    const fraction = steps === 0 ? 0 : step / steps;
    grid[Math.round(startY + fraction * (endY - startY))]
      [Math.round(startX + fraction * (endX - startX))] = '*';
  }
  grid[startY][startX] = 'A';
  grid[endY][endX] = startX === endX && startY === endY ? '@' : 'B';

  const label = value => Number(value.toPrecision(4)).toString();
  const labels = grid.map((_, r) => label(maxY - r / (height - 1) * spanY));
  const padding = Math.max(...labels.map(value => value.length));
  console.log('\nLine segment (y increases upward; x increases rightward):');
  grid.forEach((cells, r) => console.log(`${labels[r].padStart(padding)} | ${cells.join('')}`));
  const left = label(minX), right = label(maxX);
  console.log(`${' '.repeat(padding + 3)}${left}${' '.repeat(Math.max(1, width - left.length - right.length))}${right}  x`);
  console.log(`A = (${x1}, ${y1}), B = (${x2}, ${y2}); * = connecting segment`);
  console.log('@ means both points occupy the same graph cell.');
  console.log('Axes are scaled independently; use the labels to read distances.');
}

const x1=num(2,1),y1=num(3,2),x2=num(4,5),y2=num(5,10),rise=y2-y1,run=x2-x1; console.log(`Rise = ${y2} - ${y1} = ${rise}`); console.log(`Run = ${x2} - ${x1} = ${run}`); console.log(run===0?'Slope is undefined (vertical line).':`Slope = ${rise}/${run} = ${fmt(rise/run)}`);
graph(x1, y1, x2, y2);
