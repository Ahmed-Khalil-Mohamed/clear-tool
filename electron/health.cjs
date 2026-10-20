const list=x=>x==null?[]:Array.isArray(x)?x:[x];
const stages=['storage','memory','security','devices','startup','runtime','network','events'];
const scripts={
 storage:`@(Get-Volume -ErrorAction Stop | Where-Object {$_.DriveLetter -and $_.Size -gt 0} | Select-Object DriveLetter,Size,SizeRemaining,HealthStatus) | ConvertTo-Json`,
 memory:`$o=Get-CimInstance Win32_OperatingSystem -ErrorAction Stop; [pscustomobject]@{total=[double]$o.TotalVisibleMemorySize;free=[double]$o.FreePhysicalMemory} | ConvertTo-Json`,
 devices:`@(Get-CimInstance Win32_PnPEntity -ErrorAction Stop | Where-Object {$_.ConfigManagerErrorCode -ne 0} | Select-Object Name,ConfigManagerErrorCode) | ConvertTo-Json`,
 network:`@(Get-NetAdapter -ErrorAction Stop | Where-Object {$_.Status -eq 'Up'} | Select-Object Name,LinkSpeed) | ConvertTo-Json`,
 events:`$ErrorActionPreference='Stop'; try { @(Get-WinEvent -FilterHashtable @{LogName='System';Level=1,2;StartTime=(Get-Date).AddDays(-1)} -MaxEvents 40 | Select-Object Id,ProviderName,@{N='Time';E={$_.TimeCreated.ToString('o')}}) | ConvertTo-Json } catch { if($_.FullyQualifiedErrorId -like 'NoMatchingEventsFound*'){'[]'}else{throw} }`
};
function assess(id,data){
 let status='pass',value='',action=null;
 if(id==='storage'){const rows=list(data);if(!rows.length||rows.some(d=>!Number.isFinite(d.Size)||d.Size<=0||!Number.isFinite(d.SizeRemaining)||d.SizeRemaining<0||d.SizeRemaining>d.Size||d.HealthStatus==null))status='unknown';else{const low=rows.filter(d=>d.SizeRemaining/d.Size<.1),bad=rows.filter(d=>d.HealthStatus && d.HealthStatus!=='Healthy' && d.HealthStatus!==0);status=bad.length?'review':low.length?'warning':'pass';value=rows.map(d=>`${d.DriveLetter}: ${Math.round(d.SizeRemaining/1024**3)} GB / ${Math.round(d.Size/1024**3)} GB · ${d.HealthStatus??'?'}`).join('\n');action='storage';}}
 if(id==='memory'){if(!Number.isFinite(data?.total)||data.total<=0||!Number.isFinite(data.free)||data.free<0||data.free>data.total)status='unknown';else{const used=Math.round((1-data.free/data.total)*100);value=used+'%';status=used>=90?'warning':'pass';action='performance';}}
 if(id==='security'){if(!data)status='unknown';else{const d=data.defender,f=list(data.firewall);status=!d||typeof d.RealTimeProtectionEnabled!=='boolean'||!f.length||f.some(x=>![0,1,true,false].includes(x.Enabled))?'unknown':d.RealTimeProtectionEnabled===false||f.some(x=>x.Enabled===false||x.Enabled===0)?'review':data.rebootPending?'warning':'pass';value=JSON.stringify(data,null,2);action='security';}}
 if(id==='devices'){const rows=list(data);status=rows.length?'review':'pass';value=rows.length?rows.map(d=>`${d.Name}: ${d.ConfigManagerErrorCode}`).join('\n'):'0';action='drivers';}
 if(id==='startup'){const rows=list(data).filter(x=>x.state!=='disabled');status=rows.length>=10?'warning':'pass';value=String(rows.length);action='startup';}
 if(id==='runtime'){status=!data||typeof data.legacyX64!=='boolean'||typeof data.legacyX86!=='boolean'?'unknown':!data.legacyX64||!data.legacyX86?'review':'pass';value=data?JSON.stringify(data,null,2):'';action='gaming';}
 if(id==='network'){const rows=list(data);status=rows.length?'pass':'review';value=rows.map(d=>`${d.Name} · ${d.LinkSpeed}`).join('\n')||'0';action='network';}
 if(id==='events'){const rows=list(data);status=rows.length?'review':'pass';value=JSON.stringify(rows,null,2);action='repair';}
 return {id,status,value,action};
}
async function scan({read,baseScripts={},onProgress=()=>{}}){const startedAt=new Date().toISOString(),checks=[];for(const id of stages){onProgress({scope:'health',stage:id,current:checks.length,total:stages.length,measurable:true});const start=Date.now();try{checks.push({...assess(id,await read("$ErrorActionPreference='Stop'; "+(scripts[id]||baseScripts[id]),45000)),durationMs:Date.now()-start});}catch(e){checks.push({id,status:'unknown',value:e.message,durationMs:Date.now()-start});}onProgress({scope:'health',stage:id,current:checks.length,total:stages.length,measurable:true});}return {startedAt,finishedAt:new Date().toISOString(),checks};}
module.exports={assess,scan,stages};
