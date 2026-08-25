import React from 'react';
import {Icon} from './Icon.jsx';
export function IconButton({icon,size=40,tone='glass',active=false,label,onClick,style,...rest}){
  const tones={
    glass:{background:'var(--surface-glass)',border:'1px solid var(--line-glass)',color:'var(--text-primary)'},
    solid:{background:'var(--surface-solid)',border:'1px solid var(--line-solid)',color:'var(--text-inverse)'},
    ember:{background:'var(--grad-ember)',border:'1px solid rgba(255,246,236,.25)',color:'var(--accent-on)'}
  };
  const t=tones[tone]||tones.glass;
  return <button type="button" aria-label={label} onClick={onClick} {...rest} className="hh-press" style={{width:size,height:size,display:'inline-flex',alignItems:'center',justifyContent:'center',borderRadius:'var(--radius-circle)',cursor:'pointer',backdropFilter:tone==='glass'?'var(--glass)':undefined,WebkitBackdropFilter:tone==='glass'?'var(--glass)':undefined,boxShadow:active?'var(--glow-soft)':'var(--inner-top)',transition:'transform var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard),box-shadow var(--dur-base) var(--ease-standard)',...t,...(active?{color:'var(--glow-500)'}:null),...style}}>
    <Icon name={icon} size={Math.round(size*0.45)}/>
  </button>;
}
