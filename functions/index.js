/**
 * Aura Nails — e-mailové notifikácie.
 *
 * V tomto súbore sú VŠETKY cloud funkcie projektu aura-nails-kalendar.
 * Predtým boli rozhádzané v dvoch priečinkoch (Desktop/functions a
 * Desktop/auranails/functions) a nasadenie z jedného vždy zmazalo funkcie
 * toho druhého. Teraz je všetko tu.
 *
 * Heslo ku Gmailu NIE JE v kóde. Je to Firebase secret, nastavíš ho raz:
 *   firebase functions:secrets:set GMAIL_APP_PASSWORD
 *
 * Nasadenie:
 *   cd functions && npm install
 *   firebase deploy --only functions
 */
const functions = require('firebase-functions/v1');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD');

// Odosielacia schránka štúdia (k nej patrí app password v tajomstve vyššie).
const SENDER = 'auranailsmf@gmail.com';
// Kam chodia upozornenia Michaele.
const STUDIO_INBOX = 'michaelafoltanova3@gmail.com';
const STUDIO_NAME = 'Aura Nails';
const REGION_EU = 'europe-west1';

/* ---------------- pomocníci ---------------- */

function transporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SENDER, pass: GMAIL_APP_PASSWORD.value() },
  });
}

// Bezpečné vloženie textu od klientky do HTML e-mailu.
function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const SK_DOW = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
const SK_MON = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];

// '2026-09-22' → 'utorok 22. septembra 2026'
function dateLabel(iso) {
  if (!iso || typeof iso !== 'string') return String(iso || '—');
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${SK_DOW[new Date(y, m - 1, d).getDay()]} ${d}. ${SK_MON[m - 1]} ${y}`;
}

// Aktuálny čas v Bratislave ako { iso: '2026-09-22', hours: 14.5 }.
// Cloud funkcie bežia v UTC, takže sa naň nedá spoľahnúť priamo.
function nowInBratislava() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bratislava', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date()).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  return {
    iso: `${parts.year}-${parts.month}-${parts.day}`,
    hours: Number(parts.hour) + Number(parts.minute) / 60,
  };
}

function addDaysIso(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function timeToHours(t) {
  const [h, m] = String(t || '0:00').split(':').map(Number);
  return (h || 0) + (m || 0) / 60;
}

// Rozpis položiek (hlavná služba + doplnky) ako riadky tabuľky.
function itemsHtml(items, priceLabel, fallbackService) {
  if (!Array.isArray(items) || items.length === 0) {
    return `<p style="margin:0 0 12px;">${esc(fallbackService)}</p>`;
  }
  const rows = items.map((it, i) => `
    <tr>
      <td style="padding:6px 0;color:${i === 0 ? '#3E2727' : '#6B5A55'};">${i === 0 ? '' : '+ '}${esc(it.label)}</td>
      <td style="padding:6px 0;text-align:right;color:#8C6E62;">${esc(it.price)}</td>
    </tr>`).join('');
  const total = priceLabel ? `
    <tr>
      <td style="padding:10px 0 0;border-top:1px solid #E7DED9;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8A7A74;">Spolu</td>
      <td style="padding:10px 0 0;border-top:1px solid #E7DED9;text-align:right;font-size:18px;color:#3E2727;">${esc(priceLabel)}</td>
    </tr>` : '';
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin:12px 0;">${rows}${total}</table>`;
}

function layout(title, bodyHtml) {
  return `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#F7F2EF;color:#3E2727;">
    <div style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#8C6E62;">${STUDIO_NAME} · Handlová</div>
    <h2 style="font-weight:400;margin:6px 0 18px;">${title}</h2>
    <div style="background:#fff;border:1px solid #E7DED9;border-radius:16px;padding:18px;">${bodyHtml}</div>
    <p style="font-size:12px;color:#8A7A74;margin-top:18px;">Táto správa bola odoslaná automaticky z aplikácie Aura Nails.</p>
  </div>`;
}

// Odoslanie + záznam do email_logs, nech je vidieť, čo naozaj odišlo.
async function send(type, mail, meta) {
  try {
    const res = await transporter().sendMail({
      from: `${STUDIO_NAME} <${SENDER}>`, replyTo: SENDER, ...mail,
    });
    await db.collection('email_logs').add({
      type, recipient: mail.to, subject: mail.subject, status: 'sent',
      messageId: res.messageId, sentAt: admin.firestore.FieldValue.serverTimestamp(), ...(meta || {}),
    });
    console.log(`[email] ✓ ${type} → ${mail.to}`);
    return true;
  } catch (err) {
    // E-mail nesmie zhodiť zápis do databázy — rezervácia platí aj bez neho.
    await db.collection('email_logs').add({
      type, recipient: mail.to, subject: mail.subject, status: 'failed',
      error: String(err && err.message), sentAt: admin.firestore.FieldValue.serverTimestamp(), ...(meta || {}),
    }).catch(() => {});
    console.error(`[email] ✗ ${type} → ${mail.to}:`, err && err.message);
    return false;
  }
}

