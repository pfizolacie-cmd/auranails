import React from 'react';

export function PhoneFrame({backdrop,children,width=340,height=690,style,...rest}){
  return <div {...rest} style={{position:'relative',width,height,borderRadius:'var(--radius-xl)',overflow:'hidden',border:'1px solid var(--line-glass-soft)',boxShadow:'var(--shadow-lg)',isolation:'isolate',...style}}>
    <img src={backdrop} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <div style={{position:'absolute',inset:0,background:'rgba(20,12,7,.34)'}}/>
    <div style={{position:'relative',height:'100%',display:'flex',flexDirection:'column'}}>{children}</div>
  </div>;
}
