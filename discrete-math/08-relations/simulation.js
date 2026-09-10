"use strict";

const people = ["Ana", "Bo", "Cy"];
const relation = [["Ana", "Bo"], ["Bo", "Cy"], ["Ana", "Cy"]];
console.log("Relation 'knows':", relation.map(([a,b]) => `${a} -> ${b}`));
for (const person of people) {
  console.log(`${person} knows:`, relation.filter(([a]) => a === person).map(([,b]) => b));
}
