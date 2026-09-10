"use strict";

const vertices = ["A","B","C","D"];
const edges = [["A","B"], ["B","C"], ["A","C"], ["C","D"], ["B","D"]];
const parent = Object.fromEntries(vertices.map(v => [v,v]));
const find = x => parent[x] === x ? x : parent[x] = find(parent[x]);
const chosen = [];
for (const [a,b] of edges) if (find(a) !== find(b)) { parent[find(a)] = find(b); chosen.push([a,b]); }
console.log("Original edges:", edges);
console.log("Spanning-tree edges:", chosen);
console.log("Edges kept:", chosen.length, "= vertices - 1");
