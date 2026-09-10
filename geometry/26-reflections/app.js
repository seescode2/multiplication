'use strict';

const x=Number(process.argv[2]??3),y=Number(process.argv[3]??2),line=process.argv[4]??'x'; const out=line==='x'?[x,-y]:line==='y'?[-x,y]:[-x,-y]; console.log(`Reflect (${x}, ${y}) over the ${line==='origin'?'origin':line+'-axis'}.`); console.log(`Image: (${out[0]}, ${out[1]})`);
