# Rezervačná appka — UI kit (barber)

Štyri plochy produktu agentúry, postavené výhradne z komponentov tohto dizajn systému:

| Obrazovka | Súbor | Čo ukazuje |
| --- | --- | --- |
| Rezervácia (zákazník) | `BookingScreen.jsx` | trojkrokový tok: služba → holič/deň/čas → potvrdenie. Obsadené termíny sú preškrtnuté a neklikateľné. |
| Deň (majiteľ) | `OwnerScreen.jsx` | rozvrh dňa, stav termínu (hotovo / práve teraz / čaká / voľné), tržba a obsadenosť. |
| Kreslá (viac užívateľov) | `ChairsScreen.jsx` | prenájom kresiel — každý holič má vlastný kalendár, klientelu a tržby. |
| Úvodný rozhovor | `DiscoveryScreen.jsx` | discovery chatbot, ktorý zbiera podklady pred začiatkom projektu. |

Ukážkové dáta sú v `data.js` — fiktívna prevádzka **Barber Room, Prievidza**. Vymeň ich pri konkrétnom klientovi.
