"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process"), assert=require("assert");
const labs=fs.readdirSync(__dirname).filter(n=>/^\d{2}-/.test(n)).sort();
assert.strictEqual(labs.length,30,"There must be exactly 30 labs");
for(const lab of labs){ for(const file of ["app.js","lab.md"]) assert(fs.existsSync(path.join(__dirname,lab,file)),`${lab}/${file} is missing`); const run=cp.spawnSync(process.execPath,[path.join(__dirname,lab,"app.js")],{encoding:"utf8"}); assert.strictEqual(run.status,0,`${lab} failed:\n${run.stderr}`); assert(run.stdout.trim(),`${lab} printed no simulation output`); }
console.log(`All ${labs.length} matrix simulations ran successfully.`);
