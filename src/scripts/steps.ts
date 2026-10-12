import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// The steps count themselves in as they are passed, one at a time: the rail
// fills and each ring turns from waiting to counted as it crosses the line,
// a little above the middle of the screen. Without this script all are counted.
const LINE = '46%';

export function initSteps() {
  const lists = [...document.querySelectorAll<HTMLElement>('[data-steps]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Quiet scene loops (the clinic desk) start when they are seen.
  const loops = [...document.querySelectorAll<HTMLVideoElement>('video[data-loop]')];
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (loops.length && !reduced && !saveData) {
    // A loop plays while it is in view and nobody has stopped it.
    const stopped = new WeakSet<HTMLVideoElement>();
    const inView = new WeakSet<HTMLVideoElement>();
    const sync = (v: HTMLVideoElement) => {
      if (!inView.has(v) || stopped.has(v)) return v.pause();
      if (!v.src) { v.src = v.dataset.src!; v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true }); }
      v.play().catch(() => {});
    };
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      const v = en.target as HTMLVideoElement;
      if (en.isIntersecting) inView.add(v); else inView.delete(v);
      sync(v);
    }), { threshold: 0.2 });
    // Each loop has its own stop control. The page-wide one on the home page sets them all.
    const btnOf = (v: HTMLVideoElement) => v.closest('figure')?.querySelector<HTMLButtonElement>('[data-loop-toggle]');
    const stop = (v: HTMLVideoElement, off: boolean) => {
      if (off) stopped.add(v); else stopped.delete(v);
      const btn = btnOf(v);
      btn?.setAttribute('aria-pressed', String(off));
      btn?.setAttribute('aria-label', off ? 'Play motion' : 'Pause motion');
      sync(v);
    };
    loops.forEach((v) => {
      io.observe(v);
      const btn = btnOf(v);
      if (!btn) return;
      btn.hidden = false;
      btn.addEventListener('click', () => stop(v, !stopped.has(v)));
    });
    document.addEventListener('pelvy:motion', (e) => {
      const on = (e as CustomEvent<boolean>).detail;
      loops.forEach((v) => stop(v, !on));
    });
  }

  if (!lists.length || reduced) return;
  gsap.registerPlugin(ScrollTrigger);
  lists.forEach((list) => {
    list.dataset.live = '';
    const items = [...list.querySelectorAll<HTMLElement>('[data-step]')];
    items.forEach((item) => ScrollTrigger.create({
      trigger: item,
      start: `top ${LINE}`,
      onEnter: () => item.classList.add('is-on'),
      onLeaveBack: () => item.classList.remove('is-on'),
    }));
    gsap.fromTo(list, { '--rail': 0 }, { '--rail': 1, ease: 'none', scrollTrigger: { trigger: list, start: `top ${LINE}`, end: `bottom ${LINE}`, scrub: 0.4 } });
  });
}
