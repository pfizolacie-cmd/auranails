/* Aura Nails — doplnok pre hlavný web (auranails.sk)
   1) Nahradí starý rezervačný formulár (posielal e-mail, nekontroloval obsadenosť)
      odkazom do appky — aby existoval len JEDEN kalendár.
   2) Pridá chatbota "Aura" (bublina vpravo dole).
   Súbor je samostatný, nezasahuje do app.bundle.js. */
(function () {
  'use strict';
  var APP_URL = '/app/';
  var C = { ink: '#3E2727', ink2: '#6E5B55', ink3: '#9D8B84', porcelain: '#F7F2EF',
            white: '#fff', cream: '#EEE6E1', line: 'rgba(62,39,39,.14)', gold: 'rgba(62,39,39,.30)' };

  /* ---------- 1) Rezervačný formulár → odkaz do appky ---------- */
  function replaceBookingForm() {
    var form = document.querySelector('#kontakt form');
    if (!form || form.dataset.auraReplaced) return false;
    form.dataset.auraReplaced = '1';

    var box = document.createElement('div');
    box.style.cssText = 'max-width:560px;margin:0 auto;padding:30px 26px;background:' + C.white +
      ';border:1px solid ' + C.gold + ';border-radius:22px;text-align:center;font-family:Jost,system-ui,sans-serif';
    box.innerHTML =
      '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:' + C.ink + ';margin-bottom:10px">Rezervácia termínu</div>' +
      '<p style="font-size:.9rem;line-height:1.65;color:' + C.ink2 + ';margin:0 0 22px">' +
        'Termíny prijímame cez našu aplikáciu — uvidíte v nej <strong>skutočne voľné časy</strong> a rezervácia sa rovno zapíše do kalendára. ' +
        'Vďaka tomu sa nestane, že by sa dva termíny prekryli.</p>' +
      '<a href="' + APP_URL + '" style="display:inline-block;background:' + C.ink + ';color:' + C.porcelain +
        ';text-decoration:none;padding:15px 34px;border-radius:999px;font-size:.8rem;letter-spacing:.16em;text-transform:uppercase">Rezervovať v aplikácii</a>' +
      '<p style="font-size:.78rem;color:' + C.ink3 + ';margin:18px 0 0">Nemáte aplikáciu? Otvorí sa priamo v prehliadači, netreba nič inštalovať.</p>';

    form.parentNode.insertBefore(box, form);
    form.style.display = 'none';
    return true;
  }

  /* ---------- 2) Chatbot ---------- */
  var chatState = { open: false, log: [], view: 'menu' };

  var ANSWERS = {
    ceny: 'Gélové nechty: nová modelácia od 33 €, doplnenie od 30 €, gél lak 28 €.\n' +
          'Manikúra: prístrojová 20 €, SPA s peelingom 25 €.\n' +
          'Odborná starostlivosť: IBX kúra 15 €, odstránenie nechtov 15 €.\n\n' +
          'Kompletný a vždy aktuálny cenník nájdete v aplikácii.',
    hodiny: 'Otvorené máme 8:00 – 18:00. Termíny je možné rezervovať až 30 dní dopredu.',
    kde: 'Nechtové štúdio Aura Nails — Michaela Foltánová, Handlová.\nKontakt nájdete nižšie v sekcii Kontakt.',
    pass: 'Aura Pass je náš vernostný program. Za každú návštevu vám Michaela pridá pečiatku a po 5 pečiatkach získate odmenu. Stav vidíte v aplikácii.'
  };

  var MENU = [
    { label: 'Chcem sa objednať', run: function () {
        say('me', 'Chcem sa objednať');
        say('bot', 'Rada vás objednám. Rezervácie vybavujeme v aplikácii, kde uvidíte presne voľné časy — otvorím vám ju.');
        setTimeout(function () { window.location.href = APP_URL; }, 1400);
      } },
    { label: 'Aké máte ceny?', run: function () { say('me', 'Aké máte ceny?'); say('bot', ANSWERS.ceny); } },
    { label: 'Otváracie hodiny', run: function () { say('me', 'Otváracie hodiny'); say('bot', ANSWERS.hodiny); } },
    { label: 'Kde vás nájdem?', run: function () { say('me', 'Kde vás nájdem?'); say('bot', ANSWERS.kde); } },
    { label: 'Ako funguje Aura Pass?', run: function () { say('me', 'Ako funguje Aura Pass?'); say('bot', ANSWERS.pass); } }
  ];

  function say(from, text) { chatState.log.push({ from: from, text: text }); render(); }

  var elBubble, elPanel;

  function buildUI() {
    elBubble = document.createElement('button');
    elBubble.setAttribute('aria-label', 'Otvoriť chat');
    elBubble.style.cssText = 'position:fixed;right:20px;bottom:88px;z-index:9998;width:54px;height:54px;border-radius:50%;' +
      'background:' + C.ink + ';color:' + C.porcelain + ';border:none;cursor:pointer;font-size:22px;' +
      'box-shadow:0 12px 30px -12px rgba(62,39,39,.5);display:flex;align-items:center;justify-content:center';
    elBubble.textContent = '✦';
    elBubble.onclick = function () {
      chatState.open = true;
      if (!chatState.log.length) say('bot', 'Dobrý deň! Som Aura, asistentka štúdia. S čím vám môžem pomôcť?');
      else render();
    };
    document.body.appendChild(elBubble);

    elPanel = document.createElement('div');
    elPanel.style.cssText = 'position:fixed;right:20px;bottom:88px;z-index:9999;width:330px;max-width:calc(100vw - 40px);' +
      'max-height:70vh;display:none;flex-direction:column;background:' + C.porcelain + ';border:1px solid ' + C.gold +
      ';border-radius:20px;overflow:hidden;box-shadow:0 24px 50px -18px rgba(62,39,39,.45);font-family:Jost,system-ui,sans-serif';
    document.body.appendChild(elPanel);
    render();
  }

  function render() {
    if (!elPanel) return;
    elBubble.style.display = chatState.open ? 'none' : 'flex';
    elPanel.style.display = chatState.open ? 'flex' : 'none';
    if (!chatState.open) return;

    var msgs = chatState.log.map(function (m) {
      var base = 'max-width:85%;padding:9px 13px;border-radius:14px;font-size:.83rem;line-height:1.5;white-space:pre-line;';
      var s = m.from === 'me'
        ? base + 'align-self:flex-end;background:' + C.ink + ';color:' + C.porcelain
        : base + 'align-self:flex-start;background:' + C.white + ';color:' + C.ink + ';border:1px solid ' + C.line;
      return '<div style="' + s + '">' + escapeHtml(m.text) + '</div>';
    }).join('');

    var opts = MENU.map(function (o, i) {
      return '<button data-i="' + i + '" style="cursor:pointer;padding:8px 14px;border-radius:999px;background:' + C.white +
        ';border:1px solid ' + C.gold + ';color:' + C.ink2 + ';font-family:inherit;font-size:.78rem">' + o.label + '</button>';
    }).join('');

    elPanel.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:' + C.ink + ';color:' + C.porcelain + '">' +
        '<span style="font-family:\'Cormorant Garamond\',serif;font-size:1.05rem">Aura — asistentka</span>' +
        '<button id="aura-x" aria-label="Zavrieť chat" style="background:none;border:none;color:inherit;font-size:1.2rem;cursor:pointer;line-height:1">×</button>' +
      '</div>' +
      '<div id="aura-msgs" style="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px">' + msgs + '</div>' +
      '<div id="aura-opts" style="padding:12px 14px;border-top:1px solid ' + C.line + ';display:flex;flex-wrap:wrap;gap:7px">' + opts + '</div>';

    elPanel.querySelector('#aura-x').onclick = function () { chatState.open = false; render(); };
    elPanel.querySelectorAll('#aura-opts button').forEach(function (b) {
      b.onclick = function () { MENU[+b.dataset.i].run(); };
    });
    var m = elPanel.querySelector('#aura-msgs');
    m.scrollTop = m.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- štart (web sa vykresľuje Reactom, počkáme naň) ---------- */
  function boot() {
    if (!document.body) return setTimeout(boot, 100);
    if (!elBubble) buildUI();
    var done = replaceBookingForm();
    if (!done) setTimeout(boot, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
