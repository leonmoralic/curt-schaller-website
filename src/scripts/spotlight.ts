// Cursor-following warm spotlight on the hero.
// Sets CSS custom properties --mx / --my on the .hero element so the
// .hero::before radial-gradient tracks the pointer. The gradient
// itself uses an explicit pixel radius with a multi-stop alpha fade
// so it never produces a visible boundary at the transparent stop.

const hero = document.querySelector<HTMLElement>('.hero');
if (hero) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    let pending = false;
    let nextX = 50;
    let nextY = 30;

    function apply() {
      pending = false;
      hero!.style.setProperty('--mx', `${nextX}%`);
      hero!.style.setProperty('--my', `${nextY}%`);
    }

    hero.addEventListener('pointermove', (e) => {
      const rect = hero!.getBoundingClientRect();
      nextX = ((e.clientX - rect.left) / rect.width) * 100;
      nextY = ((e.clientY - rect.top) / rect.height) * 100;
      if (!pending) {
        pending = true;
        requestAnimationFrame(apply);
      }
    });
  }
}
