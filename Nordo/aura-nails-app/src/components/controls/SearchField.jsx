import React from 'react';
import {Icon} from '../core/Icon.jsx';
export function SearchField({placeholder='Search devices',value,onChange,style,...rest}){
  return <label {...rest} style={{display:'flex',alignItems:'center',gap:'var(--space-3)',padding:'10px 16px',borderRadius:'var(--radius-pill)',background:'var(--surface-glass)',border:'1px solid var(--line-glass-soft)',backdropFilter:'var(--glass)',WebkitBackdropFilter:'var(--glass)',color:'var(--text-secondary)',...style}}>
    <Icon name="search" size={16}/>
    <input value={value} onChange={e=>onChange&&onChange(e.target.value)} placeholder={placeholder} style={{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',font:'var(--text-body)',color:'var(--text-primary)'}}/>
  </label>;
}
