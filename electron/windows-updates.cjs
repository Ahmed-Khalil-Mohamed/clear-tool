const sys=require('./system.cjs');
const fs=require('node:fs/promises');
const SCRIPT=`$ErrorActionPreference='Stop'
$session=New-Object -ComObject Microsoft.Update.Session
$session.ClientApplicationID='Clear Tool'
$searcher=$session.CreateUpdateSearcher()
$searcher.Online=$true
$result=$searcher.Search("IsInstalled=0 and IsHidden=0")
$items=@(for($i=0;$i -lt $result.Updates.Count;$i++){
 $u=$result.Updates.Item($i)
 $row=[ordered]@{id=$u.Identity.UpdateID;title=$u.Title;type=if($u.Type -eq 2){'driver'}else{'system'};optional=[bool]$u.BrowseOnly;downloaded=[bool]$u.IsDownloaded;size=[double]$u.MaxDownloadSize;date=$u.LastDeploymentChangeTime.ToString('o');kb=@($u.KBArticleIDs);description=$u.Description}
 if($u.Type -eq 2){$row.provider=$u.DriverProvider;$row.model=$u.DriverModel;$row.hardwareId=$u.DriverHardwareID;$row.driverDate=if($u.DriverVerDate){$u.DriverVerDate.ToString('yyyy-MM-dd')}else{$null}}
 [pscustomobject]$row
})
[pscustomobject]@{resultCode=[int]$result.ResultCode;items=$items;checkedAt=[DateTime]::UtcNow.ToString('o');rebootRequired=[bool](New-Object -ComObject Microsoft.Update.SystemInfo).RebootRequired;source='Windows Update'} | ConvertTo-Json -Depth 5`;
let cache=null,pending=null;
async function check({refresh=false,cacheFile}={}){if(pending)return pending;if(!cache&&cacheFile&&!refresh)try{const saved=JSON.parse(await fs.readFile(cacheFile,'utf8'));if(saved.source==='Windows Update'&&Array.isArray(saved.items)&&[2,3].includes(saved.resultCode))cache=saved}catch{}if(!refresh&&cache&&Date.now()-Date.parse(cache.checkedAt)<15*60*1000)return cache;pending=sys.json(SCRIPT,6*60*1000).then(async result=>{if(!result||![2,3].includes(result.resultCode))throw Error('لم يكتمل فحص Windows Update. حاول مرة أخرى من إعدادات ويندوز.');cache={...result,items:sys.list(result.items),partial:result.resultCode===3};if(cacheFile)await fs.writeFile(cacheFile,JSON.stringify(cache,null,2)).catch(()=>{});return cache}).finally(()=>{pending=null});return pending;}
module.exports={check,SCRIPT};
