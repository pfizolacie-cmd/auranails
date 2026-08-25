export const SHOP={name:'Barber Room',city:'Prievidza',rating:4.9,reviews:212};
export const SERVICES=[
 {id:'fade',name:'Fade strih',price:18,mins:45,icon:'scissors'},
 {id:'klasik',name:'Klasický strih',price:15,mins:30,icon:'scissors'},
 {id:'brada',name:'Úprava brady',price:12,mins:30,icon:'user'},
 {id:'komplet',name:'Strih + brada',price:26,mins:60,icon:'sparkles'},
 {id:'holenie',name:'Mokré holenie',price:20,mins:45,icon:'sparkles'}];
export const BARBERS=[
 {id:'tomas',name:'Tomáš',chair:'Kreslo 1'},
 {id:'marek',name:'Marek',chair:'Kreslo 2'},
 {id:'dano',name:'Dano',chair:'Kreslo 3'}];
export const SLOTS=['09:00','09:45','10:30','11:15','13:00','13:45','14:30','15:15','16:00','16:45'];
export const TAKEN=['10:30','13:45','16:00'];
export const DAYS=[{d:'Ut',n:12},{d:'St',n:13},{d:'Št',n:14},{d:'Pi',n:15},{d:'So',n:16},{d:'Ne',n:17}];
export const AGENDA=[
 {t:'09:00',len:45,client:'Peter Krajčí',svc:'Fade strih',price:18,state:'done'},
 {t:'09:45',len:30,client:'Martin Baláž',svc:'Úprava brady',price:12,state:'done'},
 {t:'10:30',len:60,client:'Jozef Uhrík',svc:'Strih + brada',price:26,state:'now'},
 {t:'13:00',len:45,client:'Adam Šimko',svc:'Fade strih',price:18,state:'next'},
 {t:'14:30',len:30,client:'Lukáš Repka',svc:'Klasický strih',price:15,state:'next'},
 {t:'16:45',len:45,client:'Voľné',svc:'—',price:0,state:'free'}];
export const CHAIRS=[
 {name:'Tomáš',chair:'Kreslo 1',today:6,week:1240,util:88,active:true},
 {name:'Marek',chair:'Kreslo 2',today:4,week:910,util:64,active:true},
 {name:'Dano',chair:'Kreslo 3',today:0,week:0,util:0,active:false}];
export const CHAT=[
 {from:'bot',text:'Dobrý deň! Som asistent, ktorý pripraví podklady pre váš web a rezervačnú appku. Začneme jednoducho — ako sa prevádzka volá a kde ste?'},
 {from:'me',text:'Barber Room, Prievidza. Robíme tretí rok.'},
 {from:'bot',text:'Pekné, tri roky už niečo znamenajú. Ste sám, alebo máte viac kresiel?'},
 {from:'me',text:'Tri kreslá, dvaja chalani mi platia nájom.'},
 {from:'bot',text:'To je dôležité — každý bude mať vlastný kalendár a klientelu, aby sa vám termíny neprekrývali. Poďme na služby: čo najčastejšie robíte a za koľko?'}];
