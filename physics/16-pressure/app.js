'use strict';

const force = nonnegativeArg(2, 100, "force");
const wide = positiveArg(3, 2, "first area");
const narrow = positiveArg(4, 0.5, "second area");
console.log(`${force} N over ${wide} m² -> ${(force / wide).toFixed(2)} Pa`);
console.log(`${force} N over ${narrow} m² -> ${(force / narrow).toFixed(2)} Pa`);

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
