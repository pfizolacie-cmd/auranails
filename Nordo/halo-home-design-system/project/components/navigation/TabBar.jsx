import React from 'react';
import {Icon} from '../core/Icon.jsx';
export function TabBar({items,value,onChange,style,...rest}){
  return <nav {...rest} style={{display:'flex',alignItems:'center',justifyContent:'space-around',gap:'var(--space-3)',padding:'var(--inset-tabbar) var(--space-6)',borderRadius:'var(--radius-pill)',background:'var(--surface-glass)',border:'1px solid var(--line-glass-soft)',backdropFilter:'var(--glass-heavy)',WebkitBackdropFilter:'var(--glass-heavy)',boxShadow:'var(--shadow-md),var(--inner-top)',...style}}>
    {items.map(it=>{const on=it.value===value;return <button key={it.value} type="button" aria-label={it.label} aria-current={on} onClick={()=>onChange&&onChange(it.value)} style={{background:'none',border:'none',padding:0,cursor:'pointer',display:'inline-flex',color:on?'var(--glow-500)':'var(--text-tertiary)',filter:on?'drop-shadow(0 0 10px rgba(246,225,66,.7))':'none',transition:'color var(--dur-base) var(--ease-standard),filter var(--dur-base) var(--ease-standard)'}}><Icon name={it.icon} size={21}/></button>;})}
  </nav>;
}
