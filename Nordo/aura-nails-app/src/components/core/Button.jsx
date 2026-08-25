import React from 'react';
import {Icon} from './Icon.jsx';
export function Button({children,variant='primary',size='md',icon,full=false,disabled=false,style,...rest}){
  const sizes={sm:{font:'var(--text-label)',padding:'8px 14px'},md:{font:'var(--text-body)',padding:'12px 20px'},lg:{font:'var(--text-heading)',padding:'16px 26px'}};
  const variants={
    primary:{background:'var(--grad-ember)',color:'var(--accent-on)',border:'1px solid rgba(255,246,236,.22)',boxShadow:'var(--shadow-sm),var(--inner-top)'},
    glass:{background:'var(--surface-glass)',color:'var(--text-primary)',border:'1px solid var(--line-glass)',backdropFilter:'var(--glass)',WebkitBackdropFilter:'var(--glass)',boxShadow:'var(--inner-top)'},
    solid:{background:'var(--surface-solid)',color:'var(--text-inverse)',border:'1px solid var(--line-solid)',boxShadow:'var(--shadow-sm)'},
    ghost:{background:'transparent',color:'var(--text-secondary)',border:'1px solid transparent'}
  };
  const s=sizes[size]||sizes.md,v=variants[variant]||variants.primary;
  return <button type="button" disabled={disabled} {...rest} className="hh-press" style={{display:full?'flex':'inline-flex',width:full?'100%':undefined,alignItems:'center',justifyContent:'center',gap:'var(--space-3)',borderRadius:'var(--radius-pill)',font:s.font,padding:s.padding,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,transition:'transform var(--dur-fast) var(--ease-standard),filter var(--dur-fast) var(--ease-standard)',...v,...style}}>
    {icon?<Icon name={icon} size={size==='sm'?15:18}/>:null}{children}
  </button>;
}
