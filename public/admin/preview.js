/*
 * Vorschau fuer den Redaktionsbereich.
 *
 * Zwei Dinge passieren hier:
 *  1. Das echte Stylesheet der Website wird zur Laufzeit von einer Seite
 *     abgeholt und in die Vorschau geladen. Astro haengt einen Hash an den
 *     Dateinamen, der sich bei jedem Build aendert — deshalb ausgelesen und
 *     nicht fest eingetragen. Schrift, Farben und Abstaende stammen damit aus
 *     derselben Quelle wie die Seite und koennen nicht auseinanderlaufen.
 *  2. Das Markup der Abschnitte wird nachgebaut, weil die Astro-Komponenten
 *     im Editor nicht laufen. Es verwendet dieselben CSS-Klassen. Aendert
 *     jemand spaeter das Markup der Website, muss diese Datei nachgezogen
 *     werden — die Vorschau wird dann ungenau, nicht kaputt.
 *
 * Bewusst NICHT abgebildet: GSAP-Animationen, Scroll-Effekte, die
 * Oscar-Statue. Die Vorschau zeigt das Layout im Ruhezustand.
 */
(function () {
  var CMS = window.CMS;
  if (!CMS) { console.error('[Vorschau] CMS nicht gefunden'); return; }

  // Sveltia legt h und createClass global ab, nicht auf dem CMS-Objekt.
  var h = CMS.h || window.h;
  var createClass = CMS.createClass || window.createClass;
  if (!h || !createClass) { console.error('[Vorschau] Kein Renderer verfuegbar'); return; }

  // --- 1. Echtes Stylesheet der Website einhaengen ----------------------
  fetch('/de/', { credentials: 'omit' })
    .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var found = 0;
      // Gebaute Seite: verlinktes Stylesheet mit Hash im Dateinamen.
      doc.querySelectorAll('link[rel="stylesheet"]').forEach(function (l) {
        var href = l.getAttribute('href');
        if (href) { CMS.registerPreviewStyle(href); found++; }
      });
      // Entwicklungsmodus: Astro bettet die Stile direkt ein.
      doc.querySelectorAll('style').forEach(function (el) {
        var css = el.textContent;
        if (css && css.trim()) { CMS.registerPreviewStyle(css, { raw: true }); found++; }
      });
      if (!found) throw new Error('keine Stile gefunden');
    })
    .catch(function (e) {
      console.warn('[Vorschau] Stylesheet der Website nicht ladbar:', e);
    });

  // Der Editor rendert kein GSAP. Ohne diese Zeile blieben alle Elemente
  // unsichtbar, weil .reveal im Ausgangszustand transparent ist.
  CMS.registerPreviewStyle(
    '.reveal{opacity:1!important;transform:none!important}' +
    '[data-split] .line{opacity:1!important;transform:none!important}' +
    'body{padding:24px}' +
    '.hero__img-glow,.tl__oscar-wrap{display:none}',
    { raw: true }
  );

  // --- 2. Bausteine ----------------------------------------------------
  function plain(v) { return v === undefined || v === null ? '' : v; }
  function html(v) { return { __html: plain(v) }; }
  function toJS(v) { return v && typeof v.toJS === 'function' ? v.toJS() : v; }
  function data(entry) { return toJS(entry.getIn(['data'])) || {}; }
  function list(v) { return Array.isArray(v) ? v : []; }

  function section(num, label, title, alt, children) {
    return h('section', { className: 'section' + (alt ? ' section--alt' : '') },
      h('div', { className: 'container section__inner' },
        h('aside', { className: 'section__rail' },
          h('span', { className: 'section__num' }, num),
          h('span', null, label)),
        h('div', { className: 'section__body' },
          title ? h('h2', { className: 'section__title', dangerouslySetInnerHTML: html(title) }) : null,
          children)));
  }

  function template(fn) {
    return createClass({ render: function () { return fn(this.props); } });
  }

  // --- Startseite ------------------------------------------------------
  CMS.registerPreviewTemplate('hero', template(function (props) {
    var d = data(props.entry);
    var src = d.image;
    if (src && props.getAsset) { try { src = String(props.getAsset(src)) || d.image; } catch (e) { src = d.image; } }
    return h('div', { className: 'hero' },
      h('div', { className: 'hero__inner container' },
        h('div', { className: 'hero__copy' },
          h('div', { className: 'hero__kicker' }, plain(d.kicker)),
          h('h1', { className: 'hero__title' }, list(d.headlineLines).map(function (l, i) {
            return h('span', { className: 'line', key: i },
              l && l.emphasis ? h('em', null, plain(l && l.text)) : plain(l && l.text));
          })),
          h('div', { className: 'hero__sub' }, props.widgetFor ? props.widgetFor('body') : null),
          h('div', { className: 'hero__creds' }, list(d.stats).map(function (s, i) {
            return h('div', { key: i },
              h('b', null, plain(s && s.value)),
              h('span', null, plain(s && s.label)));
          }))),
        src ? h('figure', { className: 'hero__img' },
          h('img', { src: src, alt: plain(d.imageAlt) })) : null));
  }));

  // --- Vita ------------------------------------------------------------
  CMS.registerPreviewTemplate('about', template(function (props) {
    var d = data(props.entry);
    return section('01', 'Vita', d.title, false, [
      h('div', { className: 'about__body', key: 'b' },
        props.widgetFor ? props.widgetFor('body') : null),
      h('ol', { className: 'tl', key: 't' }, list(d.timeline).map(function (t, i) {
        t = t || {};
        return h('li', { className: 'tl__row' + (t.current ? ' tl__row--current' : ''), key: i },
          h('div', { className: 'tl__year' },
            h('span', { className: 'tl__year-num' }, plain(t.year)),
            t.yearSuffix ? h('span', { className: 'tl__year-suffix' }, t.yearSuffix) : null),
          h('div', { className: 'tl__rail' }, h('span', { className: 'tl__dot' })),
          h('div', { className: 'tl__copy' },
            h('h3', { className: 'tl__title', dangerouslySetInnerHTML: html(t.title) }),
            h('p', { className: 'tl__body', dangerouslySetInnerHTML: html(t.body) })));
      }))
    ]);
  }));

  // --- Erfindungen und Patente ----------------------------------------
  CMS.registerPreviewTemplate('inventions', template(function (props) {
    var d = data(props.entry);
    var pb = d.patentBlock || {};
    return h('div', null,
      section('02', 'Inventions', d.title, true,
        h('div', { className: 'inventions' }, list(d.entries).map(function (e, i) {
          e = e || {};
          return h('article', { className: 'invention', key: i },
            h('header', { className: 'invention__head' },
              h('h3', { className: 'invention__name' }, plain(e.name)),
              h('span', { className: 'invention__year' }, plain(e.year))),
            h('p', { className: 'invention__principle' }, plain(e.principle)),
            e.award ? h('span', { className: 'invention__award' }, e.award) : null);
        }))),
      section('03', 'Patente', pb.heading, false, [
        h('p', { className: 'patents__intro', key: 'i' }, plain(pb.intro)),
        h('p', { className: 'patents__legend', key: 'l' },
          h('span', { className: 'patent-id__dot' }), h('span', null, 'aktiv in Kraft')),
        h('div', { className: 'patents__families', key: 'f' }, list(pb.families).map(function (fam, i) {
          fam = fam || {};
          return h('article', { className: 'patent-family', key: i },
            h('header', { className: 'patent-family__head' },
              h('h3', { className: 'patent-family__title' }, plain(fam.title)),
              fam.note ? h('span', { className: 'patent-family__note' }, fam.note) : null),
            h('ul', { className: 'patent-family__list' }, list(fam.patents).map(function (p, j) {
              p = p || {};
              return h('li', { className: 'patent-id' + (p.active ? ' is-active' : ''), key: j },
                h('span', { className: 'patent-id__code' }, plain(p.id)),
                p.active ? h('span', { className: 'patent-id__dot' }) : null);
            })));
        }))
      ]));
  }));

  // --- Heute -----------------------------------------------------------
  CMS.registerPreviewTemplate('practice', template(function (props) {
    var d = data(props.entry);
    return section('04', 'Heute', d.title, true,
      h('ol', { className: 'practice__list' }, list(d.entries).map(function (e, i) {
        e = e || {};
        return h('li', { className: 'practice__item', key: i },
          h('a', { className: 'practice__link' },
            h('span', { className: 'practice__num' }, String(i + 1).padStart(2, '0')),
            h('h3', { className: 'practice__entry-title' },
              h('em', null, plain(e.titleItalic)), ' ', plain(e.titleRest)),
            h('p', { className: 'practice__entry-body' }, plain(e.body)),
            h('span', { className: 'practice__entry-tag' }, plain(e.tag)),
            h('span', { className: 'practice__arrow' }, '→')));
      })));
  }));

  // --- Kontakt ---------------------------------------------------------
  CMS.registerPreviewTemplate('contact', template(function (props) {
    var d = data(props.entry);
    return section('05', 'Contact', d.title, false,
      h('div', { className: 'contact' },
        h('p', { className: 'contact__letter' }, plain(d.letter)),
        h('p', { className: 'contact__signature' }, plain(d.signature)),
        h('a', { className: 'contact__cta' },
          h('span', { className: 'contact__cta-text' }, plain(d.buttonLabel)),
          h('span', { className: 'contact__cta-arrow' }, '→')),
        h('div', { className: 'contact__meta' },
          h('a', { className: 'contact__email' }, plain(d.email)),
          h('span', { className: 'contact__meta-sep' }, '·'),
          h('span', null, plain(d.location)))));
  }));

  console.info('[Vorschau] Vorlagen registriert');
})();
