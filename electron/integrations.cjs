const {app,dialog,shell}=require('electron'),fs=require('node:fs/promises'),path=require('node:path'),{spawn}=require('node:child_process'),{randomUUID}=require('node:crypto');
const catalog=require('../shared/integrations.json');
const systemLinks={personalization:'ms-settings:personalization',background:'ms-settings:personalization-background',colors:'ms-settings:colors',taskbar:'ms-settings:taskbar',themes:'ms-settings:themes',accessibility:'ms-settings:easeofaccess',sound:'ms-settings:sound',notifications:'ms-settings:notifications',display:'ms-settings:display',multitasking:'ms-settings:multitasking',clipboard:'ms-settings:clipboard',mouse:'ms-settings:mousetouchpad'};
function localExe(file){return typeof file==='string'&&path.isAbsolute(file)&&!file.startsWith('\\\\')&&!/[\r\n\0]/.test(file)&&path.extname(file).toLowerCase()==='.exe';}
function launchArgs(id,mode,rom){if(rom){if(!path.isAbsolute(rom)||/[\r\n\0]/.test(rom)||rom.startsWith('\\\\'))throw Error('Invalid game path');if(id==='ppsspp')return [rom];if(id==='dolphin')return ['--exec',rom];if(id==='pcsx2')return ['--',rom];throw Error('Open this game from the emulator library');}if(id==='playnite')return [mode==='fullscreen'?'--startfullscreen':'--startdesktop'];return [];}
function createIntegrations({getWindow,inventory,getSettings,save,record}){
 let detected=new Map(),storeApps=new Map(),addons=new Map(),scanPromise;
 const entry=id=>{const row=catalog.find(x=>x.id===id);if(!row)throw Error('Unknown tool');return row;};
 async function exists(p){try{return (await fs.stat(p)).isFile()}catch{return false;}}
 async function scan(){
  const settings=getSettings(),result=[];
  for(const tool of catalog){
   let executable=settings.integrations?.[tool.id];
   if(!localExe(executable)||!await exists(executable))executable=null;
   const matching=(inventory().apps||[]).filter(a=>tool.id==='dolphin'?/^Dolphin(?: Emulator)?(?:\s+[0-9].*)?$/i.test(a.name||''):(a.name||'').toLowerCase().includes(tool.name.toLowerCase()));
   const storeApp=!executable&&matching.find(a=>a.kind==='Store'&&/^[\w.-]+![\w.-]+$/.test(a.appId||''));
   if(storeApp)storeApps.set(tool.id,storeApp.appId);else storeApps.delete(tool.id);
   if(!executable&&!storeApp){
    const roots=new Set(matching.filter(a=>a.kind!=='Store').map(a=>a.location).filter(p=>typeof p==='string'&&path.isAbsolute(p)&&!p.startsWith('\\\\')));
    for(const a of matching){
     const icon=String(a.displayIcon||'').trim().replace(/,\s*-?\d+$/,'').replace(/^"|"$/g,'');
     if(localExe(icon)&&tool.executables.some(n=>n.toLowerCase()===path.basename(icon).toLowerCase())&&await exists(icon)){executable=icon;break;}
    }
    for(const base of [process.env.LOCALAPPDATA,path.join(process.env.LOCALAPPDATA||'','Programs'),process.env.ProgramFiles,process.env['ProgramFiles(x86)']])if(base)for(const folder of tool.folders)roots.add(path.join(base,folder));
    for(const root of roots){
     if(executable)break;
     const candidates=[root];
     try{for(const dir of (await fs.readdir(root,{withFileTypes:true})).slice(0,40))if(dir.isDirectory()&&!dir.isSymbolicLink()&&/^(app-|bin$|x64$|Dolphin-x64$)/i.test(dir.name))candidates.push(path.join(root,dir.name));}catch{}
     for(const dir of candidates){for(const name of tool.executables){const p=path.join(dir,name);if(localExe(p)&&await exists(p)){executable=p;break;}}if(executable)break;}
    }
   }
   if(executable)detected.set(tool.id,executable);else detected.delete(tool.id);
   result.push({...tool,executable,installed:!!executable||!!storeApp,registered:matching.length>0,version:matching[0]?.version||null});
  }
  return result;
 }
 async function launch(executable,args){if(!localExe(executable)||!await exists(executable))throw Error('Executable is unavailable. Locate it again.');await new Promise((resolve,reject)=>{const child=spawn(executable,args,{cwd:path.dirname(executable),detached:true,stdio:'ignore',shell:false});child.once('error',reject);child.once('spawn',()=>{child.unref();resolve();});});}
 const handlers={
  integrations:async()=>{if(!scanPromise)scanPromise=scan().finally(()=>{scanPromise=null});return scanPromise;},
  integrationAction:async({id,action,mode}={})=>{const tool=entry(id);if(action==='download'||action==='addons'){const url=action==='addons'?tool.addons:tool.url;if(!url)throw Error('No catalog for this tool');await shell.openExternal(url);return {ok:true};}if(action==='locate'){const r=await dialog.showOpenDialog(getWindow(),{title:'Locate '+tool.name,properties:['openFile'],filters:[{name:tool.name,extensions:['exe']}]});if(r.canceled)return {cancelled:true};const selected=r.filePaths[0];if(!localExe(selected))throw Error('Select a local .exe file');const settings=getSettings();settings.integrations={...settings.integrations,[id]:selected};await save();return {ok:true,items:await scan()};}if(action==='launch'){if(!detected.has(id)&&!storeApps.has(id))await handlers.integrations();const exe=detected.get(id),appId=storeApps.get(id);if(!exe&&!appId)throw Error('Locate '+tool.name+' first');if(appId)await launch(path.join(process.env.WINDIR||'C:\\Windows','explorer.exe'),['shell:AppsFolder\\'+appId]);else await launch(exe,launchArgs(id,mode));await record('launch','Opened '+tool.name);return {ok:true};}throw Error('Unknown action');},
  playniteAddons:async()=>{if(!detected.has('playnite'))await handlers.integrations();const root=detected.get('playnite');const roots=[path.join(app.getPath('appData'),'Playnite'),...(root?[path.dirname(root)]:[])];addons.clear();const rows=[];for(const base of [...new Set(roots)])for(const kind of ['Themes/Desktop','Themes/Fullscreen','Extensions']){const dir=path.join(base,kind);let dirs;try{dirs=await fs.readdir(dir,{withFileTypes:true})}catch{continue;}for(const d of dirs.slice(0,150)){if(!d.isDirectory()||d.isSymbolicLink())continue;const folder=path.join(dir,d.name);let name=d.name,version='';for(const manifest of ['theme.yaml','extension.yaml'])try{const st=await fs.stat(path.join(folder,manifest));if(st.size>65536)continue;const text=await fs.readFile(path.join(folder,manifest),'utf8');name=text.match(/^Name:\s*['"]?(.+?)['"]?\s*$/m)?.[1]||name;version=text.match(/^Version:\s*(.+)$/m)?.[1]||'';}catch{}const id=randomUUID();addons.set(id,folder);rows.push({id,name,version,kind});}}return rows;},
  revealAddon:async(id)=>{const folder=addons.get(id);if(!folder)throw Error('Refresh add-ons first');const error=await shell.openPath(folder);if(error)throw Error(error);return true;},
  systemTool:async(id)=>{if(!Object.hasOwn(systemLinks,id))throw Error('Unknown Windows tool');await shell.openExternal(systemLinks[id]);return true;},
  consoleWindow:async(enabled)=>{if(typeof enabled!=='boolean')throw Error('Invalid fullscreen value');getWindow().setFullScreen(enabled);return enabled;},
  romLibrary:async()=>getSettings().roms||[],
  addRom:async(emulator)=>{const tool=entry(emulator);if(!tool.formats)throw Error('Manage games inside this emulator');const r=await dialog.showOpenDialog(getWindow(),{title:'Add games · '+tool.name,properties:['openFile','multiSelections'],filters:[{name:tool.platform,extensions:tool.formats}]});if(r.canceled)return {cancelled:true};const settings=getSettings(),rows=settings.roms||[];for(const file of r.filePaths.slice(0,100)){if(!path.isAbsolute(file)||file.startsWith('\\\\')||!tool.formats.includes(path.extname(file).slice(1).toLowerCase())||!await exists(file))throw Error('Unsupported game file');if(!rows.some(x=>x.file===file&&x.emulator===emulator))rows.push({id:randomUUID(),name:path.basename(file,path.extname(file)),file,emulator,platform:tool.platform});}settings.roms=rows.slice(0,2000);await save();return {roms:settings.roms};},
  removeRom:async(id)=>{const settings=getSettings();settings.roms=(settings.roms||[]).filter(x=>x.id!==id);await save();return settings.roms;},
  launchRom:async(id)=>{const rom=(getSettings().roms||[]).find(x=>x.id===id);if(!rom)throw Error('Unknown game');if(!await exists(rom.file))throw Error('Game file is unavailable');if(!detected.has(rom.emulator))await handlers.integrations();const exe=detected.get(rom.emulator);if(!exe)throw Error('Locate the emulator first');await launch(exe,launchArgs(rom.emulator,null,rom.file));return {ok:true};}
 };return handlers;
}
module.exports={createIntegrations,launchArgs,localExe,systemLinks};
