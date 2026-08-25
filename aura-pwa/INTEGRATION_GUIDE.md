# 🎨 AURA NAILS — UI/UX Redesign Integration Guide

## Overview
Redesign pozostáva z 3 nových súborov:
1. **aura-design.css** — Nový modernizovaný CSS (shadows, animations, Aura farby)
2. **email-reminders.js** — Firebase Cloud Function (24h email reminders)
3. **notifications.js** — Push + In-app notifications system

---

## 📋 FÁZA 1: CSS Integration (30 minút)

### Krok 1: Backup starej verzie
```bash
# GitHub Web Editor → app.jsx → Download
# Uložiť ako: app.jsx.backup
```

### Krok 2: Vložiť nový CSS do HTML
V `index.html` (alebo v app.jsx kde je `<head>`):

```html
<!-- REPLACE OLD colors_and_type.css s novým: -->
<link rel="stylesheet" href="aura-design.css">
```

### Krok 3: Kopírovať aura-design.css
- Nahrať `aura-design.css` do GitHub repo root
- ALEBO: Vložiť obsah do `<style>` tagu v index.html

### Krok 4: Update inline st() calls
Najväčšia zmena: **Zmeniť inline CSS na CSS classes**

#### Príklad:
```javascript
// STARÝ SPÔSOB:
<div style={st('flex:1;padding:20px;background:var(--white);border-radius:18px')}>

// NOVÝ SPÔSOB:
<div className="card">
```

---

## 📋 FÁZA 2: Email Reminders Setup (45 minút)

### Krok 1: Firebase setup
1. Otvoriť Firebase Console: https://console.firebase.google.com/
2. Project → **aura-nails-kalendar**
3. Functions tab → "Create new function"

### Krok 2: Deploy Cloud Function
```bash
# Option A: Firebase CLI (v CLI nástroj)
firebase functions:config:set gmail.user="your@email.com" gmail.password="app-password"
firebase deploy --only functions

# Option B: Copy-paste do Firebase Console
# Functions → New function → Runtime: Node.js 18
# Paste: email-reminders.js
```

### Krok 3: Nastaviť Environment Variables
Firebase Console → Functions → Environment variables:
```
EMAIL_USER = tvojEmail@gmail.com
EMAIL_PASSWORD = tvoje-app-specific-password
MANUAL_TRIGGER_KEY = random-secret-key-123
```

### Krok 4: Test Email Function
Zavolať HTTP endpoint (z CLI):
```bash
curl -H "Authorization: Bearer random-secret-key-123" \
  https://europe-west1-aura-nails-kalendar.cloudfunctions.net/sendEmailReminderManual
```

---

## 📋 FÁZA 3: Notifications Setup (30 minút)

### Krok 1: Copy notifications.js do app
V `index.html` alebo do build pipeline:

```html
<script src="notifications.js"></script>
```

### Krok 2: Initialize v app.jsx
V `App()` komponente, kde je auth setup:

```javascript
// Po firebase init:
const { notifications, unreadCount, manager } = useNotifications(db, auth, user?.uid);
```

### Krok 3: Vložiť Notification UI
Ukáž notification center ako modal:

```javascript
// V JSX renderingom:
<NotificationCenter 
  isOpen={showNotificationCenter}
  onClose={() => setShowNotificationCenter(false)}
  notifications={notifications}
  onMarkRead={(id) => manager.markAsRead(id)}
  onDelete={(id) => manager.deleteNotification(id)}
  onMarkAllRead={() => manager.markAllAsRead()}
/>
```

### Krok 4: Hook up notifications na events
Keď sa uloží appointment:

```javascript
// V saveAppointment():
await manager.sendConfirmationNotification(newAppointment);

// Keď sa appointment ruší:
await manager.sendCancellationNotification(appointment);

// Pri zmene cien:
await manager.sendPriceChangeNotification(changes);
```

---

## 🎯 CSS Classes — Quick Reference

Nové CSS classes na zamenu inline st() calls:

### Buttons
```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-ghost">Ghost Button</button>
```

### Cards
```html
<div class="card">Content</div>
<div class="card card-elevated">Elevated card</div>
```

### Inputs
```html
<input type="text" class="input">
<textarea class="textarea"></textarea>
```

### Calendar
```html
<div class="calendar-grid">
  <div class="calendar-day">1</div>
  <div class="calendar-day selected">2</div>
  <div class="calendar-day disabled">3</div>
</div>
```

### Notifications
```html
<div class="notification notification-success">
  <div class="notification-icon">✓</div>
  <div class="notification-content">
    <div class="notification-title">Title</div>
    <div class="notification-text">Message</div>
  </div>
</div>
```

