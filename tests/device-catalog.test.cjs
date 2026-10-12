const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const catalog=require('../shared/device-catalog.json');
test('catalog links every family to a real bundled image and a valid brand',()=>{
 for(const list of [catalog.brands,catalog.families,catalog.art])assert.equal(new Set(list.map(x=>x.id)).size,list.length);
 for(const f of catalog.families){assert.ok(catalog.brands.some(b=>b.id===f.brand),f.id);assert.ok(catalog.art.some(a=>a.id===f.art),f.id);assert.doesNotThrow(()=>new RegExp(f.pattern,'i'));}
 for(const a of catalog.art)assert.ok(fs.existsSync(path.join(__dirname,'../public',a.src)),a.src);
 const {validatePreferences}=require('../electron/preferences.cjs');for(const a of catalog.art)assert.doesNotThrow(()=>validatePreferences({deviceArtwork:a.id}));
});
test('family selection uses manufacturer, enclosure, and Lenovo firmware family without guessing from opaque model IDs',async()=>{
 const {identifyDevice}=await import('../src/device-catalog.mjs');
 const cases=[
 [{manufacturer:'LENOVO',model:'83DF',systemFamily:'Legion 5 16IRX9',pcType:2},'lenovo-legion','laptop'],
 [{manufacturer:'LENOVO',model:'21HD',productVersion:'ThinkPad T14 Gen 4',pcType:2},'lenovo-thinkpad','laptop'],
 [{manufacturer:'Micro-Star International Co., Ltd.',model:'Katana 15 B13V',pcType:2},'msi-gaming','laptop'],
 [{manufacturer:'Dell Inc.',model:'Alienware m16 R2',pcType:2},'alienware-laptop','laptop'],
 [{manufacturer:'HP',model:'OMEN 16',pcType:2},'hp-omen','laptop'],
 [{manufacturer:'Microsoft Corporation',model:'Surface Pro 9',pcType:2,chassisTypes:[32]},'tablet','tablet'],
 [{manufacturer:'HP',model:'Pavilion All-in-One',pcType:1,chassisTypes:[13]},'all-in-one','aio'],
 [{manufacturer:'LENOVO',model:'ThinkStation P620',pcType:1},'workstation','workstation'],
 [{manufacturer:'Dell Inc.',model:'OptiPlex 7010 Micro',pcType:1},'mini-pc','mini'],
 [{manufacturer:'Panasonic',model:'TOUGHBOOK CF-33',pcType:2},'rugged-laptop','laptop'],
 [{manufacturer:'Unknown',model:'ROG Mystery',pcType:2},'ultrabook','laptop'],
 [{manufacturer:'ASUS',model:'ROG Desktop',pcType:1,battery:[{}]},'desktop','desktop'],
 [{manufacturer:'LENOVO',model:'83XYZ',pcType:2},'ultrabook','laptop'],
 ];
 for(const [hw,id,form] of cases){const result=identifyDevice(hw);assert.equal(result.artId,id,hw.model);assert.equal(result.form,form,hw.model);}
});
test('manual image overrides never alter detected identity or invent an exact photo',async()=>{
 const {deviceVisual}=await import('../src/device-visual.mjs');const hw={manufacturer:'Dell',model:'XPS 15',pcType:2};
 const r=deviceVisual(hw,'asus-tuf');assert.equal(r.id,'asus-tuf');assert.equal(r.title,'XPS 15');assert.equal(r.detected.brand.id,'dell');assert.equal(r.official,null);assert.equal(r.matched,false);
 assert.equal(deviceVisual(hw,'../../private').id,'dell-xps');
});
test('component inventory preserves multiple adapters and never invents PSU or chassis models',async()=>{
 const {hardwareParts}=await import('../src/hardware-parts.mjs');
 const parts=hardwareParts({gpus:[{Name:'Intel Arc'},{Name:'NVIDIA GeForce RTX 5080'}],memoryModules:{Manufacturer:'Samsung',PartNumber:'ABC',Capacity:16*1024**3},physicalDisks:[{Model:'Local SSD',Size:1024**4}]});
 assert.equal(parts.find(p=>p.id==='gpu').items.length,2);assert.match(parts.find(p=>p.id==='ram').items[0],/Samsung.*16.0 GB/);assert.equal(parts.find(p=>p.id==='psu').items.length,0);
 assert.ok(hardwareParts({}).every(p=>p.items.length===0));
});
test('catalog search combines brand and form filters',async()=>{
 const {searchFamilies}=await import('../src/device-catalog.mjs');assert.equal(searchFamilies('thinkpad','lenovo','laptop').length,1);assert.equal(searchFamilies('thinkpad','dell').length,0);assert.equal(searchFamilies('','asus','mini')[0].id,'asus-nuc');
});
