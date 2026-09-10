"use strict";

const graph = {A:["B","C"], B:["A","D"], C:["A","D"], D:["B","C","E"], E:["D"]};
const start = process.argv[2] || "A", goal = process.argv[3] || "E";
const queue = [[start]], visited = new Set([start]);
let answer;
while (queue.length) {
  const path = queue.shift(), last = path.at(-1);
  if (last === goal) { answer = path; break; }
  for (const next of graph[last] || []) if (!visited.has(next)) { visited.add(next); queue.push([...path, next]); }
}
console.log(answer ? `Path: ${answer.join(" -> ")}` : "No path found.");
