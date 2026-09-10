'use strict';

const step = Math.max(1, Math.abs(Number(process.argv[2] ?? 30)));
for (let angle = 0; angle <= 360; angle += step) {
  const value = Math.sin(angle * Math.PI / 180);
  const position = Math.round((value + 1) * 10);
  console.log(`${String(angle).padStart(3)}° ${' '.repeat(position)}● ${value.toFixed(2)}`);
}
