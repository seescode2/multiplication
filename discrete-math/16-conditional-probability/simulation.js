"use strict";

const cards = [1,2,3,4,5,6,7,8,9,10];
const even = cards.filter(x => x % 2 === 0);
const aboveFiveGivenEven = even.filter(x => x > 5);
console.log("Cards:", cards);
console.log("After learning the card is even:", even);
console.log("Even cards above 5:", aboveFiveGivenEven);
console.log("P(above 5 | even) =", `${aboveFiveGivenEven.length}/${even.length}`, "=", aboveFiveGivenEven.length/even.length);
