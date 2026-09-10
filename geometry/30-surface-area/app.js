'use strict';

const l=Number(process.argv[2]??4),w=Number(process.argv[3]??3),h=Number(process.argv[4]??2); const lw=l*w,lh=l*h,wh=w*h,total=2*(lw+lh+wh); console.log(`Top + bottom: 2 × ${lw} = ${2*lw}`); console.log(`Front + back: 2 × ${lh} = ${2*lh}`); console.log(`Sides: 2 × ${wh} = ${2*wh}`); console.log(`Surface area = ${total} square units`);
