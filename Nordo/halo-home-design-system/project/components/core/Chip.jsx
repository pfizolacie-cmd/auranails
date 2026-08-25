import React from 'react';
import {Icon} from './Icon.jsx';
export function Chip({children,selected=false,icon,onClick,style,...rest}){
  return <button type="button" onClick={onClick} {...rest} className="hh-press" style={{display:'inline-flex',alignItems:'center',gap:'var(--space-2)',padding:'var(--pad-pill)',borderRadius:'var(--radius-pill)',font:'var(--text-label)',whiteSpace:'nowrap',cursor:'pointer',transition:'background var(--dur-base) var(--ease-standard),color var(--dur-base) var(--ease-standard)',background:selected?'var(--surface-solid)':'var(--surface-glass)',color:selected?'var(--text-inverse)':'var(--text-secondary)',border:selected?'1px solid transparent':'1px solid var(--line-glass-soft)',backdropFilter:selected?undefined:'var(--glass)',WebkitBackdropFilter:selected?undefined:'var(--glass)',boxShadow:selected?'var(--shadow-sm)':'none',...style}}>
    {icon?<Icon name={icon} size={14}/>:null}{children}
  </button>;
}
