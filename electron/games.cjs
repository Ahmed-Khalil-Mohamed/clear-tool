const fs=require('node:fs/promises'),path=require('node:path');
const {inside}=require('./files.cjs');
function parseVdf(source){
 const tokens=String(source).match(/"(?:\\.|[^"\\])*"|[{}]/g)||[];let i=0;
 const read=depth=>{if(depth>20)throw Error('VDF depth');const out={};while(i<tokens.length){const key=tokens[i++];if(key==='}')break;if(key==='{')continue;const name=key.slice(1,-1).replace(/\\([\\"])/g,'$1'),value=tokens[i++];if(value==='{')out[name]=read(depth+1);else if(value?.startsWith('"'))out[name]=value.slice(1,-1).replace(/\\([\\"])/g,'$1');}return out;};return read(0);
}
async function exists(p){if(!p)return false;try{return (await fs.stat(p)).isDirectory();}catch{return false;}}
async function readVdf(p){try{const st=await fs.stat(p);if(st.size>10*1024*1024)return {};return parseVdf(await fs.readFile(p,'utf8'));}catch{return {};}}
async function files(p){try{return await fs.readdir(p,{withFileTypes:true});}catch{return [];}}
async function steamArt(roots,id){for(const root of roots){const base=path.join(root,'appcache','librarycache'),appDir=path.join(base,id);const versions=(await files(appDir)).filter(f=>f.isDirectory()&&/^[a-f0-9]{20,64}$/i.test(f.name)).slice(0,80).map(f=>path.join(appDir,f.name));
 for(const name of ['library_600x900.jpg','library_capsule.jpg','library_header.jpg','header.jpg']){for(const dir of [appDir,...versions]){const file=path.join(dir,name);try{await fs.access(file);return file;}catch{}}try{const file=path.join(base,id+'_'+name);await fs.access(file);return file;}catch{}}
 }return null;}
async function scanGames({apps=[],steamRoots=[],manual=[]}={}){
 const games=new Map(),libraries=[];
 for(const root of steamRoots){const v=await readVdf(path.join(root,'steamapps','libraryfolders.vdf'));const paths=[root,...Object.values(v.libraryfolders||{}).map(x=>typeof x==='object'?x.path:x).filter(Boolean)];
  for(const library of [...new Set(paths.map(p=>path.normalize(p)))]){if(libraries.some(l=>l.path.toLowerCase()===library.toLowerCase()))continue;const available=await exists(library);libraries.push({platform:'Steam',path:library,available});if(!available)continue;
   for(const f of (await files(path.join(library,'steamapps'))).filter(f=>/^appmanifest_\d+\.acf$/i.test(f.name)).slice(0,1500)){
    const a=(await readVdf(path.join(library,'steamapps',f.name))).AppState;if(!a||!/^\d+$/.test(a.appid)||!a.name||/Steamworks.*Redistributables|Steam Linux Runtime/i.test(a.name))continue;
    const location=path.resolve(library,'steamapps','common',a.installdir||'');if(!inside(path.join(library,'steamapps','common'),location))continue;
    games.set('steam:'+a.appid,{id:'steam:'+a.appid,name:a.name,platform:'Steam',appId:a.appid,location,available:await exists(location),size:Number(a.SizeOnDisk)||null,lastPlayed:Number(a.LastPlayed)||0,source:'manifest',installed:Number(a.StateFlags)&4?true:false});
   }
  }
 }
 for(const a of apps){const id=String(a.id||'').match(/^Steam App (\d+)$/)?.[1];if(id&&!games.has('steam:'+id))games.set('steam:'+id,{id:'steam:'+id,name:a.name,platform:'Steam',appId:id,location:a.location,available:await exists(a.location),size:a.sizeKB?a.sizeKB*1024:null,source:'registry',installed:true,displayIcon:a.displayIcon});}
 const epicPath=path.join(process.env.ProgramData||'C:\\ProgramData','Epic','EpicGamesLauncher','Data','Manifests');
 for(const f of (await files(epicPath)).filter(f=>f.name.endsWith('.item')).slice(0,1000)){try{const a=JSON.parse(await fs.readFile(path.join(epicPath,f.name),'utf8'));if(!a.bIsExecutable||!a.AppName||!a.InstallLocation||/Unreal Engine|Discord/i.test(a.DisplayName)||a.AppCategories?.some(c=>/plugins|engine|software/i.test(c)))continue;games.set('epic:'+a.AppName,{id:'epic:'+a.AppName,name:a.DisplayName,platform:'Epic Games',appId:a.AppName,location:a.InstallLocation,available:await exists(a.InstallLocation),installed:!a.bIsIncompleteInstall,size:a.InstallSize||null,source:'manifest'});}catch{}}
 for(const a of apps){if(/^Steam App /.test(a.id||''))continue;if(!a.location||!/[\\/](?:EA Games|GOG Games|Ubisoft[^\\/]*[\\/]games)[\\/]/i.test(a.location))continue;if([...games.values()].some(g=>g.location?.toLowerCase()===a.location.toLowerCase()))continue;games.set('registered:'+a.id,{id:'registered:'+a.id,name:a.name,platform:/GOG/i.test(a.location)?'GOG':/Ubisoft/i.test(a.location)?'Ubisoft':'EA',location:a.location,available:await exists(a.location),installed:true,size:a.sizeKB?a.sizeKB*1024:null,displayIcon:a.displayIcon,source:'registry'});}
 for(const a of manual){let available=false;try{available=(await fs.stat(a.executable)).isFile();}catch{}games.set(a.id,{...a,platform:'يدوي',source:'manual',available,installed:available,location:path.dirname(a.executable)});}
 for(const game of games.values()){if(game.platform==='Steam')game.coverPath=await steamArt(steamRoots,game.appId);}
 return {games:[...games.values()].sort((a,b)=>a.name.localeCompare(b.name)),libraries,scannedAt:new Date().toISOString()};
}
function launchTarget(game){if(!game?.available)throw Error('مجلد اللعبة غير متاح. وصّل القرص أو راجع مكان التثبيت.');if(game.platform==='Steam'&&/^\d+$/.test(game.appId))return {url:'steam://run/'+game.appId};if(game.platform==='Epic Games'&&game.appId)return {url:'com.epicgames.launcher://apps/'+encodeURIComponent(game.appId)+'?action=launch&silent=true'};if(game.source==='manual'&&/\.(exe|lnk)$/i.test(game.executable))return {file:game.executable};throw Error('أضف ملف تشغيل اللعبة من زر ربط ملف التشغيل.');}
module.exports={parseVdf,scanGames,launchTarget};
