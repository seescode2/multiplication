"use strict";

const args = process.argv.slice(2);
const items = args.length ? args : ["A", "B", "C"];
function permute(xs) {
  if (xs.length < 2) return [xs];
  return xs.flatMap((x, i) => permute(xs.filter((_, j) => j !== i)).map(rest => [x, ...rest]));
}
const answers = permute(items);
console.log(`${answers.length} arrangements:`);
answers.forEach(x => console.log(x.join(" ")));
