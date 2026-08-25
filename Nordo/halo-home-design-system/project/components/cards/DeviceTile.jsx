import React from 'react';
import {GlassCard} from '../core/GlassCard.jsx';
export function DeviceTile({name,status,image,on=false,onToggle,height=120,style,...rest}){
  return <GlassCard tone="dim" padding="0" radius="var(--radius-md)" {...rest} style={{position:'relative',overflow:'hidden',minHeight:height,display:'flex',flexDirection:'column',justifyContent:'flex-end',...style}}>
    {image?<img src={image} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:.85}}/>:null}
    <div style={{position:'absolute',inset:0,background:'var(--grad-scrim-bottom)'}}/>
    <div style={{position:'relative',display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:'var(--space-3)',padding:'var(--pad-card-tight)'}}>
      <div style={{minWidth:0}}>
        <div style={{font:'var(--text-label)',color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{name}</div>
        {status?<div style={{font:'var(--text-caption)',color:'var(--text-tertiary)'}}>{status}</div>:null}
      </div>
      <button type="button" aria-label={name+' power'} aria-pressed={on} onClick={onToggle} style={{width:22,height:22,flex:'0 0 auto',borderRadius:'var(--radius-circle)',border:'none',cursor:'pointer',background:on?'var(--ember-500)':'rgba(255,246,236,.28)',boxShadow:on?'var(--glow-ember)':'none',transition:'background var(--dur-base) var(--ease-standard),box-shadow var(--dur-base) var(--ease-standard)'}}/>
    </div>
  </GlassCard>;
}
