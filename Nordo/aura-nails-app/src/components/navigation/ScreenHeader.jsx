import React from 'react';
import {IconButton} from '../core/IconButton.jsx';
export function ScreenHeader({onBack,left,center,right,title,subtitle,style,...rest}){
  return <div {...rest} style={{display:'flex',flexDirection:'column',gap:'var(--space-7)',...style}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'var(--space-4)'}}>
      <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)'}}>{onBack?<IconButton icon="arrow-left" label="Back" size={38} onClick={onBack}/>:left}</div>
      <div style={{flex:1,display:'flex',justifyContent:'center'}}>{center}</div>
      <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)'}}>{right}</div>
    </div>
    {title?<div>
      <div style={{font:'var(--text-display)',letterSpacing:'var(--tracking-display)',color:'var(--text-primary)'}}>{title}</div>
      {subtitle?<div style={{font:'var(--text-caption)',color:'var(--text-tertiary)',marginTop:'var(--space-1)'}}>{subtitle}</div>:null}
    </div>:null}
  </div>;
}
