const {spawn}=require('node:child_process');
const readline=require('node:readline');

// One PowerShell session keeps the three read-only stages warm and reports real boundaries.
function readInventory(scripts,powershell,onProgress){
 const code=`[Console]::OutputEncoding=[System.Text.UTF8Encoding]::new(); $ProgressPreference='SilentlyContinue';
 try {
  Write-Output '{"kind":"progress","value":15,"phase":"قراءة مواصفات الجهاز"}'
  $deviceData=& { ${scripts.hardware} } | ConvertFrom-Json
  Write-Output '{"kind":"progress","value":48,"phase":"اكتشاف البرامج المثبّتة"}'
  $installedData=& { ${scripts.apps} } | ConvertFrom-Json
  Write-Output '{"kind":"progress","value":82,"phase":"فحص مكونات الألعاب"}'
  $runtimeData=& { ${scripts.runtime} } | ConvertFrom-Json
  [pscustomobject]@{kind='result';data=[pscustomobject]@{hardware=$deviceData;apps=$installedData;runtime=$runtimeData}} | ConvertTo-Json -Depth 8 -Compress
 } catch { [Console]::Error.WriteLine($_.Exception.Message); exit 1 }
 `;
 return new Promise((resolve,reject)=>{
  const child=spawn(powershell,['-NoLogo','-NoProfile','-NonInteractive','-EncodedCommand',Buffer.from(code,'utf16le').toString('base64')],{windowsHide:true,stdio:['ignore','pipe','pipe']});
  let result=null,stderr='',bytes=0,settled=false;
  const lines=readline.createInterface({input:child.stdout});
  const finish=(error,value)=>{if(settled)return;settled=true;clearTimeout(timer);lines.close();error?reject(error):resolve(value);};
  const timer=setTimeout(()=>{child.kill();finish(new Error('قراءة الجهاز استغرقت وقتًا أطول من المتوقع. جرّب إعادة المحاولة.'));},120000);
  child.stdout.on('data',chunk=>{bytes+=chunk.length;if(bytes>24*1024*1024){child.kill();finish(new Error('تجاوزت نتيجة الفحص الحجم المسموح.'));}});
  child.stderr.on('data',chunk=>{if(stderr.length<8000)stderr+=chunk.toString('utf8');});
  lines.on('line',line=>{try{const entry=JSON.parse(line.replace(/^\uFEFF/,''));if(entry.kind==='progress')onProgress({scope:'boot',value:entry.value,phase:entry.phase});if(entry.kind==='result')result=entry.data;}catch{/* PowerShell informational text is not protocol data. */}});
  child.once('error',()=>finish(new Error('تعذّر بدء قارئ معلومات ويندوز.')));
  child.once('close',code=>{
   if(code!==0||!result?.hardware)return finish(new Error('تعذّر إكمال قراءة معلومات ويندوز. حاول مرة أخرى.'));
   // Windows PowerShell 5 may serialize a root ConvertFrom-Json array as {value, Count}.
   if(!Array.isArray(result.apps)&&Array.isArray(result.apps?.value))result.apps=result.apps.value;
   result.apps=result.apps==null?[]:Array.isArray(result.apps)?result.apps:[result.apps];
   onProgress({scope:'boot',value:100,phase:'مساحة العمل جاهزة'});finish(null,result);
  });
 });
}
module.exports={readInventory};
