const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createInventoryCache,validSnapshot}=require('../electron/inventory-cache.cjs');
const {NetworkMonitor}=require('../electron/network-monitor.cjs');
const {PassThrough}=require('node:stream'),{EventEmitter}=require('node:events');
const snapshot=()=>({cacheHost:'test-host',hardware:{model:'Fixture'},apps:[{name:'App',id:'id'}],runtime:{},scannedAt:new Date().toISOString()});
test('inventory cache validates age and shape before using a saved snapshot',()=>{
 assert.equal(validSnapshot(snapshot()),true);
 for(const data of [{...snapshot(),scannedAt:'bad'}, {...snapshot(),scannedAt:'2001-01-01'}, {...snapshot(),apps:[{id:1}]},{...snapshot(),hardware:[]}])assert.equal(validSnapshot(data),false);
});
test('inventory cache serves saved data immediately, coalesces live reads, and reports failed refresh',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'clear-inventory-')),file=path.join(dir,'inventory.json');
 try{await fs.writeFile(file,JSON.stringify(snapshot()));let finish,calls=0;const events=[];const cache=createInventoryCache({file,identity:'test-host',read:()=>{calls++;return new Promise(r=>finish=r)},onChange:e=>events.push(e)});
 const saved=await cache.bootstrap();assert.equal(saved.cached,true);assert.equal(saved.refreshing,true);
 const a=cache.refresh(),b=cache.refresh();assert.equal(a,b);finish({...snapshot(),apps:[]});await a;assert.equal(calls,1);assert.equal(events[0].cached,false);assert.deepEqual(JSON.parse(await fs.readFile(file,'utf8')).apps,[]);
 const failed=createInventoryCache({file,identity:'test-host',read:async()=>{throw Error('offline')},onChange:e=>events.push(e)});await failed.bootstrap();await assert.rejects(failed.refresh());assert.equal(events.at(-1).refreshError,'offline');assert.equal(events.at(-1).cached,true);
 }finally{await fs.unlink(file);await fs.rmdir(dir)}
});
test('corrupt inventory falls back to a fresh read',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'clear-inventory-')),file=path.join(dir,'inventory.json');try{await fs.writeFile(file,'broken');const cache=createInventoryCache({file,read:async()=>snapshot()});assert.equal((await cache.bootstrap()).cached,false);}finally{await fs.unlink(file);await fs.rmdir(dir)}
});
test('a portable snapshot from another machine or account is never shown as this device',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'clear-host-')),file=path.join(dir,'inventory.json');try{await fs.writeFile(file,JSON.stringify(snapshot()));let reads=0;const cache=createInventoryCache({file,identity:'different-host',read:async()=>{reads++;return {...snapshot(),hardware:{model:'Current device'}}}});const result=await cache.bootstrap();assert.equal(result.cached,false);assert.equal(result.hardware.model,'Current device');assert.equal(reads,1);}finally{await fs.unlink(file);await fs.rmdir(dir)}
});
test('network monitor does not spawn until requested and rapid restart cannot orphan the new monitor',()=>{
 const children=[],events=[];const monitor=new NetworkMonitor(e=>events.push(e),{spawnProcess:()=>{const c=new EventEmitter();c.stdout=new PassThrough();c.stderr=new PassThrough();c.kill=()=>{c.killed=true};children.push(c);return c;}});
 assert.equal(children.length,0);monitor.start();monitor.start();assert.equal(children.length,1);monitor.stop();assert.equal(children[0].killed,true);monitor.start();children[0].emit('exit',0);assert.equal(monitor.child,children[1]);monitor.stop();assert.equal(children[1].killed,true);
});
