import React from 'react';

/* 260° gauge: cool at the left tail, ember at the right. Centre puck is porcelain. */
export function TemperatureDial({value=24,min=10,max=30,now,size=210,label='Goal',unit='°c',style,...rest}){
  const SPAN=260,START=140,r=size/2-14,cx=size/2,cy=size/2;
  const p=Math.max(0,Math.min(1,(value-min)/(max-min)));
  const pt=(t,rad=r)=>{const a=(START+SPAN*t)*Math.PI/180;return[cx+rad*Math.cos(a),cy+rad*Math.sin(a)];};
  const seg=(f,t)=>{const[x1,y1]=pt(f),[x2,y2]=pt(t);return `M ${x1} ${y1} A ${r} ${r} 0 ${SPAN*(t-f)>180?1:0} 1 ${x2} ${y2}`;};
  const nowP=now==null?null:Math.max(0,Math.min(1,(now-min)/(max-min)));
  const [kx,ky]=pt(p);
  return <div {...rest} style={{position:'relative',width:size,height:size,...style}}>
    <svg width={size} height={size} style={{overflow:'visible'}}>
      <defs><linearGradient id="hh-dial" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="var(--dusk-200)"/><stop offset=".5" stopColor="var(--glow-300)"/><stop offset="1" stopColor="var(--ember-500)"/></linearGradient></defs>
      <path d={seg(0,1)} fill="none" stroke="rgba(255,246,236,.20)" strokeWidth="3" strokeLinecap="round"/>
      <path d={seg(0,Math.max(.001,p))} fill="none" stroke="url(#hh-dial)" strokeWidth="3" strokeLinecap="round"/>
      {nowP!=null?<circle cx={pt(nowP)[0]} cy={pt(nowP)[1]} r="5" fill="var(--dusk-200)" stroke="var(--espresso-800)" strokeWidth="2"/>:null}
      <circle cx={kx} cy={ky} r="5" fill="var(--ember-500)"/>
      <circle cx={cx} cy={cy} r={r-26} fill="var(--sand-050)" style={{filter:'drop-shadow(0 10px 26px rgba(11,7,5,.45))'}}/>
    </svg>
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'var(--text-inverse)'}}>
      <span style={{font:'var(--text-caption)',color:'var(--text-inverse-soft)'}}>{label}</span>
      <span style={{font:'var(--text-metric)',letterSpacing:'var(--tracking-metric)'}}>{value}<span style={{font:'var(--weight-medium) 20px/1 var(--font-core)'}}>{unit}</span></span>
    </div>
  </div>;
}
