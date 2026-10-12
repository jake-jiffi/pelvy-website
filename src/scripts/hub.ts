// The treatment hub sample: real tabs, and the list beside it drives them too.
export function initHub() {
  const hub = document.querySelector<HTMLElement>('[data-hub]');
  if (!hub) return;
  const tabs = [...hub.querySelectorAll<HTMLButtonElement>('[data-hub-tab]')];
  const panes = [...hub.querySelectorAll<HTMLElement>('[data-hub-pane]')];
  const outside = [...document.querySelectorAll<HTMLButtonElement>('[data-hub-go]')];

  const show = (name: string, focus = false) => {
    tabs.forEach((t) => {
      const on = t.dataset.hubTab === name;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panes.forEach((p) => { p.hidden = p.dataset.hubPane !== name; });
    outside.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.hubGo === name)));
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(t.dataset.hubTab!));
    t.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      show(tabs[(i + step + tabs.length) % tabs.length].dataset.hubTab!, true);
    });
  });
  // On a phone the list sits below the screen it drives. Bring the tabs back
  // into view, so the change that was asked for can be seen.
  const strip = hub.querySelector<HTMLElement>('[role="tablist"]');
  const reveal = () => {
    const box = strip?.getBoundingClientRect();
    if (!box || (box.top >= 0 && box.bottom <= window.innerHeight)) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    hub.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
  };
  outside.forEach((b) => b.addEventListener('click', () => { show(b.dataset.hubGo!); reveal(); }));
}
