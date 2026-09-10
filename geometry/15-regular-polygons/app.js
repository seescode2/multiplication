'use strict';

const parse=(text,fallback)=>(text??fallback).split(',').map(Number); const sides=parse(process.argv[2],'5,5,5,5'),angles=parse(process.argv[3],'90,90,90,90'); const same=a=>a.every(x=>x===a[0]); console.log(`Sides equal: ${same(sides)}; angles equal: ${same(angles)}`); console.log(same(sides)&&same(angles)?'Regular polygon!':'Not a regular polygon.');
