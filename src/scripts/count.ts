// The program card counts one of its parts for real, a second at a time, while
// it is in view. The seconds and the reps are read from the card's own listed
// values. Without this script, or with reduced motion, the card shows those
// values and nothing moves.
export function initCount() {
  const root = document.querySelector<HTMLElement>('[data-count]');
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const q = (name: string) => root.querySelector<HTMLElement>(`[data-count-${name}]`);
  const live = q('live'), numeral = q('n'), label = q('phase'), repEl = q('rep'), toggle = q('toggle');
  const phases = [...root.querySelectorAll<HTMLElement>('[data-seconds]')].map((el) => ({
    el, label: el.dataset.label ?? '', seconds: Number(el.dataset.seconds), kind: el.dataset.kind ?? '',
  }));
  const reps = Number(root.dataset.reps);
  if (!live || !numeral || !label || !repEl || !phases.length || !reps) return;

  let index = 0, left = phases[0].seconds, rep = 1;
  const render = () => {
    numeral.textContent = String(left);
    label.textContent = phases[index].label;
    repEl.textContent = String(rep);
    root.dataset.kind = phases[index].kind;
    phases.forEach((p, i) => p.el.classList.toggle('is-counting', i === index));
  };
  const tick = () => {
    left -= 1;
    if (left < 1) {
      index = (index + 1) % phases.length;
      if (index === 0) rep = rep >= reps ? 1 : rep + 1;
      left = phases[index].seconds;
    }
    render();
  };

  // Count only while the ring can be seen, the tab is showing and motion is on.
  let timer = 0, seen = false, motionOn = true;
  const sync = () => {
    const run = seen && motionOn && !document.hidden;
    if (run && !timer) timer = window.setInterval(tick, 1000);
    else if (!run && timer) { window.clearInterval(timer); timer = 0; }
  };
  root.dataset.live = '';
  render();
  new IntersectionObserver((entries) => { seen = entries[entries.length - 1].isIntersecting; sync(); }, { threshold: 0.1 }).observe(live);
  document.addEventListener('visibilitychange', sync);
  // The card's own control, where it has one, and the page-wide one both set the same switch.
  const setMotion = (on: boolean) => {
    motionOn = on;
    toggle?.setAttribute('aria-pressed', String(!on));
    toggle?.setAttribute('aria-label', on ? 'Pause the count' : 'Start the count');
    sync();
  };
  toggle?.addEventListener('click', () => setMotion(!motionOn));
  document.addEventListener('pelvy:motion', (e) => setMotion((e as CustomEvent<boolean>).detail));
}
