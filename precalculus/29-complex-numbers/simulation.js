'use strict';

const z={re:2,im:3},w={re:1,im:-4};
const add=(a,b)=>({re:a.re+b.re,im:a.im+b.im});
const multiply=(a,b)=>({re:a.re*b.re-a.im*b.im,im:a.re*b.im+a.im*b.re});
console.log({z,w,sum:add(z,w),product:multiply(z,w),magnitudeZ:Math.hypot(z.re,z.im)});
