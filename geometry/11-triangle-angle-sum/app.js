'use strict';

const a=Number(process.argv[2]??50),b=Number(process.argv[3]??60),c=180-a-b; console.log(`△ angles: ${a}° + ${b}° + ?° = 180°`); console.log(`Missing angle = ${c}°`); if(c<=0) console.log('Those first angles cannot make a triangle.');
