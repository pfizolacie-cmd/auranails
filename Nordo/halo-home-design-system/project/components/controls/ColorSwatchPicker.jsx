import React from 'react';

export function ColorSwatchPicker({colors=['var(--bulb-white)','var(--bulb-cyan)','var(--bulb-yellow)','var(--bulb-blush)','var(--bulb-violet)'],value,onChange,size=16,style,...rest}){
  return <div role="radiogroup" {...rest} style={{display:'flex',alignItems:'center',gap:'var(--space-4)',...style}}>
    {colors.map(c=>{const on=c===value;return <button key={c} role="radio" aria-checked={on} aria-label={c} onClick={()=>onChange&&onChange(c)} style={{width:on?size+10:size,height:on?size+10:size,borderRadius:'var(--radius-circle)',background:c,border:on?'2px solid rgba(255,255,255,.85)':'none',cursor:'pointer',padding:0,transition:'all var(--dur-base) var(--ease-out)',boxShadow:on?'0 0 20px 4px rgba(255,213,123,.65)':'var(--shadow-sm)'}}/>;})}
  </div>;
}
