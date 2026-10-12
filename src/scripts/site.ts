import { initPlayers } from './player';
import { initHero } from './hero';
import { initHandout } from './handout';
import { initReading } from './reading';
import { initSteps } from './steps';
import { initHub } from './hub';
import { initGrounds } from './ground';
import { initCount } from './count';
import { initQuotes } from './quotes';

// The header steps out of the way on the way down and comes back on the way up.
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const menu = header.querySelector<HTMLDetailsElement>('[data-menu]');
  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (!menu?.open) header.classList.toggle('is-away', y > last && y > 160);
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  menu?.addEventListener('toggle', () => {
    document.documentElement.style.overflow = menu.open ? 'hidden' : '';
    if (menu.open) header.classList.remove('is-away');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary')?.focus(); }
  });
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { menu.open = false; }));
}

// Things rise 8px and settle once as they come into view.
function initRise() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-rise]')];
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
  // Nothing takes keyboard focus while it is still waiting to appear.
  document.addEventListener('focusin', (e) => (e.target as Element).closest?.('[data-rise]:not(.is-in)')?.classList.add('is-in'));
}

initHeader();
initRise();
initPlayers();
initHero();
initHandout();
initReading();
initGrounds();
initSteps();
initCount();
initHub();
initQuotes();
