import React from 'react';
import {GlassCard} from '../core/GlassCard.jsx';
import {Icon} from '../core/Icon.jsx';
export function StatTile({icon,label,value,meta,tone='light',style,...rest}){
  return <GlassCard tone={tone} {...rest} style={{display:'flex',flexDirection:'column',gap:'var(--space-4)',...style}}>
    <span style={{width:30,height:30,borderRadius:'var(--radius-circle)',background:'var(--surface-glass-strong)',display:'inline-flex',alignItems:'center',justifyContent:'center',color:'var(--text-primary)'}}><Icon name={icon} size={16}/></span>
    <div style={{marginTop:'auto'}}>
      <div style={{font:'var(--text-label)',color:'var(--text-primary)'}}>{label}</div>
      {value?<div style={{font:'var(--text-caption)',color:'var(--text-tertiary)'}}>{value}</div>:null}
      {meta?<div style={{font:'var(--text-micro)',color:'var(--text-tertiary)'}}>{meta}</div>:null}
    </div>
  </GlassCard>;
}
