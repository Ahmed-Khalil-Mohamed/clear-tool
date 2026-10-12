const fs=require('node:fs/promises');
const path=require('node:path');
const {inside}=require('./files.cjs');
const keyOf=a=>`${a.kind}:${a.id}:${a.version||''}`;
function iconPath(value){
 const raw=String(value||'').trim().replace(/^@/,'');
 const match=raw.match(/^"([^"]+)"(?:\s*,\s*-?\d+)?$/);
 const p=(match?match[1]:raw.replace(/,\s*-?\d+$/,'')).replace(/%([^%]+)%/g,(_,k)=>process.env[k]||'');
 return path.isAbsolute(p)&&!p.startsWith('\\\\')&&/\.(exe|dll|ico|png)$/i.test(p)?p:null;
}
const resourceCache=new Map();
function extractResource(file,index){
 const key=file+','+index;if(resourceCache.has(key))return resourceCache.get(key);
 const sys=require('./system.cjs');
 const source=`using System;using System.Runtime.InteropServices;public static class ClearIcon { [DllImport("shell32.dll",CharSet=CharSet.Unicode)] public static extern uint ExtractIconEx(string file,int index,IntPtr[] large,IntPtr[] small,uint count);[DllImport("user32.dll")] public static extern bool DestroyIcon(IntPtr handle); }`;
 const pending=sys.ps(`Add-Type -AssemblyName System.Drawing;Add-Type -TypeDefinition ${sys.psLiteral(source)};$large=New-Object IntPtr[] 1;$small=New-Object IntPtr[] 1;[void][ClearIcon]::ExtractIconEx(${sys.psLiteral(file)},${index},$large,$small,1);try {if($large[0] -ne [IntPtr]::Zero){$icon=[Drawing.Icon]::FromHandle($large[0]);$bitmap=$icon.ToBitmap();$stream=New-Object IO.MemoryStream;try{$bitmap.Save($stream,[Drawing.Imaging.ImageFormat]::Png);[Convert]::ToBase64String($stream.ToArray())}finally{$stream.Dispose();$bitmap.Dispose();$icon.Dispose()}}}finally{if($large[0] -ne [IntPtr]::Zero){[void][ClearIcon]::DestroyIcon($large[0])};if($small[0] -ne [IntPtr]::Zero){[void][ClearIcon]::DestroyIcon($small[0])}}`,20000).then(data=>data?'data:image/png;base64,'+data:null).catch(()=>null);
 resourceCache.set(key,pending);return pending;
}
function createIconReader(app){
 const cache=new Map();
 async function read(a){
  const key=keyOf(a);if(cache.has(key))return cache.get(key);
  let result=null;
  try{
   if(a.kind==='Store'&&a.location){
    const manifest=await fs.readFile(path.join(a.location,'AppxManifest.xml'),'utf8');
    const logo=manifest.match(/Square44x44Logo\s*=\s*"([^"]+)"/i)?.[1];
    if(logo){
     const target=path.resolve(a.location,logo);
     if(inside(a.location,target)){
      const dir=path.dirname(target),base=path.basename(target,'.png');
      const choices=(await fs.readdir(dir)).filter(n=>n.toLowerCase().endsWith('.png')&&(n===path.basename(target)||n.startsWith(base+'.')));
      choices.sort((a,b)=>Number(/targetsize-48|scale-100/.test(b))-Number(/targetsize-48|scale-100/.test(a)));
      if(choices[0]){const file=path.join(dir,choices[0]);if((await fs.stat(file)).size<2*1024*1024)result='data:image/png;base64,'+(await fs.readFile(file)).toString('base64');}
     }
    }
   }else{
    const target=iconPath(a.displayIcon);
    if(target){await fs.access(target);if(/\.dll$/i.test(target))result=await extractResource(target,Number(String(a.displayIcon).match(/,\s*(-?\d+)$/)?.[1]||0));else{const icon=await app.getFileIcon(target,{size:'normal'});if(!icon.isEmpty())result=icon.toDataURL();}}
   }
  }catch{}
  cache.set(key,result);if(cache.size>1000)cache.delete(cache.keys().next().value);return result;
 }
 return async function icons(keys,inventory){
  if(!Array.isArray(keys)||keys.length>100||keys.some(k=>typeof k!=='string'))throw new Error('طلب أيقونات غير صالح');
  const rows=keys.map(k=>inventory.find(a=>keyOf(a)===k)).filter(Boolean),out={};let index=0;
  await Promise.all(Array.from({length:4},async()=>{while(index<rows.length){const row=rows[index++];out[keyOf(row)]=await read(row);}}));return out;
 };
}
module.exports={keyOf,iconPath,createIconReader};
