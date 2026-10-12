import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// A full-bleed ground arrives as a card. It starts inset to the page's column,
// rises the last few pixels and opens to the edges as it is scrolled in. Only
// a clip-path changes, so nothing in the layout moves. Without this script, or
// with reduced motion, the ground is there from the start.
export function initGrounds() {
  const grounds = [...document.querySelectorAll<HTMLElement>('[data-ground]')];
  if (!grounds.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  grounds.forEach((el) => {
    const column = el.querySelector<HTMLElement>('.wrap');
    if (!column) return;
    const open = { k: 0 }; // 0 is the card, 1 is the open ground
    let side = 0, rise = 0;
    let trigger: ScrollTrigger | undefined;

    const measure = () => {
      const left = column.getBoundingClientRect().left + parseFloat(getComputedStyle(column).paddingLeft);
      // A little wider than the column, so the words inside never touch the card's edge.
      side = Math.max(left - 16, left * 0.6);
      rise = Math.min(56, window.innerHeight * 0.06);
    };
    const render = () => {
      // Before it is on its way in, and once it is fully open, the ground is left as the stylesheet draws it.
      const waiting = !trigger || (!trigger.isActive && trigger.progress === 0);
      if (waiting || open.k >= 1) { el.style.clipPath = ''; return; }
      const k = 1 - open.k;
      el.style.clipPath = `inset(${Math.round(rise * k)}px ${Math.round(side * k)}px 0px round 22px)`;
    };

    measure();
    trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'top 42%',
      scrub: 0.5,
      animation: gsap.fromTo(open, { k: 0 }, { k: 1, ease: 'power2.out', onUpdate: render }),
      onRefreshInit: measure,
      onRefresh: render,
      onToggle: render,
    });
  });
}
