import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Pt = [number, number];

// The phone's blank screen in the room clip, as fractions of the square frame:
// top left, top right, bottom right, bottom left. Fitted to the clip's own
// frames; it holds to within half a pixel across the 10 second loop.
const QUAD: Pt[] = [[0.32137, 0.13766], [0.65021, 0.13727], [0.66015, 0.85088], [0.33396, 0.86732]];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const span = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
const inOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const out = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Projective fit of a w by h box onto four points, as a CSS matrix3d.
function adj(m: number[]) {
  return [
    m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
  ];
}
function mul(a: number[], b: number[]) {
  const c = new Array(9).fill(0);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) c[3 * i + j] += a[3 * i + k] * b[3 * k + j];
  return c;
}
function basis(p: Pt[]) {
  const m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1];
  const a = adj(m);
  const v = [a[0] * p[3][0] + a[1] * p[3][1] + a[2], a[3] * p[3][0] + a[4] * p[3][1] + a[5], a[6] * p[3][0] + a[7] * p[3][1] + a[8]];
  return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}
function fit(w: number, h: number, to: Pt[]) {
  const t = mul(basis(to), adj(basis([[0, 0], [w, 0], [w, h], [0, h]])));
  const n = t.map((v) => v / t[8]);
  return `matrix3d(${n[0]},${n[3]},0,${n[6]},${n[1]},${n[4]},0,${n[7]},0,0,1,0,${n[2]},${n[5]},0,1)`;
}

