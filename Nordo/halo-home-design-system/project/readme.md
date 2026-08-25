# Halo Home — Design System

Halo Home is a **smart-home control app**: one warm, glass-panelled surface for the lights, climate, media and schedules of a single household. The whole product is built on one idea — *the interface is a pane of glass held up against a lit room.* Nothing is opaque, nothing is grey, and the accent colour is literally the light the app controls.

## Source of truth

| Source | What it gave us |
| --- | --- |
| `uploads/Tetiana Praetorius.jpg` | The **only** source. A three-screen mobile UI concept by designer Tetiana Praetorius: Smart Light, Home dashboard, Home Temperature. Every colour, radius, control and layout rule in this system was read off that image. |

No codebase, Figma file, repository, font binary, icon set, logo or written brand guide was supplied. Everything below is therefore either (a) measured/sampled from the reference, or (b) **flagged as an inference or substitution** — see *Gaps & substitutions*.

"Halo Home" is a **placeholder product name** invented so the system has something to call itself. Rename freely.

---

## Content fundamentals

**Voice: a house that has already done the thinking.** Copy states the current condition and gets out of the way. It never sells, never congratulates, never explains a feature.

- **Person.** Second person, implied. The app addresses the resident by first name — "Hi Robbie" — and then drops pronouns entirely. Labels are nouns and readings: *Brightness*, *Goal*, *Now*, *Work*, *Wi-Fi*. There is no "I", no "we", no "your".
- **Casing.** Sentence case everywhere. Screen titles are Title Case ("Smart Light", "Home Temperature") because they name a *thing*; everything else is sentence case ("Welcome Home" is the one Title-Case greeting). **No ALL CAPS anywhere** — not on buttons, not on section labels, not on tabs.
- **Length.** One to three words per label. The longest string in the entire reference is "People Are People" — a song title. If a label needs a preposition it is probably two labels.
- **Numbers are the content.** `64%`, `24°c`, `07:00`, `15°C`, `10°C`, `30°C`. Numerals always, never spelled out. Units are set smaller than the digit and ride the baseline. Degrees use a lowercase `°c` in the big readouts and an uppercase `°C` in the small track labels — preserved from the source, not normalised.
- **Status is a fragment, not a sentence.** "Brightness 64%", not "Brightness is at 64%". "On", not "Currently on".
- **No punctuation at the end of a label.** Colons appear only when a value follows on the same line ("Secudule from:").
- **No emoji. No exclamation marks.** The mood is calm and dim; enthusiasm would break it.
- **Typos in the source are preserved** where they appear in the recreated kit ("Secudule from:"). Do not carry them into new copy — write "Schedule from:".

Sample strings you can reuse verbatim: *Hi Robbie · Welcome Home · Smart Light · Brightness · Living Room · Kitchen · Bedroom · Alarm · Work · Goal · Now · Home Temperature · Secudule from: · Wi-Fi · Device 1 · Device 2*

---

## Visual foundations

### The core motif: glass over a lit room
There is **no app background colour**. Every screen is a full-bleed photograph of a warm interior, dimmed ~34%, with frosted panels floating on top (`backdrop-filter: blur(18px) saturate(140%)`). Cards are translucent warm-white (`rgba(255,244,232,.14)`) with a 1px lighter top edge (`--inner-top`) that reads as light catching a bevel. Take away the photograph and the system collapses — always ship a backdrop.

### Colour
Three families and nothing else:
- **Ember** (`#F2701C` → `#792303`) — the accent. Toggles, active power dots, the warm end of the climate dial, the one primary button.
- **Glow** (`#F6E142`, `#FFD57B`) — *emitted* light, never a fill. The lit tab glyph, halos around a selected bulb colour, drop-shadows on the arc knob.
- **Warm neutrals** — espresso/umber darks and sand/porcelain lights. **There is no neutral grey in this system.** Every dark carries red; every light carries yellow.
- **Dusk** (`#7A99AE`) is the sole cool colour, used only where cold must read as cold: the ambient "Now" marker and the low end of the temperature sweep.

Two backgrounds maximum per screen: the room photo and, optionally, one porcelain card.

### Type
Poppins (substituted — see gaps). Geometric, single-storey *a*, wide apertures. Weights 300–700 but 400/500 carry ~90% of the UI; 600 is reserved for the big metrics. Scale: 44 metric / 28 display / 20 title / 16 heading / 14 body / 12 label / 11 caption / 10 micro. Tracking is slightly negative on the metrics (`-.02em`) and zero everywhere else — no letterspaced small caps, ever. JetBrains Mono appears only for machine identifiers.

