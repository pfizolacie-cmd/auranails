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
import {SERVICES,BARBERS,SLOTS,TAKEN,DAYS,SHOP} from './data.js';
export function BookingScreen(){
  const [step,setStep]=React.useState(0);
  const [svc,setSvc]=React.useState('fade');
  const [barber,setBarber]=React.useState('tomas');
  const [day,setDay]=React.useState(13);
  const [slot,setSlot]=React.useState('13:00');
  const S=SERVICES.find(s=>s.id===svc),B=BARBERS.find(b=>b.id===barber);
  const Steps=()=><div style={{display:'flex',gap:'var(--space-2)',marginTop:'var(--space-4)'}}>{[0,1,2].map(i=><span key={i} style={{height:3,flex:1,borderRadius:2,background:i<=step?'var(--ember-500)':'var(--line-glass-soft)',transition:'background var(--dur-base) var(--ease-standard)'}}/>)}</div>;
  return <>
    <div style={{padding:'22px var(--gutter-screen) 0'}}>
      <ScreenHeader onBack={step?()=>setStep(step-1):undefined} left={!step?<span style={{width:38}}/>:undefined} right={<IconButton icon="user" label="Profil" size={38}/>}/>
      <div style={{marginTop:'var(--space-5)'}}>
        <div style={{font:'var(--text-display)',letterSpacing:'var(--tracking-display)'}}>{['Vyberte službu','Termín','Potvrdenie'][step]}</div>
        <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',font:'var(--text-caption)',color:'var(--text-tertiary)',marginTop:2}}>
          <Icon name="map-pin" size={12}/>{SHOP.name} · {SHOP.city}<Icon name="star" size={12} style={{marginLeft:6,color:'var(--glow-500)'}}/>{SHOP.rating}</div>
      </div>
      <Steps/>
    </div>
    <div className="hh-scroll" style={{flex:1,overflowY:'auto',padding:'0 var(--gutter-screen)',paddingTop:'var(--space-5)',display:'flex',flexDirection:'column',gap:'var(--gap-card)'}}>
      {step===0&&SERVICES.map(s=>{const on=s.id===svc;return <GlassCard key={s.id} tone={on?'light':'dim'} padding="var(--space-4)" glow={on} onClick={()=>setSvc(s.id)} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:'var(--space-4)',border:on?'1px solid var(--ember-400)':undefined}}>
        <span style={{width:38,height:38,flex:'0 0 auto',borderRadius:'var(--radius-circle)',background:on?'var(--grad-ember)':'var(--surface-glass-strong)',display:'inline-flex',alignItems:'center',justifyContent:'center',color:on?'var(--accent-on)':'var(--text-secondary)'}}><Icon name={s.icon} size={17}/></span>
        <div style={{flex:1,minWidth:0}}><div style={{font:'var(--text-label)'}}>{s.name}</div><div style={{font:'var(--text-caption)',color:'var(--text-tertiary)'}}>{s.mins} min</div></div>
        <div style={{font:'var(--weight-semibold) 17px/1 var(--font-core)'}}>{s.price} €</div></GlassCard>;})}

      {step===1&&<>
        <SectionLabel style={{margin:0}}>Holič</SectionLabel>
        <div style={{display:'flex',gap:'var(--space-3)'}}>{BARBERS.map(b=><Chip key={b.id} selected={b.id===barber} onClick={()=>setBarber(b.id)}>{b.name}</Chip>)}</div>
        <SectionLabel style={{margin:'var(--space-3) 0 0'}}>Deň</SectionLabel>
        <div className="hh-scroll" style={{display:'flex',gap:'var(--space-3)',overflowX:'auto'}}>{DAYS.map(d=>{const on=d.n===day;return <button key={d.n} onClick={()=>setDay(d.n)} style={{flex:'0 0 auto',width:52,padding:'10px 0',borderRadius:'var(--radius-sm)',cursor:'pointer',border:'1px solid '+(on?'transparent':'var(--line-glass-soft)'),background:on?'var(--surface-solid)':'var(--surface-glass)',color:on?'var(--text-inverse)':'var(--text-secondary)',font:'var(--text-caption)'}}>{d.d}<div style={{font:'var(--weight-semibold) 17px/1.3 var(--font-core)'}}>{d.n}</div></button>;})}</div>
        <SectionLabel style={{margin:'var(--space-3) 0 0'}} action="skutočná dostupnosť">Čas</SectionLabel>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'var(--space-3)'}}>{SLOTS.map(t=>{const busy=TAKEN.includes(t),on=t===slot;
          return <button key={t} disabled={busy} onClick={()=>setSlot(t)} style={{padding:'10px 0',borderRadius:'var(--radius-sm)',cursor:busy?'not-allowed':'pointer',font:'var(--text-label)',border:'1px solid '+(on?'transparent':'var(--line-glass-soft)'),background:on?'var(--grad-ember)':'var(--surface-glass)',color:on?'var(--accent-on)':'var(--text-secondary)',opacity:busy?.3:1,textDecoration:busy?'line-through':'none'}}>{t}</button>;})}</div>
      </>}

      {step===2&&<>
        <GlassCard tone="solid" style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',color:'var(--ember-600)'}}><Icon name="circle-check-big" size={20}/><span style={{font:'var(--text-label)'}}>Termín je rezervovaný</span></div>
          {[['Služba',S.name],['Holič',B.name+' · '+B.chair],['Kedy','štvrtok '+day+'. 8. o '+slot],['Trvanie',S.mins+' min']].map(([k,v])=>
            <div key={k} style={{display:'flex',justifyContent:'space-between',gap:'var(--space-4)',font:'var(--text-body)',color:'var(--text-inverse-soft)'}}><span>{k}</span><span style={{color:'var(--text-inverse)',textAlign:'right'}}>{v}</span></div>)}
          <div style={{height:1,background:'var(--line-solid)'}}/>
          <div style={{display:'flex',justifyContent:'space-between',font:'var(--weight-semibold) 20px/1 var(--font-core)',color:'var(--text-inverse)'}}><span>Spolu</span><span>{S.price} €</span></div>
        </GlassCard>
        <GlassCard tone="dim" padding="var(--space-4)" style={{display:'flex',alignItems:'center',gap:'var(--space-4)'}}>
          <Icon name="bell-ring" size={17} style={{color:'var(--glow-400)'}}/>
          <div style={{flex:1,font:'var(--text-caption)',color:'var(--text-secondary)'}}>Pripomienka 2 hodiny vopred</div><Switch checked size="sm" label="Pripomienka"/></GlassCard>
        <GlassCard tone="dim" padding="var(--space-4)" style={{display:'flex',alignItems:'center',gap:'var(--space-4)'}}>
          <Icon name="calendar-check" size={17} style={{color:'var(--glow-400)'}}/>
          <div style={{flex:1,font:'var(--text-caption)',color:'var(--text-secondary)'}}>Pridať do kalendára</div><Icon name="chevron-right" size={16}/></GlassCard>
      </>}
      <div style={{height:96}}/>
    </div>
    <div style={{padding:'0 var(--gutter-screen)',paddingBottom:'var(--gutter-screen)'}}>
      {step<2?<Button variant="primary" size="lg" full onClick={()=>setStep(step+1)}>{step===0?S.name+' · '+S.price+' €':'Potvrdiť '+slot}</Button>
      :<Button variant="glass" size="lg" full onClick={()=>setStep(0)}>Hotovo</Button>}
    </div>
  </>;
}
