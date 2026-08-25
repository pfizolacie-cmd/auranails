import React from 'react';
import { GlassCard } from '../components/core/GlassCard.jsx';
import { IconButton } from '../components/core/IconButton.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { Chip } from '../components/core/Chip.jsx';
import { Button } from '../components/core/Button.jsx';
import { Avatar } from '../components/core/Avatar.jsx';
import { SectionLabel } from '../components/core/SectionLabel.jsx';
import { ScreenHeader } from '../components/navigation/ScreenHeader.jsx';
import { AURA_PASS, getService, getAddon } from '../data/salon.js';
import { formatWhen, toMinutes, toTime } from '../lib/schedule.js';
import { plural } from '../lib/text.js';
import { useSalon } from '../state/SalonContext.jsx';

/* Michaela môže pred potvrdením upraviť trvanie — rovnako ako v pôvodnej appke. */
const DURATION_PRESETS = [30, 45, 60, 90, 120];

function RequestCard({ request, findConflict, onApprove, onReject }) {
  const [mins, setMins] = React.useState(request.mins);
  const service = getService(request.serviceId);
  const addons = request.addonIds.map(getAddon).filter(Boolean);
  const end = toTime(toMinutes(request.time) + mins);
  // Kolízia sa musí prepočítať pri každej zmene trvania, inak by sa dala
  // potvrdiť žiadosť, ktorá sa po predĺžení prekryje s iným termínom.
  const conflict = findConflict(mins);

  // Ponuku trvaní držíme aj s pôvodnou dĺžkou úkonu, nech sa dá vrátiť späť.
  const presets = [...new Set([...DURATION_PRESETS, request.mins])].sort((a, b) => a - b);

  return (
    <GlassCard
      tone="light"
      padding="var(--space-5)"
      style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
        borderLeft: `2px solid ${conflict ? 'var(--ember-500)' : 'var(--glow-500)'}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Avatar name={request.clientName} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--text-label)' }}>{request.clientName}</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
            {request.phone}
          </div>
        </div>
        <div style={{ font: 'var(--weight-semibold) 17px/1 var(--font-core)' }}>{request.price} €</div>
      </div>

      <div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-secondary)' }}>{service.name}</div>
        <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          {formatWhen(request.day, request.time)} — {end}
        </div>
        {addons.length > 0 && (
          <div style={{ font: 'var(--text-micro)', color: 'var(--text-tertiary)', marginTop: 4 }}>
            {addons.map((a) => a.name).join(' · ')}
          </div>
        )}
      </div>

      {conflict && (
        <div style={{
          display: 'flex', gap: 'var(--space-3)', font: 'var(--text-caption)', color: 'var(--ember-300)',
        }}>
          <Icon name="clock" size={14} style={{ flex: '0 0 auto', marginTop: 2 }} />
          <span>Prekrýva sa s termínom {conflict.clientName} o {conflict.time}. Skráťte trvanie alebo žiadosť zamietnite.</span>
        </div>
      )}

      <div>
        <SectionLabel style={{ margin: '0 0 var(--space-3)' }} action={`${mins} min`}>Trvanie</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          {presets.map((m) => (
            <Chip key={m} selected={m === mins} onClick={() => setMins(m)}>{m} min</Chip>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <Button variant="ghost" size="sm" onClick={() => onReject(request.id)} style={{ flex: 1 }}>
          Zamietnuť
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={Boolean(conflict)}
          onClick={() => onApprove(request.id, mins)}
          style={{ flex: 1 }}
        >
          Potvrdiť
        </Button>
      </div>
    </GlassCard>
  );
}

export function RequestsScreen() {
  const { requests, bookings, approveRequest, rejectRequest } = useSalon();

  const sorted = React.useMemo(
    () => [...requests].sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time)),
    [requests],
  );

  /* Žiadosti neblokujú kalendár, takže dve sa môžu chcieť zmestiť na to isté
   * miesto. Kolíziu s už potvrdeným termínom preto hlásime pri schvaľovaní. */
  const conflictFor = (req, mins) => {
    const start = toMinutes(req.time);
    const end = start + mins;
    return bookings.find((b) => {
      if (b.day !== req.day || b.status === 'cancelled') return false;
      const bs = toMinutes(b.time);
      return start < bs + b.mins && bs < end;
    }) || null;
  };

  return (
    <>
      <div style={{ padding: '22px var(--gutter-screen) 0' }}>
        <ScreenHeader
          left={<IconButton icon="menu" label="Menu" size={38} />}
          right={<IconButton icon="bell" label="Upozornenia" size={38} />}
        />
        <div style={{ marginTop: 'var(--space-5)' }}>
          <div style={{ font: 'var(--text-display)', letterSpacing: 'var(--tracking-display)' }}>Žiadosti</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            {sorted.length === 0
              ? 'Všetko vybavené'
              : `${sorted.length} ${plural(sorted.length, 'čaká', 'čakajú', 'čaká')} na potvrdenie`}
          </div>
        </div>
      </div>

      <div className="hh-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '0 var(--gutter-screen)',
        paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--gap-card)',
      }}>
        {sorted.length === 0 ? (
          <GlassCard tone="dim" padding="var(--space-5)" style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Icon name="check-check" size={17} style={{ color: 'var(--glow-400)', flex: '0 0 auto', marginTop: 2 }} />
            <div style={{ font: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Žiadne čakajúce žiadosti. Nové rezervácie sa objavia tu skôr, než sa zapíšu do rozvrhu.
            </div>
          </GlassCard>
        ) : (
          sorted.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              findConflict={(mins) => conflictFor(r, mins)}
              onApprove={approveRequest}
              onReject={rejectRequest}
            />
          ))
        )}

        <GlassCard tone="dim" padding="var(--space-4)" style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
          <Icon name="sparkles" size={16} style={{ color: 'var(--glow-400)', flex: '0 0 auto', marginTop: 2 }} />
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            Potvrdením pribudne klientke návšteva, pečiatka Aura Passu ({AURA_PASS.maxStamps} do odmeny) a záznam v histórii.
          </div>
        </GlassCard>

        <div style={{ height: 96 }} />
      </div>
    </>
  );
}
