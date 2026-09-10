"use strict";

const items = process.argv.slice(2);
const input = items.length ? items : ["apple", "banana", "apple", "pear"];
const set = [...new Set(input)];
console.log("List:", input);
console.log("Set:", set);
console.log("Size of set:", set.length);
