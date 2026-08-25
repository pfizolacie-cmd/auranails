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
export function ClimateScreen({nav}){
  const [goal,setGoal]=React.useState(24);
  const [room,setRoom]=React.useState('Living room');
  return <>
    <div style={{padding:'22px var(--gutter-screen) 0'}}>
      <ScreenHeader onBack={()=>nav('home')} center={<SegmentedControl options={['Living room','Bedroom']} value={room} onChange={setRoom}/>} right={<span style={{width:38}}/>}/>
      <div style={{font:'var(--text-display)',letterSpacing:'var(--tracking-display)',textAlign:'center',marginTop:'var(--space-6)'}}>Home Temperature</div>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'var(--space-7)',padding:'0 var(--gutter-screen)'}}>
      <div style={{position:'relative',width:'100%',display:'flex',justifyContent:'center'}}>
        <span style={{position:'absolute',left:8,top:'42%',font:'var(--text-caption)',color:'var(--text-secondary)'}}>10°C −</span>
        <span style={{position:'absolute',right:8,top:'42%',font:'var(--text-caption)',color:'var(--text-secondary)'}}>− 30°C</span>
        <div style={{position:'absolute',left:22,top:'14%',font:'var(--text-caption)',color:'var(--text-secondary)',textAlign:'center'}}>15°C<div style={{font:'var(--text-micro)',color:'var(--text-tertiary)'}}>Now</div></div>
        <div style={{position:'absolute',right:56,top:'2%',font:'var(--text-caption)',color:'var(--text-secondary)'}}>20°C</div>
        <TemperatureDial value={goal} now={15} min={10} max={30} size={216}/>
      </div>
      <div style={{display:'flex',gap:'var(--space-7)'}}>
        <StepperButton direction="down" onClick={()=>setGoal(g=>Math.max(10,g-1))}/>
        <StepperButton direction="up" onClick={()=>setGoal(g=>Math.min(30,g+1))}/>
      </div>
      <div style={{width:'100%'}}>
        <SectionLabel>Secudule from:</SectionLabel>
        <TimeRangeField from="15:00" to="22:00"/>
      </div>
    </div>
    <div style={{padding:'0 var(--gutter-screen) var(--gutter-screen)'}}><TabBar items={TABS} value="temp" onChange={v=>nav(v)}/></div>
  </>;
}
