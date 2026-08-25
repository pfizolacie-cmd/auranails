/* @ds-bundle: {"format":4,"namespace":"HaloHomeDesignSystem_abaa2b","components":[{"name":"AlarmCard","sourcePath":"components/cards/AlarmCard.jsx"},{"name":"ClimateTile","sourcePath":"components/cards/ClimateTile.jsx"},{"name":"DeviceTile","sourcePath":"components/cards/DeviceTile.jsx"},{"name":"MediaCard","sourcePath":"components/cards/MediaCard.jsx"},{"name":"StatTile","sourcePath":"components/cards/StatTile.jsx"},{"name":"ArcSlider","sourcePath":"components/controls/ArcSlider.jsx"},{"name":"ColorSwatchPicker","sourcePath":"components/controls/ColorSwatchPicker.jsx"},{"name":"SearchField","sourcePath":"components/controls/SearchField.jsx"},{"name":"StepperButton","sourcePath":"components/controls/StepperButton.jsx"},{"name":"Switch","sourcePath":"components/controls/Switch.jsx"},{"name":"TemperatureDial","sourcePath":"components/controls/TemperatureDial.jsx"},{"name":"TimeRangeField","sourcePath":"components/controls/TimeRangeField.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"GlassCard","sourcePath":"components/core/GlassCard.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"SectionLabel","sourcePath":"components/core/SectionLabel.jsx"},{"name":"SegmentedControl","sourcePath":"components/core/SegmentedControl.jsx"},{"name":"PhoneFrame","sourcePath":"components/navigation/PhoneFrame.jsx"},{"name":"ScreenHeader","sourcePath":"components/navigation/ScreenHeader.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"BookingScreen","sourcePath":"ui_kits/booking-app/BookingScreen.jsx"},{"name":"ChairsScreen","sourcePath":"ui_kits/booking-app/ChairsScreen.jsx"},{"name":"DiscoveryScreen","sourcePath":"ui_kits/booking-app/DiscoveryScreen.jsx"},{"name":"OwnerScreen","sourcePath":"ui_kits/booking-app/OwnerScreen.jsx"},{"name":"SHOP","sourcePath":"ui_kits/booking-app/data.js"},{"name":"SERVICES","sourcePath":"ui_kits/booking-app/data.js"},{"name":"BARBERS","sourcePath":"ui_kits/booking-app/data.js"},{"name":"SLOTS","sourcePath":"ui_kits/booking-app/data.js"},{"name":"TAKEN","sourcePath":"ui_kits/booking-app/data.js"},{"name":"DAYS","sourcePath":"ui_kits/booking-app/data.js"},{"name":"AGENDA","sourcePath":"ui_kits/booking-app/data.js"},{"name":"CHAIRS","sourcePath":"ui_kits/booking-app/data.js"},{"name":"CHAT","sourcePath":"ui_kits/booking-app/data.js"},{"name":"App","sourcePath":"ui_kits/halo-home-app/App.jsx"},{"name":"ClimateScreen","sourcePath":"ui_kits/halo-home-app/ClimateScreen.jsx"},{"name":"HomeScreen","sourcePath":"ui_kits/halo-home-app/HomeScreen.jsx"},{"name":"LightScreen","sourcePath":"ui_kits/halo-home-app/LightScreen.jsx"},{"name":"TABS","sourcePath":"ui_kits/halo-home-app/LightScreen.jsx"},{"name":"SettingsScreen","sourcePath":"ui_kits/halo-home-app/SettingsScreen.jsx"}],"sourceHashes":{"components/cards/AlarmCard.jsx":"40b0fa984397","components/cards/ClimateTile.jsx":"4543ade8dac1","components/cards/DeviceTile.jsx":"e0ad68855a22","components/cards/MediaCard.jsx":"0c66f008e428","components/cards/StatTile.jsx":"48df192e9016","components/controls/ArcSlider.jsx":"3ce5f250aefe","components/controls/ColorSwatchPicker.jsx":"b85a6f42a3f7","components/controls/SearchField.jsx":"8f5e0daf58e6","components/controls/StepperButton.jsx":"f618b3d58111","components/controls/Switch.jsx":"9f5b9146711f","components/controls/TemperatureDial.jsx":"777938432f67","components/controls/TimeRangeField.jsx":"815eb1f883eb","components/core/Avatar.jsx":"9bb8697716ad","components/core/Button.jsx":"01b25789ef25","components/core/Chip.jsx":"d97e42c25629","components/core/GlassCard.jsx":"8350d9f913d3","components/core/Icon.jsx":"a5e8c06d8a47","components/core/IconButton.jsx":"4f4b5549fc6f","components/core/SectionLabel.jsx":"e34df5cf4f20","components/core/SegmentedControl.jsx":"ac313b7f3e43","components/navigation/PhoneFrame.jsx":"bd8fc3514047","components/navigation/ScreenHeader.jsx":"d63fffeb659a","components/navigation/TabBar.jsx":"762347da3add","ui_kits/booking-app/BookingScreen.jsx":"ebdbc7891131","ui_kits/booking-app/ChairsScreen.jsx":"2da87b489a94","ui_kits/booking-app/DiscoveryScreen.jsx":"4762352a06e6","ui_kits/booking-app/OwnerScreen.jsx":"5f289333b994","ui_kits/booking-app/data.js":"a79c000018a8","ui_kits/halo-home-app/App.jsx":"2b6067ca508a","ui_kits/halo-home-app/ClimateScreen.jsx":"ea98f2a813c3","ui_kits/halo-home-app/HomeScreen.jsx":"86b43f515aeb","ui_kits/halo-home-app/LightScreen.jsx":"e64df521300e","ui_kits/halo-home-app/SettingsScreen.jsx":"d4f2ece613ee"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HaloHomeDesignSystem_abaa2b = window.HaloHomeDesignSystem_abaa2b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/controls/ArcSlider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Half-dome brightness arc: the track opens downward, the knob rides the top. */
function ArcSlider({
  value = 64,
  onChange,
  size = 240,
  unit = '%',
  caption = 'Brightness',
  style,
  ...rest
}) {
  const r = size / 2 - 10,
    cx = size / 2,
    cy = size / 2 + 6;
  const pt = p => {
    const a = Math.PI * (1 - p);
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  };
  const [sx, sy] = pt(0),
    [ex, ey] = pt(1),
    [kx, ky] = pt(Math.max(0, Math.min(1, value / 100)));
  const arc = (f, t) => {
    const [x1, y1] = pt(f),
      [x2, y2] = pt(t);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  const set = e => {
    if (!onChange) return;
    const b = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - b.left - cx,
      dy = cy - (e.clientY - b.top);
    let a = Math.atan2(dy, dx);
    if (a < 0) a = 0;
    onChange(Math.round((1 - a / Math.PI) * 100));
  };
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      position: 'relative',
      width: size,
      height: size / 2 + 56,
      ...style
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size / 2 + 16,
    viewBox: `0 0 ${size} ${size / 2 + 16}`,
    onPointerDown: set,
    style: {
      cursor: 'pointer',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: arc(0, 1),
    fill: "none",
    stroke: "rgba(255,246,236,.22)",
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: arc(0, Math.max(.001, value / 100)),
    fill: "none",
    stroke: "var(--porcelain)",
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: sx,
    cy: sy,
    r: "3",
    fill: "rgba(255,246,236,.4)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: ex,
    cy: ey,
    r: "3",
    fill: "rgba(255,246,236,.4)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: kx,
    cy: ky,
    r: "11",
    fill: "var(--porcelain)",
    style: {
      filter: 'drop-shadow(0 0 12px rgba(255,213,123,.7))'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: size * 0.30,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-metric)',
      letterSpacing: 'var(--tracking-metric)',
      color: 'var(--text-primary)'
    }
  }, value, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 22px/1 var(--font-core)'
    }
  }, unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--text-secondary)',
      marginTop: 'var(--space-1)'
    }
  }, caption)));
}
Object.assign(__ds_scope, { ArcSlider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/ArcSlider.jsx", error: String((e && e.message) || e) }); }

// components/controls/ColorSwatchPicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ColorSwatchPicker({
  colors = ['var(--bulb-white)', 'var(--bulb-cyan)', 'var(--bulb-yellow)', 'var(--bulb-blush)', 'var(--bulb-violet)'],
  value,
  onChange,
  size = 16,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "radiogroup"
  }, rest, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      ...style
    }
  }), colors.map(c => {
    const on = c === value;
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      role: "radio",
      "aria-checked": on,
      "aria-label": c,
      onClick: () => onChange && onChange(c),
      style: {
        width: on ? size + 10 : size,
        height: on ? size + 10 : size,
        borderRadius: 'var(--radius-circle)',
        background: c,
        border: on ? '2px solid rgba(255,255,255,.85)' : 'none',
        cursor: 'pointer',
        padding: 0,
        transition: 'all var(--dur-base) var(--ease-out)',
        boxShadow: on ? '0 0 20px 4px rgba(255,213,123,.65)' : 'var(--shadow-sm)'
      }
    });
  }));
}
Object.assign(__ds_scope, { ColorSwatchPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/ColorSwatchPicker.jsx", error: String((e && e.message) || e) }); }

// components/controls/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked = false,
  onChange,
  size = 'md',
  label,
  style,
  ...rest
}) {
  const dims = size === 'sm' ? {
    w: 38,
    h: 22,
    k: 16
  } : {
    w: 52,
    h: 30,
    k: 24
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": checked,
    "aria-label": label,
    onClick: () => onChange && onChange(!checked)
  }, rest, {
    style: {
      width: dims.w,
      height: dims.h,
      padding: 3,
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: checked ? 'flex-end' : 'flex-start',
      background: checked ? 'var(--control-track-on)' : 'var(--control-track-off)',
      boxShadow: checked ? 'var(--glow-ember)' : 'inset 0 1px 2px rgba(11,7,5,.25)',
      transition: 'background var(--dur-base) var(--ease-standard),box-shadow var(--dur-base) var(--ease-standard)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: dims.k,
      height: dims.k,
      borderRadius: 'var(--radius-circle)',
      background: 'var(--control-knob)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/Switch.jsx", error: String((e && e.message) || e) }); }

// components/controls/TemperatureDial.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* 260° gauge: cool at the left tail, ember at the right. Centre puck is porcelain. */
function TemperatureDial({
  value = 24,
  min = 10,
  max = 30,
  now,
  size = 210,
  label = 'Goal',
  unit = '°c',
  style,
  ...rest
}) {
  const SPAN = 260,
    START = 140,
    r = size / 2 - 14,
    cx = size / 2,
    cy = size / 2;
  const p = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const pt = (t, rad = r) => {
    const a = (START + SPAN * t) * Math.PI / 180;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };
  const seg = (f, t) => {
    const [x1, y1] = pt(f),
      [x2, y2] = pt(t);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${SPAN * (t - f) > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const nowP = now == null ? null : Math.max(0, Math.min(1, (now - min) / (max - min)));
  const [kx, ky] = pt(p);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      position: 'relative',
      width: size,
      height: size,
      ...style
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "hh-dial",
    x1: "0",
    y1: "1",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "var(--dusk-200)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".5",
    stopColor: "var(--glow-300)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "var(--ember-500)"
  }))), /*#__PURE__*/React.createElement("path", {
    d: seg(0, 1),
    fill: "none",
    stroke: "rgba(255,246,236,.20)",
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: seg(0, Math.max(.001, p)),
    fill: "none",
    stroke: "url(#hh-dial)",
    strokeWidth: "3",
    strokeLinecap: "round"
  }), nowP != null ? /*#__PURE__*/React.createElement("circle", {
    cx: pt(nowP)[0],
    cy: pt(nowP)[1],
    r: "5",
    fill: "var(--dusk-200)",
    stroke: "var(--espresso-800)",
    strokeWidth: "2"
  }) : null, /*#__PURE__*/React.createElement("circle", {
    cx: kx,
    cy: ky,
    r: "5",
    fill: "var(--ember-500)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: r - 26,
    fill: "var(--sand-050)",
    style: {
      filter: 'drop-shadow(0 10px 26px rgba(11,7,5,.45))'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-inverse)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-inverse-soft)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-metric)',
      letterSpacing: 'var(--tracking-metric)'
    }
  }, value, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 20px/1 var(--font-core)'
    }
  }, unit))));
}
Object.assign(__ds_scope, { TemperatureDial });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/TemperatureDial.jsx", error: String((e && e.message) || e) }); }

