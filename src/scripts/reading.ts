import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// A line reads itself in as it is scrolled: each word goes from faint to ink.
// Without this script the line is ink.
export function initReading() {
  const lines = [...document.querySelectorAll<HTMLElement>('[data-reading]')];
  if (!lines.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  lines.forEach((line) => {
    const text = line.textContent ?? '';
    line.textContent = '';
    const words = text.trim().split(/\s+/).map((word, i) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.opacity = '0.22';
      if (i) line.append(' ');
      line.append(span);
      return span;
    });
    // A line that is already on screen when the page opens reads itself in once,
    // at reading pace, so it is all in ink before anything is scrolled.
    if (line.getBoundingClientRect().top < window.innerHeight) {
      gsap.to(words, { opacity: 1, ease: 'none', duration: 0.4, stagger: 0.09, delay: 0.15 });
      return;
    }
    gsap.to(words, {
      opacity: 1,
      ease: 'none',
      stagger: 0.5,
      scrollTrigger: { trigger: line, start: 'top 78%', end: 'top 38%', scrub: 0.3 },
    });
  });
}
