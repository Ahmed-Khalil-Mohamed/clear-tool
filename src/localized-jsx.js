import React,{useContext} from 'react';
import {jsx as base,jsxs as bases,Fragment} from 'react/jsx-runtime';
import {PreferencesContext} from './preferences';
import {translate} from './translate.mjs';
const fields=['title','placeholder','aria-label','alt'];
const arabic=x=>typeof x==='string'&&/[\u0600-\u06ff]/.test(x);
const needs=x=>Array.isArray(x)?x.some(needs):arabic(x);
function LocalizedNode({tag,original}){const {settings}=useContext(PreferencesContext),props={...original};const tr=x=>Array.isArray(x)?x.map(tr):typeof x==='string'?translate(x,settings.language):x;props.children=tr(props.children);for(const field of fields)if(props[field])props[field]=tr(props[field]);return React.createElement(tag,props);}
function localize(factory,type,props,key){if(typeof type==='string'&&!['script','style','code','pre'].includes(type)&&!props?.['data-raw']&&(needs(props?.children)||fields.some(f=>arabic(props?.[f]))))return factory(LocalizedNode,{tag:type,original:props},key);return factory(type,props,key);}
export const jsx=(type,props,key)=>localize(base,type,props,key);
export const jsxs=(type,props,key)=>localize(bases,type,props,key);
export const jsxDEV=(type,props,key)=>localize(base,type,props,key);
export {Fragment};
