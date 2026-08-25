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
import {CHAIRS} from './data.js';
const TABS=[{value:'day',icon:'calendar',label:'Deň'},{value:'clients',icon:'users',label:'Klienti'},{value:'money',icon:'banknote',label:'Tržby'},{value:'set',icon:'settings',label:'Nastavenia'}];
export function ChairsScreen(){
  const [rows,setRows]=React.useState(CHAIRS);
  const toggle=i=>setRows(r=>r.map((x,j)=>j===i?{...x,active:!x.active}:x));
  return <>
    <div style={{padding:'22px var(--gutter-screen) 0'}}>
      <ScreenHeader onBack={()=>{}} right={<IconButton icon="plus" tone="ember" label="Pridať kreslo" size={38}/>}/>
      <div style={{marginTop:'var(--space-5)'}}>
        <div style={{font:'var(--text-display)',letterSpacing:'var(--tracking-display)'}}>Kreslá</div>
        <div style={{font:'var(--text-caption)',color:'var(--text-tertiary)',marginTop:2}}>Každý má vlastný kalendár aj klientelu</div></div>
    </div>
    <div className="hh-scroll" style={{flex:1,overflowY:'auto',padding:'0 var(--gutter-screen)',paddingTop:'var(--space-6)',display:'flex',flexDirection:'column',gap:'var(--gap-card)'}}>
      {rows.map((c,i)=><GlassCard key={c.chair} tone={c.active?'light':'dim'} style={{display:'flex',flexDirection:'column',gap:'var(--space-4)',opacity:c.active?1:.6}}>
        <div style={{display:'flex',alignItems:'center',gap:'var(--space-4)'}}>
          <Avatar name={c.name} size={40}/>
          <div style={{flex:1,minWidth:0}}><div style={{font:'var(--text-label)'}}>{c.name}</div>
          <div style={{display:'flex',alignItems:'center',gap:4,font:'var(--text-caption)',color:'var(--text-tertiary)'}}><Icon name="armchair" size={12}/>{c.chair}</div></div>
          <Switch checked={c.active} onChange={()=>toggle(i)} size="sm" label={c.name}/></div>
        <div style={{display:'flex',gap:'var(--space-3)'}}>
          {[[c.today,'dnes'],[c.week+' €','tento týždeň'],[c.util+' %','obsadenosť']].map(([v,l])=>
            <div key={l} style={{flex:1,padding:'10px 12px',borderRadius:'var(--radius-sm)',background:'var(--surface-glass-dim)',border:'1px solid var(--line-glass-soft)'}}>
              <div style={{font:'var(--weight-medium) 15px/1.2 var(--font-core)'}}>{v}</div>
              <div style={{font:'var(--text-micro)',color:'var(--text-tertiary)'}}>{l}</div></div>)}</div>
        <div style={{height:5,borderRadius:3,background:'var(--line-glass-soft)',overflow:'hidden'}}>
          <div style={{width:c.util+'%',height:'100%',borderRadius:3,background:'var(--grad-ember)',transition:'width var(--dur-slow) var(--ease-out)'}}/></div>
      </GlassCard>)}
      <GlassCard tone="dim" padding="var(--space-4)" style={{display:'flex',alignItems:'center',gap:'var(--space-4)'}}>
        <Icon name="users" size={17} style={{color:'var(--ember-300)'}}/>
        <div style={{flex:1,font:'var(--text-caption)',color:'var(--text-secondary)'}}>Kalendáre sa neprekrývajú — každý vidí len svoje termíny</div></GlassCard>
      <div style={{height:96}}/>
    </div>
    <div style={{padding:'0 var(--gutter-screen)',paddingBottom:'var(--gutter-screen)'}}><TabBar items={TABS} value="set"/></div>
  </>;
}
