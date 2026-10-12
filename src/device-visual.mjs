import {cleanModel} from './device.mjs';
import {art,identifyDevice} from './device-catalog.mjs';
const list=x=>x==null?[]:Array.isArray(x)?x:[x];
export const artworkChoices=art;
export function deviceVisual(hw={},override='auto'){
 const model=cleanModel(hw.model),maker=hw.manufacturer||'',detected=identifyDevice(hw);
 const chosen=art.find(a=>a.id===override),id=chosen?.id||detected.artId;
 const family=detected.family?detected.brand.label+' '+detected.family.label:detected.brand?.label||'Windows PC';
 const official=!chosen&&detected.brand?.id==='asus'&&detected.form==='laptop'&&/FA607NUG(?:\b|_)/i.test(model)?{src:'./devices/asus-fa607nug-official.png',model:'FA607NUG',source:'asus-fa607nug'}:null;
 return {id,src:art.find(a=>a.id===id).src,family,matched:!chosen&&!!detected.family,laptop:['laptop','tablet'].includes(detected.form),official,title:deviceTitle(model,maker),model,detected,manual:!!chosen,caption:chosen?'رسم توضيحي من اختيارك':detected.family?'تصوّر توضيحي؛ ليس تفكيكًا دقيقًا للموديل':'رسم عام حسب نوع الجهاز'};
}
export function deviceTitle(model,maker=''){
 const clean=cleanModel(model).replace(/_+/g,' ').replace(/\s+/g,' ').trim();
 const tuf=clean.match(/(?:ASUS\s+)?TUF(?:\s+Gaming)?\s+([AF]\d{2})/i);if(tuf)return 'ASUS TUF '+tuf[1].toUpperCase();
 if(!clean||/System Product Name|To Be Filled|Default string/i.test(clean))return /ASUS/i.test(maker)?'ASUS PC':maker?maker+' PC':'Windows PC';
 return clean.replace(/\s+(?:Laptop PC|Notebook PC|Notebook|Laptop)$/i,'');
}
export function deviceFacts(hw={}){const gpus=list(hw.gpus),gpu=gpus.find(g=>/NVIDIA|GeForce|Radeon RX|Intel.*Arc/i.test(g.Name))||gpus[0];const modules=list(hw.memoryModules),physical=modules.reduce((n,m)=>n+(Number(m.Capacity)||0),0);const types=[...new Set(modules.map(m=>({24:'DDR3',26:'DDR4',34:'DDR5'}[m.SMBIOSMemoryType])).filter(Boolean))];
 const cpu=String(hw.cpu||'غير متاح').replace(/\(R\)|\(TM\)/gi,'').replace(/\s+(?:with|w\/)\s+Radeon.*$/i,'').replace(/\s+CPU\b/i,'').trim();const gpuName=String(gpu?.Name||'غير متاح').replace(/\s+Laptop GPU$/i,'');
 return {cpu,gpu,gpuName,memory:physical||hw.totalMemory||0,physical:!!physical,memoryType:types.length===1?types[0]:'RAM',gpuVendor:/NVIDIA|GeForce/i.test(gpuName)?'NVIDIA':/AMD|Radeon/i.test(gpuName)?'AMD':/Intel/i.test(gpuName)?'INTEL':'GRAPHICS'};
}
