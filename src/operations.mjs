export const operationNames={refresh:'تحديث معلومات الجهاز',apps:'قراءة البرامج المثبّتة',drivers:'قراءة تعريفات الجهاز',runtime:'فحص مكتبات الألعاب',cache:'فحص الكاش',folder:'تحليل الملفات',updates:'فحص تحديثات البرامج',upgrade:'تحديث البرنامج',startup:'قراءة بدء التشغيل',toggle:'تغيير بدء التشغيل',network:'قراءة الشبكة',security:'قراءة الحماية',processes:'قراءة العمليات',history:'قراءة سجل العمليات',repair:'تشغيل أداة صيانة',export:'تصدير تقرير الجهاز',open:'فتح المصدر أو إعدادات ويندوز',reveal:'فتح مكان الملف'};
export function progressState(previous={},event,now=Date.now()){
 const next={...event,receivedAt:now};
 const same=previous.phase===event.phase&&previous.total===event.total;
 next.startedAt=same?previous.startedAt:now;
 next.initial=same?previous.initial:(event.current||0);
 const advanced=(event.current||0)-next.initial,elapsed=(now-next.startedAt)/1000;
 next.eta=event.measurable&&event.total>0&&advanced>0&&elapsed>=1?Math.max(0,(event.total-event.current)*elapsed/advanced):null;
 return next;
}
export function duration(seconds){const s=Math.max(0,Math.round(seconds||0));return s<60?`${s} ث`: `${Math.floor(s/60)} د ${s%60} ث`;}
