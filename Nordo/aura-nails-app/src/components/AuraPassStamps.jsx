import React from 'react';
import { Icon } from './core/Icon.jsx';
import { AURA_PASS } from '../data/salon.js';

/* Pečiatky Aura Passu — rovnaká mechanika ako v pôvodnej appke: päť miest,
 * získané svietia, prázdne zostávajú ako obrys. Používa sa u klientky
 * aj v detaile klientky u Michaely, aby obe strany videli to isté. */
export function AuraPassStamps({ stamps = 0, size = 40 }) {
  const filled = Math.max(0, Math.min(AURA_PASS.maxStamps, stamps));

  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      {Array.from({ length: AURA_PASS.maxStamps }, (_, i) => {
        const on = i < filled;
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              width: size, height: size, flex: '0 0 auto',
              borderRadius: 'var(--radius-circle)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: on ? 'var(--grad-ember)' : 'var(--surface-glass-dim)',
              border: `1px solid ${on ? 'transparent' : 'var(--line-glass-soft)'}`,
              color: on ? 'var(--accent-on)' : 'var(--text-tertiary)',
              boxShadow: on ? 'var(--glow-ember)' : 'none',
              transition: 'background var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)',
            }}
          >
            <Icon name={on ? 'sparkles' : 'heart'} size={Math.round(size * 0.42)} />
          </span>
        );
      })}
    </div>
  );
}

/** Veta o stave passu — podľa textov z pôvodnej appky. */
export function auraPassMessage(stamps = 0) {
  return stamps >= AURA_PASS.maxStamps
    ? AURA_PASS.rewardReady
    : `${AURA_PASS.howItWorks} Aktuálne máte ${stamps}/${AURA_PASS.maxStamps}.`;
}
