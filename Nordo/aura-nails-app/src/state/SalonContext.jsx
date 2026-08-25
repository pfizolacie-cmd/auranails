/* Jediný zdroj pravdy o rezerváciách, klientkach a žiadostiach.
 *
 * Držíme všetko v pamäti a zrkadlíme do localStorage, takže appka prežije
 * obnovenie stránky. Pri ostrom nasadení sa `load`/`persist` vymenia za volania
 * na backend (v existujúcej appke je to Firestore) — zvyšok appky sa meniť
 * nemusí, pracuje len s týmto rozhraním. */

import React from 'react';
import {
  AURA_PASS, CLIENTS, CURRENT_CLIENT, getService, getAddon,
} from '../data/salon.js';
import { dayKey, totalMins, totalPrice, hoursUntil } from '../lib/schedule.js';

const STORAGE_KEY = 'aura-nails-state-v2';

const SalonContext = React.createContext(null);

/** Ukážkové rezervácie, aby deň majiteľky nebol pri prvom spustení prázdny.
 *  Počítajú sa od dnešného dňa, takže appka vyzerá živo kedykoľvek ju otvoríte. */
function seedBookings() {
  const today = new Date();
  const plus = (n) => {
    const d = new Date(today);
    d.setDate(today.getDate() + n);
    return dayKey(d);
  };

  const make = (id, day, time, serviceId, clientId, clientName, status = 'active') => {
    const svc = getService(serviceId);
    return {
      id, day, time, serviceId, addonIds: [],
      mins: svc.mins, price: svc.price,
      clientId, clientName, status,
      createdAt: new Date().toISOString(),
    };
  };

  return [
    make('s1', plus(0), '08:30', 'model-dlhe', 'c3', 'Martina Hrušková'),
    make('s2', plus(0), '11:00', 'gel-lak', 'c2', 'Lucia Bendová'),
    make('s3', plus(0), '13:00', 'ibx-plus', 'c5', 'Katarína Molnárová'),
    make('s4', plus(0), '15:00', 'spa', 'c4', 'Simona Vargová'),
    make('s5', plus(3), '09:00', 'doplnenie-stredne', 'c1', 'Zuzana Krajčíová'),
    make('s6', plus(-21), '10:00', 'model-stredne', 'c1', 'Zuzana Krajčíová', 'done'),
  ];
}

/** Jedna čakajúca žiadosť, aby bola záložka Žiadosti hneď čitateľná. */
function seedRequests() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  const svc = getService('spa');
  return [{
    id: 'r1', day: dayKey(d), time: '10:00',
    serviceId: 'spa', addonIds: [], mins: svc.mins, price: svc.price,
    clientId: 'c4', clientName: 'Simona Vargová', phone: '+421 949 720 145',
    createdAt: new Date().toISOString(),
  }];
}

const seedState = () => ({
  bookings: seedBookings(),
  clients: CLIENTS,
  requests: seedRequests(),
});

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.bookings)) return seedState();
    return {
      bookings: parsed.bookings,
      clients: Array.isArray(parsed.clients) && parsed.clients.length ? parsed.clients : CLIENTS,
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
    };
  } catch {
    // Poškodený alebo nedostupný localStorage nesmie zhodiť appku.
    return seedState();
  }
}

const newId = (prefix) => `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 6)}`;

