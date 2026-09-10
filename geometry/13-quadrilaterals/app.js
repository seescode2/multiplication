'use strict';

const args=process.argv.slice(2), right=args.includes('--right'), sides=args.filter(x=>!x.startsWith('--')).map(Number); const s=sides.length===4?sides:[4,4,4,4]; const all=s.every(x=>x===s[0]), opposite=s[0]===s[2]&&s[1]===s[3]; let name=right&&all?'square':right&&opposite?'rectangle':all?'rhombus':'quadrilateral'; console.log(`Sides: ${s.join(', ')}; four right angles: ${right}`); console.log(`Best name: ${name}`);
