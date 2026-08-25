import React from 'react';

export function GlassCard({tone='light',padding='var(--pad-card)',radius='var(--radius-md)',glow=false,style,children,...rest}){
  const tones={
    light:{background:'var(--grad-glass)',border:'1px solid var(--line-glass)'},
    dim:{background:'var(--grad-glass-dim)',border:'1px solid var(--line-glass-soft)'},
    solid:{background:'var(--surface-solid)',border:'1px solid var(--line-solid)',color:'var(--text-inverse)'}
  };
  const t=tones[tone]||tones.light;
  return <div {...rest} style={{position:'relative',borderRadius:radius,padding,backdropFilter:tone==='solid'?undefined:'var(--glass)',WebkitBackdropFilter:tone==='solid'?undefined:'var(--glass)',boxShadow:tone==='solid'?'var(--shadow-md)':'var(--shadow-sm),var(--inner-glass)'+(glow?',var(--glow-soft)':''),...t,...style}}>{children}</div>;
}
