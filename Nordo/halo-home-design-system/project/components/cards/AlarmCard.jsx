import React from 'react';
import {GlassCard} from '../core/GlassCard.jsx';
import {Switch} from '../controls/Switch.jsx';
export function AlarmCard({title='Alarm',time='07:00',meta='Work',on=true,onToggle,style,...rest}){
  return <GlassCard tone="solid" {...rest} style={{display:'flex',flexDirection:'column',gap:'var(--space-3)',...style}}>
    <div style={{font:'var(--text-label)',color:'var(--text-inverse)'}}>{title}</div>
    <div>
      <div style={{font:'var(--weight-semibold) 24px/1.1 var(--font-core)',letterSpacing:'var(--tracking-metric)',color:'var(--text-inverse)'}}>{time}</div>
      <div style={{font:'var(--text-caption)',color:'var(--text-inverse-soft)'}}>{meta}</div>
    </div>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'auto'}}>
      <span style={{font:'var(--text-caption)',color:'var(--text-inverse-soft)'}}>{on?'On':'Off'}</span>
      <Switch checked={on} onChange={onToggle} label={title} size="sm"/>
    </div>
  </GlassCard>;
}