### Spacing & layout
20px screen gutters. 12px gap between grid cards. 16px inner card padding (12px on tight tiles). The layout is a fixed two-column grid of glass tiles under a full-width media strip. The tab bar is **fixed and floating**: pinned 20px from the bottom and 20px from each side, never docked flush. Content scrolls under it with an 88px tail so nothing hides behind it.

### Corners
Nothing is square. 8 / 12 / 18 / 24 / 32 / pill. Standard glass card = 18px. Screen shell = 32px. All buttons, chips, segmented controls, tab bars and time fields are full pills or circles.

### Shadows
Two systems, both warm-black — never `rgba(0,0,0,…)` neutral:
- **Elevation** — `0 2px 8px`, `0 8px 24px`, `0 18px 48px` at `rgba(11,7,5,.28–.42)`.
- **Inner** — `inset 0 1px 0 rgba(255,246,236,.30)` on the top edge, a matching dark line on the bottom. This 1px pair is what makes a panel look like glass rather than a tinted rectangle.
- **Glow** — an additive third system for anything emitting: `0 0 24px rgba(255,213,123,.35)` soft, `0 0 44px` strong, `0 0 32px rgba(242,112,28,.45)` ember.

### Transparency & blur
Blur is used for **surfaces**, not for legibility rescue. Panels 18px; the tab bar 32px (heavier, because more content passes under it). Where text sits on a photograph without a panel — a device tile's name — use a bottom **protection gradient** (`--grad-scrim-bottom`), never a solid capsule.

### Imagery
Warm interiors after dark: incandescent light sources in frame, shallow depth of field, heavy optical blur, orange-to-amber cast with deep near-black shadows. One cool edge (a window, a screen) is permitted per image as a counterweight. Never bright daylight, never desaturated, never cool-white. Device photography is shot in situ, cropped square, and sits *behind* the tile's scrim.

### Motion
Fast and decelerating. 160ms for state flips, 240ms standard, 420ms for a screen transition. Easing is `cubic-bezier(.32,.72,0,1)` — a firm start with a long settle. **No bounce, no spring, no overshoot** — a light that overshoots looks broken. Dials and sliders use `--ease-glide`. The only ambient animation permitted is a slow glow pulse on an actively-emitting element.

### Interaction states
- **Hover** — `filter: brightness(1.08)`. Never a colour change, never a border appearing.
- **Press** — `transform: scale(.96)`. Uniform across every tappable thing.
- **Selected** — inverts to a porcelain fill with dark text (chips, segmented control). Selection is never shown with a coloured outline or a checkmark.
- **On / lit** — ember fill plus a glow shadow. Colour *and* light together.
- **Disabled** — 40% opacity, no other change.
- **Focus** — 2px `--focus-ring` (`#FFD57B`) offset 2px.

### Borders
1px only, and always a light on dark: `rgba(255,246,236,.28)` on glass, `.14` on dim glass, `rgba(21,13,8,.10)` on porcelain. No dividers, no hairline rules between list rows — spacing does that job.

---

## Iconography

**No icon assets were supplied with the source.** The reference draws a consistent line set — ~1.5–2px stroke, rounded caps and joins, geometric, no fills, no duotone — matching Lucide almost exactly.

- **Substitution (flagged):** the `Icon` component pulls **Lucide 0.454.0** from `cdn.jsdelivr.net/npm/lucide-static` and renders each glyph as a **CSS mask** so it inherits `currentColor` and can be tinted, dimmed or lit. No SVG was hand-drawn for this system.
- **Sizes:** 21px in the tab bar, 20px default, 16px inside a glass circle, 14px for media transport, 13–15px inline with a label.
- **Colour:** icons take text colour. An active tab glyph is `--glow-500` with a drop-shadow; an idle one is `--text-tertiary`. Icons are never ember unless they sit on an ember fill.
- **Containment:** a functional icon sits in a circular glass chip (30–44px); a decorative or transport icon sits bare.
- **Glyphs in use:** `house · lightbulb · thermometer · settings · bell · search · menu · arrow-left · plus · minus · wifi · heart · speaker · play · pause · rewind · fast-forward · rotate-ccw`.
- **Emoji: never.** **Unicode as iconography: only the degree sign** (`°`) inside a temperature readout.
- **Logo: none exists.** The source contains no wordmark or brand mark. Wherever a logo would go, set the product name in Poppins Medium — see `thumbnail.html`. **Do not draw one.**

