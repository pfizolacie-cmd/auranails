import React from 'react';
import {GlassCard} from '../core/GlassCard.jsx';
export function ClimateTile({value=24,unit='°c',label='Home',on=true,onToggle,style,...rest}){
  return <GlassCard tone="dim" {...rest} style={{display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:120,...style}}>
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
      <span style={{width:44,height:44,borderRadius:'var(--radius-circle)',border:'2px solid var(--line-glass)',display:'inline-flex',alignItems:'center',justifyContent:'center',font:'var(--text-label)',color:'var(--text-primary)'}}>{value}{unit}</span>
      <button type="button" aria-label={label+' power'} aria-pressed={on} onClick={onToggle} style={{width:20,height:20,borderRadius:'var(--radius-circle)',border:'none',cursor:'pointer',background:on?'var(--ember-500)':'rgba(255,246,236,.28)',boxShadow:on?'var(--glow-ember)':'none'}}/>
    </div>
    <div style={{font:'var(--text-label)',color:'var(--text-primary)'}}>{label}</div>
  </GlassCard>;
}
