const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),{EventEmitter}=require('node:events');
function fixture(apps=[]){
 const files=new Set(['D:\\Games\\PPSSPP\\PPSSPPWindows.exe','D:\\Games\\a game.iso','C:\\Windows\\explorer.exe']),calls=[],settings={integrations:{},roms:[]};let choice={canceled:true},saved=0;
 const fakeFs={stat:async p=>{if(!files.has(p))throw Error('missing');return {isFile:()=>true}},readdir:async()=>[]};
 const module={exports:{}};
 const requireMock=id=>id==='electron'?{app:{getPath:()=> 'D:\\AppData'},dialog:{showOpenDialog:async()=>choice},shell:{openExternal:async url=>calls.push({url}),openPath:async folder=>{calls.push({folder});return ''}}}:id==='node:fs/promises'?fakeFs:id==='node:child_process'?{spawn:(exe,args,options)=>{calls.push({exe,args,options});const child=new EventEmitter();child.unref=()=>{};queueMicrotask(()=>child.emit('spawn'));return child}}:id==='../shared/integrations.json'?require('../shared/integrations.json'):require(id);
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../electron/integrations.cjs'),'utf8'),{require:requireMock,module,process:{env:{WINDIR:'C:\\Windows'}},queueMicrotask});
 const api=module.exports.createIntegrations({getWindow:()=>({setFullScreen:v=>calls.push({fullscreen:v})}),inventory:()=>({apps}),getSettings:()=>settings,save:async()=>saved++,record:async()=>{}});
 return {api,settings,files,calls,choose:value=>{choice=value},saved:()=>saved,exports:module.exports};
}
test('integration discovery distinguishes Dolphin Anty and reads validated executable icons',async()=>{
 const f=fixture([{name:'Dolphin Anty 2026',kind:'Desktop',displayIcon:'C:\\Anty.exe,0'},{name:'PPSSPP',displayIcon:'"D:\\Games\\PPSSPP\\PPSSPPWindows.exe",0'}]);
 const rows=await f.api.integrations();assert.equal(rows.find(x=>x.id==='dolphin').registered,false);assert.equal(rows.find(x=>x.id==='ppsspp').installed,true);
 await f.api.integrationAction({id:'ppsspp',action:'launch'});assert.equal(f.calls[0].exe,'D:\\Games\\PPSSPP\\PPSSPPWindows.exe');assert.equal(f.calls[0].options.shell,false);
});
test('ROM import deduplicates, preserves file and launches with separated arguments',async()=>{
 const f=fixture();f.settings.integrations.ppsspp='D:\\Games\\PPSSPP\\PPSSPPWindows.exe';f.choose({canceled:false,filePaths:['D:\\Games\\a game.iso']});
 await f.api.addRom('ppsspp');await f.api.addRom('ppsspp');assert.equal(f.settings.roms.length,1);const id=f.settings.roms[0].id;await f.api.launchRom(id);assert.deepEqual(Array.from(f.calls[0].args),['D:\\Games\\a game.iso']);await f.api.removeRom(id);assert.equal(f.settings.roms.length,0);assert(f.files.has('D:\\Games\\a game.iso'));
 f.choose({canceled:false,filePaths:['D:\\Games\\payload.exe']});await assert.rejects(f.api.addRom('ppsspp'),/Unsupported/);
});
test('integration API rejects arbitrary routes, launch actions and UNC files',async()=>{
 const f=fixture();await assert.rejects(f.api.systemTool('ms-settings:anything'),/Unknown/);await assert.rejects(f.api.integrationAction({id:'https://example.com',action:'download'}),/Unknown/);await assert.rejects(f.api.integrationAction({id:'ppsspp',action:'exec'}),/Unknown/);await assert.rejects(f.api.consoleWindow('true'),/Invalid/);assert.equal(f.exports.localExe('\\\\server\\file.exe'),false);assert.throws(()=>f.exports.launchArgs('dolphin',null,'\\\\server\\game.iso'),/Invalid/);
 await f.api.systemTool('themes');assert.equal(f.calls[0].url,'ms-settings:themes');assert.equal((await f.api.addRom('ppsspp')).cancelled,true);assert.equal(f.saved(),0);
});
test('Store integrations launch their registered application ID',async()=>{
 const f=fixture([{name:'Lively Wallpaper',kind:'Store',appId:'Lively_123!App'}]);assert.equal((await f.api.integrations()).find(x=>x.id==='lively').installed,true);await f.api.integrationAction({id:'lively',action:'launch'});assert.equal(f.calls[0].exe,'C:\\Windows\\explorer.exe');assert.deepEqual(Array.from(f.calls[0].args),['shell:AppsFolder\\Lively_123!App']);
});
