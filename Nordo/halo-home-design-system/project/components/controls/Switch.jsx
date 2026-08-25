import React from 'react';

export function Switch({checked=false,onChange,size='md',label,style,...rest}){
  const dims=size==='sm'?{w:38,h:22,k:16}:{w:52,h:30,k:24};
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={()=>onChange&&onChange(!checked)} {...rest} style={{width:dims.w,height:dims.h,padding:3,border:'none',borderRadius:'var(--radius-pill)',cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:checked?'flex-end':'flex-start',background:checked?'var(--control-track-on)':'var(--control-track-off)',boxShadow:checked?'var(--glow-ember)':'inset 0 1px 2px rgba(11,7,5,.25)',transition:'background var(--dur-base) var(--ease-standard),box-shadow var(--dur-base) var(--ease-standard)',...style}}>
    <span style={{width:dims.k,height:dims.k,borderRadius:'var(--radius-circle)',background:'var(--control-knob)',boxShadow:'var(--shadow-sm)',transition:'transform var(--dur-base) var(--ease-out)'}}/>
  </button>;
}
