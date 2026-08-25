import React from 'react';

export function SectionLabel({children,action,style,...rest}){
  return <div {...rest} style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',font:'var(--text-body)',color:'var(--text-secondary)',margin:'0 0 var(--space-4)',...style}}>
    <span>{children}</span>{action?<span style={{font:'var(--text-caption)',color:'var(--text-tertiary)'}}>{action}</span>:null}
  </div>;
}
