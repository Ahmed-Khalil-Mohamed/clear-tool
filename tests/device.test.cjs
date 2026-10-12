const test=require('node:test');const assert=require('node:assert/strict');
test('device profiles choose only detected vendors and retain a universal Windows route',async()=>{
 const {vendorLinks,cleanModel}=await import('../src/device.mjs');
 assert.deepEqual(vendorLinks({manufacturer:'Dell Inc.',gpus:[{Name:'Intel UHD Graphics'}]}),[['intel','Intel'],['dell','Dell'],['windows','Windows Update']]);
 assert.deepEqual(vendorLinks({manufacturer:'LENOVO',gpus:{Name:'AMD Radeon Graphics'}}),[['amd','AMD'],['lenovo','Lenovo'],['windows','Windows Update']]);
 assert.deepEqual(vendorLinks({manufacturer:'Custom',gpus:[]}),[['windows','Windows Update']]);
 assert.deepEqual(vendorLinks({manufacturer:'HP',gpus:[{Name:'NVIDIA GeForce RTX 4060'},{Name:'Intel Iris Xe'}]}).map(x=>x[0]),['nvidia','intel','hp','windows']);
 assert.equal(cleanModel('ASUS TUF Gaming A16 FA607NUG_FA607NUG'),'ASUS TUF Gaming A16 FA607NUG');
 assert.equal(cleanModel('ThinkPad T14 Gen 4'),'ThinkPad T14 Gen 4');
 assert.equal(cleanModel(null),'Windows PC');
});
