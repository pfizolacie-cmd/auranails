import React from 'react';

export function TimeRangeField({from='15:00',to='22:00',separator='to',onChange,style,...rest}){
  const box={padding:'10px 18px',borderRadius:'var(--radius-sm)',background:'var(--surface-glass)',border:'1px solid var(--line-glass-soft)',backdropFilter:'var(--glass)',WebkitBackdropFilter:'var(--glass)',font:'var(--text-body)',color:'var(--text-primary)',cursor:'pointer'};
  return <div {...rest} style={{display:'flex',alignItems:'center',gap:'var(--space-4)',...style}}>
    <span style={box} onClick={()=>onChange&&onChange('from')}>{from}</span>
    <span style={{font:'var(--text-caption)',color:'var(--text-tertiary)'}}>{separator}</span>
    <span style={box} onClick={()=>onChange&&onChange('to')}>{to}</span>
  </div>;
}
