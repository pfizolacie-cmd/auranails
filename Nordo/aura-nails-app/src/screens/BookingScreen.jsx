import React from 'react';
import { GlassCard } from '../components/core/GlassCard.jsx';
import { IconButton } from '../components/core/IconButton.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { Chip } from '../components/core/Chip.jsx';
import { Button } from '../components/core/Button.jsx';
import { SectionLabel } from '../components/core/SectionLabel.jsx';
import { ScreenHeader } from '../components/navigation/ScreenHeader.jsx';
import { SALON, CATEGORIES, SERVICES, ADDONS, getService, getAddon } from '../data/salon.js';
import {
  dayKey, shortDayName, formatWhen, nextDays, slotsForDay, totalMins, totalPrice,
} from '../lib/schedule.js';
import { useSalon } from '../state/SalonContext.jsx';

const STEP_TITLES = ['Vyberte službu', 'Termín', 'Potvrdenie'];

export function BookingScreen() {
  const { bookings, addRequest } = useSalon();

  const [step, setStep] = React.useState(0);
  const [category, setCategory] = React.useState('gel');
  const [serviceId, setServiceId] = React.useState(null);
  const [addonIds, setAddonIds] = React.useState([]);
  const [day, setDay] = React.useState(() => dayKey(new Date()));
  const [slot, setSlot] = React.useState(null);
  const [created, setCreated] = React.useState(null);

  const service = getService(serviceId);
  const addons = addonIds.map(getAddon).filter(Boolean);
  const mins = totalMins(service, addons);
  const price = totalPrice(service, addons);

  const days = React.useMemo(() => nextDays(14), []);
  const slots = React.useMemo(
    () => (service ? slotsForDay(day, mins, bookings) : []),
    [service, day, mins, bookings],
  );

  // Zmena služby alebo dňa môže zneplatniť už vybraný čas — radšej ho pustíme,
  // než by mala appka potvrdiť termín, ktorý sa medzitým prestal zmestiť.
  React.useEffect(() => {
    if (slot && !slots.some((s) => s.time === slot && s.available)) setSlot(null);
  }, [slots, slot]);

  const toggleAddon = (id) =>
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const confirm = () => {
    setCreated(addRequest({ day, time: slot, serviceId, addonIds }));
    setStep(2);
  };

  const restart = () => {
    setCreated(null);
    setServiceId(null);
    setAddonIds([]);
    setSlot(null);
    setStep(0);
  };

  const canContinue = step === 0 ? Boolean(service) : Boolean(slot);

  return (
    <>
      <div style={{ padding: '22px var(--gutter-screen) 0' }}>
        <ScreenHeader
          onBack={step > 0 && step < 2 ? () => setStep(step - 1) : undefined}
          left={step === 0 || step === 2 ? <span style={{ width: 38 }} /> : undefined}
          right={<IconButton icon="user" label="Profil" size={38} />}
        />
        <div style={{ marginTop: 'var(--space-5)' }}>
          <div style={{ font: 'var(--text-display)', letterSpacing: 'var(--tracking-display)' }}>
            {STEP_TITLES[step]}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2,
          }}>
            <Icon name="map-pin" size={12} />
            {SALON.name} · {SALON.city}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              height: 3, flex: 1, borderRadius: 2,
              background: i <= step ? 'var(--ember-500)' : 'var(--line-glass-soft)',
              transition: 'background var(--dur-base) var(--ease-standard)',
            }} />
          ))}
        </div>
      </div>

      <div className="hh-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '0 var(--gutter-screen)',
        paddingTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--gap-card)',
      }}>
        {step === 0 && (
          <>
            <div className="hh-scroll" style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto' }}>
              {CATEGORIES.map((c) => (
                <Chip key={c.id} icon={c.icon} selected={c.id === category} onClick={() => setCategory(c.id)}>
                  {c.name}
                </Chip>
              ))}
            </div>

            {SERVICES.filter((s) => s.category === category).map((s) => {
              const on = s.id === serviceId;
              return (
                <GlassCard
                  key={s.id}
                  tone={on ? 'light' : 'dim'}
                  padding="var(--space-4)"
                  glow={on}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  onClick={() => setServiceId(s.id)}
                  // Karta služby je div, nie <button> — bez toho by sa dala vybrať
                  // len myšou a klávesnica by ju preskočila.
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setServiceId(s.id);
                    }
                  }}
                  style={{
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                    border: on ? '1px solid var(--ember-400)' : undefined,
                  }}
                >
                  <span style={{
                    width: 38, height: 38, flex: '0 0 auto', borderRadius: 'var(--radius-circle)',
                    background: on ? 'var(--grad-ember)' : 'var(--surface-glass-strong)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: on ? 'var(--accent-on)' : 'var(--text-secondary)',
                  }}>
                    <Icon name={CATEGORIES.find((c) => c.id === s.category).icon} size={17} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: 'var(--text-label)' }}>{s.name}</div>
                    <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
                      {s.note ? `${s.note} · ${s.mins} min` : `${s.mins} min`}
                    </div>
                  </div>
                  <div style={{ font: 'var(--weight-semibold) 17px/1 var(--font-core)' }}>{s.price} €</div>
                </GlassCard>
              );
            })}

            {service && (
              <>
                <SectionLabel style={{ margin: 'var(--space-3) 0 0' }} action="voliteľné">Doplnky</SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  {ADDONS.map((a) => (
                    <Chip key={a.id} selected={addonIds.includes(a.id)} onClick={() => toggleAddon(a.id)}>
                      {a.name} +{a.price} €
                    </Chip>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <SectionLabel style={{ margin: 0 }}>Deň</SectionLabel>
            <div className="hh-scroll" style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto' }}>
              {days.map((d) => {
                const key = dayKey(d);
                const on = key === day;
                return (
                  <button
                    key={key}
                    onClick={() => setDay(key)}
                    style={{
                      flex: '0 0 auto', width: 52, padding: '10px 0', borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer', border: `1px solid ${on ? 'transparent' : 'var(--line-glass-soft)'}`,
                      background: on ? 'var(--surface-solid)' : 'var(--surface-glass)',
                      color: on ? 'var(--text-inverse)' : 'var(--text-secondary)',
                      font: 'var(--text-caption)',
                    }}
                  >
                    {shortDayName(d)}
                    <div style={{ font: 'var(--weight-semibold) 17px/1.3 var(--font-core)' }}>{d.getDate()}</div>
                  </button>
                );
              })}
            </div>

            <SectionLabel style={{ margin: 'var(--space-3) 0 0' }} action="skutočná dostupnosť">
              Čas · {mins} min
            </SectionLabel>
            {slots.length === 0 ? (
              <GlassCard tone="dim" padding="var(--space-5)">
                <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
                  V tento deň sa už úkon v dĺžke {mins} minút nezmestí. Skúste iný deň.
                </div>
              </GlassCard>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-3)' }}>
                {slots.map((s) => {
                  const on = s.time === slot;
                  return (
                    <button
                      key={s.time}
                      disabled={!s.available}
                      onClick={() => setSlot(s.time)}
                      style={{
                        padding: '10px 0', borderRadius: 'var(--radius-sm)',
                        cursor: s.available ? 'pointer' : 'not-allowed', font: 'var(--text-label)',
                        border: `1px solid ${on ? 'transparent' : 'var(--line-glass-soft)'}`,
                        background: on ? 'var(--grad-ember)' : 'var(--surface-glass)',
                        color: on ? 'var(--accent-on)' : 'var(--text-secondary)',
                        opacity: s.available ? 1 : 0.3,
                        textDecoration: s.available ? 'none' : 'line-through',
                      }}
                    >
                      {s.time}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {step === 2 && created && (
          <>
            <GlassCard tone="solid" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--ember-600)' }}>
                <Icon name="circle-check-big" size={20} />
                <span style={{ font: 'var(--text-label)' }}>Žiadosť odoslaná</span>
              </div>
              {[
                ['Služba', getService(created.serviceId).name],
                ...(created.addonIds.length
                  ? [['Doplnky', created.addonIds.map((a) => getAddon(a).name).join(', ')]]
                  : []),
                ['Kedy', formatWhen(created.day, created.time)],
                ['Trvanie', `${created.mins} min`],
                ['Nechtárka', SALON.owner],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)',
                  font: 'var(--text-body)', color: 'var(--text-inverse-soft)',
                }}>
                  <span>{k}</span>
                  <span style={{ color: 'var(--text-inverse)', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'var(--line-solid)' }} />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                font: 'var(--weight-semibold) 20px/1 var(--font-core)', color: 'var(--text-inverse)',
              }}>
                <span>Spolu</span>
                <span>{created.price} €</span>
              </div>
            </GlassCard>

            <GlassCard tone="dim" padding="var(--space-4)" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Icon name="map-pin" size={17} style={{ color: 'var(--glow-400)' }} />
              <div style={{ flex: 1, font: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                {SALON.street}, {SALON.zip} {SALON.city}
              </div>
            </GlassCard>

            <GlassCard tone="dim" padding="var(--space-4)" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Icon name="bell-ring" size={17} style={{ color: 'var(--glow-400)' }} />
              <div style={{ flex: 1, font: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                Michaela žiadosť potvrdí. Stav uvidíte v sekcii Moje termíny.
              </div>
            </GlassCard>
          </>
        )}

        <div style={{ height: 96 }} />
      </div>

      <div style={{ padding: '0 var(--gutter-screen)', paddingBottom: 'var(--gutter-screen)' }}>
        {step === 0 && (
          <Button variant="primary" size="lg" full disabled={!canContinue} onClick={() => setStep(1)}>
            {service ? `${service.name} · ${price} €` : 'Vyberte službu'}
          </Button>
        )}
        {step === 1 && (
          <Button variant="primary" size="lg" full disabled={!canContinue} onClick={confirm}>
            {slot ? `Potvrdiť ${slot}` : 'Vyberte čas'}
          </Button>
        )}
        {step === 2 && (
          <Button variant="glass" size="lg" full onClick={restart}>Hotovo</Button>
        )}
      </div>
    </>
  );
}
