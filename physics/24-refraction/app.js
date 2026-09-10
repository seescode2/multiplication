'use strict';

const incoming = numberArg(2, 40, "incoming angle");
const index = positiveArg(3, 1.5, "refractive index");
if (incoming < 0 || incoming >= 90 || index < 1) fail("use an angle from 0 to under 90 and an index of at least 1");
const refracted = Math.asin(Math.sin(incoming * Math.PI / 180) / index) * 180 / Math.PI;
console.log(`Air angle: ${incoming.toFixed(1)}°`);
console.log(`Material index: ${index}`);
console.log(`Refracted angle: ${refracted.toFixed(1)}° (toward the normal)`);

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
