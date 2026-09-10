'use strict';

const a=process.argv.slice(2,5).map(Number); const angles=a.length===3?a:[30,60,90]; const total=angles.reduce((x,y)=>x+y,0), largest=Math.max(...angles); const type=largest<90?'acute':largest===90?'right':'obtuse'; console.log(`Angles: ${angles.join('° + ')}° = ${total}°`); console.log(total===180&&angles.every(x=>x>0)?`This is a ${type} triangle.`:'Not a valid triangle.');
