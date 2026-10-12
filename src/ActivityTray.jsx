import React,{useEffect,useState} from 'react';
import {CircleNotch,CheckCircle,WarningCircle,X,Clock,ArrowDown,ArrowUp} from '@phosphor-icons/react';
import {duration} from './operations.mjs';
export default function ActivityTray({operations,onDismiss,compact=false}){
 const [now,setNow]=useState(Date.now()),[expanded,setExpanded]=useState(!compact);
 useEffect(()=>setExpanded(!compact),[compact]);
 const running=operations.filter(o=>o.state==='running');
 useEffect(()=>{if(!running.length)return;const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[running.length]);
 useEffect(()=>{if(running.length||!operations.length)return;const timer=setTimeout(onDismiss,12000);return()=>clearTimeout(timer);},[operations,running.length]);
 if(!operations.length)return null;
 const visible=expanded?[...running,...operations.filter(o=>o.state!=='running').slice(0,2)]:[];
 return <aside className={'activity-tray '+(!expanded?'compact':'')} aria-label="متابعة العمليات">
  <div className="activity-heading"><button onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}><Clock size={18}/><b>متابعة العمليات</b><span>{running.length?`${running.length} قيد التشغيل`:'آخر النتائج'}</span>{expanded?<ArrowDown size={16}/>:<ArrowUp size={16}/>}</button>{!running.length&&<button aria-label="إخفاء متابعة العمليات" onClick={onDismiss}><X size={18}/></button>}</div>
  {visible.map(o=>{const p=o.progress||{},percent=p.measurable&&p.total>0?Math.min(100,p.current/p.total*100):null;const active=o.state==='running';return <div className={'activity-item '+o.state} key={o.id}><div className="activity-label">{active?<CircleNotch className="spin"/>:o.state==='error'?<WarningCircle/>:<CheckCircle/>}<b>{o.label}</b><small>{active?'جارٍ العمل':o.state==='cancelled'?'أُلغيت':o.state==='error'?'لم تكتمل':'اكتملت'}</small></div>{active&&<><p>{p.phase||'جارٍ تنفيذ الطلب…'}{percent!==null&&<b className="activity-percent num">{Math.round(percent)}%</b>}{p.files!=null&&<span> · {p.files.toLocaleString()} ملف</span>}</p><div className={'activity-meter '+(percent===null?'indeterminate':'')} role="progressbar" aria-label={o.label} {...(percent!==null?{'aria-valuenow':Math.round(percent),'aria-valuemin':0,'aria-valuemax':100}:{})}><span style={percent!==null?{width:percent+'%'}:{}}/></div></>}<div className="activity-time"><span>الوقت المنقضي <b>{duration(((o.endedAt||now)-o.startedAt)/1000)}</b></span>{active&&<span>{p.eta!=null?<>المتبقي تقريبًا <b>{duration(p.eta)}</b></>:'المتبقي: غير محدد بعد'}</span>}</div>{o.error&&<p className="activity-error">{o.error}</p>}</div>})}
 </aside>
}
