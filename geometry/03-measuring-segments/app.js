'use strict';

const a=Number(process.argv[2]??2), b=Number(process.argv[3]??8); const length=Math.abs(b-a);
console.log(`${a} ${'─'.repeat(Math.max(0,length*2-1))} ${b}`);
console.log(`Length = |${b} - ${a}| = ${length} units`);
