const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),sync=require('node:fs'),os=require('node:os'),path=require('node:path');
const {walk,duplicates}=require('../electron/files.cjs');
test('many empty directories do not flood the renderer with progress events',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'clear-walk-')),paths=Array.from({length:100},(_,i)=>path.join(dir,String(i)));
 try{await Promise.all(paths.map(p=>fs.mkdir(p)));let count=0;const result=await walk(dir,{onProgress:()=>count++});assert.equal(result.entries.length,0);assert.ok(count<20,'progress should be time bounded, not emitted per empty folder');}finally{for(const p of paths)await fs.rmdir(p);await fs.rmdir(dir)}
});
test('duplicate scan excludes candidates changed after the discovery snapshot',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'clear-duplicate-')),a=path.join(dir,'a'),b=path.join(dir,'b');let changed=false;
 try{await fs.writeFile(a,Buffer.alloc(2*1024*1024,1));await fs.copyFile(a,b);const result=await duplicates(dir,p=>{if(p.phase&&!changed){changed=true;sync.appendFileSync(a,'changed');sync.appendFileSync(b,'changed');}});assert.ok(changed);assert.equal(result.groups.length,0);assert.equal(result.skipped,2);}finally{await fs.unlink(a);await fs.unlink(b);await fs.rmdir(dir)}
});
test('elapsed time uses the selected language',async()=>{const {duration}=await import('../src/operations.mjs');assert.equal(duration(65,'en'),'1m 5s');assert.equal(duration(5,'ar'),'5 ث');});
