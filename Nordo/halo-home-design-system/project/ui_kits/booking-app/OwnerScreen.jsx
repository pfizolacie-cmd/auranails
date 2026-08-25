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
import {AGENDA} from './data.js';
const TABS=[{value:'day',icon:'calendar',label:'Deň'},{value:'clients',icon:'users',label:'Klienti'},{value:'money',icon:'banknote',label:'Tržby'},{value:'set',icon:'settings',label:'Nastavenia'}];
export function OwnerScreen(){
  const [view,setView]=React.useState('Dnes');
  const STATE={done:{c:'var(--text-tertiary)',l:'Hotovo'},now:{c:'var(--glow-500)',l:'Práve teraz'},next:{c:'var(--ember-400)',l:'Čaká'},free:{c:'var(--text-tertiary)',l:'Voľné'}};
  return <>
    <div style={{padding:'22px var(--gutter-screen) 0'}}>
      <ScreenHeader left={<IconButton icon="menu" label="Menu" size={38}/>} right={<><IconButton icon="bell" label="Upozornenia" size={38}/><Avatar name="Tomáš Hric"/></>}/>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginTop:'var(--space-5)'}}>
        <div><div style={{font:'var(--text-display)',letterSpacing:'var(--tracking-display)'}}>Štvrtok</div>
        <div style={{font:'var(--text-caption)',color:'var(--text-tertiary)'}}>14. augusta · Kreslo 1</div></div>
        <SegmentedControl options={['Dnes','Týždeň']} value={view} onChange={setView}/></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'var(--gap-card)',marginTop:'var(--space-5)'}}>
        {[['5','termínov','calendar'],['89 €','dnes','banknote'],['92 %','obsadenosť','trending-up']].map(([v,l,ic])=>
          <GlassCard key={l} tone="light" padding="var(--space-4)">
            <Icon name={ic} size={15} style={{color:'var(--ember-300)'}}/>
            <div style={{font:'var(--weight-semibold) 21px/1.2 var(--font-core)',marginTop:6}}>{v}</div>
            <div style={{font:'var(--text-micro)',color:'var(--text-tertiary)'}}>{l}</div></GlassCard>)}
      </div>
    </div>
    <div className="hh-scroll" style={{flex:1,overflowY:'auto',padding:'0 var(--gutter-screen)',paddingTop:'var(--space-6)',display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
      <SectionLabel style={{margin:0}} action="synchronizované">Rozvrh dňa</SectionLabel>
      {AGENDA.map(a=>{const st=STATE[a.state],free=a.state==='free';
        return <div key={a.t} style={{display:'flex',gap:'var(--space-4)'}}>
          <div style={{width:44,flex:'0 0 auto',paddingTop:14,font:'var(--text-caption)',color:'var(--text-tertiary)'}}>{a.t}</div>
          <GlassCard tone={a.state==='now'?'light':'dim'} padding="var(--space-4)" glow={a.state==='now'} style={{flex:1,display:'flex',alignItems:'center',gap:'var(--space-4)',opacity:free?.55:1,borderLeft:'2px solid '+st.c}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{font:'var(--text-label)',color:free?'var(--text-tertiary)':'var(--text-primary)'}}>{a.client}</div>
              <div style={{font:'var(--text-caption)',color:'var(--text-tertiary)'}}>{a.svc} · {a.len} min</div></div>
            <div style={{textAlign:'right'}}>
              {a.price?<div style={{font:'var(--weight-medium) 15px/1 var(--font-core)'}}>{a.price} €</div>:null}
              <div style={{font:'var(--text-micro)',color:st.c,marginTop:3}}>{st.l}</div></div>
          </GlassCard></div>;})}
      <div style={{height:96}}/>
    </div>
    <div style={{padding:'0 var(--gutter-screen)',paddingBottom:'var(--gutter-screen)'}}><TabBar items={TABS} value="day"/></div>
  </>;
}
