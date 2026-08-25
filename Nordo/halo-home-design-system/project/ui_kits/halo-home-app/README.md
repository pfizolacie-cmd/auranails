# Halo Home — app UI kit

Recreation of the four surfaces implied by the source reference (`uploads/Tetiana Praetorius.jpg`).

| Screen | File | Source |
| --- | --- | --- |
| Home dashboard | `HomeScreen.jsx` | centre phone in the reference |
| Smart Light | `LightScreen.jsx` | left phone |
| Home Temperature | `ClimateScreen.jsx` | right phone |
| Settings | `SettingsScreen.jsx` | **extrapolated** — the reference shows a settings tab but no settings view. Built only from patterns visible elsewhere (glass rows, switches, stat tile); flagged as an addition, not a recreation. |

`index.html` mounts `App.jsx` in a `PhoneFrame` and is click-through: tab bar switches screens, the Smart Light tile and the climate tile deep-link into their screens, the arc and dial are draggable/steppable, chips and swatches select.

Screens compose the shared primitives — nothing here re-implements a component.

Copy quirk preserved from the source: the climate screen's label reads "Secudule from:" (sic).
