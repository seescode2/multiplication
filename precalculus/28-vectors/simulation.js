'use strict';

const a=[3,4],b=[-1,2],add=(u,v)=>u.map((n,i)=>n+v[i]),length=v=>Math.hypot(...v);
console.log({a,b,sum:add(a,b),lengthA:length(a),lengthB:length(b),lengthSum:length(add(a,b))});
