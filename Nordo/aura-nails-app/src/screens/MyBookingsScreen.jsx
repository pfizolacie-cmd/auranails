import React from 'react';
import { GlassCard } from '../components/core/GlassCard.jsx';
import { IconButton } from '../components/core/IconButton.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { Button } from '../components/core/Button.jsx';
import { SectionLabel } from '../components/core/SectionLabel.jsx';
import { ScreenHeader } from '../components/navigation/ScreenHeader.jsx';
import { POLICY, CURRENT_CLIENT, getService, getAddon } from '../data/salon.js';
import { formatWhen, hoursUntil, dayKey } from '../lib/schedule.js';
import { useSalon } from '../state/SalonContext.jsx';

/* Karta jedného termínu. Zrušenie je dvojkrokové — potvrdenie sa objaví
 * priamo v karte aj s informáciou o stornopoplatku, aby zákazníčka videla
 * cenu skôr, než klikne. */
function BookingCard({ booking, onCancel }) {
  const [confirming, setConfirming] = React.useState(false);

  const service = getService(booking.serviceId);
  const addons = booking.addonIds.map(getAddon).filter(Boolean);
  const cancelled = booking.status === 'cancelled';
  const done = booking.status === 'done';
  const hours = hoursUntil(booking.day, booking.time);
  const feeApplies = hours < POLICY.cancelWindowHours;

  const accent = cancelled
    ? 'var(--text-tertiary)'
    : done
      ? 'var(--text-tertiary)'
      : 'var(--ember-400)';

  return (
    <GlassCard
      tone={cancelled || done ? 'dim' : 'light'}
      padding="var(--space-5)"
      style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
        borderLeft: `2px solid ${accent}`, opacity: cancelled ? 0.55 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--text-label)' }}>{service.name}</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            {formatWhen(booking.day, booking.time)}
          </div>
          {addons.length > 0 && (
            <div style={{ font: 'var(--text-micro)', color: 'var(--text-tertiary)', marginTop: 4 }}>
              {addons.map((a) => a.name).join(' · ')}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ font: 'var(--weight-semibold) 17px/1 var(--font-core)' }}>{booking.price} €</div>
          <div style={{ font: 'var(--text-micro)', color: accent, marginTop: 4 }}>
            {cancelled ? 'Zrušené' : done ? 'Absolvované' : `${booking.mins} min`}
          </div>
        </div>
      </div>

      {!cancelled && !done && (
        confirming ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{
              display: 'flex', gap: 'var(--space-3)', font: 'var(--text-caption)',
              color: feeApplies ? 'var(--ember-300)' : 'var(--text-secondary)',
            }}>
              <Icon name="clock" size={14} style={{ flex: '0 0 auto', marginTop: 2 }} />
              <span>
                {feeApplies
                  ? `Do termínu zostáva menej než ${POLICY.cancelWindowHours} hodín, zrušenie je spoplatnené sumou ${POLICY.cancelFeeEur} €.`
                  : 'Termín je možné zrušiť bez poplatku.'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} style={{ flex: 1 }}>
                Ponechať
              </Button>
              <Button variant="primary" size="sm" onClick={() => onCancel(booking.id)} style={{ flex: 1 }}>
                Zrušiť termín
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setConfirming(true)} style={{ alignSelf: 'flex-start' }}>
            Zrušiť termín
          </Button>
        )
      )}
    </GlassCard>
  );
}

/* Žiadosť ešte nie je termín — Michaela ju musí potvrdiť. Kartu preto
 * odlišujeme aj farebne a namiesto zrušenia ponúkame stiahnutie žiadosti. */
function RequestCard({ request, onWithdraw }) {
  const service = getService(request.serviceId);
  const addons = request.addonIds.map(getAddon).filter(Boolean);

  return (
    <GlassCard
      tone="dim"
      padding="var(--space-5)"
      style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
        borderLeft: '2px solid var(--glow-500)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--text-label)' }}>{service.name}</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            {formatWhen(request.day, request.time)}
          </div>
          {addons.length > 0 && (
            <div style={{ font: 'var(--text-micro)', color: 'var(--text-tertiary)', marginTop: 4 }}>
              {addons.map((a) => a.name).join(' · ')}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ font: 'var(--weight-semibold) 17px/1 var(--font-core)' }}>{request.price} €</div>
          <div style={{ font: 'var(--text-micro)', color: 'var(--glow-500)', marginTop: 4 }}>Čaká na potvrdenie</div>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onWithdraw(request.id)} style={{ alignSelf: 'flex-start' }}>
        Stiahnuť žiadosť
      </Button>
    </GlassCard>
  );
}

export function MyBookingsScreen() {
  const { myBookings, myRequests, cancelBooking, rejectRequest } = useSalon();
  const today = dayKey(new Date());

  const upcoming = myBookings.filter((b) => b.status === 'active' && b.day >= today);
  const past = myBookings.filter((b) => b.status !== 'active' || b.day < today);
  const pending = myRequests.filter((r) => r.day >= today);

  return (
    <>
      <div style={{ padding: '22px var(--gutter-screen) 0' }}>
        <ScreenHeader
          left={<span style={{ width: 38 }} />}
          right={<IconButton icon="bell" label="Upozornenia" size={38} />}
        />
        <div style={{ marginTop: 'var(--space-5)' }}>
          <div style={{ font: 'var(--text-display)', letterSpacing: 'var(--tracking-display)' }}>
            Moje termíny
          </div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            {CURRENT_CLIENT.name}
          </div>
        </div>
      </div>

      <div className="hh-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '0 var(--gutter-screen)',
        paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--gap-card)',
      }}>
        {pending.length > 0 && (
          <>
            <SectionLabel style={{ margin: 0 }} action={`${pending.length}`}>Čaká na potvrdenie</SectionLabel>
            {pending.map((r) => <RequestCard key={r.id} request={r} onWithdraw={rejectRequest} />)}
            <div style={{ height: 'var(--space-3)' }} />
          </>
        )}

        <SectionLabel style={{ margin: 0 }} action={`${upcoming.length}`}>Nadchádzajúce</SectionLabel>
        {upcoming.length === 0 ? (
          <GlassCard tone="dim" padding="var(--space-5)">
            <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
              Zatiaľ nemáte objednaný žiadny termín.
            </div>
          </GlassCard>
        ) : (
          upcoming.map((b) => <BookingCard key={b.id} booking={b} onCancel={cancelBooking} />)
        )}

        {past.length > 0 && (
          <>
            <SectionLabel style={{ margin: 'var(--space-4) 0 0' }}>História</SectionLabel>
            {past.map((b) => <BookingCard key={b.id} booking={b} onCancel={cancelBooking} />)}
          </>
        )}

        <GlassCard tone="dim" padding="var(--space-4)" style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          <Icon name="check-check" size={17} style={{ color: 'var(--glow-400)', flex: '0 0 auto', marginTop: 2 }} />
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            {POLICY.warrantyNote}
          </div>
        </GlassCard>

        <div style={{ height: 96 }} />
      </div>
    </>
  );
}
