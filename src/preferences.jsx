import React,{createContext,useContext,useEffect,useState} from 'react';
const defaults={language:'ar',theme:'light',sidebarCompact:false,consoleStyle:'station',deviceArtwork:'auto'};
let cached=defaults;try{cached={...defaults,...JSON.parse(localStorage.getItem('clear-appearance')||'{}')}}catch{}
export const PreferencesContext=createContext({settings:cached,save:async()=>{}});
export const usePreferences=()=>useContext(PreferencesContext);
function apply(s){document.documentElement.lang=s.language==='en'?'en':'ar';document.documentElement.dir=s.language==='en'?'ltr':'rtl';document.documentElement.dataset.theme=s.theme==='dark'?'dark':'light';try{localStorage.setItem('clear-appearance',JSON.stringify(s))}catch{}}
apply(cached);
export function PreferencesProvider({children}){const [settings,setSettings]=useState(cached);const update=s=>{setSettings(p=>{const next={...p,...s};apply(next);return next;});};useEffect(()=>{let live=true;window.clear?.settings().then(s=>live&&update(s)).catch(()=>{});const off=window.clear?.onSettings(update);return()=>{live=false;off?.();}},[]);const save=async patch=>{if(window.clear){const s=await window.clear.saveSettings(patch);update(s);return s;}const s={...settings,...patch};update(s);return s;};return <PreferencesContext.Provider value={{settings,save}}>{children}</PreferencesContext.Provider>}
