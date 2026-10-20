const {test}=require('node:test');
const assert=require('node:assert/strict');
const {assess,scan,stages}=require('../electron/health.cjs');
test('low free disk space and bad volume health are distinguished',()=>{
 assert.equal(assess('storage',[{Size:100,SizeRemaining:5,HealthStatus:'Healthy'}]).status,'warning');
 assert.equal(assess('storage',[{Size:100,SizeRemaining:80,HealthStatus:'Unhealthy'}]).status,'review');
 assert.equal(assess('storage',[]).status,'unknown');
});
test('missing protection evidence is not a clean bill of health',()=>{
 assert.equal(assess('security',{defender:null,firewall:[]}).status,'unknown');
 assert.equal(assess('security',{defender:{RealTimeProtectionEnabled:true},firewall:[{Enabled:false}]}).status,'review');
 assert.equal(assess('security',{defender:{RealTimeProtectionEnabled:true},firewall:[{Enabled:0}]}).status,'review');
 assert.equal(assess('security',{defender:{},firewall:[{Enabled:1}]}).status,'unknown');
 assert.equal(assess('security',{defender:{RealTimeProtectionEnabled:true},firewall:[{Enabled:true}],rebootPending:true}).status,'warning');
});
test('single devices and absent legacy libraries are reviewable, not fabricated repairs',()=>{
 assert.equal(assess('devices',{Name:'GPU',ConfigManagerErrorCode:43}).status,'review');
 assert.equal(assess('devices',[]).status,'pass');
 assert.equal(assess('runtime',null).status,'unknown');
 assert.equal(assess('runtime',{legacyX64:false,legacyX86:true}).status,'review');
});
test('failed probes do not stop remaining checks or become passes',async()=>{
 const progress=[];let count=0;const r=await scan({read:async()=>{count++;throw Error('Access denied')},baseScripts:{},onProgress:p=>progress.push(p)});
 assert.equal(count,8);assert.deepEqual(r.checks.map(c=>c.id),stages);assert.ok(r.checks.every(c=>c.status==='unknown'));assert.equal(progress.at(-1).current,8);
});

test('incomplete or invalid metrics never pass a health check',()=>{
 for(const value of [{Size:0,SizeRemaining:0},{Size:100,SizeRemaining:150,HealthStatus:'Healthy'},{Size:100,SizeRemaining:80}])assert.equal(assess('storage',[value]).status,'unknown');
 assert.equal(assess('memory',{total:Infinity,free:1}).status,'unknown');assert.equal(assess('runtime',{}).status,'unknown');
});
