import React from 'react';
import { GlassCard } from '../components/core/GlassCard.jsx';
import { IconButton } from '../components/core/IconButton.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { Avatar } from '../components/core/Avatar.jsx';
import { SectionLabel } from '../components/core/SectionLabel.jsx';
import { ScreenHeader } from '../components/navigation/ScreenHeader.jsx';
import { SALON, WORKING_HOURS, getService, getAddon } from '../data/salon.js';
import {
  dayKey, shortDayName, longDayName, nextDays, toMinutes, toTime, fromDayKey,
} from '../lib/schedule.js';
import { plural } from '../lib/text.js';
import { useSalon } from '../state/SalonContext.jsx';

/* Stav termínu voči aktuálnemu času. Pri inom než dnešnom dni nemá zmysel
 * hlásiť "práve teraz", preto sa počíta len pre dnešok. */
function stateOf(booking, key, now) {
  if (key !== dayKey(now)) return key < dayKey(now) ? 'done' : 'next';
  const start = toMinutes(booking.time);
  const end = start + booking.mins;
  const cur = now.getHours() * 60 + now.getMinutes();
  if (cur >= end) return 'done';
  if (cur >= start) return 'now';
  return 'next';
}

const STATE_STYLE = {
  done: { color: 'var(--text-tertiary)', label: 'Hotovo' },
  now: { color: 'var(--glow-500)', label: 'Práve teraz' },
  next: { color: 'var(--ember-400)', label: 'Čaká' },
};

export function DayScreen() {
  const { dayAgenda } = useSalon();
  const now = new Date();
  const [day, setDay] = React.useState(() => dayKey(now));

  const days = React.useMemo(() => nextDays(14), []);
  const agenda = dayAgenda(day);

  const bookedMins = agenda.reduce((sum, b) => sum + b.mins, 0);
  const revenue = agenda.reduce((sum, b) => sum + b.price, 0);
  const windowMins = toMinutes(WORKING_HOURS.end) - toMinutes(WORKING_HOURS.start);
  const utilisation = windowMins > 0 ? Math.round((bookedMins / windowMins) * 100) : 0;

  const date = fromDayKey(day);

  return (
    <>
      <div style={{ padding: '22px var(--gutter-screen) 0' }}>
        <ScreenHeader
          left={<IconButton icon="menu" label="Menu" size={38} />}
          right={
            <>
              <IconButton icon="bell" label="Upozornenia" size={38} />
              <Avatar name={SALON.owner} />
            </>
          }
        />
        <div style={{ marginTop: 'var(--space-5)' }}>
          <div style={{ font: 'var(--text-display)', letterSpacing: 'var(--tracking-display)' }}>
            {longDayName(date)}
          </div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            {date.getDate()}. {['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'][date.getMonth()]} · {SALON.owner}
          </div>
        </div>

        <div className="hh-scroll" style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', marginTop: 'var(--space-5)' }}>
          {days.map((d) => {
            const key = dayKey(d);
            const on = key === day;
            const count = dayAgenda(key).length;
            return (
              <button
                key={key}
                onClick={() => setDay(key)}
                style={{
                  flex: '0 0 auto', width: 52, padding: '8px 0', borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer', border: `1px solid ${on ? 'transparent' : 'var(--line-glass-soft)'}`,
                  background: on ? 'var(--surface-solid)' : 'var(--surface-glass)',
                  color: on ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  font: 'var(--text-caption)',
                }}
              >
                {shortDayName(d)}
                <div style={{ font: 'var(--weight-semibold) 17px/1.2 var(--font-core)' }}>{d.getDate()}</div>
                <div style={{
                  height: 4, width: 4, borderRadius: '50%', margin: '3px auto 0',
                  background: count ? (on ? 'var(--ember-500)' : 'var(--ember-400)') : 'transparent',
                }} />
              </button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--gap-card)', marginTop: 'var(--space-5)' }}>
          {[
            [String(agenda.length), plural(agenda.length, 'termín', 'termíny', 'termínov'), 'calendar'],
            [`${revenue} €`, 'tržba', 'banknote'],
            [`${utilisation} %`, 'obsadenosť', 'trending-up'],
          ].map(([value, label, icon]) => (
            <GlassCard key={label} tone="light" padding="var(--space-4)">
              <Icon name={icon} size={15} style={{ color: 'var(--ember-300)' }} />
              <div style={{ font: 'var(--weight-semibold) 21px/1.2 var(--font-core)', marginTop: 6 }}>{value}</div>
              <div style={{ font: 'var(--text-micro)', color: 'var(--text-tertiary)' }}>{label}</div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="hh-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '0 var(--gutter-screen)',
        paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
      }}>
        <SectionLabel style={{ margin: 0 }} action="synchronizované">Rozvrh dňa</SectionLabel>

        {agenda.length === 0 ? (
          <GlassCard tone="dim" padding="var(--space-5)">
            <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
              V tento deň nemáte žiadny termín. Celé okno {WORKING_HOURS.start} – {WORKING_HOURS.end} je voľné.
            </div>
          </GlassCard>
        ) : (
          agenda.map((b) => {
            const st = STATE_STYLE[stateOf(b, day, now)];
            const service = getService(b.serviceId);
            const addons = b.addonIds.map(getAddon).filter(Boolean);
            const isNow = st.label === 'Práve teraz';
            return (
              <div key={b.id} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ width: 44, flex: '0 0 auto', paddingTop: 14, font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
                  {b.time}
                </div>
                <GlassCard
                  tone={isNow ? 'light' : 'dim'}
                  padding="var(--space-4)"
                  glow={isNow}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                    borderLeft: `2px solid ${st.color}`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: 'var(--text-label)' }}>{b.clientName}</div>
                    <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
                      {service.name} · {b.mins} min
                    </div>
                    {addons.length > 0 && (
                      <div style={{ font: 'var(--text-micro)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                        {addons.map((a) => a.name).join(' · ')}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ font: 'var(--weight-medium) 15px/1 var(--font-core)' }}>{b.price} €</div>
                    <div style={{ font: 'var(--text-micro)', color: st.color, marginTop: 3 }}>{st.label}</div>
                    <div style={{ font: 'var(--text-micro)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      do {toTime(toMinutes(b.time) + b.mins)}
                    </div>
                  </div>
                </GlassCard>
              </div>
            );
          })
        )}

        <div style={{ height: 96 }} />
      </div>
    </>
  );
}