// E-mail klientky: najprv z termínu, potom z jej karty (podľa uid, inak podľa mena).
async function findClientEmail(d) {
  if (d.email) return { email: d.email, client: null };
  if (d.clientUid) {
    const doc = await db.collection('clients').doc(d.clientUid).get();
    if (doc.exists && doc.data().email) return { email: doc.data().email, client: doc.data() };
  }
  if (d.name) {
    const snap = await db.collection('clients').where('name', '==', d.name).limit(1).get();
    if (!snap.empty && snap.docs[0].data().email) return { email: snap.docs[0].data().email, client: snap.docs[0].data() };
  }
  return { email: '', client: null };
}

/* ---------------- nová žiadosť o termín ---------------- */

exports.onNewRequest = functions
  .runWith({ secrets: [GMAIL_APP_PASSWORD] })
  .firestore.document('requests/{docId}')
  .onCreate(async (snap) => {
    const d = snap.data() || {};
    const when = `${dateLabel(d.date)} o ${esc(d.time)}`;

    // 1) Michaele — čo si klientka objednala
    await send('request-studio', {
      to: STUDIO_INBOX,
      subject: `Nová žiadosť — ${d.name || 'klientka'} · ${d.date || ''} ${d.time || ''}`,
      html: layout('Nová žiadosť o termín', `
        <p style="margin:0 0 4px;font-size:17px;">${esc(d.name)}</p>
        <p style="margin:0 0 12px;font-size:13px;color:#8A7A74;">${esc(d.phone) || 'bez telefónu'}${d.email ? ' · ' + esc(d.email) : ''}</p>
        ${itemsHtml(d.items, d.priceLabel, d.service)}
        <p style="margin:12px 0 0;"><strong>${when}</strong></p>
        <p style="margin:4px 0 0;font-size:13px;color:#8A7A74;">Predpokladané trvanie: ${esc(d.duration)} h</p>
        <p style="margin:16px 0 0;font-size:13px;color:#8A7A74;">Potvrď alebo zamietni v appke → záložka Žiadosti.</p>
      `),
    }, { clientName: d.name || '' });

    // 2) Klientke — potvrdenie, že žiadosť dorazila
    if (d.email) {
      await send('request-client', {
        to: d.email,
        subject: `Vaša žiadosť o termín — ${STUDIO_NAME}`,
        html: layout('Ďakujeme za vašu žiadosť', `
          <p style="margin:0 0 12px;">Dobrý deň, ${esc(d.name)},</p>
          <p style="margin:0 0 12px;">vašu žiadosť sme prijali. Michaela ju čoskoro potvrdí a dáme vám vedieť.</p>
          ${itemsHtml(d.items, d.priceLabel, d.service)}
          <p style="margin:12px 0 0;"><strong>${when}</strong></p>
          <p style="margin:16px 0 0;font-size:13px;color:#8A7A74;">Termín zatiaľ nie je záväzne potvrdený.</p>
        `),
      }, { clientName: d.name || '' });
    }
  });

/* ---------------- potvrdený termín v kalendári ---------------- */

exports.onNewAppointment = functions
  .runWith({ secrets: [GMAIL_APP_PASSWORD] })
  .firestore.document('appointments/{docId}')
  .onCreate(async (snap) => {
    const d = snap.data() || {};
    if (d.blocked) return; // voľno/zatvorené — nikomu sa nepíše

    const { email } = await findClientEmail(d);
    if (!email) return; // telefonická klientka bez e-mailu — niet kam písať

    await send('appointment-confirmed', {
      to: email,
      subject: `Termín potvrdený — ${dateLabel(d.date)} o ${d.time}`,
      html: layout('Váš termín je potvrdený', `
        <p style="margin:0 0 12px;">Dobrý deň, ${esc(d.name)},</p>
        <p style="margin:0 0 12px;">tešíme sa na vás.</p>
        ${itemsHtml(d.items, d.priceLabel, d.service)}
        <p style="margin:12px 0 0;"><strong>${dateLabel(d.date)} o ${esc(d.time)}</strong></p>
        <p style="margin:4px 0 0;font-size:13px;color:#8A7A74;">Vyhraďte si prosím ${esc(d.duration)} h.</p>
        <p style="margin:16px 0 0;font-size:13px;color:#8A7A74;">Ak sa vám termín nehodí, ozvite sa nám čo najskôr — zrušenie menej ako 24 hodín vopred je spoplatnené 15 €.</p>
      `),
    }, { clientName: d.name || '', appointmentId: snap.id });
  });

/* ---------------- pripomienky ---------------- */

