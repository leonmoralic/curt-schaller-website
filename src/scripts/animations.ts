import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  initReveals();
  initHeadlineSplit();
  initCounters();
  initTimeline();
  initTimelineScrub();
} else {
  // Reduced motion: ensure timeline rows are visible (CSS hides them when html.js)
  document.querySelectorAll<HTMLElement>('.tl__row').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

function initReveals() {
  const elements = document.querySelectorAll<HTMLElement>('.reveal');
  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  });
}

function initHeadlineSplit() {
  const headline = document.querySelector<HTMLElement>('[data-split]');
  if (!headline) return;
  const lines = headline.querySelectorAll<HTMLElement>('.line');
  gsap.fromTo(
    lines,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.15 }
  );
}

function initTimeline() {
  const rows = document.querySelectorAll<HTMLElement>('.tl__row');
  if (rows.length === 0) return;
  gsap.to(rows, {
    y: 0,
    opacity: 1,
    duration: 0.85,
    ease: 'expo.out',
    stagger: 0.09,
    scrollTrigger: { trigger: rows[0], start: 'top 80%', once: true },
  });
}

// Steadicam-style playhead: a glowing gold disc scrubs down the timeline rail
// as the user scrolls, filling the rail with gold behind it and lighting up
// each station's dot + year as it passes. Cinematic metaphor for "playing back"
// the career.
function initTimelineScrub() {
  const tl = document.querySelector<HTMLElement>('.tl');
  if (!tl) return;
  const rows = Array.from(tl.querySelectorAll<HTMLElement>('.tl__row'));
  if (rows.length === 0) return;

  const fill = document.createElement('span');
  fill.className = 'tl__fill';
  fill.setAttribute('aria-hidden', 'true');
  tl.appendChild(fill);

  const playhead = document.createElement('span');
  playhead.className = 'tl__playhead';
  playhead.setAttribute('aria-hidden', 'true');
  tl.appendChild(playhead);

  let dotYs: number[] = [];
  let firstDot = 0;
  let lastDot = 0;

  function measure() {
    const tlRect = tl!.getBoundingClientRect();
    dotYs = rows.map((row) => {
      const dot = row.querySelector<HTMLElement>('.tl__dot');
      if (!dot) return 0;
      const r = dot.getBoundingClientRect();
      return r.top - tlRect.top + r.height / 2;
    });
    firstDot = dotYs[0] ?? 0;
    lastDot = dotYs[dotYs.length - 1] ?? 0;
  }

  measure();
  window.addEventListener('resize', () => {
    measure();
    ScrollTrigger.refresh();
  });

  ScrollTrigger.create({
    trigger: tl,
    start: 'top 55%',
    end: 'bottom 55%',
    scrub: 0.6,
    onEnter: () => playhead.classList.add('tl__playhead--active'),
    onEnterBack: () => playhead.classList.add('tl__playhead--active'),
    onLeave: () => playhead.classList.remove('tl__playhead--active'),
    onLeaveBack: () => playhead.classList.remove('tl__playhead--active'),
    onUpdate: (self) => {
      const y = firstDot + self.progress * (lastDot - firstDot);
      fill.style.top = `${firstDot}px`;
      fill.style.height = `${Math.max(0, y - firstDot)}px`;
      playhead.style.top = `${y}px`;

      rows.forEach((row, i) => {
        if (y >= dotYs[i] - 4) row.classList.add('tl__row--passed');
        else row.classList.remove('tl__row--passed');
      });
    },
  });
}

function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  counters.forEach((el) => {
    const raw = el.dataset.count;
    if (!raw) return;
    const target = parseInt(raw, 10);
    if (!target) return;
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
    });
  });
}
