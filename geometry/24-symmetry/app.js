'use strict';

const x=Number(process.argv[2]??4),y=Number(process.argv[3]??2); console.log(`Original point:  (${x}, ${y})`); console.log('Mirror line:     x = 0 (the y-axis)'); console.log(`Reflected point: (${-x}, ${y})`); console.log('The x sign flips; y stays the same.');
