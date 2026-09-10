'use strict';

const s=process.argv.slice(2,5).map(Number); if(s.length<3)s.push(5,5,3); const [a,b,c]=s; const valid=a+b>c&&a+c>b&&b+c>a; const type=a===b&&b===c?'equilateral':a===b||b===c||a===c?'isosceles':'scalene'; console.log(`Sides: ${a}, ${b}, ${c}`); console.log(valid?`This is a ${type} triangle.`:'These sides cannot close into a triangle.');
