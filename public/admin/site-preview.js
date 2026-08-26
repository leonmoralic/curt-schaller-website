/*
 * Web-Vorschau: zeigt die veroeffentlichte Website in einem Rahmen neben
 * dem Editor und springt zu dem Abschnitt, der gerade bearbeitet wird.
 *
 * Wichtig und deshalb in der Oberflaeche auch so beschriftet: Der Rahmen
 * zeigt den VEROEFFENTLICHTEN Stand. Ungespeicherte Aenderungen sind darin
 * nicht zu sehen — dafuer ist die Feldvorschau im Editor da. Nach dem
 * Speichern dauert es rund zwei Minuten, bis die Seite neu gebaut ist;
 * darum gibt es einen Knopf zum Neuladen.
 */
(function () {
  var ANKER = {
    hero: 'hero', about: 'about', inventions: 'inventions',
    practice: 'practice', contact: 'contact'
  };
  var sprache = 'de';
  var offen = false;
  var panel, rahmen;

  function aktuellerAnker() {
    var m = /#\/collections\/([a-z]+)/.exec(location.hash || '');
    return (m && ANKER[m[1]]) || 'hero';
  }

  function ziel() { return '/' + sprache + '/#' + aktuellerAnker(); }

  function laden(neu) {
    if (!rahmen) return;
    var pfad = '/' + sprache + '/';
    var gleicheSeite = !neu && rahmen.contentWindow &&
      (rahmen.contentWindow.location.pathname === pfad);
    if (gleicheSeite) {
      // Nur der Anker aendert sich — kein Neuladen noetig.
      try { rahmen.contentWindow.location.hash = '#' + aktuellerAnker(); return; } catch (e) { /* faellt durch */ }
    }
    rahmen.src = ziel();
  }

  function bauen() {
    panel = document.createElement('div');
    panel.id = 'web-vorschau';
    panel.innerHTML =
      '<div class="wv__kopf">' +
        '<div class="wv__titel">Veroeffentlichte Seite</div>' +
        '<div class="wv__hinweis">Ungespeicherte Aenderungen sind hier nicht zu sehen</div>' +
        '<div class="wv__knoepfe">' +
          '<button type="button" data-wv="de" class="wv__sprache is-aktiv">DE</button>' +
          '<button type="button" data-wv="en" class="wv__sprache">EN</button>' +
          '<button type="button" data-wv="neu">Neu laden</button>' +
          '<button type="button" data-wv="zu">Schliessen</button>' +
        '</div>' +
      '</div>' +
      '<iframe class="wv__rahmen" title="Vorschau der Website"></iframe>' +
      '<div class="wv__griff" title="Breite ziehen"></div>';
    document.body.appendChild(panel);
    rahmen = panel.querySelector('.wv__rahmen');

    // Breite ziehen. Waehrend des Ziehens nimmt der Rahmen keine
    // Mausereignisse an, sonst verschluckt er sie.
    var griff = panel.querySelector('.wv__griff');
    griff.addEventListener('mousedown', function (e) {
      e.preventDefault();
      rahmen.style.pointerEvents = 'none';
      function zieh(ev) {
        var breite = Math.min(Math.max(window.innerWidth - ev.clientX, 320), window.innerWidth - 240);
        panel.style.width = breite + 'px';
      }
      function los() {
        rahmen.style.pointerEvents = '';
        window.removeEventListener('mousemove', zieh);
        window.removeEventListener('mouseup', los);
        try { localStorage.setItem('wv.breite', panel.style.width); } catch (err) {}
      }
      window.addEventListener('mousemove', zieh);
      window.addEventListener('mouseup', los);
    });
    try {
      var gemerkt = localStorage.getItem('wv.breite');
      if (gemerkt) panel.style.width = gemerkt;
    } catch (err) {}

    panel.addEventListener('click', function (e) {
      var was = e.target && e.target.getAttribute && e.target.getAttribute('data-wv');
      if (!was) return;
      if (was === 'zu') return umschalten(false);
      if (was === 'neu') return laden(true);
      if (was === 'de' || was === 'en') {
        sprache = was;
        panel.querySelectorAll('.wv__sprache').forEach(function (b) {
          b.classList.toggle('is-aktiv', b.getAttribute('data-wv') === was);
        });
        laden(true);
      }
    });
  }

  function umschalten(auf) {
    offen = auf === undefined ? !offen : auf;
    if (offen && !panel) bauen();
    if (panel) panel.classList.toggle('is-offen', offen);
    knopf.textContent = offen ? 'Vorschau schliessen' : 'Website ansehen';
    if (offen) laden(true);
  }

  var knopf = document.createElement('button');
  knopf.type = 'button';
  knopf.id = 'web-vorschau-knopf';
  knopf.textContent = 'Website ansehen';
  knopf.addEventListener('click', function () { umschalten(); });

  var stil = document.createElement('style');
  stil.textContent =
    '#web-vorschau-knopf{position:fixed;right:16px;bottom:16px;z-index:2147483000;' +
      'padding:10px 16px;border:1px solid rgba(0,0,0,.25);border-radius:6px;' +
      'background:#1c1c1e;color:#fff;font:500 13px/1 system-ui,sans-serif;cursor:pointer}' +
    '#web-vorschau-knopf:hover{background:#000}' +
    '#web-vorschau{position:fixed;top:var(--wv-oben,0px);right:0;width:46vw;min-width:360px;height:calc(100vh - var(--wv-oben,0px));' +
      'z-index:2147482999;display:none;flex-direction:column;background:#fff;' +
      'border-left:1px solid rgba(0,0,0,.18);box-shadow:-8px 0 24px rgba(0,0,0,.12)}' +
    '#web-vorschau.is-offen{display:flex}' +
    '.wv__kopf{padding:10px 12px 10px;border-bottom:1px solid rgba(0,0,0,.12);' +
      'font:13px/1.4 system-ui,sans-serif;background:#f6f6f7}' +
    '.wv__titel{font-weight:600}' +
    '.wv__hinweis{color:#666;font-size:12px;margin-top:2px}' +
    '.wv__knoepfe{margin-top:8px;display:flex;gap:6px;flex-wrap:wrap}' +
    '.wv__kopf button{padding:4px 10px;border:1px solid rgba(0,0,0,.25);border-radius:4px;' +
      'background:#fff;font:500 12px/1 system-ui,sans-serif;cursor:pointer}' +
    '.wv__kopf button:hover{background:#eee}' +
    '.wv__kopf button.is-aktiv{background:#1c1c1e;color:#fff;border-color:#1c1c1e}' +
    '.wv__rahmen{flex:1;width:100%;border:0}' +
    // Ziehgriff an der linken Kante: der Rahmen ueberlagert den Editor,
    // also muss man ihn schmaler ziehen koennen statt Sveltias Layout
    // von aussen umzubauen.
    '.wv__griff{position:absolute;left:0;top:0;width:6px;height:100%;cursor:ew-resize;' +
      'background:transparent}' +
    '.wv__griff:hover{background:rgba(0,0,0,.12)}';

  function start() {
    document.head.appendChild(stil);
    document.body.appendChild(knopf);
    // Abschnittswechsel im Editor folgt der Rahmen automatisch.
    window.addEventListener('hashchange', function () { if (offen) laden(false); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
