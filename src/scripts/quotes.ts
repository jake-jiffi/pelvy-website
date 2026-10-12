// The clinic quotes: one at a time, with previous and next and a count of where
// you are. The row still scrolls by touch and trackpad. Nothing moves until
// somebody asks. Without this script the row scrolls and shows its scrollbar.
export function initQuotes() {
  const root = document.querySelector<HTMLElement>('[data-quotes]');
  const row = root?.querySelector<HTMLElement>('[data-quotes-row]');
  if (!root || !row) return;
  const items = [...row.children] as HTMLElement[];
  const q = (name: string) => root.querySelector<HTMLElement>(`[data-quotes-${name}]`);
  const prev = q('prev'), next = q('next'), now = q('now'), status = q('status');
  if (!prev || !next || !now || items.length < 2) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let index = 0;
  // Where the row has to be scrolled for a quote to sit at the start of the column.
  const stop = (i: number) => items[i].offsetLeft - items[0].offsetLeft;
  const nearest = () => items.reduce((best, _, i) => (Math.abs(stop(i) - row.scrollLeft) < Math.abs(stop(best) - row.scrollLeft) ? i : best), 0);

  const paint = () => {
    now.textContent = String(index + 1);
    prev.setAttribute('aria-disabled', String(index === 0));
    next.setAttribute('aria-disabled', String(index === items.length - 1));
  };
  const go = (to: number) => {
    const i = Math.min(items.length - 1, Math.max(0, to));
    if (i === index) return;
    row.scrollTo({ left: stop(i), behavior: reduced.matches ? 'auto' : 'smooth' });
    index = i;
    paint();
    // Said once, for the person who pressed: a swipe needs no announcement.
    if (status) status.textContent = `Quote ${i + 1} of ${items.length}`;
  };

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  row.addEventListener('keydown', (e) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    go(index + step);
  });

  // A swipe or a trackpad moves the row by itself: the count follows once it settles.
  let settle = 0;
  row.addEventListener('scroll', () => {
    window.clearTimeout(settle);
    settle = window.setTimeout(() => { index = nearest(); paint(); }, 90);
  }, { passive: true });

  paint();
}
