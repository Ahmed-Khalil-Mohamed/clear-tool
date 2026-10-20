const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {hashFile,createUtilities}=require('../electron/utilities.cjs');
test('SHA-256 streams bytes and reports measured progress',async()=>{const dir=await fs.mkdtemp(path.join(os.tmpdir(),'clear-hash-'));const file=path.join(dir,'sample');try{await fs.writeFile(file,'abc');const progress=[];const result=await hashFile(file,p=>progress.push(p));assert.equal(result.sha256,'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');assert.equal(progress.at(-1).current,3);assert.equal(progress.at(-1).total,3);}finally{await fs.unlink(file);await fs.rmdir(dir)}});
test('utilities reject arbitrary commands and cancel file selection without reading',async()=>{let calls=0;const api=createUtilities({sys:{run:()=>calls++},dialog:{showOpenDialog:async()=>({canceled:true})},getWindow:()=>null,task:(_,fn)=>fn(),emit:()=>{}});await assert.rejects(api.utility('cmd.exe'),/Unknown/);assert.deepEqual(await api.utility('checksum'),{cancelled:true});assert.equal(calls,0)});
test('failed diagnostics propagate instead of fabricating success',async()=>{const api=createUtilities({sys:{json:async()=>{throw Error('Access denied')}},getWindow:()=>null,task:(_,fn)=>fn(),emit:()=>{}});await assert.rejects(api.utility('disks'),/Access denied/)});

test('utility state survives navigation and keeps the previous result on failure or cancellation',async()=>{
 let fail=false;const events=[];const api=createUtilities({sys:{json:async()=>{if(fail)throw Error('Unavailable');return []}},dialog:{showOpenDialog:async()=>({canceled:true})},getWindow:()=>null,task:(_,fn)=>fn(),emit:(c,s)=>events.push(s)});
 const result=await api.utility('battery');assert.equal((await api.utilityState()).last.token,result.token);assert.equal((await api.utilityState()).running,false);
 fail=true;await assert.rejects(api.utility('disks'),/Unavailable/);assert.equal((await api.utilityState()).last.token,result.token);assert.equal((await api.utilityState()).error,'Unavailable');
 await api.utility('checksum');assert.equal((await api.utilityState()).running,false);assert.equal((await api.utilityState()).last.token,result.token);assert.ok(events.some(e=>e.running));
});
test('export captures the displayed result even if another tool finishes while the dialog is open',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'clear-export-')),file=path.join(dir,'result.json');let choose;
 try{const api=createUtilities({sys:{json:async()=>[]},dialog:{showSaveDialog:()=>new Promise(r=>choose=r)},getWindow:()=>null,task:(_,fn)=>fn(),emit:()=>{}});const first=await api.utility('battery');const exporting=api.exportUtility(first.token);await api.utility('services');choose({canceled:false,filePath:file});await exporting;assert.equal(JSON.parse(await fs.readFile(file,'utf8')).id,'battery');await assert.rejects(api.exportUtility(first.token),/replaced/);}finally{await fs.unlink(file);await fs.rmdir(dir)}
});
