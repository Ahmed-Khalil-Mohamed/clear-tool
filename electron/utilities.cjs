const fs=require('node:fs'),fsp=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
async function hashFile(file,onProgress=()=>{}){
 const before=await fsp.stat(file);if(!before.isFile())throw Error('Select a regular file');
 const hash=crypto.createHash('sha256');let done=0,last=0;
 for await(const chunk of fs.createReadStream(file)){hash.update(chunk);done+=chunk.length;if(Date.now()-last>150){onProgress({current:done,total:before.size,measurable:true});last=Date.now();}}
 const after=await fsp.stat(file);if(after.size!==before.size||after.mtimeMs!==before.mtimeMs)throw Error('File changed during verification. Try again.');
 onProgress({current:done,total:before.size,measurable:true});return {name:path.basename(file),bytes:done,sha256:hash.digest('hex')};
}
const queries={disks:"@(Get-PhysicalDisk -ErrorAction Stop | Select-Object FriendlyName,@{N='MediaType';E={$_.MediaType.ToString()}},@{N='HealthStatus';E={$_.HealthStatus.ToString()}},OperationalStatus,Size) | ConvertTo-Json -Depth 4",services:"@(Get-CimInstance Win32_Service -ErrorAction Stop | Where-Object {$_.StartMode -eq 'Auto' -and $_.State -ne 'Running'} | Select-Object DisplayName,State,StartMode) | ConvertTo-Json",battery:"@(Get-CimInstance Win32_Battery -ErrorAction Stop | Select-Object Name,EstimatedChargeRemaining,BatteryStatus) | ConvertTo-Json"};
function createUtilities({sys,dialog,app,getWindow,emit,task,knownPaths}){let last=null,state={running:false,last:null,error:null};const publish=patch=>{state={...state,...patch,last};emit('utility',state);};return {
 utilityState:async()=>state,
 utility:async(id)=>task('utility',async()=>{
  if(!['checksum','batteryReport','sleep','disks','services','battery'].includes(id))throw Error('Unknown utility');
  if(state.running)throw Error('Another utility is running');
  const started=Date.now();publish({running:true,id,startedAt:started,error:null});
  try{
  emit('progress',{scope:'utility',phase:id,measurable:false});let data;
  if(id==='checksum'){const choice=await dialog.showOpenDialog(getWindow(),{properties:['openFile']});if(choice.canceled)return {cancelled:true};data=await hashFile(choice.filePaths[0],p=>emit('progress',{scope:'utility',phase:'SHA-256',...p}));}
  else if(id==='batteryReport'){const folder=path.join(app.getPath('userData'),'reports');await fsp.mkdir(folder,{recursive:true});const report=path.join(folder,'battery-'+Date.now()+'.html');await sys.run(path.join(process.env.SystemRoot,'System32','powercfg.exe'),['/batteryreport','/output',report],60000);await fsp.access(report);knownPaths.add(report);data={report};}
  else if(id==='sleep')data=await sys.run(path.join(process.env.SystemRoot,'System32','powercfg.exe'),['/a']);
  else data=await sys.json("$ErrorActionPreference='Stop'; "+queries[id],45000);
  last={id,token:crypto.randomUUID(),at:new Date().toISOString(),durationMs:Date.now()-started,data};return last;
  }catch(e){publish({error:e.message});throw e;}finally{publish({running:false});}
 }),
 exportUtility:async(token)=>{if(!last)throw Error('Run a tool first');if(token&&token!==last.token)throw Error('This result was replaced. Open the latest result.');const snapshot=last;const r=await dialog.showSaveDialog(getWindow(),{defaultPath:'Clear-Tool-'+snapshot.id+'.json',filters:[{name:'JSON',extensions:['json']}]});if(r.canceled)return {cancelled:true};await fsp.writeFile(r.filePath,JSON.stringify(snapshot,null,2));return {ok:true};}
};}
module.exports={hashFile,createUtilities,queries};
