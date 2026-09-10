'use strict';

const amplitude = integerArg(2, 3, "amplitude", 1, 6);
const wavelength = integerArg(3, 8, "wavelength", 2, 20);
for (let row = amplitude; row >= -amplitude; row--) {
  let line = "";
  for (let x = 0; x < 48; x++) {
    const y = Math.round(amplitude * Math.sin(2 * Math.PI * x / wavelength));
    line += y === row ? "●" : row === 0 ? "─" : " ";
  }
  console.log(line);
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
