'use strict';

const n=Number(process.argv[2]??6); const names={3:'triangle',4:'quadrilateral',5:'pentagon',6:'hexagon',7:'heptagon',8:'octagon',9:'nonagon',10:'decagon'}; console.log(`${n} straight sides → ${names[n]??`${n}-gon`}`); console.log('A polygon must be closed and use straight sides.');
