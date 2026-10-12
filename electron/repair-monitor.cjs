const fs=require('node:fs/promises');
async function waitForRepair(marker,pid,{onProgress=()=>{},interval=1000,timeout=2*60*60*1000,alive=id=>{try{process.kill(id,0);return true;}catch(e){return e.code==='EPERM';}}}={}){
 const started=Date.now();
 while(Date.now()-started<timeout){
  try{const result=JSON.parse((await fs.readFile(marker,'utf8')).replace(/^\uFEFF/,''));if(Number.isInteger(result.exitCode))return result;}catch{}
  if(!alive(pid))throw new Error('أُغلقت نافذة الأداة قبل وصول نتيجة نهائية. راجع سجل الأداة قبل إعادة التشغيل.');
  onProgress();await new Promise(resolve=>setTimeout(resolve,interval));
 }
 throw new Error('انتهت مدة المتابعة داخل البرنامج. راجع نافذة أداة ويندوز لمعرفة النتيجة.');
}
module.exports={waitForRepair};
