"use strict";

const tree = {root:["left","right"], left:["leaf1","leaf2"], right:["leaf3"], leaf1:[], leaf2:[], leaf3:[]};
function visit(node, depth = 0) {
  console.log("  ".repeat(depth) + node);
  for (const child of tree[node]) visit(child, depth + 1);
}
visit("root");
const vertices = Object.keys(tree).length;
const edges = Object.values(tree).flat().length;
console.log({vertices, edges, expectedTreeEdges: vertices - 1});
