'use strict';

const m1=Number(process.argv[2]??2),m2=Number(process.argv[3]??2); console.log(`Line A slope: ${m1}`); console.log(`Line B slope: ${m2}`); console.log(m1===m2?'Same slope → parallel lines.':'Different slopes → not parallel.');
