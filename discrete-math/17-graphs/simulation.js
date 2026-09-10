"use strict";

const vertices = ["A", "B", "C", "D"];
const edges = [["A","B"], ["A","C"], ["B","D"]];
console.log("Vertices:", vertices);
console.log("Edges:", edges.map(e => e.join("--")));
for (const v of vertices) {
  const neighbors = edges.filter(e => e.includes(v)).map(e => e[0] === v ? e[1] : e[0]);
  console.log(`${v}: degree ${neighbors.length}, neighbors ${neighbors}`);
}
