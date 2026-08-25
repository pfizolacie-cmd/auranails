import React from 'react';
import {PhoneFrame} from '../../components/navigation/PhoneFrame.jsx';
import {HomeScreen} from './HomeScreen.jsx';
import {LightScreen} from './LightScreen.jsx';
import {ClimateScreen} from './ClimateScreen.jsx';
import {SettingsScreen} from './SettingsScreen.jsx';
const SCREENS={home:HomeScreen,light:LightScreen,temp:ClimateScreen,settings:SettingsScreen};
export function App({start='home',backdrop='../../assets/backdrop-room-warm.jpg'}){
  const [screen,setScreen]=React.useState(start);
  const S=SCREENS[screen]||HomeScreen;
  return <PhoneFrame backdrop={backdrop}><S nav={setScreen}/></PhoneFrame>;
}
