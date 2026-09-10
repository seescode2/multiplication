'use strict';

const mass = positiveArg(2, 5, "mass");
const height = positiveArg(3, 4, "height");
const total = mass * 9.8 * height;
for (let step = 0; step <= 4; step++) {
  const h = height * (1 - step / 4);
  const potential = mass * 9.8 * h;
  const kinetic = total - potential;
  console.log(`height ${h.toFixed(1)} m | PE ${potential.toFixed(1)} J + KE ${kinetic.toFixed(1)} J = ${total.toFixed(1)} J`);
}

function numberArg(index, fallback, name) {
  const value = Number(process.argv[index] ?? fallback);
  if (!Number.isFinite(value)) fail(`${name} must be a number`);
  return value;
}
function positiveArg(index, fallback, name) {
  const value = numberArg(index, fallback, name);
  if (value <= 0) fail(`${name} must be greater than zero`);
  return value;
}
function nonnegativeArg(index, fallback, name) {
  const value = numberArg(index, fallback, name);
  if (value < 0) fail(`${name} cannot be negative`);
  return value;
}
function integerArg(index, fallback, name, min, max) {
  const value = numberArg(index, fallback, name);
  if (!Number.isInteger(value) || value < min || value > max) fail(`${name} must be a whole number from ${min} to ${max}`);
  return value;
}
function showBar(value, label) {
  const blocks = Math.min(40, Math.max(0, Math.round(value)));
  console.log(`${label}: ${"█".repeat(blocks)}${value > 40 ? "…" : ""}`);
}
function fail(message) {
  console.error(`Input error: ${message}.`);
  process.exit(1);
}
