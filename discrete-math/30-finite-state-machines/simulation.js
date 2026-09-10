"use strict";

const inputs = process.argv.slice(2);
const events = inputs.length ? inputs : ["coin", "push", "push", "coin", "push"];
let state = "locked";
console.log("Start:", state);
for (const event of events) {
  if (state === "locked" && event === "coin") state = "unlocked";
  else if (state === "unlocked" && event === "push") state = "locked";
  console.log(`After ${event}: ${state}`);
}
console.log("Try events named coin and push in a different order.");
