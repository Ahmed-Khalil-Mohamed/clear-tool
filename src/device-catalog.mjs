import catalog from '../shared/device-catalog.json' with {type:'json'};
export const {brands,families,art}=catalog;
const values=x=>x==null?[]:Array.isArray(x)?x:[x];
const match=(pattern,text)=>new RegExp(pattern,'i').test(text);
export function identifyDevice(hw={}){
 const maker=String(hw.manufacturer||'').trim();
 const model=[hw.model,hw.systemFamily,hw.productVersion].filter(Boolean).join(' ');
 const brand=brands.find(b=>match(b.aliases,maker));
 const candidates=brand?families.filter(f=>f.brand===brand.id&&match(f.pattern,model)):[];
 const chassis=values(hw.chassisTypes).map(Number),type=Number(hw.pcType);
 // Physical enclosure beats broad marketing names (e.g. Legion / Envy desktops).
 let form;
 if(chassis.includes(13)||/All.in.One|\bAiO\b|Surface Studio|iMac/i.test(model))form='aio';
 else if(chassis.includes(30)||chassis.includes(32)||/Surface Pro|Surface Go/i.test(model))form='tablet';
 else if(/\bNUC\b|Mini PC|MiniDesktop|DeskMini|ThinkCentre.*Tiny|OptiPlex.*Micro|(?:Elite|Pro).*Mini|Macmini|Mac mini/i.test(model))form='mini';
 else if(chassis.some(n=>[8,9,10,14,31].includes(n))||[2,8].includes(type))form='laptop';
 else if(type===3)form='workstation';
 else if(type===1||chassis.some(n=>[3,4,5,6,7,15,16].includes(n)))form='desktop';
 else if(candidates.length)form=candidates[0].form;
 else if(values(hw.battery).length||/laptop|notebook|MacBook/i.test(model))form='laptop';
 else form='desktop';
 // Desktop subtype matches (mini/workstation) are valid for PCSystemType=1.
 let family=candidates.find(f=>f.form===form);
 if(!family&&form==='desktop')family=candidates.find(f=>['mini','workstation'].includes(f.form));
 if(family)form=family.form;
 let fallback=({laptop:'ultrabook',tablet:'tablet',mini:'mini-pc',aio:'all-in-one',workstation:'workstation',desktop:'desktop'})[form];
 if(form==='laptop'&&/gaming|Alienware|AORUS|Katana|Raider|Stealth/i.test(model))fallback='gaming-laptop';
 return {brand,family,form,artId:family?.art||fallback};
}
export function searchFamilies(query='',brand='all',form='all'){
 const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 return families.filter(f=>(brand==='all'||f.brand===brand)&&(form==='all'||f.form===form)&&terms.every(t=>(brands.find(b=>b.id===f.brand)?.label+' '+f.label).toLowerCase().includes(t)));
}
