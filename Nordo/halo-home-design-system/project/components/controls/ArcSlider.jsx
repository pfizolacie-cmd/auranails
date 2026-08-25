import React from 'react';

/* Half-dome brightness arc: the track opens downward, the knob rides the top. */
export function ArcSlider({value=64,onChange,size=240,unit='%',caption='Brightness',style,...rest}){
  const r=size/2-10,cx=size/2,cy=size/2+6;
  const pt=p=>{const a=Math.PI*(1-p);return[cx+r*Math.cos(a),cy-r*Math.sin(a)];};
  const [sx,sy]=pt(0),[ex,ey]=pt(1),[kx,ky]=pt(Math.max(0,Math.min(1,value/100)));
  const arc=(f,t)=>{const[x1,y1]=pt(f),[x2,y2]=pt(t);return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;};
  const set=e=>{if(!onChange)return;const b=e.currentTarget.getBoundingClientRect();const dx=e.clientX-b.left-cx,dy=cy-(e.clientY-b.top);let a=Math.atan2(dy,dx);if(a<0)a=0;onChange(Math.round((1-a/Math.PI)*100));};
  return <div {...rest} style={{position:'relative',width:size,height:size/2+56,...style}}>
    <svg width={size} height={size/2+16} viewBox={`0 0 ${size} ${size/2+16}`} onPointerDown={set} style={{cursor:'pointer',overflow:'visible'}}>
      <path d={arc(0,1)} fill="none" stroke="rgba(255,246,236,.22)" strokeWidth="3" strokeLinecap="round"/>
      <path d={arc(0,Math.max(.001,value/100))} fill="none" stroke="var(--porcelain)" strokeWidth="3" strokeLinecap="round"/>
      <circle cx={sx} cy={sy} r="3" fill="rgba(255,246,236,.4)"/><circle cx={ex} cy={ey} r="3" fill="rgba(255,246,236,.4)"/>
      <circle cx={kx} cy={ky} r="11" fill="var(--porcelain)" style={{filter:'drop-shadow(0 0 12px rgba(255,213,123,.7))'}}/>
    </svg>
    <div style={{position:'absolute',left:0,right:0,top:size*0.30,textAlign:'center'}}>
      <div style={{font:'var(--text-metric)',letterSpacing:'var(--tracking-metric)',color:'var(--text-primary)'}}>{value}<span style={{font:'var(--weight-medium) 22px/1 var(--font-core)'}}>{unit}</span></div>
      <div style={{font:'var(--text-body)',color:'var(--text-secondary)',marginTop:'var(--space-1)'}}>{caption}</div>
    </div>
  </div>;
}
