import React from 'react';
import {GlassCard} from '../../components/core/GlassCard.jsx';
import {IconButton} from '../../components/core/IconButton.jsx';
import {Icon} from '../../components/core/Icon.jsx';
import {Chip} from '../../components/core/Chip.jsx';
import {SegmentedControl} from '../../components/core/SegmentedControl.jsx';
import {Avatar} from '../../components/core/Avatar.jsx';
import {SectionLabel} from '../../components/core/SectionLabel.jsx';
import {ArcSlider} from '../../components/controls/ArcSlider.jsx';
import {TemperatureDial} from '../../components/controls/TemperatureDial.jsx';
import {StepperButton} from '../../components/controls/StepperButton.jsx';
import {ColorSwatchPicker} from '../../components/controls/ColorSwatchPicker.jsx';
import {TimeRangeField} from '../../components/controls/TimeRangeField.jsx';
import {DeviceTile} from '../../components/cards/DeviceTile.jsx';
import {AlarmCard} from '../../components/cards/AlarmCard.jsx';
import {MediaCard} from '../../components/cards/MediaCard.jsx';
import {StatTile} from '../../components/cards/StatTile.jsx';
import {ClimateTile} from '../../components/cards/ClimateTile.jsx';
import {ScreenHeader} from '../../components/navigation/ScreenHeader.jsx';
import {TabBar} from '../../components/navigation/TabBar.jsx';
import {TABS} from './LightScreen.jsx';
const A='../../assets/';
export function HomeScreen({nav}){
  const [room,setRoom]=React.useState('Living Room');
  const [playing,setPlaying]=React.useState(true);
  const [lightOn,setLightOn]=React.useState(true);
  const [alarmOn,setAlarmOn]=React.useState(true);
  return <>
    <div style={{padding:'22px var(--gutter-screen) 0',display:'flex',flexDirection:'column',gap:'var(--space-5)'}}>
      <ScreenHeader left={<IconButton icon="menu" label="Menu" size={38}/>} right={<><IconButton icon="bell" label="Alerts" size={38}/><Avatar name="Robbie Hale"/></>}/>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div><div style={{font:'var(--text-display)',letterSpacing:'var(--tracking-display)'}}>Hi Robbie</div>
        <div style={{font:'var(--text-caption)',color:'var(--text-tertiary)'}}>Welcome Home</div></div>
        <IconButton icon="search" label="Search" size={34} tone="glass" style={{background:'transparent',border:'none',boxShadow:'none'}}/>
      </div>
      <div className="hh-scroll" style={{display:'flex',gap:'var(--space-3)',overflowX:'auto',paddingBottom:2}}>
        <Chip icon="plus" aria-label="Add room"/>
        {['Living Room','Kitchen','Bedroom'].map(r=><Chip key={r} selected={r===room} onClick={()=>setRoom(r)}>{r}</Chip>)}
      </div>
    </div>
    <div className="hh-scroll" style={{flex:1,overflowY:'auto',padding:'var(--space-5) var(--gutter-screen) 0',display:'flex',flexDirection:'column',gap:'var(--gap-card)'}}>
      <MediaCard title="People Are People" artist="Depeche Mode" art={A+'scene-room-evening.jpg'} count={124} playing={playing} onToggle={()=>setPlaying(!playing)}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridAutoRows:'minmax(158px,auto)',gap:'var(--gap-card)'}}>
        <DeviceTile name="Smart Light" status={'Brightness 64%'} image={A+'device-smart-light.jpg'} on={lightOn} onToggle={()=>setLightOn(!lightOn)} height={158} style={{cursor:'pointer'}} onClick={()=>nav('light')}/>
        <AlarmCard time="07:00" meta="Work" on={alarmOn} onToggle={setAlarmOn}/>
        <StatTile icon="wifi" label="Wi-Fi" value="RTAA56-728890"/>
        <ClimateTile value={24} label="Home" on style={{cursor:'pointer'}} onClick={()=>nav('temp')}/>
      </div>
      <div style={{height:88}}/>
    </div>
    <div style={{padding:'0 var(--gutter-screen) var(--gutter-screen)'}}><TabBar items={TABS} value="home" onChange={v=>nav(v)}/></div>
  </>;
}
