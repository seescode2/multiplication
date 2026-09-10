"use strict";

const graph = {A:["1","2"], B:["2","3"], C:["1"], 1:["A","C"], 2:["A","B"], 3:["B"]};
const side = {}; let ok = true;
for (const start of Object.keys(graph)) if (!(start in side)) {
  side[start] = 0; const queue = [start];
  while (queue.length) { const v = queue.shift(); for (const n of graph[v]) {
    if (!(n in side)) { side[n] = 1 - side[v]; queue.push(n); } else if (side[n] === side[v]) ok = false;
  }}
}
console.log("Group 1:", Object.keys(side).filter(v => side[v] === 0));
console.log("Group 2:", Object.keys(side).filter(v => side[v] === 1));
console.log("Bipartite:", ok);