// components/controls/TimeRangeField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TimeRangeField({
  from = '15:00',
  to = '22:00',
  separator = 'to',
  onChange,
  style,
  ...rest
}) {
  const box = {
    padding: '10px 18px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--surface-glass)',
    border: '1px solid var(--line-glass-soft)',
    backdropFilter: 'var(--glass)',
    WebkitBackdropFilter: 'var(--glass)',
    font: 'var(--text-body)',
    color: 'var(--text-primary)',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: box,
    onClick: () => onChange && onChange('from')
  }, from), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, separator), /*#__PURE__*/React.createElement("span", {
    style: box,
    onClick: () => onChange && onChange('to')
  }, to));
}
Object.assign(__ds_scope, { TimeRangeField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/TimeRangeField.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Avatar({
  src,
  name = '',
  size = 38,
  ring = true,
  style,
  ...rest
}) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-circle)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      font: 'var(--text-label)',
      color: 'var(--text-inverse)',
      background: src ? 'transparent' : 'var(--sand-200)',
      border: ring ? '2px solid var(--line-glass)' : 'none',
      boxShadow: 'var(--shadow-sm)',
      flex: '0 0 auto',
      ...style
    }
  }), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/GlassCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function GlassCard({
  tone = 'light',
  padding = 'var(--pad-card)',
  radius = 'var(--radius-md)',
  glow = false,
  style,
  children,
  ...rest
}) {
  const tones = {
    light: {
      background: 'var(--grad-glass)',
      border: '1px solid var(--line-glass)'
    },
    dim: {
      background: 'var(--grad-glass-dim)',
      border: '1px solid var(--line-glass-soft)'
    },
    solid: {
      background: 'var(--surface-solid)',
      border: '1px solid var(--line-solid)',
      color: 'var(--text-inverse)'
    }
  };
  const t = tones[tone] || tones.light;
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      position: 'relative',
      borderRadius: radius,
      padding,
      backdropFilter: tone === 'solid' ? undefined : 'var(--glass)',
      WebkitBackdropFilter: tone === 'solid' ? undefined : 'var(--glass)',
      boxShadow: tone === 'solid' ? 'var(--shadow-md)' : 'var(--shadow-sm),var(--inner-glass)' + (glow ? ',var(--glow-soft)' : ''),
      ...t,
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { GlassCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/GlassCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/AlarmCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function AlarmCard({
  title = 'Alarm',
  time = '07:00',
  meta = 'Work',
  on = true,
  onToggle,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.GlassCard, _extends({
    tone: "solid"
  }, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label)',
      color: 'var(--text-inverse)'
    }
  }, title), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) 24px/1.1 var(--font-core)',
      letterSpacing: 'var(--tracking-metric)',
      color: 'var(--text-inverse)'
    }
  }, time), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-inverse-soft)'
    }
  }, meta)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-inverse-soft)'
    }
  }, on ? 'On' : 'Off'), /*#__PURE__*/React.createElement(__ds_scope.Switch, {
    checked: on,
    onChange: onToggle,
    label: title,
    size: "sm"
  })));
}
Object.assign(__ds_scope, { AlarmCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/AlarmCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/ClimateTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ClimateTile({
  value = 24,
  unit = '°c',
  label = 'Home',
  on = true,
  onToggle,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.GlassCard, _extends({
    tone: "dim"
  }, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 120,
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-circle)',
      border: '2px solid var(--line-glass)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: 'var(--text-label)',
      color: 'var(--text-primary)'
    }
  }, value, unit), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label + ' power',
    "aria-pressed": on,
    onClick: onToggle,
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-circle)',
      border: 'none',
      cursor: 'pointer',
      background: on ? 'var(--ember-500)' : 'rgba(255,246,236,.28)',
      boxShadow: on ? 'var(--glow-ember)' : 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { ClimateTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ClimateTile.jsx", error: String((e && e.message) || e) }); }

// components/cards/DeviceTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DeviceTile({
  name,
  status,
  image,
  on = false,
  onToggle,
  height = 120,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.GlassCard, _extends({
    tone: "dim",
    padding: "0",
    radius: "var(--radius-md)"
  }, rest, {
    style: {
      position: 'relative',
      overflow: 'hidden',
      minHeight: height,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      ...style
    }
  }), image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: .85
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--grad-scrim-bottom)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      padding: 'var(--pad-card-tight)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, name), status ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, status) : null), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": name + ' power',
    "aria-pressed": on,
    onClick: onToggle,
    style: {
      width: 22,
      height: 22,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-circle)',
      border: 'none',
      cursor: 'pointer',
      background: on ? 'var(--ember-500)' : 'rgba(255,246,236,.28)',
      boxShadow: on ? 'var(--glow-ember)' : 'none',
      transition: 'background var(--dur-base) var(--ease-standard),box-shadow var(--dur-base) var(--ease-standard)'
    }
  })));
}
Object.assign(__ds_scope, { DeviceTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/DeviceTile.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide 0.454.0 (ISC), vendored as inline data URIs and rendered through a CSS
   mask so every glyph inherits currentColor. Vendored rather than CDN-linked so
   the system is self-contained and path-independent.
   SUBSTITUTION: the source screenshot ships no icon assets; Lucide is the closest
   match to its 2px rounded-cap line style. Raw files also in assets/icons/. */
const PATHS = {
  'house': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M15%2021v-8a1%201%200%200%200-1-1h-4a1%201%200%200%200-1%201v8%22%2F%3E%3Cpath%20d%3D%22M3%2010a2%202%200%200%201%20.709-1.528l7-5.999a2%202%200%200%201%202.582%200l7%205.999A2%202%200%200%201%2021%2010v9a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2z%22%2F%3E%3C%2Fsvg%3E',
  'lightbulb': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M15%2014c.2-1%20.7-1.7%201.5-2.5%201-.9%201.5-2.2%201.5-3.5A6%206%200%200%200%206%208c0%201%20.2%202.2%201.5%203.5.7.7%201.3%201.5%201.5%202.5%22%2F%3E%3Cpath%20d%3D%22M9%2018h6%22%2F%3E%3Cpath%20d%3D%22M10%2022h4%22%2F%3E%3C%2Fsvg%3E',
  'thermometer': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M14%204v10.54a4%204%200%201%201-4%200V4a2%202%200%200%201%204%200Z%22%2F%3E%3C%2Fsvg%3E',
  'settings': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12.22%202h-.44a2%202%200%200%200-2%202v.18a2%202%200%200%201-1%201.73l-.43.25a2%202%200%200%201-2%200l-.15-.08a2%202%200%200%200-2.73.73l-.22.38a2%202%200%200%200%20.73%202.73l.15.1a2%202%200%200%201%201%201.72v.51a2%202%200%200%201-1%201.74l-.15.09a2%202%200%200%200-.73%202.73l.22.38a2%202%200%200%200%202.73.73l.15-.08a2%202%200%200%201%202%200l.43.25a2%202%200%200%201%201%201.73V20a2%202%200%200%200%202%202h.44a2%202%200%200%200%202-2v-.18a2%202%200%200%201%201-1.73l.43-.25a2%202%200%200%201%202%200l.15.08a2%202%200%200%200%202.73-.73l.22-.39a2%202%200%200%200-.73-2.73l-.15-.08a2%202%200%200%201-1-1.74v-.5a2%202%200%200%201%201-1.74l.15-.09a2%202%200%200%200%20.73-2.73l-.22-.38a2%202%200%200%200-2.73-.73l-.15.08a2%202%200%200%201-2%200l-.43-.25a2%202%200%200%201-1-1.73V4a2%202%200%200%200-2-2z%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%2F%3E%3C%2Fsvg%3E',
  'bell': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%208a6%206%200%200%201%2012%200c0%207%203%209%203%209H3s3-2%203-9%22%2F%3E%3Cpath%20d%3D%22M10.3%2021a1.94%201.94%200%200%200%203.4%200%22%2F%3E%3C%2Fsvg%3E',
  'search': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%2211%22%20cy%3D%2211%22%20r%3D%228%22%2F%3E%3Cpath%20d%3D%22m21%2021-4.3-4.3%22%2F%3E%3C%2Fsvg%3E',
  'menu': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cline%20x1%3D%224%22%20x2%3D%2220%22%20y1%3D%2212%22%20y2%3D%2212%22%2F%3E%3Cline%20x1%3D%224%22%20x2%3D%2220%22%20y1%3D%226%22%20y2%3D%226%22%2F%3E%3Cline%20x1%3D%224%22%20x2%3D%2220%22%20y1%3D%2218%22%20y2%3D%2218%22%2F%3E%3C%2Fsvg%3E',
  'arrow-left': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m12%2019-7-7%207-7%22%2F%3E%3Cpath%20d%3D%22M19%2012H5%22%2F%3E%3C%2Fsvg%3E',
  'plus': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M5%2012h14%22%2F%3E%3Cpath%20d%3D%22M12%205v14%22%2F%3E%3C%2Fsvg%3E',
  'minus': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M5%2012h14%22%2F%3E%3C%2Fsvg%3E',
  'wifi': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%2020h.01%22%2F%3E%3Cpath%20d%3D%22M2%208.82a15%2015%200%200%201%2020%200%22%2F%3E%3Cpath%20d%3D%22M5%2012.859a10%2010%200%200%201%2014%200%22%2F%3E%3Cpath%20d%3D%22M8.5%2016.429a5%205%200%200%201%207%200%22%2F%3E%3C%2Fsvg%3E',
  'heart': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M19%2014c1.49-1.46%203-3.21%203-5.5A5.5%205.5%200%200%200%2016.5%203c-1.76%200-3%20.5-4.5%202-1.5-1.5-2.74-2-4.5-2A5.5%205.5%200%200%200%202%208.5c0%202.3%201.5%204.05%203%205.5l7%207Z%22%2F%3E%3C%2Fsvg%3E',
  'speaker': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20width%3D%2216%22%20height%3D%2220%22%20x%3D%224%22%20y%3D%222%22%20rx%3D%222%22%2F%3E%3Cpath%20d%3D%22M12%206h.01%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2214%22%20r%3D%224%22%2F%3E%3Cpath%20d%3D%22M12%2014h.01%22%2F%3E%3C%2Fsvg%3E',
  'play': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolygon%20points%3D%226%203%2020%2012%206%2021%206%203%22%2F%3E%3C%2Fsvg%3E',
  'pause': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%2214%22%20y%3D%224%22%20width%3D%224%22%20height%3D%2216%22%20rx%3D%221%22%2F%3E%3Crect%20x%3D%226%22%20y%3D%224%22%20width%3D%224%22%20height%3D%2216%22%20rx%3D%221%22%2F%3E%3C%2Fsvg%3E',
  'rewind': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolygon%20points%3D%2211%2019%202%2012%2011%205%2011%2019%22%2F%3E%3Cpolygon%20points%3D%2222%2019%2013%2012%2022%205%2022%2019%22%2F%3E%3C%2Fsvg%3E',
  'fast-forward': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolygon%20points%3D%2213%2019%2022%2012%2013%205%2013%2019%22%2F%3E%3Cpolygon%20points%3D%222%2019%2011%2012%202%205%202%2019%22%2F%3E%3C%2Fsvg%3E',
  'rotate-ccw': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%2012a9%209%200%201%200%209-9%209.75%209.75%200%200%200-6.74%202.74L3%208%22%2F%3E%3Cpath%20d%3D%22M3%203v5h5%22%2F%3E%3C%2Fsvg%3E',
  'scissors': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%226%22%20cy%3D%226%22%20r%3D%223%22%2F%3E%3Cpath%20d%3D%22M8.12%208.12%2012%2012%22%2F%3E%3Cpath%20d%3D%22M20%204%208.12%2015.88%22%2F%3E%3Ccircle%20cx%3D%226%22%20cy%3D%2218%22%20r%3D%223%22%2F%3E%3Cpath%20d%3D%22M14.8%2014.8%2020%2020%22%2F%3E%3C%2Fsvg%3E',
  'calendar': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M8%202v4%22%2F%3E%3Cpath%20d%3D%22M16%202v4%22%2F%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%224%22%20rx%3D%222%22%2F%3E%3Cpath%20d%3D%22M3%2010h18%22%2F%3E%3C%2Fsvg%3E',
  'calendar-check': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M8%202v4%22%2F%3E%3Cpath%20d%3D%22M16%202v4%22%2F%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%224%22%20rx%3D%222%22%2F%3E%3Cpath%20d%3D%22M3%2010h18%22%2F%3E%3Cpath%20d%3D%22m9%2016%202%202%204-4%22%2F%3E%3C%2Fsvg%3E',
  'clock': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%2F%3E%3Cpolyline%20points%3D%2212%206%2012%2012%2016%2014%22%2F%3E%3C%2Fsvg%3E',
  'user': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M19%2021v-2a4%204%200%200%200-4-4H9a4%204%200%200%200-4%204v2%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%227%22%20r%3D%224%22%2F%3E%3C%2Fsvg%3E',
  'users': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M16%2021v-2a4%204%200%200%200-4-4H6a4%204%200%200%200-4%204v2%22%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%227%22%20r%3D%224%22%2F%3E%3Cpath%20d%3D%22M22%2021v-2a4%204%200%200%200-3-3.87%22%2F%3E%3Cpath%20d%3D%22M16%203.13a4%204%200%200%201%200%207.75%22%2F%3E%3C%2Fsvg%3E',
  'chevron-right': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m9%2018%206-6-6-6%22%2F%3E%3C%2Fsvg%3E',
  'chevron-left': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m15%2018-6-6%206-6%22%2F%3E%3C%2Fsvg%3E',
  'check': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M20%206%209%2017l-5-5%22%2F%3E%3C%2Fsvg%3E',
  'check-check': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M18%206%207%2017l-5-5%22%2F%3E%3Cpath%20d%3D%22m22%2010-7.5%207.5L13%2016%22%2F%3E%3C%2Fsvg%3E',
  'credit-card': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20width%3D%2220%22%20height%3D%2214%22%20x%3D%222%22%20y%3D%225%22%20rx%3D%222%22%2F%3E%3Cline%20x1%3D%222%22%20x2%3D%2222%22%20y1%3D%2210%22%20y2%3D%2210%22%2F%3E%3C%2Fsvg%3E',
  'message-circle': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M7.9%2020A9%209%200%201%200%204%2016.1L2%2022Z%22%2F%3E%3C%2Fsvg%3E',
  'trending-up': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%2222%207%2013.5%2015.5%208.5%2010.5%202%2017%22%2F%3E%3Cpolyline%20points%3D%2216%207%2022%207%2022%2013%22%2F%3E%3C%2Fsvg%3E',
  'phone': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M22%2016.92v3a2%202%200%200%201-2.18%202%2019.79%2019.79%200%200%201-8.63-3.07%2019.5%2019.5%200%200%201-6-6%2019.79%2019.79%200%200%201-3.07-8.67A2%202%200%200%201%204.11%202h3a2%202%200%200%201%202%201.72%2012.84%2012.84%200%200%200%20.7%202.81%202%202%200%200%201-.45%202.11L8.09%209.91a16%2016%200%200%200%206%206l1.27-1.27a2%202%200%200%201%202.11-.45%2012.84%2012.84%200%200%200%202.81.7A2%202%200%200%201%2022%2016.92z%22%2F%3E%3C%2Fsvg%3E',
  'map-pin': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M20%2010c0%204.993-5.539%2010.193-7.399%2011.799a1%201%200%200%201-1.202%200C9.539%2020.193%204%2014.993%204%2010a8%208%200%200%201%2016%200%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2210%22%20r%3D%223%22%2F%3E%3C%2Fsvg%3E',
  'star': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M11.525%202.295a.53.53%200%200%201%20.95%200l2.31%204.679a2.123%202.123%200%200%200%201.595%201.16l5.166.756a.53.53%200%200%201%20.294.904l-3.736%203.638a2.123%202.123%200%200%200-.611%201.878l.882%205.14a.53.53%200%200%201-.771.56l-4.618-2.428a2.122%202.122%200%200%200-1.973%200L6.396%2021.01a.53.53%200%200%201-.77-.56l.881-5.139a2.122%202.122%200%200%200-.611-1.879L2.16%209.795a.53.53%200%200%201%20.294-.906l5.165-.755a2.122%202.122%200%200%200%201.597-1.16z%22%2F%3E%3C%2Fsvg%3E',
  'send': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M14.536%2021.686a.5.5%200%200%200%20.937-.024l6.5-19a.496.496%200%200%200-.635-.635l-19%206.5a.5.5%200%200%200-.024.937l7.93%203.18a2%202%200%200%201%201.112%201.11z%22%2F%3E%3Cpath%20d%3D%22m21.854%202.147-10.94%2010.939%22%2F%3E%3C%2Fsvg%3E',
  'sparkles': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M9.937%2015.5A2%202%200%200%200%208.5%2014.063l-6.135-1.582a.5.5%200%200%201%200-.962L8.5%209.936A2%202%200%200%200%209.937%208.5l1.582-6.135a.5.5%200%200%201%20.963%200L14.063%208.5A2%202%200%200%200%2015.5%209.937l6.135%201.581a.5.5%200%200%201%200%20.964L15.5%2014.063a2%202%200%200%200-1.437%201.437l-1.582%206.135a.5.5%200%200%201-.963%200z%22%2F%3E%3Cpath%20d%3D%22M20%203v4%22%2F%3E%3Cpath%20d%3D%22M22%205h-4%22%2F%3E%3Cpath%20d%3D%22M4%2017v2%22%2F%3E%3Cpath%20d%3D%22M5%2018H3%22%2F%3E%3C%2Fsvg%3E',
  'instagram': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20width%3D%2220%22%20height%3D%2220%22%20x%3D%222%22%20y%3D%222%22%20rx%3D%225%22%20ry%3D%225%22%2F%3E%3Cpath%20d%3D%22M16%2011.37A4%204%200%201%201%2012.63%208%204%204%200%200%201%2016%2011.37z%22%2F%3E%3Cline%20x1%3D%2217.5%22%20x2%3D%2217.51%22%20y1%3D%226.5%22%20y2%3D%226.5%22%2F%3E%3C%2Fsvg%3E',
  'globe': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%2F%3E%3Cpath%20d%3D%22M12%202a14.5%2014.5%200%200%200%200%2020%2014.5%2014.5%200%200%200%200-20%22%2F%3E%3Cpath%20d%3D%22M2%2012h20%22%2F%3E%3C%2Fsvg%3E',
  'bot': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%208V4H8%22%2F%3E%3Crect%20width%3D%2216%22%20height%3D%2212%22%20x%3D%224%22%20y%3D%228%22%20rx%3D%222%22%2F%3E%3Cpath%20d%3D%22M2%2014h2%22%2F%3E%3Cpath%20d%3D%22M20%2014h2%22%2F%3E%3Cpath%20d%3D%22M15%2013v2%22%2F%3E%3Cpath%20d%3D%22M9%2013v2%22%2F%3E%3C%2Fsvg%3E',
  'armchair': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M19%209V6a2%202%200%200%200-2-2H7a2%202%200%200%200-2%202v3%22%2F%3E%3Cpath%20d%3D%22M3%2016a2%202%200%200%200%202%202h14a2%202%200%200%200%202-2v-5a2%202%200%200%200-4%200v1.5a.5.5%200%200%201-.5.5h-9a.5.5%200%200%201-.5-.5V11a2%202%200%200%200-4%200z%22%2F%3E%3Cpath%20d%3D%22M5%2018v2%22%2F%3E%3Cpath%20d%3D%22M19%2018v2%22%2F%3E%3C%2Fsvg%3E',
  'banknote': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20width%3D%2220%22%20height%3D%2212%22%20x%3D%222%22%20y%3D%226%22%20rx%3D%222%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%222%22%2F%3E%3Cpath%20d%3D%22M6%2012h.01M18%2012h.01%22%2F%3E%3C%2Fsvg%3E',
  'circle-check-big': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M21.801%2010A10%2010%200%201%201%2017%203.335%22%2F%3E%3Cpath%20d%3D%22m9%2011%203%203L22%204%22%2F%3E%3C%2Fsvg%3E',
  'x': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M18%206%206%2018%22%2F%3E%3Cpath%20d%3D%22m6%206%2012%2012%22%2F%3E%3C%2Fsvg%3E',
  'arrow-right': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M5%2012h14%22%2F%3E%3Cpath%20d%3D%22m12%205%207%207-7%207%22%2F%3E%3C%2Fsvg%3E',
  'layout-grid': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%221%22%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%2214%22%20y%3D%223%22%20rx%3D%221%22%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%2214%22%20y%3D%2214%22%20rx%3D%221%22%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%223%22%20y%3D%2214%22%20rx%3D%221%22%2F%3E%3C%2Fsvg%3E',
  'bell-ring': '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%208a6%206%200%200%201%2012%200c0%207%203%209%203%209H3s3-2%203-9%22%2F%3E%3Cpath%20d%3D%22M10.3%2021a1.94%201.94%200%200%200%203.4%200%22%2F%3E%3Cpath%20d%3D%22M4%202C2.8%203.7%202%205.7%202%208%22%2F%3E%3Cpath%20d%3D%22M22%208c0-2.3-.8-4.3-2-6%22%2F%3E%3C%2Fsvg%3E'
};
const ICON_NAMES = Object.keys(PATHS);
function Icon({
  name,
  size = 20,
  style,
  ...rest
}) {
  const d = PATHS[name];
  const url = d ? `url("data:image/svg+xml,${d}")` : 'none';
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true"
  }, rest, {
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      flex: '0 0 auto',
      backgroundColor: 'currentColor',
      WebkitMaskImage: url,
      maskImage: url,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      ...style
    }
  }));
}
Object.assign(__ds_scope, { ICON_NAMES, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/cards/MediaCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function MediaCard({
  title,
  artist,
  art,
  playing = true,
  liked = false,
  count,
  onToggle,
  style,
  ...rest
}) {
  const ctrl = {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'inline-flex'
  };
  return /*#__PURE__*/React.createElement(__ds_scope.GlassCard, _extends({
    tone: "light",
    padding: "var(--space-3)"
  }, rest, {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'stretch',
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      background: 'var(--umber-500)'
    }
  }, art ? /*#__PURE__*/React.createElement("img", {
    src: art,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, artist)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-circle)',
      background: 'var(--surface-glass-strong)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "speaker",
    size: 13
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: ctrl,
    "aria-label": "Repeat"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "rotate-ccw",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    style: ctrl,
    "aria-label": "Previous"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "rewind",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    style: ctrl,
    "aria-label": playing ? 'Pause' : 'Play',
    onClick: onToggle
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: playing ? 'pause' : 'play',
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    style: ctrl,
    "aria-label": "Next"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "fast-forward",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      ...ctrl,
      color: liked ? 'var(--ember-500)' : 'var(--text-secondary)'
    },
    "aria-label": "Like"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "heart",
    size: 14
  })), count != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-micro)',
      color: 'var(--text-tertiary)'
    }
  }, count) : null)));
}
Object.assign(__ds_scope, { MediaCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/MediaCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/StatTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatTile({
  icon,
  label,
  value,
  meta,
  tone = 'light',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.GlassCard, _extends({
    tone: tone
  }, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 'var(--radius-circle)',
      background: 'var(--surface-glass-strong)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label)',
      color: 'var(--text-primary)'
    }
  }, label), value ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, value) : null, meta ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-micro)',
      color: 'var(--text-tertiary)'
    }
  }, meta) : null));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/controls/SearchField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SearchField({
  placeholder = 'Search devices',
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({}, rest, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: '10px 16px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-glass)',
      border: '1px solid var(--line-glass-soft)',
      backdropFilter: 'var(--glass)',
      WebkitBackdropFilter: 'var(--glass)',
      color: 'var(--text-secondary)',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 16
  }), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    placeholder: placeholder,
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--text-body)',
      color: 'var(--text-primary)'
    }
  }));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/controls/StepperButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StepperButton({
  direction = 'up',
  onClick,
  size = 52,
  label,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label || (direction === 'up' ? 'Increase' : 'Decrease'),
    onClick: onClick
  }, rest, {
    className: "hh-press",
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-circle)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      background: 'var(--grad-glass)',
      border: '1px solid var(--line-glass)',
      color: 'var(--text-primary)',
      backdropFilter: 'var(--glass)',
      WebkitBackdropFilter: 'var(--glass)',
      boxShadow: 'var(--shadow-sm),var(--inner-top)',
      transition: 'transform var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: direction === 'up' ? 'plus' : 'minus',
    size: 22
  }));
}
Object.assign(__ds_scope, { StepperButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/StepperButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  full = false,
  disabled = false,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      font: 'var(--text-label)',
      padding: '8px 14px'
    },
    md: {
      font: 'var(--text-body)',
      padding: '12px 20px'
    },
    lg: {
      font: 'var(--text-heading)',
      padding: '16px 26px'
    }
  };
  const variants = {
    primary: {
      background: 'var(--grad-ember)',
      color: 'var(--accent-on)',
      border: '1px solid rgba(255,246,236,.22)',
      boxShadow: 'var(--shadow-sm),var(--inner-top)'
    },
    glass: {
      background: 'var(--surface-glass)',
      color: 'var(--text-primary)',
      border: '1px solid var(--line-glass)',
      backdropFilter: 'var(--glass)',
      WebkitBackdropFilter: 'var(--glass)',
      boxShadow: 'var(--inner-top)'
    },
    solid: {
      background: 'var(--surface-solid)',
      color: 'var(--text-inverse)',
      border: '1px solid var(--line-solid)',
      boxShadow: 'var(--shadow-sm)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    }
  };
  const s = sizes[size] || sizes.md,
    v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled
  }, rest, {
    className: "hh-press",
    style: {
      display: full ? 'flex' : 'inline-flex',
      width: full ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-3)',
      borderRadius: 'var(--radius-pill)',
      font: s.font,
      padding: s.padding,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      transition: 'transform var(--dur-fast) var(--ease-standard),filter var(--dur-fast) var(--ease-standard)',
      ...v,
      ...style
    }
  }), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 15 : 18
  }) : null, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Chip({
  children,
  selected = false,
  icon,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick
  }, rest, {
    className: "hh-press",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--pad-pill)',
      borderRadius: 'var(--radius-pill)',
      font: 'var(--text-label)',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      transition: 'background var(--dur-base) var(--ease-standard),color var(--dur-base) var(--ease-standard)',
      background: selected ? 'var(--surface-solid)' : 'var(--surface-glass)',
      color: selected ? 'var(--text-inverse)' : 'var(--text-secondary)',
      border: selected ? '1px solid transparent' : '1px solid var(--line-glass-soft)',
      backdropFilter: selected ? undefined : 'var(--glass)',
      WebkitBackdropFilter: selected ? undefined : 'var(--glass)',
      boxShadow: selected ? 'var(--shadow-sm)' : 'none',
      ...style
    }
  }), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  }) : null, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  size = 40,
  tone = 'glass',
  active = false,
  label,
  onClick,
  style,
  ...rest
}) {
  const tones = {
    glass: {
      background: 'var(--surface-glass)',
      border: '1px solid var(--line-glass)',
      color: 'var(--text-primary)'
    },
    solid: {
      background: 'var(--surface-solid)',
      border: '1px solid var(--line-solid)',
      color: 'var(--text-inverse)'
    },
    ember: {
      background: 'var(--grad-ember)',
      border: '1px solid rgba(255,246,236,.25)',
      color: 'var(--accent-on)'
    }
  };
  const t = tones[tone] || tones.glass;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    onClick: onClick
  }, rest, {
    className: "hh-press",
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-circle)',
      cursor: 'pointer',
      backdropFilter: tone === 'glass' ? 'var(--glass)' : undefined,
      WebkitBackdropFilter: tone === 'glass' ? 'var(--glass)' : undefined,
      boxShadow: active ? 'var(--glow-soft)' : 'var(--inner-top)',
      transition: 'transform var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard),box-shadow var(--dur-base) var(--ease-standard)',
      ...t,
      ...(active ? {
        color: 'var(--glow-500)'
      } : null),
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.45)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionLabel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionLabel({
  children,
  action,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      font: 'var(--text-body)',
      color: 'var(--text-secondary)',
      margin: '0 0 var(--space-4)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", null, children), action ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, action) : null);
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// components/core/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SegmentedControl({
  options,
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist"
  }, rest, {
    style: {
      display: 'inline-flex',
      gap: 'var(--space-1)',
      padding: '4px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-glass-dim)',
      border: '1px solid var(--line-glass-soft)',
      backdropFilter: 'var(--glass)',
      WebkitBackdropFilter: 'var(--glass)',
      ...style
    }
  }), options.map(o => {
    const v = typeof o === 'string' ? o : o.value,
      l = typeof o === 'string' ? o : o.label,
      on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": on,
      onClick: () => onChange && onChange(v),
      style: {
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-pill)',
        padding: '7px 16px',
        font: 'var(--text-label)',
        transition: 'background var(--dur-base) var(--ease-standard),color var(--dur-base) var(--ease-standard)',
        background: on ? 'var(--surface-solid)' : 'transparent',
        color: on ? 'var(--text-inverse)' : 'var(--text-secondary)',
        boxShadow: on ? 'var(--shadow-sm)' : 'none'
      }
    }, l);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PhoneFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PhoneFrame({
  backdrop,
  children,
  width = 340,
  height = 690,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      position: 'relative',
      width,
      height,
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      border: '1px solid var(--line-glass-soft)',
      boxShadow: 'var(--shadow-lg)',
      isolation: 'isolate',
      ...style
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: backdrop,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(20,12,7,.34)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, children));
}
Object.assign(__ds_scope, { PhoneFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ScreenHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ScreenHeader({
  onBack,
  left,
  center,
  right,
  title,
  subtitle,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-7)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, onBack ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "arrow-left",
    label: "Back",
    size: 38,
    onClick: onBack
  }) : left), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center'
    }
  }, center), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, right)), title ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display)',
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--text-primary)'
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)',
      marginTop: 'var(--space-1)'
    }
  }, subtitle) : null) : null);
}
Object.assign(__ds_scope, { ScreenHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ScreenHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TabBar({
  items,
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({}, rest, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 'var(--space-3)',
      padding: 'var(--inset-tabbar) var(--space-6)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-glass)',
      border: '1px solid var(--line-glass-soft)',
      backdropFilter: 'var(--glass-heavy)',
      WebkitBackdropFilter: 'var(--glass-heavy)',
      boxShadow: 'var(--shadow-md),var(--inner-top)',
      ...style
    }
  }), items.map(it => {
    const on = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      "aria-label": it.label,
      "aria-current": on,
      onClick: () => onChange && onChange(it.value),
      style: {
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'inline-flex',
        color: on ? 'var(--glow-500)' : 'var(--text-tertiary)',
        filter: on ? 'drop-shadow(0 0 10px rgba(246,225,66,.7))' : 'none',
        transition: 'color var(--dur-base) var(--ease-standard),filter var(--dur-base) var(--ease-standard)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 21
    }));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/booking-app/data.js
try { (() => {
const SHOP = {
  name: 'Barber Room',
  city: 'Prievidza',
  rating: 4.9,
  reviews: 212
};
const SERVICES = [{
  id: 'fade',
  name: 'Fade strih',
  price: 18,
  mins: 45,
  icon: 'scissors'
}, {
  id: 'klasik',
  name: 'Klasický strih',
  price: 15,
  mins: 30,
  icon: 'scissors'
}, {
  id: 'brada',
  name: 'Úprava brady',
  price: 12,
  mins: 30,
  icon: 'user'
}, {
  id: 'komplet',
  name: 'Strih + brada',
  price: 26,
  mins: 60,
  icon: 'sparkles'
}, {
  id: 'holenie',
  name: 'Mokré holenie',
  price: 20,
  mins: 45,
  icon: 'sparkles'
}];
const BARBERS = [{
  id: 'tomas',
  name: 'Tomáš',
  chair: 'Kreslo 1'
}, {
  id: 'marek',
  name: 'Marek',
  chair: 'Kreslo 2'
}, {
  id: 'dano',
  name: 'Dano',
  chair: 'Kreslo 3'
}];
const SLOTS = ['09:00', '09:45', '10:30', '11:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45'];
const TAKEN = ['10:30', '13:45', '16:00'];
const DAYS = [{
  d: 'Ut',
  n: 12
}, {
  d: 'St',
  n: 13
}, {
  d: 'Št',
  n: 14
}, {
  d: 'Pi',
  n: 15
}, {
  d: 'So',
  n: 16
}, {
  d: 'Ne',
  n: 17
}];
const AGENDA = [{
  t: '09:00',
  len: 45,
  client: 'Peter Krajčí',
  svc: 'Fade strih',
  price: 18,
  state: 'done'
}, {
  t: '09:45',
  len: 30,
  client: 'Martin Baláž',
  svc: 'Úprava brady',
  price: 12,
  state: 'done'
}, {
  t: '10:30',
  len: 60,
  client: 'Jozef Uhrík',
  svc: 'Strih + brada',
  price: 26,
  state: 'now'
}, {
  t: '13:00',
  len: 45,
  client: 'Adam Šimko',
  svc: 'Fade strih',
  price: 18,
  state: 'next'
}, {
  t: '14:30',
  len: 30,
  client: 'Lukáš Repka',
  svc: 'Klasický strih',
  price: 15,
  state: 'next'
}, {
  t: '16:45',
  len: 45,
  client: 'Voľné',
  svc: '—',
  price: 0,
  state: 'free'
}];
const CHAIRS = [{
  name: 'Tomáš',
  chair: 'Kreslo 1',
  today: 6,
  week: 1240,
  util: 88,
  active: true
}, {
  name: 'Marek',
  chair: 'Kreslo 2',
  today: 4,
  week: 910,
  util: 64,
  active: true
}, {
  name: 'Dano',
  chair: 'Kreslo 3',
  today: 0,
  week: 0,
  util: 0,
  active: false
}];
const CHAT = [{
  from: 'bot',
  text: 'Dobrý deň! Som asistent, ktorý pripraví podklady pre váš web a rezervačnú appku. Začneme jednoducho — ako sa prevádzka volá a kde ste?'
}, {
  from: 'me',
  text: 'Barber Room, Prievidza. Robíme tretí rok.'
}, {
  from: 'bot',
  text: 'Pekné, tri roky už niečo znamenajú. Ste sám, alebo máte viac kresiel?'
}, {
  from: 'me',
  text: 'Tri kreslá, dvaja chalani mi platia nájom.'
}, {
  from: 'bot',
  text: 'To je dôležité — každý bude mať vlastný kalendár a klientelu, aby sa vám termíny neprekrývali. Poďme na služby: čo najčastejšie robíte a za koľko?'
}];
Object.assign(__ds_scope, { SHOP, SERVICES, BARBERS, SLOTS, TAKEN, DAYS, AGENDA, CHAIRS, CHAT });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/booking-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/booking-app/BookingScreen.jsx
try { (() => {
function BookingScreen() {
  const [step, setStep] = React.useState(0);
  const [svc, setSvc] = React.useState('fade');
  const [barber, setBarber] = React.useState('tomas');
  const [day, setDay] = React.useState(13);
  const [slot, setSlot] = React.useState('13:00');
  const S = __ds_scope.SERVICES.find(s => s.id === svc),
    B = __ds_scope.BARBERS.find(b => b.id === barber);
  const Steps = () => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-4)'
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: 3,
      flex: 1,
      borderRadius: 2,
      background: i <= step ? 'var(--ember-500)' : 'var(--line-glass-soft)',
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  })));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px var(--gutter-screen) 0'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ScreenHeader, {
    onBack: step ? () => setStep(step - 1) : undefined,
    left: !step ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38
      }
    }) : undefined,
    right: /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
      icon: "user",
      label: "Profil",
      size: 38
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display)',
      letterSpacing: 'var(--tracking-display)'
    }
  }, ['Vyberte službu', 'Termín', 'Potvrdenie'][step]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)',
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 12
  }), __ds_scope.SHOP.name, " \xB7 ", __ds_scope.SHOP.city, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "star",
    size: 12,
    style: {
      marginLeft: 6,
      color: 'var(--glow-500)'
    }
  }), __ds_scope.SHOP.rating)), /*#__PURE__*/React.createElement(Steps, null)), /*#__PURE__*/React.createElement("div", {
    className: "hh-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 var(--gutter-screen)',
      paddingTop: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-card)'
    }
  }, step === 0 && __ds_scope.SERVICES.map(s => {
    const on = s.id === svc;
    return /*#__PURE__*/React.createElement(__ds_scope.GlassCard, {
      key: s.id,
      tone: on ? 'light' : 'dim',
      padding: "var(--space-4)",
      glow: on,
      onClick: () => setSvc(s.id),
      style: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        border: on ? '1px solid var(--ember-400)' : undefined
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38,
        height: 38,
        flex: '0 0 auto',
        borderRadius: 'var(--radius-circle)',
        background: on ? 'var(--grad-ember)' : 'var(--surface-glass-strong)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: on ? 'var(--accent-on)' : 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: s.icon,
      size: 17
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-label)'
      }
    }, s.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--text-tertiary)'
      }
    }, s.mins, " min")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-semibold) 17px/1 var(--font-core)'
      }
    }, s.price, " \u20AC"));
  }), step === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, {
    style: {
      margin: 0
    }
  }, "Holi\u010D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, __ds_scope.BARBERS.map(b => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: b.id,
    selected: b.id === barber,
    onClick: () => setBarber(b.id)
  }, b.name))), /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, {
    style: {
      margin: 'var(--space-3) 0 0'
    }
  }, "De\u0148"), /*#__PURE__*/React.createElement("div", {
    className: "hh-scroll",
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      overflowX: 'auto'
    }
  }, __ds_scope.DAYS.map(d => {
    const on = d.n === day;
    return /*#__PURE__*/React.createElement("button", {
      key: d.n,
      onClick: () => setDay(d.n),
      style: {
        flex: '0 0 auto',
        width: 52,
        padding: '10px 0',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        border: '1px solid ' + (on ? 'transparent' : 'var(--line-glass-soft)'),
        background: on ? 'var(--surface-solid)' : 'var(--surface-glass)',
        color: on ? 'var(--text-inverse)' : 'var(--text-secondary)',
        font: 'var(--text-caption)'
      }
    }, d.d, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-semibold) 17px/1.3 var(--font-core)'
      }
    }, d.n));
  })), /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, {
    style: {
      margin: 'var(--space-3) 0 0'
    },
    action: "skuto\u010Dn\xE1 dostupnos\u0165"
  }, "\u010Cas"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--space-3)'
    }
  }, __ds_scope.SLOTS.map(t => {
    const busy = __ds_scope.TAKEN.includes(t),
      on = t === slot;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      disabled: busy,
      onClick: () => setSlot(t),
      style: {
        padding: '10px 0',
        borderRadius: 'var(--radius-sm)',
        cursor: busy ? 'not-allowed' : 'pointer',
        font: 'var(--text-label)',
        border: '1px solid ' + (on ? 'transparent' : 'var(--line-glass-soft)'),
        background: on ? 'var(--grad-ember)' : 'var(--surface-glass)',
        color: on ? 'var(--accent-on)' : 'var(--text-secondary)',
        opacity: busy ? .3 : 1,
        textDecoration: busy ? 'line-through' : 'none'
      }
    }, t);
  }))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.GlassCard, {
    tone: "solid",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      color: 'var(--ember-600)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-check-big",
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-label)'
    }
  }, "Term\xEDn je rezervovan\xFD")), [['Služba', S.name], ['Holič', B.name + ' · ' + B.chair], ['Kedy', 'štvrtok ' + day + '. 8. o ' + slot], ['Trvanie', S.mins + ' min']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      font: 'var(--text-body)',
      color: 'var(--text-inverse-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-inverse)',
      textAlign: 'right'
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--line-solid)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: 'var(--weight-semibold) 20px/1 var(--font-core)',
      color: 'var(--text-inverse)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Spolu"), /*#__PURE__*/React.createElement("span", null, S.price, " \u20AC"))), /*#__PURE__*/React.createElement(__ds_scope.GlassCard, {
    tone: "dim",
    padding: "var(--space-4)",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "bell-ring",
    size: 17,
    style: {
      color: 'var(--glow-400)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      font: 'var(--text-caption)',
      color: 'var(--text-secondary)'
    }
  }, "Pripomienka 2 hodiny vopred"), /*#__PURE__*/React.createElement(__ds_scope.Switch, {
    checked: true,
    size: "sm",
    label: "Pripomienka"
  })), /*#__PURE__*/React.createElement(__ds_scope.GlassCard, {
    tone: "dim",
    padding: "var(--space-4)",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "calendar-check",
    size: 17,
    style: {
      color: 'var(--glow-400)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      font: 'var(--text-caption)',
      color: 'var(--text-secondary)'
    }
  }, "Prida\u0165 do kalend\xE1ra"), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 96
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen)',
      paddingBottom: 'var(--gutter-screen)'
    }
  }, step < 2 ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "lg",
    full: true,
    onClick: () => setStep(step + 1)
  }, step === 0 ? S.name + ' · ' + S.price + ' €' : 'Potvrdiť ' + slot) : /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "glass",
    size: "lg",
    full: true,
    onClick: () => setStep(0)
  }, "Hotovo")));
}
Object.assign(__ds_scope, { BookingScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/booking-app/BookingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/booking-app/ChairsScreen.jsx
try { (() => {
const TABS = [{
  value: 'day',
  icon: 'calendar',
  label: 'Deň'
}, {
  value: 'clients',
  icon: 'users',
  label: 'Klienti'
}, {
  value: 'money',
  icon: 'banknote',
  label: 'Tržby'
}, {
  value: 'set',
  icon: 'settings',
  label: 'Nastavenia'
}];
function ChairsScreen() {
  const [rows, setRows] = React.useState(__ds_scope.CHAIRS);
  const toggle = i => setRows(r => r.map((x, j) => j === i ? {
    ...x,
    active: !x.active
  } : x));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px var(--gutter-screen) 0'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ScreenHeader, {
    onBack: () => {},
    right: /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
      icon: "plus",
      tone: "ember",
      label: "Prida\u0165 kreslo",
      size: 38
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display)',
      letterSpacing: 'var(--tracking-display)'
    }
  }, "Kresl\xE1"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)',
      marginTop: 2
    }
  }, "Ka\u017Ed\xFD m\xE1 vlastn\xFD kalend\xE1r aj klientelu"))), /*#__PURE__*/React.createElement("div", {
    className: "hh-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 var(--gutter-screen)',
      paddingTop: 'var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-card)'
    }
  }, rows.map((c, i) => /*#__PURE__*/React.createElement(__ds_scope.GlassCard, {
    key: c.chair,
    tone: c.active ? 'light' : 'dim',
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      opacity: c.active ? 1 : .6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: c.name,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label)'
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "armchair",
    size: 12
  }), c.chair)), /*#__PURE__*/React.createElement(__ds_scope.Switch, {
    checked: c.active,
    onChange: () => toggle(i),
    size: "sm",
    label: c.name
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, [[c.today, 'dnes'], [c.week + ' €', 'tento týždeň'], [c.util + ' %', 'obsadenosť']].map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      flex: 1,
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-glass-dim)',
      border: '1px solid var(--line-glass-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-medium) 15px/1.2 var(--font-core)'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-micro)',
      color: 'var(--text-tertiary)'
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      borderRadius: 3,
      background: 'var(--line-glass-soft)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: c.util + '%',
      height: '100%',
      borderRadius: 3,
      background: 'var(--grad-ember)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })))), /*#__PURE__*/React.createElement(__ds_scope.GlassCard, {
    tone: "dim",
    padding: "var(--space-4)",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "users",
    size: 17,
    style: {
      color: 'var(--ember-300)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      font: 'var(--text-caption)',
      color: 'var(--text-secondary)'
    }
  }, "Kalend\xE1re sa neprekr\xFDvaj\xFA \u2014 ka\u017Ed\xFD vid\xED len svoje term\xEDny")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 96
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen)',
      paddingBottom: 'var(--gutter-screen)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.TabBar, {
    items: TABS,
    value: "set"
  })));
}
Object.assign(__ds_scope, { ChairsScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/booking-app/ChairsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/booking-app/DiscoveryScreen.jsx
try { (() => {
function DiscoveryScreen() {
  const [msgs] = React.useState(__ds_scope.CHAT);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px var(--gutter-screen) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ScreenHeader, {
    onBack: () => {},
    right: /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
      icon: "x",
      label: "Zavrie\u0165",
      size: 38
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-circle)',
      background: 'var(--grad-ember)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--accent-on)',
      boxShadow: 'var(--glow-ember)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "bot",
    size: 21
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-title)'
    }
  }, "\xDAvodn\xFD rozhovor"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--glow-500)',
      boxShadow: 'var(--glow-soft)'
    }
  }), "5 min\xFAt, \u017Eiadny formul\xE1r")))), /*#__PURE__*/React.createElement("div", {
    className: "hh-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 var(--gutter-screen)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, msgs.map((m, i) => {
    const me = m.from === 'me';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: me ? 'flex-end' : 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: '82%',
        padding: '11px 15px',
        font: 'var(--text-body)',
        lineHeight: 1.5,
        borderRadius: me ? 'var(--radius-md) var(--radius-md) 4px var(--radius-md)' : 'var(--radius-md) var(--radius-md) var(--radius-md) 4px',
        background: me ? 'var(--grad-ember)' : 'var(--grad-glass)',
        color: me ? 'var(--accent-on)' : 'var(--text-primary)',
        border: me ? 'none' : '1px solid var(--line-glass)',
        backdropFilter: me ? undefined : 'var(--glass)',
        WebkitBackdropFilter: me ? undefined : 'var(--glass)',
        boxShadow: me ? 'var(--shadow-sm)' : 'var(--inner-top)'
      }
    }, m.text));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      marginTop: 'var(--space-1)'
    }
  }, ['Fade, klasika, brada', 'Pošlem cenník', 'Nie sme si istí'].map(s => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: s
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen)',
      paddingBottom: 'var(--gutter-screen)',
      paddingTop: 'var(--space-4)',
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: '12px 16px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-glass)',
      border: '1px solid var(--line-glass-soft)',
      backdropFilter: 'var(--glass)',
      WebkitBackdropFilter: 'var(--glass)',
      font: 'var(--text-body)',
      color: 'var(--text-tertiary)'
    }
  }, "Nap\xED\u0161te odpove\u010F\u2026"), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "send",
    tone: "ember",
    label: "Odosla\u0165",
    size: 46
  })));
}
Object.assign(__ds_scope, { DiscoveryScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/booking-app/DiscoveryScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/booking-app/OwnerScreen.jsx
try { (() => {
const TABS = [{
  value: 'day',
  icon: 'calendar',
  label: 'Deň'
}, {
  value: 'clients',
  icon: 'users',
  label: 'Klienti'
}, {
  value: 'money',
  icon: 'banknote',
  label: 'Tržby'
}, {
  value: 'set',
  icon: 'settings',
  label: 'Nastavenia'
}];
function OwnerScreen() {
  const [view, setView] = React.useState('Dnes');
  const STATE = {
    done: {
      c: 'var(--text-tertiary)',
      l: 'Hotovo'
    },
    now: {
      c: 'var(--glow-500)',
      l: 'Práve teraz'
    },
    next: {
      c: 'var(--ember-400)',
      l: 'Čaká'
    },
    free: {
      c: 'var(--text-tertiary)',
      l: 'Voľné'
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px var(--gutter-screen) 0'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ScreenHeader, {
    left: /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
      icon: "menu",
      label: "Menu",
      size: 38
    }),
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
      icon: "bell",
      label: "Upozornenia",
      size: 38
    }), /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
      name: "Tom\xE1\u0161 Hric"
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display)',
      letterSpacing: 'var(--tracking-display)'
    }
  }, "\u0160tvrtok"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, "14. augusta \xB7 Kreslo 1")), /*#__PURE__*/React.createElement(__ds_scope.SegmentedControl, {
    options: ['Dnes', 'Týždeň'],
    value: view,
    onChange: setView
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--gap-card)',
      marginTop: 'var(--space-5)'
    }
  }, [['5', 'termínov', 'calendar'], ['89 €', 'dnes', 'banknote'], ['92 %', 'obsadenosť', 'trending-up']].map(([v, l, ic]) => /*#__PURE__*/React.createElement(__ds_scope.GlassCard, {
    key: l,
    tone: "light",
    padding: "var(--space-4)"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 15,
    style: {
      color: 'var(--ember-300)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) 21px/1.2 var(--font-core)',
      marginTop: 6
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-micro)',
      color: 'var(--text-tertiary)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    className: "hh-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 var(--gutter-screen)',
      paddingTop: 'var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, {
    style: {
      margin: 0
    },
    action: "synchronizovan\xE9"
  }, "Rozvrh d\u0148a"), __ds_scope.AGENDA.map(a => {
    const st = STATE[a.state],
      free = a.state === 'free';
    return /*#__PURE__*/React.createElement("div", {
      key: a.t,
      style: {
        display: 'flex',
        gap: 'var(--space-4)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        flex: '0 0 auto',
        paddingTop: 14,
        font: 'var(--text-caption)',
        color: 'var(--text-tertiary)'
      }
    }, a.t), /*#__PURE__*/React.createElement(__ds_scope.GlassCard, {
      tone: a.state === 'now' ? 'light' : 'dim',
      padding: "var(--space-4)",
      glow: a.state === 'now',
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        opacity: free ? .55 : 1,
        borderLeft: '2px solid ' + st.c
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-label)',
        color: free ? 'var(--text-tertiary)' : 'var(--text-primary)'
      }
    }, a.client), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--text-tertiary)'
      }
    }, a.svc, " \xB7 ", a.len, " min")), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, a.price ? /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-medium) 15px/1 var(--font-core)'
      }
    }, a.price, " \u20AC") : null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-micro)',
        color: st.c,
        marginTop: 3
      }
    }, st.l))));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 96
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen)',
      paddingBottom: 'var(--gutter-screen)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.TabBar, {
    items: TABS,
    value: "day"
  })));
}
Object.assign(__ds_scope, { OwnerScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/booking-app/OwnerScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/halo-home-app/LightScreen.jsx
try { (() => {
const A = '../../assets/';
function LightScreen({
  nav
}) {
  const [brightness, setBrightness] = React.useState(64);
  const [device, setDevice] = React.useState('Device 1');
  const [hue, setHue] = React.useState('var(--bulb-yellow)');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px var(--gutter-screen) 0'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ScreenHeader, {
    onBack: () => nav('home'),
    center: /*#__PURE__*/React.createElement(__ds_scope.SegmentedControl, {
      options: ['Device 1', 'Device 2'],
      value: device,
      onChange: setDevice
    }),
    right: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38
      }
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display)',
      letterSpacing: 'var(--tracking-display)',
      textAlign: 'center',
      marginTop: 'var(--space-6)'
    }
  }, "Smart Light")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'device-pendant-lamp.jpg',
    alt: "Pendant lamp",
    style: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 172,
      height: 190,
      objectFit: 'cover',
      objectPosition: 'center 40%',
      opacity: brightness / 100 * .55 + .45,
      WebkitMaskImage: 'radial-gradient(ellipse 60% 62% at 50% 42%,#000 42%,transparent 78%)',
      maskImage: 'radial-gradient(ellipse 60% 62% at 50% 42%,#000 42%,transparent 78%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 104,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 260,
      height: 200,
      borderRadius: '50%',
      opacity: brightness / 100,
      background: 'radial-gradient(ellipse at top,' + hue + ' 0%,transparent 62%)',
      filter: 'blur(26px)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.ArcSlider, {
    value: brightness,
    onChange: setBrightness,
    size: 276,
    caption: "Brightness"
  }), /*#__PURE__*/React.createElement(__ds_scope.ColorSwatchPicker, {
    value: hue,
    onChange: setHue,
    style: {
      marginTop: 'var(--space-7)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen) var(--gutter-screen)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.TabBar, {
    items: TABS,
    value: "light",
    onChange: v => nav(v)
  })));
}
const TABS = [{
  value: 'home',
  icon: 'house',
  label: 'Home'
}, {
  value: 'light',
  icon: 'lightbulb',
  label: 'Lights'
}, {
  value: 'temp',
  icon: 'thermometer',
  label: 'Climate'
}, {
  value: 'settings',
  icon: 'settings',
  label: 'Settings'
}];
Object.assign(__ds_scope, { LightScreen, TABS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/halo-home-app/LightScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/halo-home-app/ClimateScreen.jsx
try { (() => {
function ClimateScreen({
  nav
}) {
  const [goal, setGoal] = React.useState(24);
  const [room, setRoom] = React.useState('Living room');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px var(--gutter-screen) 0'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ScreenHeader, {
    onBack: () => nav('home'),
    center: /*#__PURE__*/React.createElement(__ds_scope.SegmentedControl, {
      options: ['Living room', 'Bedroom'],
      value: room,
      onChange: setRoom
    }),
    right: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38
      }
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display)',
      letterSpacing: 'var(--tracking-display)',
      textAlign: 'center',
      marginTop: 'var(--space-6)'
    }
  }, "Home Temperature")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-7)',
      padding: '0 var(--gutter-screen)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 8,
      top: '42%',
      font: 'var(--text-caption)',
      color: 'var(--text-secondary)'
    }
  }, "10\xB0C \u2212"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 8,
      top: '42%',
      font: 'var(--text-caption)',
      color: 'var(--text-secondary)'
    }
  }, "\u2212 30\xB0C"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 22,
      top: '14%',
      font: 'var(--text-caption)',
      color: 'var(--text-secondary)',
      textAlign: 'center'
    }
  }, "15\xB0C", /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-micro)',
      color: 'var(--text-tertiary)'
    }
  }, "Now")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 56,
      top: '2%',
      font: 'var(--text-caption)',
      color: 'var(--text-secondary)'
    }
  }, "20\xB0C"), /*#__PURE__*/React.createElement(__ds_scope.TemperatureDial, {
    value: goal,
    now: 15,
    min: 10,
    max: 30,
    size: 216
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StepperButton, {
    direction: "down",
    onClick: () => setGoal(g => Math.max(10, g - 1))
  }), /*#__PURE__*/React.createElement(__ds_scope.StepperButton, {
    direction: "up",
    onClick: () => setGoal(g => Math.min(30, g + 1))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, null, "Secudule from:"), /*#__PURE__*/React.createElement(__ds_scope.TimeRangeField, {
    from: "15:00",
    to: "22:00"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen) var(--gutter-screen)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.TabBar, {
    items: __ds_scope.TABS,
    value: "temp",
    onChange: v => nav(v)
  })));
}
Object.assign(__ds_scope, { ClimateScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/halo-home-app/ClimateScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/halo-home-app/HomeScreen.jsx
try { (() => {
const A = '../../assets/';
function HomeScreen({
  nav
}) {
  const [room, setRoom] = React.useState('Living Room');
  const [playing, setPlaying] = React.useState(true);
  const [lightOn, setLightOn] = React.useState(true);
  const [alarmOn, setAlarmOn] = React.useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px var(--gutter-screen) 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ScreenHeader, {
    left: /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
      icon: "menu",
      label: "Menu",
      size: 38
    }),
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
      icon: "bell",
      label: "Alerts",
      size: 38
    }), /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
      name: "Robbie Hale"
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display)',
      letterSpacing: 'var(--tracking-display)'
    }
  }, "Hi Robbie"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, "Welcome Home")), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "search",
    label: "Search",
    size: 34,
    tone: "glass",
    style: {
      background: 'transparent',
      border: 'none',
      boxShadow: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "hh-scroll",
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      overflowX: 'auto',
      paddingBottom: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    icon: "plus",
    "aria-label": "Add room"
  }), ['Living Room', 'Kitchen', 'Bedroom'].map(r => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: r,
    selected: r === room,
    onClick: () => setRoom(r)
  }, r)))), /*#__PURE__*/React.createElement("div", {
    className: "hh-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 'var(--space-5) var(--gutter-screen) 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-card)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.MediaCard, {
    title: "People Are People",
    artist: "Depeche Mode",
    art: A + 'scene-room-evening.jpg',
    count: 124,
    playing: playing,
    onToggle: () => setPlaying(!playing)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridAutoRows: 'minmax(158px,auto)',
      gap: 'var(--gap-card)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.DeviceTile, {
    name: "Smart Light",
    status: 'Brightness 64%',
    image: A + 'device-smart-light.jpg',
    on: lightOn,
    onToggle: () => setLightOn(!lightOn),
    height: 158,
    style: {
      cursor: 'pointer'
    },
    onClick: () => nav('light')
  }), /*#__PURE__*/React.createElement(__ds_scope.AlarmCard, {
    time: "07:00",
    meta: "Work",
    on: alarmOn,
    onToggle: setAlarmOn
  }), /*#__PURE__*/React.createElement(__ds_scope.StatTile, {
    icon: "wifi",
    label: "Wi-Fi",
    value: "RTAA56-728890"
  }), /*#__PURE__*/React.createElement(__ds_scope.ClimateTile, {
    value: 24,
    label: "Home",
    on: true,
    style: {
      cursor: 'pointer'
    },
    onClick: () => nav('temp')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 88
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen) var(--gutter-screen)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.TabBar, {
    items: __ds_scope.TABS,
    value: "home",
    onChange: v => nav(v)
  })));
}
Object.assign(__ds_scope, { HomeScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/halo-home-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/halo-home-app/SettingsScreen.jsx
try { (() => {
function SettingsScreen({
  nav
}) {
  const [rows, setRows] = React.useState({
    away: false,
    voice: true,
    adapt: true
  });
  const set = k => v => setRows(r => ({
    ...r,
    [k]: v
  }));
  const Row = ({
    icon,
    label,
    meta,
    k
  }) => /*#__PURE__*/React.createElement(__ds_scope.GlassCard, {
    tone: "light",
    padding: "var(--space-4)",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-circle)',
      background: 'var(--surface-glass-strong)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-label)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, meta)), /*#__PURE__*/React.createElement(__ds_scope.Switch, {
    checked: rows[k],
    onChange: set(k),
    size: "sm",
    label: label
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px var(--gutter-screen) 0'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ScreenHeader, {
    onBack: () => nav('home'),
    right: /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
      name: "Robbie Hale"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-display)',
      letterSpacing: 'var(--tracking-display)',
      marginTop: 'var(--space-6)'
    }
  }, "Settings")), /*#__PURE__*/React.createElement("div", {
    className: "hh-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 'var(--space-6) var(--gutter-screen) 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-card)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, {
    style: {
      margin: 0
    }
  }, "Household"), /*#__PURE__*/React.createElement(Row, {
    icon: "house",
    label: "Away mode",
    meta: "Pause all schedules",
    k: "away"
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "speaker",
    label: "Voice control",
    meta: "Hub \xB7 Living Room",
    k: "voice"
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "lightbulb",
    label: "Adaptive lighting",
    meta: "Follows sunset",
    k: "adapt"
  }), /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, {
    style: {
      margin: 'var(--space-3) 0 0'
    }
  }, "Hub"), /*#__PURE__*/React.createElement(__ds_scope.StatTile, {
    icon: "wifi",
    label: "Halo Hub",
    value: "RTAA56-728890",
    meta: "Firmware 4.2.1 \xB7 up to date"
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "glass",
    full: true
  }, "Add a device"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 88
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen) var(--gutter-screen)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.TabBar, {
    items: __ds_scope.TABS,
    value: "settings",
    onChange: v => nav(v)
  })));
}
Object.assign(__ds_scope, { SettingsScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/halo-home-app/SettingsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/halo-home-app/App.jsx
try { (() => {
const SCREENS = {
  home: __ds_scope.HomeScreen,
  light: __ds_scope.LightScreen,
  temp: __ds_scope.ClimateScreen,
  settings: __ds_scope.SettingsScreen
};
function App({
  start = 'home',
  backdrop = '../../assets/backdrop-room-warm.jpg'
}) {
  const [screen, setScreen] = React.useState(start);
  const S = SCREENS[screen] || __ds_scope.HomeScreen;
  return /*#__PURE__*/React.createElement(__ds_scope.PhoneFrame, {
    backdrop: backdrop
  }, /*#__PURE__*/React.createElement(S, {
    nav: setScreen
  }));
}
Object.assign(__ds_scope, { App });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/halo-home-app/App.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AlarmCard = __ds_scope.AlarmCard;

__ds_ns.ClimateTile = __ds_scope.ClimateTile;

__ds_ns.DeviceTile = __ds_scope.DeviceTile;

__ds_ns.MediaCard = __ds_scope.MediaCard;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.ArcSlider = __ds_scope.ArcSlider;

__ds_ns.ColorSwatchPicker = __ds_scope.ColorSwatchPicker;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.StepperButton = __ds_scope.StepperButton;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TemperatureDial = __ds_scope.TemperatureDial;

__ds_ns.TimeRangeField = __ds_scope.TimeRangeField;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.GlassCard = __ds_scope.GlassCard;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.PhoneFrame = __ds_scope.PhoneFrame;

__ds_ns.ScreenHeader = __ds_scope.ScreenHeader;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.BookingScreen = __ds_scope.BookingScreen;

__ds_ns.ChairsScreen = __ds_scope.ChairsScreen;

__ds_ns.DiscoveryScreen = __ds_scope.DiscoveryScreen;

__ds_ns.OwnerScreen = __ds_scope.OwnerScreen;

__ds_ns.SHOP = __ds_scope.SHOP;

__ds_ns.SERVICES = __ds_scope.SERVICES;

__ds_ns.BARBERS = __ds_scope.BARBERS;

__ds_ns.SLOTS = __ds_scope.SLOTS;

__ds_ns.TAKEN = __ds_scope.TAKEN;

__ds_ns.DAYS = __ds_scope.DAYS;

__ds_ns.AGENDA = __ds_scope.AGENDA;

__ds_ns.CHAIRS = __ds_scope.CHAIRS;

__ds_ns.CHAT = __ds_scope.CHAT;

__ds_ns.App = __ds_scope.App;

__ds_ns.ClimateScreen = __ds_scope.ClimateScreen;

__ds_ns.HomeScreen = __ds_scope.HomeScreen;

__ds_ns.LightScreen = __ds_scope.LightScreen;

__ds_ns.TABS = __ds_scope.TABS;

__ds_ns.SettingsScreen = __ds_scope.SettingsScreen;

})();
