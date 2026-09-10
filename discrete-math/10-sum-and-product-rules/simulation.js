"use strict";

const shirts = ["red", "blue", "green"];
const pants = ["black", "tan"];
const outfits = shirts.flatMap(s => pants.map(p => `${s} shirt + ${p} pants`));
console.log("Choose a shirt OR pants item:", shirts.length + pants.length, "choices");
console.log("Choose a shirt AND pants:", outfits.length, "outfits");
console.log(outfits);
