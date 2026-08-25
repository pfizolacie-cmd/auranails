import React from 'react';
import { GlassCard } from '../components/core/GlassCard.jsx';
import { IconButton } from '../components/core/IconButton.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { SectionLabel } from '../components/core/SectionLabel.jsx';
import { ScreenHeader } from '../components/navigation/ScreenHeader.jsx';
import { SALON, POLICY, CATEGORIES, SERVICES, ADDONS, EXTRAS } from '../data/salon.js';

function Row({ name, note, price, muted }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: 'var(--space-4)', padding: '10px 0',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: 'var(--text-body)', color: muted ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
          {name}
        </div>
        {note && (
          <div style={{ font: 'var(--text-micro)', color: 'var(--text-tertiary)', marginTop: 2 }}>{note}</div>
        )}
      </div>
      <div style={{ font: 'var(--weight-medium) 15px/1 var(--font-core)', flex: '0 0 auto' }}>{price} €</div>
    </div>
  );
}

export function PriceListScreen() {
  return (
    <>
      <div style={{ padding: '22px var(--gutter-screen) 0' }}>
        <ScreenHeader
          left={<span style={{ width: 38 }} />}
          right={<IconButton icon="instagram" label="Instagram" size={38} />}
        />
        <div style={{ marginTop: 'var(--space-5)' }}>
          <div style={{ font: 'var(--text-display)', letterSpacing: 'var(--tracking-display)' }}>Cenník</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            {SALON.specialization} · {SALON.products}
          </div>
        </div>
      </div>

      <div className="hh-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '0 var(--gutter-screen)',
        paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--gap-card)',
      }}>
        {CATEGORIES.map((c) => (
          <React.Fragment key={c.id}>
            <SectionLabel style={{ margin: 'var(--space-3) 0 0' }}>{c.name}</SectionLabel>
            <GlassCard tone="light" padding="var(--space-5)">
              {SERVICES.filter((s) => s.category === c.id).map((s, i, arr) => (
                <React.Fragment key={s.id}>
                  <Row name={s.name} note={s.note ? `${s.note} · ${s.mins} min` : `${s.mins} min`} price={s.price} />
                  {i < arr.length - 1 && <div style={{ height: 1, background: 'var(--line-glass-soft)' }} />}
                </React.Fragment>
              ))}
            </GlassCard>
          </React.Fragment>
        ))}

        <SectionLabel style={{ margin: 'var(--space-3) 0 0' }}>Dizajn a doplnky</SectionLabel>
        <GlassCard tone="light" padding="var(--space-5)">
          {[...ADDONS, ...EXTRAS].map((a, i, arr) => (
            <React.Fragment key={a.id}>
              <Row name={a.name} price={a.price} muted />
              {i < arr.length - 1 && <div style={{ height: 1, background: 'var(--line-glass-soft)' }} />}
            </React.Fragment>
          ))}
        </GlassCard>

        <SectionLabel style={{ margin: 'var(--space-3) 0 0' }}>Podmienky</SectionLabel>
        <GlassCard tone="dim" padding="var(--space-5)" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Icon name="clock" size={16} style={{ color: 'var(--glow-400)', flex: '0 0 auto', marginTop: 2 }} />
            <div style={{ font: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Zrušenie termínu do {POLICY.cancelWindowHours} hodín pred začiatkom je spoplatnené sumou {POLICY.cancelFeeEur} €.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Icon name="check-check" size={16} style={{ color: 'var(--glow-400)', flex: '0 0 auto', marginTop: 2 }} />
            <div style={{ font: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              {POLICY.warrantyNote}
            </div>
          </div>
        </GlassCard>

        <SectionLabel style={{ margin: 'var(--space-3) 0 0' }}>Kontakt</SectionLabel>
        <GlassCard tone="light" padding="var(--space-5)" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[
            ['map-pin', `${SALON.street}, ${SALON.zip} ${SALON.city}`],
            ['phone', SALON.phone],
            ['instagram', SALON.instagram],
            ['globe', SALON.web],
            ['calendar', SALON.hours],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Icon name={icon} size={16} style={{ color: 'var(--text-tertiary)', flex: '0 0 auto' }} />
              <span style={{ font: 'var(--text-body)', color: 'var(--text-secondary)' }}>{text}</span>
            </div>
          ))}
        </GlassCard>

        <div style={{ height: 96 }} />
      </div>
    </>
  );
}
