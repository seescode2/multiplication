'use strict';

const m1 = positiveArg(2, 2, "mass 1"), v1 = numberArg(3, 4, "velocity 1");
const m2 = positiveArg(4, 3, "mass 2"), v2 = numberArg(5, -1, "velocity 2");
const before = m1 * v1 + m2 * v2;
const afterVelocity = before / (m1 + m2);
console.log(`Before: total momentum = ${before.toFixed(2)} kg·m/s`);
console.log(`Stuck-together velocity = ${afterVelocity.toFixed(2)} m/s`);
console.log(`After: total momentum = ${((m1 + m2) * afterVelocity).toFixed(2)} kg·m/s`);

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
