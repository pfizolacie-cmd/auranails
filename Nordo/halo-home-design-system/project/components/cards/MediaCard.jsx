import React from 'react';
import {GlassCard} from '../core/GlassCard.jsx';
import {Icon} from '../core/Icon.jsx';
export function MediaCard({title,artist,art,playing=true,liked=false,count,onToggle,style,...rest}){
  const ctrl={background:'none',border:'none',padding:0,cursor:'pointer',color:'var(--text-secondary)',display:'inline-flex'};
  return <GlassCard tone="light" padding="var(--space-3)" {...rest} style={{display:'flex',gap:'var(--space-4)',alignItems:'stretch',...style}}>
    <div style={{width:78,flex:'0 0 auto',borderRadius:'var(--radius-sm)',overflow:'hidden',background:'var(--umber-500)'}}>{art?<img src={art} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:null}</div>
    <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'var(--space-3)'}}>
        <div style={{minWidth:0}}>
          <div style={{font:'var(--text-label)',color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</div>
          <div style={{font:'var(--text-caption)',color:'var(--text-tertiary)'}}>{artist}</div>
        </div>
        <span style={{width:26,height:26,flex:'0 0 auto',borderRadius:'var(--radius-circle)',background:'var(--surface-glass-strong)',display:'inline-flex',alignItems:'center',justifyContent:'center',color:'var(--text-secondary)'}}><Icon name="speaker" size={13}/></span>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'var(--space-4)',color:'var(--text-secondary)'}}>
        <button style={ctrl} aria-label="Repeat"><Icon name="rotate-ccw" size={14}/></button>
        <button style={ctrl} aria-label="Previous"><Icon name="rewind" size={14}/></button>
        <button style={ctrl} aria-label={playing?'Pause':'Play'} onClick={onToggle}><Icon name={playing?'pause':'play'} size={16}/></button>
        <button style={ctrl} aria-label="Next"><Icon name="fast-forward" size={14}/></button>
        <button style={{...ctrl,color:liked?'var(--ember-500)':'var(--text-secondary)'}} aria-label="Like"><Icon name="heart" size={14}/></button>
        {count!=null?<span style={{font:'var(--text-micro)',color:'var(--text-tertiary)'}}>{count}</span>:null}
      </div>
    </div>
  </GlassCard>;
}
