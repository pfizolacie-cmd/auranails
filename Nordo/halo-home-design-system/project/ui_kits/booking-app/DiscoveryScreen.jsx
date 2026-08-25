import React from 'react';
import {GlassCard} from '../../components/core/GlassCard.jsx';
import {IconButton} from '../../components/core/IconButton.jsx';
import {Icon} from '../../components/core/Icon.jsx';
import {Chip} from '../../components/core/Chip.jsx';
import {Button} from '../../components/core/Button.jsx';
import {Avatar} from '../../components/core/Avatar.jsx';
import {SectionLabel} from '../../components/core/SectionLabel.jsx';
import {SegmentedControl} from '../../components/core/SegmentedControl.jsx';
import {Switch} from '../../components/controls/Switch.jsx';
import {ScreenHeader} from '../../components/navigation/ScreenHeader.jsx';
import {TabBar} from '../../components/navigation/TabBar.jsx';
import {CHAT} from './data.js';
export function DiscoveryScreen(){
  const [msgs]=React.useState(CHAT);
  return <>
    <div style={{padding:'22px var(--gutter-screen) var(--space-5)'}}>
      <ScreenHeader onBack={()=>{}} right={<IconButton icon="x" label="Zavrieť" size={38}/>}/>
      <div style={{display:'flex',alignItems:'center',gap:'var(--space-4)',marginTop:'var(--space-5)'}}>
        <span style={{width:44,height:44,borderRadius:'var(--radius-circle)',background:'var(--grad-ember)',display:'inline-flex',alignItems:'center',justifyContent:'center',color:'var(--accent-on)',boxShadow:'var(--glow-ember)'}}><Icon name="bot" size={21}/></span>
        <div><div style={{font:'var(--text-title)'}}>Úvodný rozhovor</div>
        <div style={{display:'flex',alignItems:'center',gap:5,font:'var(--text-caption)',color:'var(--text-tertiary)'}}><span style={{width:6,height:6,borderRadius:'50%',background:'var(--glow-500)',boxShadow:'var(--glow-soft)'}}/>5 minút, žiadny formulár</div></div></div>
    </div>
    <div className="hh-scroll" style={{flex:1,overflowY:'auto',padding:'0 var(--gutter-screen)',display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
      {msgs.map((m,i)=>{const me=m.from==='me';
        return <div key={i} style={{display:'flex',justifyContent:me?'flex-end':'flex-start'}}>
          <div style={{maxWidth:'82%',padding:'11px 15px',font:'var(--text-body)',lineHeight:1.5,
            borderRadius:me?'var(--radius-md) var(--radius-md) 4px var(--radius-md)':'var(--radius-md) var(--radius-md) var(--radius-md) 4px',
            background:me?'var(--grad-ember)':'var(--grad-glass)',
            color:me?'var(--accent-on)':'var(--text-primary)',
            border:me?'none':'1px solid var(--line-glass)',
            backdropFilter:me?undefined:'var(--glass)',WebkitBackdropFilter:me?undefined:'var(--glass)',
            boxShadow:me?'var(--shadow-sm)':'var(--inner-top)'}}>{m.text}</div></div>;})}
      <div style={{display:'flex',gap:'var(--space-3)',flexWrap:'wrap',marginTop:'var(--space-1)'}}>
        {['Fade, klasika, brada','Pošlem cenník','Nie sme si istí'].map(s=><Chip key={s}>{s}</Chip>)}</div>
      <div style={{height:24}}/>
    </div>
    <div style={{padding:'0 var(--gutter-screen)',paddingBottom:'var(--gutter-screen)',paddingTop:'var(--space-4)',display:'flex',gap:'var(--space-3)',alignItems:'center'}}>
      <div style={{flex:1,display:'flex',alignItems:'center',gap:'var(--space-3)',padding:'12px 16px',borderRadius:'var(--radius-pill)',background:'var(--surface-glass)',border:'1px solid var(--line-glass-soft)',backdropFilter:'var(--glass)',WebkitBackdropFilter:'var(--glass)',font:'var(--text-body)',color:'var(--text-tertiary)'}}>Napíšte odpoveď…</div>
      <IconButton icon="send" tone="ember" label="Odoslať" size={46}/>
    </div>
  </>;
}
