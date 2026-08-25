import React from 'react';
import {Icon} from '../core/Icon.jsx';
export function StepperButton({direction='up',onClick,size=52,label,style,...rest}){
  return <button type="button" aria-label={label||(direction==='up'?'Increase':'Decrease')} onClick={onClick} {...rest} className="hh-press" style={{width:size,height:size,borderRadius:'var(--radius-circle)',display:'inline-flex',alignItems:'center',justifyContent:'center',cursor:'pointer',background:'var(--grad-glass)',border:'1px solid var(--line-glass)',color:'var(--text-primary)',backdropFilter:'var(--glass)',WebkitBackdropFilter:'var(--glass)',boxShadow:'var(--shadow-sm),var(--inner-top)',transition:'transform var(--dur-fast) var(--ease-standard)',...style}}>
    <Icon name={direction==='up'?'plus':'minus'} size={22}/>
  </button>;
}
