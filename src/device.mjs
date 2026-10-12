export function cleanModel(model){return (model||'Windows PC').replace(/(\b[\w-]+)_\1\b/g,'$1');}
export function vendorLinks(hardware){
 const gpu=Array.isArray(hardware.gpus)?hardware.gpus:hardware.gpus?[hardware.gpus]:[];
 const names=gpu.map(g=>g.Name||'').join(' ');
 const vendors=[];
 for(const [id,label,re] of [['nvidia','NVIDIA',/NVIDIA|GeForce/i],['amd','AMD',/AMD|Radeon/i],['intel','Intel',/Intel/i]])if(re.test(names))vendors.push([id,label]);
 for(const [id,label,re] of [['asus','ASUS',/asus/i],['dell','Dell',/dell/i],['hp','HP',/^HP$|Hewlett/i],['lenovo','Lenovo',/lenovo/i],['acer','Acer',/acer/i]])if(re.test(hardware.manufacturer||''))vendors.push([id,label]);
 vendors.push(['windows','Windows Update']);
 return vendors;
}
