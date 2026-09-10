'use strict';

const target=.5, step=.1, answers=[];
for(let d=0;d<=360;d+=step) if(Math.abs(Math.sin(d*Math.PI/180)-target)<.001) answers.push(+d.toFixed(1));
console.log('Approximate degree solutions:',answers.filter((v,i,a)=>i===0||v-a[i-1]>1));
