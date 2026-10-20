const fs=require('node:fs/promises'),path=require('node:path');
const os=require('node:os'),{createHash}=require('node:crypto');
const hostKey=createHash('sha256').update(os.hostname()+'\0'+os.userInfo().username).digest('hex');
const MAX_AGE=7*24*60*60*1000;
function validSnapshot(value,now=Date.now()){
 const age=now-Date.parse(value?.scannedAt);
 return !!value?.hardware&&typeof value.hardware==='object'&&!Array.isArray(value.hardware)&&Array.isArray(value.apps)&&value.apps.every(a=>a&&typeof a.name==='string'&&typeof a.id==='string')&&value.runtime&&typeof value.runtime==='object'&&Number.isFinite(age)&&age>=0&&age<MAX_AGE;
}
function createInventoryCache({file,read,onChange=()=>{},onAccept=()=>{},identity=hostKey}){
 let current=null,pending=null,loaded=null;
 const accept=value=>{current=value;onAccept(value);return value;};
 async function load(){if(!loaded)loaded=(async()=>{try{if((await fs.stat(file)).size>8*1024*1024)return;const value=JSON.parse(await fs.readFile(file,'utf8'));if(value.cacheHost===identity&&validSnapshot(value))accept(value);}catch{}})();await loaded;}
 function refresh(){if(pending)return pending;pending=(async()=>{
  try{const value={...await read(),scannedAt:new Date().toISOString(),cacheHost:identity};accept(value);
   try{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file+'.tmp',JSON.stringify(value));await fs.rename(file+'.tmp',file);}catch{/* A live inventory remains usable when disk persistence is unavailable. */}
   onChange({...value,cached:false,refreshing:false});return {...value,cached:false,refreshing:false};
  }catch(e){if(current)onChange({...current,cached:true,refreshing:false,refreshError:e.message});throw e;}
  finally{pending=null;}
 })();return pending;}
 return {refresh,async bootstrap(){await load();if(current){refresh().catch(()=>{});return {...current,cached:true,refreshing:true};}return refresh();}};
}
module.exports={createInventoryCache,validSnapshot};
