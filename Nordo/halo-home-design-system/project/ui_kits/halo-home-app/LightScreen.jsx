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

const A='../../assets/';
export function LightScreen({nav}){
  const [brightness,setBrightness]=React.useState(64);
  const [device,setDevice]=React.useState('Device 1');
  const [hue,setHue]=React.useState('var(--bulb-yellow)');
  return <>
    <div style={{padding:'22px var(--gutter-screen) 0'}}>
      <ScreenHeader onBack={()=>nav('home')} center={<SegmentedControl options={['Device 1','Device 2']} value={device} onChange={setDevice}/>} right={<span style={{width:38}}/>}/>
      <div style={{font:'var(--text-display)',letterSpacing:'var(--tracking-display)',textAlign:'center',marginTop:'var(--space-6)'}}>Smart Light</div>
    </div>
    <div style={{flex:1,position:'relative',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',paddingBottom:'var(--space-6)'}}>
      <img src={A+'device-pendant-lamp.jpg'} alt="Pendant lamp" style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:172,height:190,objectFit:'cover',objectPosition:'center 40%',opacity:brightness/100*.55+.45,WebkitMaskImage:'radial-gradient(ellipse 60% 62% at 50% 42%,#000 42%,transparent 78%)',maskImage:'radial-gradient(ellipse 60% 62% at 50% 42%,#000 42%,transparent 78%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:104,left:'50%',transform:'translateX(-50%)',width:260,height:200,borderRadius:'50%',opacity:brightness/100,background:'radial-gradient(ellipse at top,'+hue+' 0%,transparent 62%)',filter:'blur(26px)',pointerEvents:'none'}}/>
      <ArcSlider value={brightness} onChange={setBrightness} size={276} caption="Brightness"/>
      <ColorSwatchPicker value={hue} onChange={setHue} style={{marginTop:'var(--space-7)'}}/>
    </div>
    <div style={{padding:'0 var(--gutter-screen) var(--gutter-screen)'}}><TabBar items={TABS} value="light" onChange={v=>nav(v)}/></div>
  </>;
}
export const TABS=[{value:'home',icon:'house',label:'Home'},{value:'light',icon:'lightbulb',label:'Lights'},{value:'temp',icon:'thermometer',label:'Climate'},{value:'settings',icon:'settings',label:'Settings'}];
