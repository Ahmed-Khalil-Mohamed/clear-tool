import dictionary from '../shared/locale-en.json' with {type:'json'};
const entries=Object.entries(dictionary).sort((a,b)=>b[0].length-a[0].length);
export function translate(value,language='ar'){if(language!=='en'||typeof value!=='string'||!/[\u0600-\u06ff]/.test(value))return value;const trimmed=value.trim();if(dictionary[trimmed])return value.replace(trimmed,dictionary[trimmed]);let text=value;for(const [ar,en]of entries)if(ar.length>=4&&text.includes(ar))text=text.split(ar).join(en);return text;}