### Tabs
```html
<div class="tabs">
  <button class="tab-btn active">Tab 1</button>
  <button class="tab-btn">Tab 2</button>
</div>
```

---

## 🚀 Deployment Checklist

- [ ] aura-design.css uploadnutý do GitHub
- [ ] app.jsx aktualizovaný s novými CSS classes
- [ ] Email Cloud Function deploynutý
- [ ] Environment variables nastavené
- [ ] Notifications.js vložený do app
- [ ] useNotifications hook integrovaný
- [ ] Push notification permission request Added
- [ ] Test: Otvoriť app → skontrolovať styling
- [ ] Test: Vytvoriť appointment → dostať notification
- [ ] Test: Skúsiť email test function
- [ ] Test: Mobile responsive (4-column calendar on mobile)

---

## 📝 Refactoring Tips

### Ako rýchlo upgrade-nut app.jsx:

1. **Search & Replace (GitHub Web Editor)**
   ```
   Find: <div style={st('
   Replace with: <div className="
   ```

2. **CSS Color Vars** (už v aura-design.css):
   ```css
   --taupe: #9d8b7e;
   --espresso: #3d3d3d;
   --text: #2c2c2a;
   --bg: #faf8f6;
   ```

3. **Button examples**:
   ```javascript
   // OLD:
   <button style={st('background:var(--espresso);color:white;...')}>Save</button>
   
   // NEW:
   <button class="btn btn-primary">Save</button>
   ```

4. **Card examples**:
   ```javascript
   // OLD:
   <div style={st('background:white;border-radius:18px;padding:16px;...')}>
   
   // NEW:
   <div class="card">
   ```

---

## 🔧 Firebase Cloud Functions Setup (Detailed)

### Option 1: Firebase CLI

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Init functions in your project
firebase init functions

# 4. Replace functions/index.js with email-reminders.js content

# 5. Install nodemailer
cd functions
npm install nodemailer

# 6. Set config
firebase functions:config:set gmail.user="your@gmail.com"
firebase functions:config:set gmail.password="your-app-password"

# 7. Deploy
firebase deploy --only functions
```

### Option 2: Firebase Console (No CLI)

1. Firebase Console → Functions
2. "Create new function"
3. Trigger type: Cloud Pub/Sub
4. Copy paste email-reminders.js code
5. Runtime: Node.js 18
6. Add dependency: `nodemailer@^6.9.0`
7. Deploy

---

## 🧪 Testing Notifications

### Test Email Reminder:
```bash
curl -H "Authorization: Bearer YOUR_MANUAL_TRIGGER_KEY" \
  https://europe-west1-aura-nails-kalendar.cloudfunctions.net/sendEmailReminderManual
```

### Test In-App Notification:
```javascript
// In browser console:
manager.sendCustomNotification(
  '🧪 Test Notif',
  'This is a test notification',
  'info'
);
```

### Test Push Notification:
```javascript
// Browser console:
manager.sendPushNotification('Test Push', 'This is a test push');
```

---

## 🎨 Color Reference

```css
--taupe: #9d8b7e;           /* Primary accent */
--taupe-dark: #7a6b5e;      /* Darker variant */
--taupe-light: #c7b8ac;     /* Lighter variant */
--espresso: #3d3d3d;        /* Primary text/buttons */
--espresso-light: #5a5a5a;  /* Secondary text */
--white: #faf8f6;           /* Background/cards */
--text: #2c2c2a;            /* Main text */
--border: #e8e6e1;          /* Borders */
```

---

## 🆘 Troubleshooting

### Issue: CSS not applying
- Check: Link tag in HTML correct?
- Check: Cache busted? (Hard reload Ctrl+Shift+R)
- Check: CSS file in root of repo?

### Issue: Email not sending
- Check: Gmail app password configured?
- Check: SMTP credentials correct?
- Check: Less secure apps enabled (if using Gmail)?

### Issue: Notifications not showing
- Check: Browser supports notifications?
- Check: User granted permission?
- Check: Service Worker registered?

### Issue: Mobile styling broken
- Check: CSS media queries in aura-design.css
- Check: Viewport meta tag present?
- Check: Calendar grid responsive (should be 4 cols on mobile)

---

## 📞 Next Steps

1. **Phase 1**: CSS refactor (today)
2. **Phase 2**: Email reminders (tomorrow)
3. **Phase 3**: Notifications (tomorrow)
4. **Phase 4**: Recurring appointments (next week)
5. **Phase 5**: Aura Pass loyalty system (optional)

---

## 📚 Resources

- Firebase Functions: https://firebase.google.com/docs/functions
- Cloud Scheduler: https://cloud.google.com/scheduler
- Web Push API: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
- Nodemailer: https://nodemailer.com/

---

**Ready to deploy? Git commit & push!** 🚀
