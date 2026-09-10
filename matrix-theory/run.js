"use strict";
const fs=require("fs"), path=require("path");
const labs=fs.readdirSync(__dirname).filter(n=>/^\d{2}-/.test(n)).sort();
if(process.argv[2]==="--list"){ labs.forEach((n,i)=>console.log(`${i+1}. ${n.slice(3).replaceAll("-"," ")}`)); process.exit(0); }
const raw=process.argv[2]||"1", number=Number(raw);
if(!Number.isInteger(number)||number<1||number>labs.length){ console.error(`Choose a lab from 1 to ${labs.length}, or use --list.`); process.exit(1); }
require(path.join(__dirname,labs[number-1],"app.js"));
