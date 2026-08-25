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
import {Button} from '../../components/core/Button.jsx';
import {Switch} from '../../components/controls/Switch.jsx';
export function SettingsScreen({nav}){
  const [rows,setRows]=React.useState({away:false,voice:true,adapt:true});
  const set=k=>v=>setRows(r=>({...r,[k]:v}));
  const Row=({icon,label,meta,k})=><GlassCard tone="light" padding="var(--space-4)" style={{display:'flex',alignItems:'center',gap:'var(--space-4)'}}>
    <span style={{width:34,height:34,flex:'0 0 auto',borderRadius:'var(--radius-circle)',background:'var(--surface-glass-strong)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><Icon name={icon} size={16}/></span>
    <div style={{flex:1,minWidth:0}}><div style={{font:'var(--text-label)'}}>{label}</div><div style={{font:'var(--text-caption)',color:'var(--text-tertiary)'}}>{meta}</div></div>
    <Switch checked={rows[k]} onChange={set(k)} size="sm" label={label}/>
  </GlassCard>;
  return <>
    <div style={{padding:'22px var(--gutter-screen) 0'}}>
      <ScreenHeader onBack={()=>nav('home')} right={<Avatar name="Robbie Hale"/>}/>
      <div style={{font:'var(--text-display)',letterSpacing:'var(--tracking-display)',marginTop:'var(--space-6)'}}>Settings</div>
    </div>
    <div className="hh-scroll" style={{flex:1,overflowY:'auto',padding:'var(--space-6) var(--gutter-screen) 0',display:'flex',flexDirection:'column',gap:'var(--gap-card)'}}>
      <SectionLabel style={{margin:0}}>Household</SectionLabel>
      <Row icon="house" label="Away mode" meta="Pause all schedules" k="away"/>
      <Row icon="speaker" label="Voice control" meta="Hub · Living Room" k="voice"/>
      <Row icon="lightbulb" label="Adaptive lighting" meta="Follows sunset" k="adapt"/>
      <SectionLabel style={{margin:'var(--space-3) 0 0'}}>Hub</SectionLabel>
      <StatTile icon="wifi" label="Halo Hub" value="RTAA56-728890" meta="Firmware 4.2.1 · up to date"/>
      <Button variant="glass" full>Add a device</Button>
      <div style={{height:88}}/>
    </div>
    <div style={{padding:'0 var(--gutter-screen) var(--gutter-screen)'}}><TabBar items={TABS} value="settings" onChange={v=>nav(v)}/></div>
  </>;
}
