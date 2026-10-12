import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const FRAMES = 32;
// The sheet lets go between these points of the section's scroll.
const FROM = 0.3, TO = 0.62;

export function initHandout() {
  const root = document.querySelector<HTMLElement>('[data-handout]');
  const canvas = root?.querySelector<HTMLCanvasElement>('[data-handout-canvas]');
  const ctx = canvas?.getContext('2d');
  if (!root || !canvas || !ctx) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // 800KB of frames is not for someone who has asked to save data. The still stays.
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;

  gsap.registerPlugin(ScrollTrigger);
  const frames: HTMLImageElement[] = [];
  let wanted = 0, drawn = -1;

  const draw = () => {
    // Fall back to the nearest frame that has arrived, so a slow connection never shows a gap.
    let i = wanted;
    while (i > 0 && !(frames[i]?.complete && frames[i].naturalWidth)) i -= 1;
    const img = frames[i];
    if (!img?.complete || !img.naturalWidth || i === drawn) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawn = i;
    root.classList.add('is-live');
  };

  const load = () => {
    for (let i = 0; i < FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `/media/handout/${String(i + 1).padStart(2, '0')}.webp`;
      img.onload = draw;
      frames[i] = img;
    }
  };

  // Fetch the frames only when the section is on its way.
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    load();
  }, { rootMargin: '150% 0px' });
  io.observe(root);

  // The fall is timed against the three lines, not the heading that holds after them.
  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    endTrigger: root.querySelector('[data-handout-beats]') ?? root,
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate: (self) => {
      const t = Math.min(1, Math.max(0, (self.progress - FROM) / (TO - FROM)));
      wanted = Math.round(t * (FRAMES - 1));
      draw();
    },
  });
}
