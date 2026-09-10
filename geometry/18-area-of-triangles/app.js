'use strict';

const b=Number(process.argv[2]??8),h=Number(process.argv[3]??5),rectangle=b*h; console.log(`Matching rectangle: ${b} × ${h} = ${rectangle}`); console.log(`Triangle is half: ${rectangle} ÷ 2 = ${rectangle/2} square units`);
