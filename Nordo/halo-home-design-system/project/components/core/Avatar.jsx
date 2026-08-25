import React from 'react';

export function Avatar({src,name='',size=38,ring=true,style,...rest}){
  const initials=name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  return <span {...rest} style={{width:size,height:size,borderRadius:'var(--radius-circle)',display:'inline-flex',alignItems:'center',justifyContent:'center',overflow:'hidden',font:'var(--text-label)',color:'var(--text-inverse)',background:src?'transparent':'var(--sand-200)',border:ring?'2px solid var(--line-glass)':'none',boxShadow:'var(--shadow-sm)',flex:'0 0 auto',...style}}>
    {src?<img src={src} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:initials}
  </span>;
}