---

## Gaps & substitutions — please confirm

1. **Font.** No binaries supplied. Poppins (Google Fonts) is the closest match to the reference's geometric sans. **If you have the real family, send the files** and swap `tokens/fonts.css`.
2. **Icons.** Lucide via CDN, substituted for an unknown set (see above).
3. **Brand name & logo.** "Halo Home" is invented; no mark exists. Nothing was drawn.
4. **Imagery.** `assets/*.jpg` are crops and blurs derived **from the uploaded reference itself** — they are stand-ins at reference resolution, not production photography.
5. **Settings screen.** The reference shows a settings tab but no settings view; `SettingsScreen.jsx` is extrapolated from patterns visible elsewhere and is the one screen that is not a recreation.
6. **Source fidelity.** Recreated from a **single flattened JPEG**, so exact paddings, radii and hex values are measured/sampled, not authoritative. A Figma file or codebase would sharpen all of it considerably.

---

## Index

**Root**
- `styles.css` — the single entry point consumers link. `@import` list only.
- `readme.md` — this file.
- `SKILL.md` — Agent Skills wrapper.
- `thumbnail.html` — homepage tile.

**`tokens/`** — `fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `radii.css` · `effects.css` · `motion.css` · `base.css`

**`assets/`** — `backdrop-room-warm.jpg` · `backdrop-glow-amber.jpg` · `backdrop-cool-edge.jpg` · `device-pendant-lamp.jpg` · `device-smart-light.jpg` · `scene-room-evening.jpg`

**`guidelines/`** — 19 foundation specimen cards (Colors, Type, Spacing, Brand).

**Components** — each with `.jsx`, `.d.ts`, `.prompt.md`:

| Group | Components |
| --- | --- |
| `components/core/` | **Icon**, **GlassCard**, **IconButton**, **Button**, **Chip**, **SegmentedControl**, **Avatar**, **SectionLabel** |
| `components/controls/` | **Switch**, **StepperButton**, **ArcSlider**, **TemperatureDial**, **ColorSwatchPicker**, **TimeRangeField**, **SearchField** |
| `components/cards/` | **DeviceTile**, **AlarmCard**, **MediaCard**, **StatTile**, **ClimateTile** |
| `components/navigation/` | **ScreenHeader**, **TabBar**, **PhoneFrame** |

**Intentional additions** (not literal components in the source, extracted because the kit needs them):
- **Icon** — wrapper for the substituted glyph set.
- **PhoneFrame** — the screen shell + backdrop treatment, so every screen shares one.
- **Button** — the source has no text button; added because any consuming project will need one, styled from the chip/pill language.
- **SearchField** — the source shows a search *icon* only; the expanded field is inferred.
- **SectionLabel** — extracted from the "Secudule from:" heading.

**UI kits**
- `ui_kits/booking-app/` — rezervačná appka pre barber prevádzku (4 obrazovky): `BookingScreen.jsx`, `OwnerScreen.jsx`, `ChairsScreen.jsx`, `DiscoveryScreen.jsx`, `data.js`, `index.html`, `README.md`.
- `ui_kits/halo-home-app/` — `index.html` (click-through, three phones side by side), `App.jsx`, `HomeScreen.jsx`, `LightScreen.jsx`, `ClimateScreen.jsx`, `SettingsScreen.jsx`, `README.md`.

---

## Agency use — the booking-app product

This design system doubles as the visual foundation for the agency's own product: a **web + booking app + AI agent** package sold to small local businesses in Slovakia (beauty and barber sector first).

- **`ui_kits/booking-app/`** — four product surfaces, barber-flavoured, built only from the primitives above: customer booking flow, owner's day, chair rental (multi-user), and the discovery chatbot. Sample data lives in `data.js` (fictional *Barber Room, Prievidza*) — swap it per client.
- **`templates/agency-sales-deck/`** — an 11-slide Slovak sales deck (`AgencySalesDeck.dc.html`) that embeds those screens live and uses **Aura Nails** (Handlová) as the case study. Pricing shown: €500–1500 one-off, no monthly fee.

**Placeholder to replace:** the agency name is set as **"Nordo"** on slides 1 and 11 of the deck. It is invented — search the deck for `Nordo` and replace it, plus the contact line on the final slide.
