'use strict';

const a=Number(process.argv[2]??3),b=Number(process.argv[3]??4),c=Math.hypot(a,b); console.log(`a² + b² = ${a}² + ${b}² = ${a*a+b*b}`); console.log(`c = √${a*a+b*b} = ${Number(c.toFixed(4))}`);