export function initHero() {
  const found = document.querySelector<HTMLElement>('[data-hero]');
  if (!found) return;
  const hero: HTMLElement = found;
  const q = <T extends HTMLElement>(name: string) => hero.querySelector<T>(`[data-${name}]`)!;
  const stage = q('hero-stage'), slot = q('hero-slot'), ground = q('hero-ground'), world = q('hero-world');
  const photo = q('hero-photo'), backing = q('hero-backing'), screen = q('hero-screen'), copy = q('hero-copy');
  const meta = q('hero-meta'), tryLayer = q('hero-try'), tryIn = q('hero-try-in'), target = q('hero-target');
  const video = q<HTMLVideoElement>('hero-video');
  const motionBtn = q<HTMLButtonElement>('motion-toggle');
  const parts = [...hero.querySelectorAll<HTMLElement>('[data-try-part]')];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ---- The room clip: only for people who want motion and are not saving data.
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  let motionOn = true;
  let photoGone = false;
  const syncVideo = () => {
    if (!video.src) return;
    if (motionOn && !photoGone && !document.hidden) video.play().catch(() => {});
    else video.pause();
  };
  if (!saveData) {
    video.src = window.matchMedia('(min-width: 700px)').matches ? video.dataset.srcLg! : video.dataset.srcSm!;
    video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
    syncVideo();
    document.addEventListener('visibilitychange', syncVideo);
  }
  motionBtn.hidden = false;
  motionBtn.addEventListener('click', () => {
    motionOn = !motionOn;
    motionBtn.setAttribute('aria-pressed', String(!motionOn));
    motionBtn.setAttribute('aria-label', motionOn ? 'Pause motion' : 'Play motion');
    syncVideo();
    document.dispatchEvent(new CustomEvent('pelvy:motion', { detail: motionOn }));
  });

  // ---- Pinned push-in. Nothing here changes layout: the ground opens with a
  // clip-path and the room moves with a transform, so the page never jumps.
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const HOLD = 0.66; // the rest of the travel holds the finished state, about 0.85 of a screen
  const m = {
    sw: 0, sh: 0, slot: { x: 0, y: 0, w: 0, h: 0 },
    box: { w: 0, h: 0 }, rest: [] as Pt[], end: [] as Pt[], c: [0, 0] as Pt, f0: [0, 0] as Pt, f1: [0, 0] as Pt, s1: 1,
  };
  const state = { p: 0 };
  let trigger: ScrollTrigger | null = null;

  function measure() {
    const st = stage.getBoundingClientRect();
    const sl = slot.getBoundingClientRect();
    const tg = target.getBoundingClientRect();
    m.sw = st.width; m.sh = st.height;
    m.slot = { x: sl.left - st.left, y: sl.top - st.top, w: sl.width, h: sl.height };

    // The small screen is laid out at the large screen's size and fitted down
    // into the photograph, so it is sharp when the push-in arrives.
    m.box = { w: tg.width, h: tg.height };
    for (const el of [screen, backing]) {
      el.style.left = el.style.top = '0';
      el.style.width = `${m.box.w}px`;
      el.style.height = `${m.box.h}px`;
    }
    // Everything below is in the room's own coordinates: its top left is the slot's.
    m.rest = QUAD.map(([x, y]) => [x * sl.width, y * sl.height] as Pt);
    m.c = [m.rest.reduce((a, p) => a + p[0], 0) / 4, m.rest.reduce((a, p) => a + p[1], 0) / 4];
    const quadH = (m.rest[3][1] - m.rest[0][1] + (m.rest[2][1] - m.rest[1][1])) / 2;
    m.s1 = tg.height / quadH;
    m.f0 = [m.c[0], m.c[1]];
    const bx = tg.left - sl.left, by = tg.top - sl.top;
    m.f1 = [bx + tg.width / 2, by + tg.height / 2];
    const t1: Pt = [m.f1[0] - m.s1 * m.c[0], m.f1[1] - m.s1 * m.c[1]];
    const corners: Pt[] = [[bx, by], [bx + tg.width, by], [bx + tg.width, by + tg.height], [bx, by + tg.height]];
    m.end = corners.map(([x, y]) => [(x - t1[0]) / m.s1, (y - t1[1]) / m.s1] as Pt);
  }

  function render() {
    const p = clamp(state.p / HOLD);

    // The sage ground opens from the photograph's place in the layout to the whole stage.
    const k = out(span(p, 0.1, 0.52));
    const inset = [m.slot.y, m.sw - m.slot.x - m.slot.w, m.sh - m.slot.y - m.slot.h, m.slot.x].map((v) => `${(Math.max(0, v) * (1 - k)).toFixed(2)}px`);
    ground.style.clipPath = `inset(${inset.join(' ')} round ${(22 * (1 - k)).toFixed(2)}px)`;

    // The photograph travels to where the large screen will be as the ground
    // opens, then pushes in on the phone until its screen is the large screen.
    const z = inOut(span(p, 0.14, 0.84));
    const s = Math.exp(Math.log(m.s1) * z);
    const fx = lerp(m.f0[0], m.f1[0], k), fy = lerp(m.f0[1], m.f1[1], k);
    world.style.transform = `translate(${(fx - s * m.c[0]).toFixed(2)}px, ${(fy - s * m.c[1]).toFixed(2)}px) scale(${s.toFixed(5)})`;

    // The leaning screen in the photograph stands up straight as the room fades to sage.
    const e = inOut(span(p, 0.48, 0.84));
    const pts = m.rest.map((r, i) => [lerp(r[0], m.end[i][0], e), lerp(r[1], m.end[i][1], e)] as Pt);
    screen.style.transform = backing.style.transform = fit(m.box.w, m.box.h, pts);

    // The photograph closes in on the phone's screen, the way the ground opened,
    // so the room is never seen tinted. By the end only the screen is left.
    const c = inOut(span(p, 0.54, 0.86));
    const xs = pts.map((v) => v[0]), ys = pts.map((v) => v[1]);
    const side = m.slot.w;
    const close = [Math.min(...ys), side - Math.max(...xs), side - Math.max(...ys), Math.min(...xs)].map((v) => `${(Math.max(0, v) * c).toFixed(2)}px`);
    photo.style.clipPath = `inset(${close.join(' ')} round ${lerp(22 / s, (m.box.w * 0.07) / s, c).toFixed(2)}px)`;
    photo.style.opacity = c >= 1 ? '0' : '1';
    backing.style.opacity = String(span(p, 0.4, 0.54) * (1 - span(p, 0.95, 0.99)));
    screen.style.opacity = String(1 - span(p, 0.95, 0.99));
    target.style.opacity = String(span(p, 0.9, 0.94));

    // The copy has left before the ground starts to open across it.
    const leave = span(p, 0, 0.09);
    copy.style.opacity = meta.style.opacity = String(1 - leave);
    copy.style.transform = `translateY(${(-24 * leave).toFixed(2)}px)`;
    copy.style.visibility = meta.style.visibility = leave >= 1 ? 'hidden' : 'visible';

    let shown = true;
    parts.forEach((el, i) => {
      const a = out(span(p, 0.86 + i * 0.03, 0.97 + i * 0.03));
      el.style.opacity = String(a);
      el.style.transform = `translateY(${(8 * (1 - a)).toFixed(2)}px)`;
      if (a < 1) shown = false;
    });
    tryLayer.inert = !shown;
    tryLayer.classList.toggle('is-on', shown);

    const gone = p > 0.84;
    if (gone !== photoGone) { photoGone = gone; syncVideo(); }
  }

  // The pinned version needs room: the opening copy and the exercise screen
  // with its controls must each fit one screen. Otherwise the page stays static.
  const fits = () => copy.getBoundingClientRect().bottom <= stage.getBoundingClientRect().bottom - 8 && tryIn.scrollHeight <= stage.clientHeight + 1;

  function disable() {
    trigger?.animation?.kill();
    trigger?.kill();
    trigger = null;
    hero.classList.remove('hero--live');
    tryLayer.classList.remove('is-on');
    tryLayer.inert = false;
    for (const el of [ground, world, photo, backing, screen, copy, meta, target, ...parts]) el.removeAttribute('style');
    state.p = 0;
    if (photoGone) { photoGone = false; syncVideo(); }
  }

  function enable() {
    hero.classList.add('hero--live');
    if (window.innerHeight < 640 || !fits()) { disable(); return; }
    measure();
    render();
    trigger = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: () => `+=${hero.offsetHeight - window.innerHeight}`,
      scrub: 0.55,
      animation: gsap.fromTo(state, { p: 0 }, { p: 1, ease: 'none', onUpdate: render }),
    });
  }

  ScrollTrigger.addEventListener('refreshInit', () => { if (trigger) measure(); });
  ScrollTrigger.addEventListener('refresh', () => { if (trigger) render(); });
  enable();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  // A different window may or may not have the room. Check again once it settles.
  let width = window.innerWidth, height = window.innerHeight, timer = 0;
  window.addEventListener('resize', () => {
    // A phone's address bar changes the height by itself: that is not a new layout.
    const real = window.innerWidth !== width || Math.abs(window.innerHeight - height) > 140;
    if (!real) return;
    width = window.innerWidth; height = window.innerHeight;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => { disable(); enable(); ScrollTrigger.refresh(); }, 180);
  });

  // Keyboard: Tab from the last control of the opening goes to the exercise
  // screen, and Shift+Tab comes back. The scroll goes with the focus, at once.
  const jump = (progress: number, focus: HTMLElement | null) => {
    if (!trigger) return;
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'instant' as ScrollBehavior });
    ScrollTrigger.update();
    trigger.getTween()?.progress(1);
    state.p = progress;
    render();
    focus?.focus({ preventScroll: true });
  };
  const firstTry = () => tryLayer.querySelector<HTMLElement>('button, a[href]');
  hero.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !trigger) return;
    const el = document.activeElement as HTMLElement;
    if (!e.shiftKey && el === motionBtn && tryLayer.inert) { e.preventDefault(); jump(HOLD + 0.1, firstTry()); }
    else if (e.shiftKey && el === firstTry() && copy.style.visibility === 'hidden') { e.preventDefault(); jump(0, motionBtn); }
  });
}
