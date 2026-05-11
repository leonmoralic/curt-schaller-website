import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  initReveals();
  initHeadlineSplit();
  initCounters();
  initTimeline();
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
