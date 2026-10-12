import {cleanModel} from './device.mjs';
const list=x=>x==null?[]:Array.isArray(x)?x:[x];
export const artworkChoices=[['asus-tuf','ASUS TUF'],['asus-rog','ASUS ROG Strix / Zephyrus'],['lenovo-legion','Lenovo Legion'],['lenovo-loq','Lenovo LOQ'],['lenovo-thinkpad','Lenovo ThinkPad'],['hp-laptop','HP Pavilion / Envy'],['gaming-laptop','Gaming laptop · MSI / Acer / Alienware'],['ultrabook','Ultrabook · Zenbook / VivoBook / Yoga / XPS'],['desktop','Desktop · Graphite'],['desktop-white','Desktop · White'],['mini-pc','Mini PC · NUC / Mini']].map(([id,label])=>({id,label}));
export function deviceVisual(hw={},override='auto'){
 const model=cleanModel(hw.model),maker=hw.manufacturer||'',text=maker+' '+model;
 const laptop=hw.pcType===1?false:hw.pcType===2||hw.pcType===8||list(hw.battery).length>0||/laptop|notebook|thinkpad|ideapad|yoga|legion|pavilion|envy|spectre|victus|omen|vivobook|zenbook|tuf gaming|rog|latitude|inspiron|xps|precision [357]\d{3}|aspire|nitro|swift|predator|surface/i.test(model);
 const gaming=/TUF|ROG|Legion|LOQ|Victus|OMEN|Nitro|Predator|Alienware|Katana|Raider|Stealth|Gaming|AORUS/i.test(model);
 let id='desktop',family='كمبيوتر مكتبي',matched=false;
 if(laptop){id='ultrabook';family='لابتوب';if(/ASUS|ASUSTeK/i.test(text)&&/TUF|FA50|FA60|FX50/i.test(model)){id='asus-tuf';family='ASUS TUF';matched=true;}else if(/ASUS|ASUSTeK/i.test(text)&&/ROG|Strix|Zephyrus/i.test(model)){id='asus-rog';family='ASUS ROG';matched=true;}else if(/Lenovo/i.test(maker)&&/Legion/i.test(model)){id='lenovo-legion';family='Lenovo Legion';matched=true;}else if(/Lenovo/i.test(maker)&&/LOQ/i.test(model)){id='lenovo-loq';family='Lenovo LOQ';matched=true;}else if(/Lenovo/i.test(maker)&&/ThinkPad/i.test(model)){id='lenovo-thinkpad';family='Lenovo ThinkPad';matched=true;}else if(gaming){id='gaming-laptop';family='لابتوب ألعاب';}else if(/^HP$|Hewlett/i.test(maker)&&/Pavilion|Envy/i.test(model)){id='hp-laptop';family='HP Pavilion / Envy';matched=true;}}else if(/NUC|Mini PC|MiniDesktop|ThinkCentre.*Tiny|OptiPlex.*Micro|Elite.*Mini|DeskMini|Mini.?ITX/i.test(model)){id='mini-pc';family='Mini PC';}
 const chosen=artworkChoices.find(x=>x.id===override);if(chosen){id=chosen.id;family=chosen.label;matched=false;}
 const official=!chosen&&/ASUS|ASUSTeK/i.test(maker)&&/FA607NUG(?:\b|_)/i.test(model)?{src:'./devices/asus-fa607nug-official.png',model:'FA607NUG',source:'asus-fa607nug'}:null;
 return {id,src:'./devices/'+id+'.png',family,matched,laptop,official,title:deviceTitle(model,maker),model,caption:chosen?'رسم توضيحي من اختيارك':matched?'تصوّر توضيحي لعائلة '+family:'تصوّر توضيحي لنوع الجهاز'};
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
