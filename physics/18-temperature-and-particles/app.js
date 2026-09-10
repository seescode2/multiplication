'use strict';

const cool = numberArg(2, 20, "first temperature");
const hot = numberArg(3, 80, "second temperature");
function particles(temp) {
  const marks = Math.max(1, Math.min(20, Math.round((temp + 273.15) / 25)));
  return "•".repeat(marks) + " ".repeat(20 - marks);
}
console.log(`${cool}°C |${particles(cool)}| average motion`);
console.log(`${hot}°C |${particles(hot)}| average motion`);
console.log("More dots here represent faster average motion (a teaching model).");

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
