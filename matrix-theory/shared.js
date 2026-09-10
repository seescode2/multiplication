"use strict";
function shape(A){ return [A.length, A[0]?.length ?? 0]; }
function assertMatrix(A){ if(!Array.isArray(A)||!A.length||!A.every(r=>Array.isArray(r)&&r.length===A[0].length&&r.every(Number.isFinite))) throw new Error("Expected a non-empty rectangular numeric matrix"); }
function show(name,A){ console.log(`\n${name}:`); A.forEach(row=>console.log("  "+row.map(round).join("\t"))); }
function zeros(r,c){ return Array.from({length:r},()=>Array(c).fill(0)); }
function identity(n){ return Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?1:0)); }
function add(A,B){ assertMatrix(A); assertMatrix(B); if(String(shape(A))!==String(shape(B))) throw new Error("Matrix shapes must match"); return A.map((r,i)=>r.map((x,j)=>x+B[i][j])); }
function scale(k,A){ return A.map(r=>r.map(x=>k*x)); }
function transpose(A){ return A[0].map((_,j)=>A.map(r=>r[j])); }
function multiply(A,B){ assertMatrix(A); assertMatrix(B); if(A[0].length!==B.length) throw new Error("Inner dimensions must match"); const BT=transpose(B); return A.map(r=>BT.map(c=>r.reduce((s,x,i)=>s+x*c[i],0))); }
function matVec(A,v){ return A.map(r=>r.reduce((s,x,i)=>s+x*v[i],0)); }
function equal(A,B,eps=1e-9){ return shape(A).join()==shape(B).join()&&A.every((r,i)=>r.every((x,j)=>Math.abs(x-B[i][j])<eps)); }
function determinant2(A){ return A[0][0]*A[1][1]-A[0][1]*A[1][0]; }
function inverse2(A){ const d=determinant2(A); if(Math.abs(d)<1e-12) throw new Error("This matrix has no inverse because its determinant is zero"); return [[A[1][1]/d,-A[0][1]/d],[-A[1][0]/d,A[0][0]/d]]; }
function norm(v){ return Math.hypot(...v); }
function round(x){ const y=Math.round(x*1000)/1000; return Object.is(y,-0)?0:y; }
function power(A,n){ if(!Number.isInteger(n)||n<0) throw new Error("Power must be a nonnegative integer"); let out=identity(A.length), base=A; while(n){ if(n%2) out=multiply(out,base); base=multiply(base,base); n=Math.floor(n/2); } return out; }
function rank(A,eps=1e-10){ const M=A.map(r=>r.slice()); let row=0; for(let col=0;col<M[0].length&&row<M.length;col++){ let p=row; for(let i=row+1;i<M.length;i++) if(Math.abs(M[i][col])>Math.abs(M[p][col])) p=i; if(Math.abs(M[p][col])<eps) continue; [M[row],M[p]]=[M[p],M[row]]; const q=M[row][col]; M[row]=M[row].map(x=>x/q); for(let i=0;i<M.length;i++) if(i!==row){ const f=M[i][col]; M[i]=M[i].map((x,j)=>x-f*M[row][j]); } row++; } return row; }
function parallel(a,b,eps=1e-9){ return Math.abs(a[0]*b[1]-a[1]*b[0])<eps; }
module.exports={show,zeros,identity,add,scale,transpose,multiply,matVec,equal,determinant2,inverse2,norm,round,power,rank,parallel};
