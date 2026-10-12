const {spawn}=require('node:child_process');
const cleanTerminal=text=>text.replace(/\x1b\][^\x07]*(?:\x07|\x1b\\)/g,'').replace(/\x1b\[[0-?]*[ -/]*[@-~]/g,'');
function parseProgress(text){
 const clean=cleanTerminal(text);
 const bytes=[...clean.matchAll(/([\d.,]+)\s*(KB|MB|GB|TB)\s*\/\s*([\d.,]+)\s*(KB|MB|GB|TB)/gi)].at(-1);
 if(bytes){const scale={KB:1024,MB:1024**2,GB:1024**3,TB:1024**4},current=Number(bytes[1].replace(/,/g,''))*scale[bytes[2].toUpperCase()],total=Number(bytes[3].replace(/,/g,''))*scale[bytes[4].toUpperCase()];if(total>0&&current>=0&&current<=total*1.01)return {phase:'تنزيل حزمة التحديث',current:Math.min(current,total),total,measurable:true,unit:'bytes'};}
 const match=[...clean.matchAll(/(?:^|[\s\r\n])([0-9]{1,3}(?:\.[0-9]+)?)%/g)].at(-1);
 if(match&&Number(match[1])<=100)return {phase:'تقدم أداة التحديث',current:Number(match[1]),total:100,measurable:true,unit:'percent'};
 if(/Successfully installed|Successfully upgraded/i.test(clean))return {phase:'اكتمل التثبيت',current:100,total:100,measurable:true,unit:'percent'};
 if(/Starting package install|^\s*Installing\b/i.test(clean))return {phase:'تثبيت التحديث',measurable:false};
 if(/verified installer hash|Verifying/i.test(clean))return {phase:'التحقق من حزمة التحديث',measurable:false};
 if(/Downloading/i.test(clean))return {phase:'تنزيل حزمة التحديث',measurable:false};
 return null;
}
function runWithProgress(exe,args,{onProgress=()=>{},timeout=15*60*1000}={}){
 return new Promise((resolve,reject)=>{
  let child,terminal=false;
  try{if(process.platform==='win32'&&/winget\.exe$/i.test(exe)){const ptyModule=require.resolve('node-pty').replace(/app\.asar([\\/])/,'app.asar.unpacked$1');child=require(ptyModule).spawn(exe,args,{name:'xterm-256color',cols:180,rows:32,cwd:require('node:path').dirname(exe),env:process.env,useConpty:true});terminal=true;}else child=spawn(exe,args,{windowsHide:true,shell:false,stdio:['ignore','pipe','pipe']});}catch(error){reject(error);return;}
  let output='',pending='',done=false;
  const timer=setTimeout(()=>{child.kill();finish(Error('انتهت مهلة انتظار أداة التحديث. راجع حالة البرنامج قبل المحاولة مرة أخرى.'))},timeout);
  const finish=(error)=>{if(done)return;done=true;clearTimeout(timer);if(error){error.output=cleanTerminal(output);reject(error)}else resolve(cleanTerminal(output))};
  const read=chunk=>{output=(output+chunk).slice(-2*1024*1024);pending+=chunk;const lines=pending.split(/[\r\n]/);pending=lines.pop().slice(-8192);for(const line of lines){const event=parseProgress(line);if(event)onProgress(event)}const event=parseProgress(pending);if(event)onProgress(event)};
  if(terminal){child.onData(data=>{if(data.includes('\x1b[6n'))child.write('\x1b[1;1R');read(data)});child.onExit(({exitCode})=>finish(exitCode===0?null:Error('لم يكتمل التحديث. كود الأداة: '+exitCode)));}
  else{child.stdout.setEncoding('utf8');child.stderr.setEncoding('utf8');child.stdout.on('data',read);child.stderr.on('data',read);child.once('error',finish);child.once('close',code=>finish(code===0?null:Error('لم يكتمل التحديث. كود الأداة: '+code)));}
 });
}
module.exports={parseProgress,runWithProgress};
