import {APP_VERSION} from './version.mjs';
import React,{useEffect,useState} from 'react';
import {X,Minus,CornersOut,CheckCircle,CircleNotch,WarningCircle,ArrowsClockwise,Cpu,AppWindow,GameController} from '@phosphor-icons/react';

const stages=[
 {title:'مواصفات الجهاز',description:'المعالج، الذاكرة، الرسوميات والأقراص',icon:Cpu},
 {title:'البرامج المثبّتة',description:'اكتشاف البرامج وإصداراتها وأماكنها',icon:AppWindow},
 {title:'مكتبات الألعاب',description:'قراءة مكونات DirectX ومكتبات التشغيل',icon:GameController}
];
export default function Startup({boot,error,onRetry,api}){
 const [elapsed,setElapsed]=useState(0);
 useEffect(()=>{if(error)return;setElapsed(0);const start=Date.now();const interval=setInterval(()=>setElapsed(Math.floor((Date.now()-start)/1000)),1000);return()=>clearInterval(interval);},[error]);
 const completed=boot.value>=100?3:boot.value>=82?2:boot.value>=48?1:0;
 return <div className="launch-screen splash">
  <div className="launch-controls"><button aria-label="إغلاق" onClick={()=>api?.window('close')}><X size={18}/></button><button aria-label="تكبير النافذة" onClick={()=>api?.window('maximize')}><CornersOut size={16}/></button><button aria-label="تصغير" onClick={()=>api?.window('minimize')}><Minus size={18}/></button></div>
  <section className="launch-panel">
   <div className="launch-brand" dir="ltr"><img src="./clear-mark.png" alt=""/><strong>Clear Tool</strong></div>
   <div className="launch-intro"><span className="eyebrow">LET’S GET THINGS CLEAR</span><h1>تجهيز مساحة العمل</h1><p>نقرأ معلومات جهازك والبرامج الموجودة عليه.</p></div>
   <ol className="launch-steps">{stages.map(({title,description,icon:Icon},i)=><li key={title} className={i<completed?'done':i===completed?'current':'pending'} aria-current={i===completed?'step':undefined}><span className="launch-step-number num">0{i+1}</span><div><h2>{title}</h2><p>{i<completed?'اكتملت القراءة':description}</p></div><span className="launch-step-status">{i<completed?<CheckCircle weight="fill" size={24}/>:i===completed?(error?<WarningCircle size={24}/>:<CircleNotch className="spin" size={25}/>):<Icon size={23}/>}</span></li>)}</ol>
   <div className="launch-progress"><div className="launch-phase" role="status"><b>{error?'تعذّر إكمال القراءة':boot.phase}</b><span className="num">{String(Math.min(3,completed+1)).padStart(2,'0')} / 03</span></div><div className="launch-track" role="progressbar" aria-label="مراحل القراءة المكتملة" aria-valuemin={0} aria-valuemax={3} aria-valuenow={completed}><span style={{width:`${completed/3*100}%`}}/></div><div className="launch-meta"><span>{elapsed} ثانية</span><span>قراءة محلية للجهاز</span></div>{error&&<div className="launch-error"><p>{error}</p><button className="button" onClick={onRetry}><ArrowsClockwise size={19}/>إعادة المحاولة</button></div>}</div>
  </section>
  <section className="launch-art" aria-label="Clear Tool"><div className="launch-wordmark" dir="ltr"><h2>Clear Tool<span>.</span></h2><p>WINDOWS WORKSPACE</p></div><img src="./hardware-gaming.png" alt=""/><div className="launch-art-footer" dir="ltr"><span>YOUR PC. IN FOCUS.</span><small>v{APP_VERSION}</small></div></section>
 </div>
}
