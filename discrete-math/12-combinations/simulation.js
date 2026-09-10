"use strict";

const args = process.argv.slice(2);
const k = Number(args[0]) || 2;
const items = args.length > 1 ? args.slice(1) : ["A", "B", "C", "D"];
function choose(xs, n) {
  if (n === 0) return [[]];
  if (xs.length < n) return [];
  return choose(xs.slice(1), n - 1).map(c => [xs[0], ...c]).concat(choose(xs.slice(1), n));
}
const answers = choose(items, k);
console.log(`Choose ${k} from {${items}}: ${answers.length} ways`);
answers.forEach(x => console.log(x.join(" ")));
