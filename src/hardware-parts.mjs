const list=x=>x==null?[]:Array.isArray(x)?x:[x];
const join=(...x)=>x.filter(v=>v!=null&&String(v).trim()).map(v=>String(v).trim()).join(' · ');
const size=n=>Number(n)>0?`${(Number(n)/1024**3).toFixed(1)} GB`:'';
export const partCatalog=[
 {id:'cpu',ar:'المعالج',en:'Processors',vendors:['Intel','AMD','Qualcomm'],read:h=>h.cpu?[h.cpu]:[]},
 {id:'gpu',ar:'كروت الشاشة',en:'Graphics',vendors:['NVIDIA','AMD','Intel','ASUS','MSI','Gigabyte','Sapphire','PowerColor','XFX','ZOTAC','PNY','Palit','Gainward','ASRock'],read:h=>list(h.gpus).map(x=>join(x.Name,x.DriverVersion))},
 {id:'ram',ar:'شرائح الذاكرة',en:'Memory modules',vendors:['Samsung','SK hynix','Micron','Crucial','Kingston','Corsair','G.Skill','TeamGroup','ADATA','Patriot','Lexar'],read:h=>list(h.memoryModules).map(x=>join(x.Manufacturer,x.PartNumber,size(x.Capacity),x.ConfiguredClockSpeed?x.ConfiguredClockSpeed+' MT/s':'',x.DeviceLocator))},
 {id:'board',ar:'اللوحة الأم',en:'Motherboards',vendors:['ASUS','MSI','Gigabyte','ASRock','Biostar','Supermicro','Intel','Dell','HP','Lenovo'],read:h=>list(h.baseBoards).map(x=>join(x.Manufacturer,x.Product))},
 {id:'storage',ar:'وحدات التخزين',en:'Physical storage',vendors:['Samsung','Western Digital','SanDisk','Seagate','Toshiba','Kioxia','Crucial','Kingston','SK hynix','Solidigm','ADATA','TeamGroup','Sabrent','Lexar'],read:h=>list(h.physicalDisks).map(x=>join(x.Model,size(x.Size),x.InterfaceType))},
 {id:'display',ar:'الشاشات',en:'Displays',vendors:['LG','Samsung','BOE','AUO','Innolux','Dell','ASUS','Acer','BenQ','AOC','MSI','ViewSonic','Philips','HP','Lenovo'],read:h=>list(h.monitors).map(x=>join(x.MonitorManufacturer,x.Name))},
 {id:'network',ar:'كروت الشبكة',en:'Network adapters',vendors:['Intel','Realtek','Qualcomm','Broadcom','MediaTek','Marvell','TP-Link','ASUS'],read:h=>list(h.networkCards).map(x=>join(x.Manufacturer,x.Name))},
 {id:'audio',ar:'الصوت',en:'Audio devices',vendors:['Realtek','Intel','AMD','NVIDIA','Creative','C-Media'],read:h=>list(h.soundDevices).map(x=>join(x.Manufacturer,x.Name))},
 {id:'battery',ar:'البطارية',en:'Batteries',vendors:['Simplo','Sunwoda','Dynapack','LG','Samsung','Panasonic'],read:h=>list(h.battery).map(x=>join(x.Name,Number.isFinite(x.EstimatedChargeRemaining)?x.EstimatedChargeRemaining+'%':''))},
 {id:'case',ar:'الكيسة',en:'Cases',vendors:['Corsair','NZXT','Fractal Design','Lian Li','Cooler Master','be quiet!','Phanteks','Thermaltake','DeepCool','Antec','HYTE'],read:()=>[],unavailable:true},
 {id:'cooling',ar:'التبريد',en:'Cooling',vendors:['Noctua','ARCTIC','Corsair','Cooler Master','be quiet!','DeepCool','Thermalright','NZXT','Lian Li','EK'],read:()=>[],unavailable:true},
 {id:'psu',ar:'مزود الطاقة',en:'Power supplies',vendors:['Seasonic','Corsair','Super Flower','FSP','be quiet!','Cooler Master','Thermaltake','MSI','ASUS','SilverStone'],read:()=>[],unavailable:true}
];
export function hardwareParts(hw={}){return partCatalog.map(p=>({...p,items:p.read(hw).filter(Boolean)}));}
