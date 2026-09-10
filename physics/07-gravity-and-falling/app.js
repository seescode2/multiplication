'use strict';

const seconds = integerArg(2, 4, "time", 0, 20);
const gravity = 9.8;
for (let t = 0; t <= seconds; t++) {
  const speed = gravity * t;
  const distance = 0.5 * gravity * t * t;
  console.log(`${t}s | speed ${speed.toFixed(1)} m/s | fallen ${distance.toFixed(1)} m`);
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