export function SalonProvider({ children }) {
  const [state, setState] = React.useState(load);
  const { bookings, clients, requests } = state;

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* privátny režim prehliadača — appka funguje ďalej, len bez perzistencie */
    }
  }, [state]);

  const patch = React.useCallback((fn) => setState((prev) => ({ ...prev, ...fn(prev) })), []);

  /* ---- Žiadosti o termín ---------------------------------------------- */

  /** Zákazníčka odosiela žiadosť — do kalendára sa dostane až po schválení. */
  const addRequest = React.useCallback(({ day, time, serviceId, addonIds = [] }) => {
    const service = getService(serviceId);
    const addons = addonIds.map(getAddon).filter(Boolean);
    const request = {
      id: newId('r'), day, time, serviceId, addonIds,
      mins: totalMins(service, addons),
      price: totalPrice(service, addons),
      clientId: CURRENT_CLIENT.id,
      clientName: CURRENT_CLIENT.name,
      phone: CURRENT_CLIENT.phone,
      createdAt: new Date().toISOString(),
    };
    patch((prev) => ({ requests: [...prev.requests, request] }));
    return request;
  }, [patch]);

  /**
   * Schválenie žiadosti. Rovnako ako v pôvodnej appke: vznikne termín a
   * klientke pribudne návšteva, pečiatka a záznam v histórii.
   * `mins` umožňuje Michaele upraviť trvanie pred potvrdením.
   */
  const approveRequest = React.useCallback((id, mins) => {
    patch((prev) => {
      const req = prev.requests.find((r) => r.id === id);
      if (!req) return {};
      const duration = mins ?? req.mins;
      const service = getService(req.serviceId);

      const booking = {
        id: newId('b'), day: req.day, time: req.time,
        serviceId: req.serviceId, addonIds: req.addonIds,
        mins: duration, price: req.price,
        clientId: req.clientId, clientName: req.clientName,
        status: 'active', createdAt: new Date().toISOString(),
      };

      return {
        bookings: [...prev.bookings, booking],
        requests: prev.requests.filter((r) => r.id !== id),
        clients: prev.clients.map((c) => (c.id === req.clientId ? {
          ...c,
          visits: (c.visits || 0) + 1,
          stamps: Math.min(AURA_PASS.maxStamps, (c.stamps || 0) + 1),
          history: [{ service: service.name, date: req.day }, ...(c.history || [])],
        } : c)),
      };
    });
  }, [patch]);

  const rejectRequest = React.useCallback((id) => {
    patch((prev) => ({ requests: prev.requests.filter((r) => r.id !== id) }));
  }, [patch]);

  /* ---- Termíny --------------------------------------------------------- */

  const cancelBooking = React.useCallback((id) => {
    patch((prev) => ({
      bookings: prev.bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)),
    }));
  }, [patch]);

  /* ---- Klientky -------------------------------------------------------- */

  const addClient = React.useCallback((data) => {
    const client = { ...data, id: newId('c'), history: data.history || [] };
    patch((prev) => ({ clients: [...prev.clients, client] }));
    return client;
  }, [patch]);

  const updateClient = React.useCallback((id, data) => {
    patch((prev) => ({ clients: prev.clients.map((c) => (c.id === id ? { ...c, ...data } : c)) }));
  }, [patch]);

  /** Zmazanie klientky nechá jej termíny na pokoji — sú súčasťou rozvrhu dňa. */
  const deleteClient = React.useCallback((id) => {
    patch((prev) => ({
      clients: prev.clients.filter((c) => c.id !== id),
      requests: prev.requests.filter((r) => r.clientId !== id),
    }));
  }, [patch]);

  /** Pečiatky Aura Passu pridáva a odoberá Michaela ručne. */
  const setStamps = React.useCallback((id, delta) => {
    patch((prev) => ({
      clients: prev.clients.map((c) => (c.id === id ? {
        ...c,
        stamps: Math.max(0, Math.min(AURA_PASS.maxStamps, (c.stamps || 0) + delta)),
      } : c)),
    }));
  }, [patch]);

  /* ---- Odvodené výbery -------------------------------------------------- */

  const myBookings = React.useMemo(
    () => bookings
      .filter((b) => b.clientId === CURRENT_CLIENT.id)
      .sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time)),
    [bookings],
  );

  const myRequests = React.useMemo(
    () => requests
      .filter((r) => r.clientId === CURRENT_CLIENT.id)
      .sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time)),
    [requests],
  );

  const me = React.useMemo(
    () => clients.find((c) => c.id === CURRENT_CLIENT.id) || null,
    [clients],
  );

  const dayAgenda = React.useCallback(
    (key) => bookings
      .filter((b) => b.day === key && b.status !== 'cancelled')
      .sort((a, b) => a.time.localeCompare(b.time)),
    [bookings],
  );

  const clientBookings = React.useCallback(
    (id) => bookings
      .filter((b) => b.clientId === id)
      .sort((a, b) => (b.day + b.time).localeCompare(a.day + a.time)),
    [bookings],
  );

  const value = React.useMemo(() => ({
    bookings, clients, requests,
    addRequest, approveRequest, rejectRequest,
    cancelBooking,
    addClient, updateClient, deleteClient, setStamps,
    myBookings, myRequests, me, dayAgenda, clientBookings,
  }), [
    bookings, clients, requests,
    addRequest, approveRequest, rejectRequest, cancelBooking,
    addClient, updateClient, deleteClient, setStamps,
    myBookings, myRequests, me, dayAgenda, clientBookings,
  ]);

  return <SalonContext.Provider value={value}>{children}</SalonContext.Provider>;
}

export function useSalon() {
  const ctx = React.useContext(SalonContext);
  if (!ctx) throw new Error('useSalon musí byť použité vnútri <SalonProvider>');
  return ctx;
}

export { hoursUntil };
