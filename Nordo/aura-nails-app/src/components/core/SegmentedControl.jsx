import React from 'react';

export function SegmentedControl({options,value,onChange,style,...rest}){
  return <div role="tablist" {...rest} style={{display:'inline-flex',gap:'var(--space-1)',padding:'4px',borderRadius:'var(--radius-pill)',background:'var(--surface-glass-dim)',border:'1px solid var(--line-glass-soft)',backdropFilter:'var(--glass)',WebkitBackdropFilter:'var(--glass)',...style}}>
    {options.map(o=>{const v=typeof o==='string'?o:o.value,l=typeof o==='string'?o:o.label,on=v===value;
      return <button key={v} role="tab" aria-selected={on} onClick={()=>onChange&&onChange(v)} style={{border:'none',cursor:'pointer',borderRadius:'var(--radius-pill)',padding:'7px 16px',font:'var(--text-label)',transition:'background var(--dur-base) var(--ease-standard),color var(--dur-base) var(--ease-standard)',background:on?'var(--surface-solid)':'transparent',color:on?'var(--text-inverse)':'var(--text-secondary)',boxShadow:on?'var(--shadow-sm)':'none'}}>{l}</button>;})}
  </div>;
}