// Jedna pripomienka. `field` je značka na termíne, aby sa neposlala dvakrát.
async function sendReminder(doc, kind) {
  const d = doc.data() || {};
  if (d.blocked) return false;
  const field = kind === 'day' ? 'reminderDaySentAt' : 'reminderSoonSentAt';
  if (d[field]) return false; // už odoslané

  const { email, client } = await findClientEmail(d);
  if (!email) return false;

  // klientka si pripomienky vie vypnúť v profile appky
  const pref = kind === 'day' ? 'remindDayBefore' : 'remindHoursBefore';
  if (client && client[pref] === false) return false;

  const ok = await send(kind === 'day' ? 'reminder-day' : 'reminder-soon', {
    to: email,
    subject: kind === 'day' ? `Pripomienka — zajtra o ${d.time}` : `Pripomienka — dnes o ${d.time}`,
    html: layout(kind === 'day' ? 'Zajtra sa vidíme' : 'Dnes sa vidíme', `
      <p style="margin:0 0 12px;">Dobrý deň, ${esc(d.name)},</p>
      <p style="margin:0 0 12px;">pripomíname váš ${kind === 'day' ? 'zajtrajší' : 'dnešný'} termín.</p>
      ${itemsHtml(d.items, d.priceLabel, d.service)}
      <p style="margin:12px 0 0;"><strong>${dateLabel(d.date)} o ${esc(d.time)}</strong></p>
    `),
  }, { clientName: d.name || '', appointmentId: doc.id });

  if (ok) await doc.ref.update({ [field]: admin.firestore.FieldValue.serverTimestamp() });
  return ok;
}

// Deň vopred, každý deň o 18:00 bratislavského času.
exports.sendEmailReminder = functions
  .region(REGION_EU)
  .runWith({ secrets: [GMAIL_APP_PASSWORD] })
  .pubsub.schedule('0 18 * * *')
  .timeZone('Europe/Bratislava')
  .onRun(async () => {
    const tomorrow = addDaysIso(nowInBratislava().iso, 1);
    const snap = await db.collection('appointments').where('date', '==', tomorrow).get();
    let sent = 0;
    for (const doc of snap.docs) { if (await sendReminder(doc, 'day')) sent++; }
    console.log(`[pripomienky ${tomorrow}] odoslaných ${sent} z ${snap.size}`);
    return null;
  });

// Dve hodiny pred termínom. Beží každých 30 minút a berie termíny,
// ktoré začínajú o 1,5 až 2,5 hodiny — každý sa tak trafí práve raz.
exports.sendSoonReminder = functions
  .region(REGION_EU)
  .runWith({ secrets: [GMAIL_APP_PASSWORD] })
  .pubsub.schedule('every 30 minutes')
  .timeZone('Europe/Bratislava')
  .onRun(async () => {
    const now = nowInBratislava();
    const snap = await db.collection('appointments').where('date', '==', now.iso).get();
    let sent = 0;
    for (const doc of snap.docs) {
      const lead = timeToHours(doc.data().time) - now.hours;
      if (lead >= 1.5 && lead <= 2.5) { if (await sendReminder(doc, 'soon')) sent++; }
    }
    console.log(`[pripomienky 2h ${now.iso}] odoslaných ${sent}`);
    return null;
  });

// Kľúč, ktorým sú chránené ručné endpointy nižšie.
// Nastavíš ho cez: firebase functions:secrets:set MANUAL_TRIGGER_KEY
const MANUAL_TRIGGER_KEY = defineSecret('MANUAL_TRIGGER_KEY');

function authorized(req) {
  return req.headers.authorization === `Bearer ${MANUAL_TRIGGER_KEY.value()}`;
}

exports.sendEmailReminderManual = functions
  .region(REGION_EU)
  .runWith({ secrets: [GMAIL_APP_PASSWORD, MANUAL_TRIGGER_KEY] })
  .https.onRequest(async (req, res) => {
    if (!authorized(req)) { res.status(401).json({ error: 'Unauthorized' }); return; }

    // ?test=1 → len skúšobný e-mail do schránky štúdia, databázy sa to netýka.
    if (req.query.test) {
      const ok = await send('test', {
        to: STUDIO_INBOX,
        subject: 'Test — e-maily z Aura Nails fungujú',
        html: layout('Skúšobná správa', `
          <p style="margin:0 0 12px;">Ak čítate tento e-mail, odosielanie z appky Aura Nails funguje.</p>
          <p style="margin:0;font-size:13px;color:#8A7A74;">Odoslané ${new Date().toISOString()}</p>
        `),
      });
      res.status(ok ? 200 : 500).json({ test: true, sent: ok, to: STUDIO_INBOX });
      return;
    }

    const target = typeof req.query.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
      ? req.query.date
      : addDaysIso(nowInBratislava().iso, 1);
    const snap = await db.collection('appointments').where('date', '==', target).get();
    let sent = 0;
    for (const doc of snap.docs) { if (await sendReminder(doc, 'day')) sent++; }
    res.json({ success: true, date: target, found: snap.size, sent });
  });
