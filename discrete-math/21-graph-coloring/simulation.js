"use strict";

const graph = {A:["B","C"], B:["A","C","D"], C:["A","B","D"], D:["B","C"]};
const colors = ["red","blue","green","yellow"], result = {};
for (const v of Object.keys(graph)) {
  const used = new Set(graph[v].map(n => result[n]));
  result[v] = colors.find(c => !used.has(c));
}
console.log("Coloring:", result);
for (const [v, ns] of Object.entries(graph)) for (const n of ns) {
  if (result[v] === result[n]) throw new Error("Neighbors share a color");
}
console.log("Check passed: every pair of neighbors has different colors.");
