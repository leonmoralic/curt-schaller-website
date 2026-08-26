/*
 * Meldet im Editor, ob eine Aenderung tatsaechlich veroeffentlicht wurde.
 *
 * Hintergrund: Sveltia meldet nur "gespeichert" — das heisst aber lediglich,
 * dass der Text im Repo liegt. Ob die Website daraus auch gebaut und
 * hochgeladen wurde, sieht die Redaktion sonst nirgends. Am 25.08.2026 sind
 * so elf Aenderungen einen ganzen Tag lang unbemerkt liegengeblieben.
 *
 * Die Abfrage laeuft ohne Anmeldung gegen die oeffentliche GitHub-API. Deren
 * Grenze liegt bei 60 Abfragen je Stunde und IP-Adresse, deshalb nur alle
 * zwei Minuten und nur, solange der Tab sichtbar ist.
 */
(function () {
  var REPO = 'leonmoralic/curt-schaller-website';
  var TAKT = 120000;
  var leiste, letzterZustand = null, warAmBauen = false, versteckenTimer;

  function bauen() {
    leiste = document.createElement('div');
    leiste.id = 'deploy-meldung';
    document.body.appendChild(leiste);
    var stil = document.createElement('style');
    stil.textContent =
      '#deploy-meldung{position:fixed;top:0;left:0;right:0;z-index:2147483600;' +
        'display:none;padding:10px 16px;font:500 13px/1.45 system-ui,sans-serif;' +
        'text-align:center;color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.18)}' +
      '#deploy-meldung.is-sichtbar{display:block}' +
      '#deploy-meldung.ist-fehler{background:#8c1d18}' +
      '#deploy-meldung.ist-unterwegs{background:#40464d}' +
      '#deploy-meldung.ist-fertig{background:#1f5c34}' +
      '#deploy-meldung a{color:#fff;text-decoration:underline}';
    document.head.appendChild(stil);
  }

  function zeigen(art, text) {
    if (!leiste) bauen();
    clearTimeout(versteckenTimer);
    leiste.className = 'is-sichtbar ist-' + art;
    leiste.innerHTML = text;
    // Die Web-Vorschau darf nicht unter die Leiste rutschen.
    document.documentElement.style.setProperty('--wv-oben', leiste.offsetHeight + 'px');
    if (art === 'fertig') versteckenTimer = setTimeout(verstecken, 12000);
  }

  function verstecken() {
    if (!leiste) return;
    leiste.className = '';
    document.documentElement.style.setProperty('--wv-oben', '0px');
  }

  function pruefen() {
    if (document.hidden) return;
    fetch('https://api.github.com/repos/' + REPO + '/actions/runs?per_page=1&branch=main',
      { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) {
        // Bei ueberschrittener Abfragegrenze lieber nichts sagen als falsch warnen.
        if (r.status === 403 || r.status === 429) throw new Error('Abfragegrenze');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) {
        var lauf = d.workflow_runs && d.workflow_runs[0];
        if (!lauf) return;
        var zustand = lauf.status === 'completed' ? lauf.conclusion : 'unterwegs';
        if (zustand === letzterZustand && zustand !== 'unterwegs') return;
        letzterZustand = zustand;

        if (zustand === 'unterwegs') {
          warAmBauen = true;
          zeigen('unterwegs', 'Die Website wird gerade neu erstellt. Das dauert etwa zwei Minuten.');
        } else if (zustand === 'success') {
          if (warAmBauen) { warAmBauen = false; zeigen('fertig', 'Fertig — deine Aenderung ist jetzt auf cos-cam.com zu sehen.'); }
          else verstecken();
        } else {
          warAmBauen = false;
          zeigen('fehler',
            '<strong>Achtung: Die Veroeffentlichung ist fehlgeschlagen.</strong> ' +
            'Deine Aenderungen sind gespeichert, aber sie sind NICHT auf der Website. ' +
            'Bitte gib Leon Bescheid und arbeite bis dahin nicht weiter — ' +
            '<a href="https://github.com/' + REPO + '/actions" target="_blank" rel="noopener">Einzelheiten</a>');
        }
      })
      .catch(function () { /* still bleiben, lieber keine Meldung als eine falsche */ });
  }

  document.addEventListener('visibilitychange', function () { if (!document.hidden) pruefen(); });
  setInterval(pruefen, TAKT);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pruefen);
  else pruefen();
})();
