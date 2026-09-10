'use strict';

const values = [numberArg(2, 2, "mass A"), numberArg(3, 6, "velocity A"), numberArg(4, 4, "mass B"), numberArg(5, 3, "velocity B")];
if (values[0] <= 0 || values[2] <= 0) fail("masses must be greater than zero");
console.log(`A momentum: ${(values[0] * values[1]).toFixed(2)} kg·m/s`);
console.log(`B momentum: ${(values[2] * values[3]).toFixed(2)} kg·m/s`);

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
