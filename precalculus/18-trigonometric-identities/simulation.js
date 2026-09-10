'use strict';

for(const degrees of [0,17,45,89,123,250]){const x=degrees*Math.PI/180; console.log({degrees, sum:Math.sin(x)**2+Math.cos(x)**2});}
