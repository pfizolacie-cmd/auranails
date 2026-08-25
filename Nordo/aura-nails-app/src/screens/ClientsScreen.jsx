import React from 'react';
import { GlassCard } from '../components/core/GlassCard.jsx';
import { IconButton } from '../components/core/IconButton.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { Button } from '../components/core/Button.jsx';
import { Avatar } from '../components/core/Avatar.jsx';
import { Field } from '../components/core/Field.jsx';
import { SectionLabel } from '../components/core/SectionLabel.jsx';
import { SearchField } from '../components/controls/SearchField.jsx';
import { ScreenHeader } from '../components/navigation/ScreenHeader.jsx';
import { AuraPassStamps } from '../components/AuraPassStamps.jsx';
import { AURA_PASS, emptyClient, getService } from '../data/salon.js';
import { dayKey, formatWhen, formatDay } from '../lib/schedule.js';
import { withCount } from '../lib/text.js';
import { useSalon } from '../state/SalonContext.jsx';

/* Obrazovka má tri stavy: zoznam, detail klientky a formulár. Držíme ich
 * v jednom komponente rovnako ako pôvodná appka — prechody sú tak okamžité
 * a netreba router. */

function ClientForm({ initial, title, onSave, onCancel }) {
  const [draft, setDraft] = React.useState(initial);
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));
  const nameOk = draft.name.trim().length > 0;

  return (
    <>
      <SectionLabel style={{ margin: 0 }}>{title}</SectionLabel>

      <GlassCard tone="light" padding="var(--space-5)" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Field label="Meno a priezvisko" value={draft.name} onChange={set('name')} placeholder="Napríklad Zuzana Krajčíová" />
        <Field label="Telefón" value={draft.phone} onChange={set('phone')} placeholder="+421" type="tel" />
        <Field label="E-mail" value={draft.email} onChange={set('email')} placeholder="nepovinné" type="email" />
        <Field label="Dátum narodenia" value={draft.birthday} onChange={set('birthday')} type="date" />
        <Field label="Poznámka" value={draft.notes} onChange={set('notes')} placeholder="Alergie, preferencie, odtiene" multiline />
      </GlassCard>

      {!nameOk && (
        <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
          Meno je jediný povinný údaj.
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <Button variant="ghost" size="md" onClick={onCancel} style={{ flex: 1 }}>Zrušiť</Button>
        <Button variant="primary" size="md" disabled={!nameOk} onClick={() => onSave(draft)} style={{ flex: 1 }}>
          Uložiť
        </Button>
      </div>
    </>
  );
}

function ClientDetail({ client, bookings, onEdit, onDelete, onStamp, onBack }) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const today = dayKey(new Date());
  const upcoming = bookings.filter((b) => b.status === 'active' && b.day >= today);
  const history = client.history || [];

  return (
    <>
      <Button variant="ghost" size="sm" icon="arrow-left" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
        Klientky
      </Button>

      <GlassCard tone="light" padding="var(--space-5)" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Avatar name={client.name} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--text-title)' }}>{client.name}</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            {withCount(client.visits || 0, 'návšteva', 'návštevy', 'návštev')} · klientka od {client.since}
          </div>
        </div>
      </GlassCard>

      <SectionLabel style={{ margin: 'var(--space-3) 0 0' }} action={`${client.stamps || 0}/${AURA_PASS.maxStamps}`}>
        Aura Pass
      </SectionLabel>
      <GlassCard tone="light" padding="var(--space-5)" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <AuraPassStamps stamps={client.stamps || 0} />
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button
            variant="glass"
            size="sm"
            icon="minus"
            disabled={(client.stamps || 0) <= 0}
            onClick={() => onStamp(-1)}
            style={{ flex: 1 }}
          >
            Odobrať
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon="plus"
            disabled={(client.stamps || 0) >= AURA_PASS.maxStamps}
            onClick={() => onStamp(1)}
            style={{ flex: 1 }}
          >
            Pridať
          </Button>
        </div>
        {(client.stamps || 0) >= AURA_PASS.maxStamps && (
          <div style={{ display: 'flex', gap: 'var(--space-3)', font: 'var(--text-caption)', color: 'var(--ember-300)' }}>
            <Icon name="sparkles" size={14} style={{ flex: '0 0 auto', marginTop: 2 }} />
            <span>Pass je plný — pri najbližšej návšteve uplatnite odmenu.</span>
          </div>
        )}
      </GlassCard>

      <SectionLabel style={{ margin: 'var(--space-3) 0 0' }}>Kontakt</SectionLabel>
      <GlassCard tone="light" padding="var(--space-5)" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {[
          ['phone', client.phone || '—'],
          ['globe', client.email || '—'],
          ['calendar', client.birthday ? formatDay(client.birthday) : 'Narodeniny neuvedené'],
        ].map(([icon, text]) => (
          <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <Icon name={icon} size={16} style={{ color: 'var(--text-tertiary)', flex: '0 0 auto' }} />
            <span style={{ font: 'var(--text-body)', color: 'var(--text-secondary)' }}>{text}</span>
          </div>
        ))}
      </GlassCard>

      {client.notes ? (
        <>
          <SectionLabel style={{ margin: 'var(--space-3) 0 0' }}>Poznámka</SectionLabel>
          <GlassCard tone="dim" padding="var(--space-5)">
            <div style={{ font: 'var(--text-body)', color: 'var(--text-secondary)' }}>{client.notes}</div>
          </GlassCard>
        </>
      ) : null}

      <SectionLabel style={{ margin: 'var(--space-3) 0 0' }} action={`${upcoming.length}`}>
        Nadchádzajúce termíny
      </SectionLabel>
      {upcoming.length === 0 ? (
        <GlassCard tone="dim" padding="var(--space-5)">
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
            Bez objednaného termínu.
          </div>
        </GlassCard>
      ) : (
        upcoming.map((b) => (
          <GlassCard key={b.id} tone="light" padding="var(--space-4)" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <Icon name="calendar-check" size={16} style={{ color: 'var(--ember-300)', flex: '0 0 auto' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: 'var(--text-label)' }}>{getService(b.serviceId).name}</div>
              <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
                {formatWhen(b.day, b.time)}
              </div>
            </div>
            <div style={{ font: 'var(--weight-medium) 15px/1 var(--font-core)' }}>{b.price} €</div>
          </GlassCard>
        ))
      )}

      <SectionLabel style={{ margin: 'var(--space-3) 0 0' }}>História návštev</SectionLabel>
      {history.length === 0 ? (
        <GlassCard tone="dim" padding="var(--space-5)">
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>Zatiaľ bez návštev.</div>
        </GlassCard>
      ) : (
        <GlassCard tone="dim" padding="var(--space-5)">
          {history.map((h, i) => (
            <React.Fragment key={`${h.date}-${i}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', padding: '8px 0' }}>
                <span style={{ font: 'var(--text-body)', color: 'var(--text-secondary)' }}>{h.service}</span>
                <span style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', flex: '0 0 auto' }}>
                  {formatDay(h.date)}
                </span>
              </div>
              {i < history.length - 1 && <div style={{ height: 1, background: 'var(--line-glass-soft)' }} />}
            </React.Fragment>
          ))}
        </GlassCard>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
        <Button variant="glass" size="md" onClick={onEdit} style={{ flex: 1 }}>Upraviť</Button>
        <Button variant="ghost" size="md" onClick={() => setConfirmDelete(true)} style={{ flex: 1 }}>Zmazať</Button>
      </div>

      {confirmDelete && (
        <GlassCard tone="light" padding="var(--space-5)" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            Zmazať {client.name} z evidencie? Jej termíny v rozvrhu zostanú, zmizne len karta klientky.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} style={{ flex: 1 }}>Ponechať</Button>
            <Button variant="primary" size="sm" onClick={onDelete} style={{ flex: 1 }}>Zmazať</Button>
          </div>
        </GlassCard>
      )}
    </>
  );
}

export function ClientsScreen() {
  const { clients, addClient, updateClient, deleteClient, setStamps, clientBookings } = useSalon();

  const [query, setQuery] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(null);
  const [formMode, setFormMode] = React.useState(null); // null | 'new' | 'edit'

  const today = dayKey(new Date());
  const selected = clients.find((c) => c.id === selectedId) || null;

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients
      .filter((c) => !q
        || c.name.toLowerCase().includes(q)
        || (c.phone || '').includes(q)
        || (c.email || '').toLowerCase().includes(q))
      .sort((a, b) => (b.visits || 0) - (a.visits || 0));
  }, [query, clients]);

  const withUpcoming = React.useMemo(
    () => clients.filter((c) => clientBookings(c.id).some((b) => b.status === 'active' && b.day >= today)).length,
    [clients, clientBookings, today],
  );

  const saveNew = (draft) => {
    const created = addClient(draft);
    setFormMode(null);
    setSelectedId(created.id);
  };

  const saveEdit = (draft) => {
    updateClient(selectedId, draft);
    setFormMode(null);
  };

  const removeClient = () => {
    deleteClient(selectedId);
    setSelectedId(null);
  };

  const back = () => {
    setSelectedId(null);
    setFormMode(null);
  };

  const heading = formMode === 'new'
    ? 'Nová klientka'
    : selected
      ? 'Klientka'
      : 'Klientky';

  const subheading = formMode === 'new'
    ? 'Napríklad telefonická objednávka'
    : selected
      ? `${selected.stamps || 0}/${AURA_PASS.maxStamps} pečiatok Aura Passu`
      : `${clients.length} v evidencii · ${withUpcoming} s objednaným termínom`;

  return (
    <>
      <div style={{ padding: '22px var(--gutter-screen) 0' }}>
        <ScreenHeader
          left={<IconButton icon="menu" label="Menu" size={38} />}
          right={
            selected || formMode
              ? <span style={{ width: 38 }} />
              : <IconButton icon="plus" label="Pridať klientku" size={38} onClick={() => setFormMode('new')} />
          }
        />
        <div style={{ marginTop: 'var(--space-5)' }}>
          <div style={{ font: 'var(--text-display)', letterSpacing: 'var(--tracking-display)' }}>{heading}</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2 }}>{subheading}</div>
        </div>
        {!selected && !formMode && (
          <SearchField
            placeholder="Meno, telefón alebo e-mail"
            value={query}
            onChange={setQuery}
            style={{ marginTop: 'var(--space-5)' }}
          />
        )}
      </div>

      <div className="hh-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '0 var(--gutter-screen)',
        paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--gap-card)',
      }}>
        {formMode === 'new' && (
          <ClientForm
            initial={emptyClient()}
            title="Údaje klientky"
            onSave={saveNew}
            onCancel={() => setFormMode(null)}
          />
        )}

        {formMode === 'edit' && selected && (
          <ClientForm
            initial={selected}
            title={`Upraviť — ${selected.name}`}
            onSave={saveEdit}
            onCancel={() => setFormMode(null)}
          />
        )}

        {!formMode && selected && (
          <ClientDetail
            client={selected}
            bookings={clientBookings(selected.id)}
            onEdit={() => setFormMode('edit')}
            onDelete={removeClient}
            onStamp={(delta) => setStamps(selected.id, delta)}
            onBack={back}
          />
        )}

        {!formMode && !selected && (
          <>
            <SectionLabel style={{ margin: 0 }} action="podľa návštev">Evidencia</SectionLabel>

            {rows.length === 0 ? (
              <GlassCard tone="dim" padding="var(--space-5)">
                <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
                  {query ? `Hľadaniu „${query}“ nezodpovedá žiadna klientka.` : 'Evidencia je zatiaľ prázdna.'}
                </div>
              </GlassCard>
            ) : (
              rows.map((c) => {
                const next = clientBookings(c.id).find((b) => b.status === 'active' && b.day >= today);
                return (
                  <GlassCard
                    key={c.id}
                    tone={next ? 'light' : 'dim'}
                    padding="var(--space-4)"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedId(c.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(c.id);
                      }
                    }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
                  >
                    <Avatar name={c.name} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: 'var(--text-label)' }}>{c.name}</div>
                      <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
                        {withCount(c.visits || 0, 'návšteva', 'návštevy', 'návštev')} · {c.stamps || 0}/{AURA_PASS.maxStamps} pečiatok
                      </div>
                      {next && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                          font: 'var(--text-micro)', color: 'var(--ember-300)', marginTop: 4,
                        }}>
                          <Icon name="calendar-check" size={12} />
                          {formatWhen(next.day, next.time)}
                        </div>
                      )}
                    </div>
                    <Icon name="chevron-right" size={16} style={{ color: 'var(--text-tertiary)', flex: '0 0 auto' }} />
                  </GlassCard>
                );
              })
            )}
          </>
        )}

        <div style={{ height: 96 }} />
      </div>
    </>
  );
}
