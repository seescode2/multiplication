"use strict";

const values = process.argv.slice(2);
const items = values.length ? values : ["a", "b", "c"];
const subsets = [];
for (let mask = 0; mask < 2 ** items.length; mask++) {
  subsets.push(items.filter((_, i) => mask & (1 << i)));
}
console.log(`The set {${items}} has ${subsets.length} subsets:`);
subsets.forEach(s => console.log(`{${s}}`));
