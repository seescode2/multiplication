'use strict';

const a = (process.argv[2] ?? "positive").toLowerCase();
const b = (process.argv[3] ?? "negative").toLowerCase();
const valid = new Set(["positive", "negative", "+", "-"]);
if (!valid.has(a) || !valid.has(b)) fail("charges must be positive, negative, +, or -");
const signA = a === "positive" || a === "+" ? "+" : "-";
const signB = b === "positive" || b === "+" ? "+" : "-";
const action = signA === signB ? "REPEL  ←   →" : "ATTRACT →   ←";
console.log(`[ ${signA} ]     [ ${signB} ]`);
console.log(action);

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
