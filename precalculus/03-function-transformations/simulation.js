'use strict';

const right = 2, up = 3;
const base = x => x*x;
const moved = x => base(x-right)+up;
for(let x=-2;x<=6;x++) console.log({x, base:base(x), moved:moved(x)});
