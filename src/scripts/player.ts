// One clock for every exercise screen on the page, so the small one in the
// room photograph and the large one beside it never disagree.

type PhaseKind = 'in' | 'hold' | 'out';
interface Phase { kind: PhaseKind; label: string; cue: string; seconds: number }
export interface Program { id: ProgramId; title: string; reps: number; phases: Phase[] }
export type ProgramId = 'letgo' | 'squeeze';

// Names, cues and counts are the app's own (demo video frames and the brand's app screens).
export const PROGRAMS: Record<ProgramId, Program> = {
  letgo: {
    id: 'letgo',
    title: 'Belly breathing',
    reps: 20,
    phases: [
      { kind: 'in', label: 'Breathe in', cue: 'Widen your lower belly, waist and ribs', seconds: 3 },
      { kind: 'hold', label: 'Hold', cue: 'Pause', seconds: 2 },
      { kind: 'out', label: 'Breathe out', cue: 'Let your belly soften back towards your spine', seconds: 4 },
    ],
  },
  squeeze: {
    id: 'squeeze',
    title: 'Pelvic floor with breath',
    reps: 10,
    phases: [
      { kind: 'in', label: 'Breathe in', cue: 'Relax your pelvic floor and widen your lower belly', seconds: 4 },
      { kind: 'hold', label: 'Hold', cue: 'Get ready to squeeze', seconds: 1 },
      { kind: 'out', label: 'Breathe out', cue: 'Squeeze your pelvic floor', seconds: 5 },
    ],
  },
};

const SMALL = 0.86; // the disc at the bottom of the out-breath
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

class Engine {
  program: Program = PROGRAMS.letgo;
  rep = 1;
  index = 0;
  running = false;
  /** Set once somebody has pressed a control: only then are changes announced. */
  engaged = false;
  private elapsed = 0; // ms into the current phase
  private last = 0;
  private raf = 0;
  private shown = -1;
  private listeners = new Set<() => void>();

  get phase(): Phase { return this.program.phases[this.index]; }
  get remaining(): number { return Math.max(1, Math.ceil(this.phase.seconds - this.elapsed / 1000)); }

  /** 0 at the bottom of the out-breath, 1 at the top of the in-breath. */
  get breath(): number {
    const t = Math.min(1, this.elapsed / (this.phase.seconds * 1000));
    const eased = 0.5 - Math.cos(Math.PI * t) / 2;
    if (this.phase.kind === 'in') return eased;
    if (this.phase.kind === 'out') return 1 - eased;
    return 1;
  }
  get scale(): number { return SMALL + (1 - SMALL) * this.breath; }

  subscribe(fn: () => void) { this.listeners.add(fn); fn(); return () => this.listeners.delete(fn); }
  private emit() { this.listeners.forEach((fn) => fn()); }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
    this.emit();
  }
  pause() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.emit();
  }
  toggle() { this.running ? this.pause() : this.start(); }

  setProgram(id: ProgramId) {
    if (this.program.id === id) return;
    this.program = PROGRAMS[id];
    this.rep = 1; this.index = 0; this.elapsed = 0; this.shown = -1;
    this.emit();
  }

  private frame = (now: number) => {
    // A tab that slept should pick up where it left off, not skip ahead.
    this.elapsed += Math.min(now - this.last, 250);
    this.last = now;
    let changed = false;
    while (this.elapsed >= this.phase.seconds * 1000) {
      this.elapsed -= this.phase.seconds * 1000;
      this.index += 1;
      if (this.index >= this.program.phases.length) {
        this.index = 0;
        this.rep = this.rep >= this.program.reps ? 1 : this.rep + 1;
      }
      changed = true;
    }
    if (changed || this.remaining !== this.shown) { this.shown = this.remaining; this.emit(); }
    views.forEach((v) => v.breathe());
    if (this.running) this.raf = requestAnimationFrame(this.frame);
  };
}

export const engine = new Engine();

class View {
  private parts: Record<string, HTMLElement | null>;
  private lastPhase = '';
  constructor(private root: HTMLElement) {
    const q = (name: string) => root.querySelector<HTMLElement>(`[data-player-${name}]`);
    this.parts = { title: q('title'), rep: q('rep'), reps: q('reps'), cue: q('cue'), count: q('count'), label: q('label'), toggle: q('toggle'), toggleLabel: q('toggle-label'), status: q('status') };
    this.parts.toggle?.addEventListener('click', () => { engine.engaged = true; userPaused = engine.running; engine.toggle(); });
    engine.subscribe(() => this.render());
  }
  private set(el: HTMLElement | null, text: string) { if (el && el.textContent !== text) el.textContent = text; }

  render() {
    const { program, phase } = engine;
    this.root.dataset.phase = phase.kind;
    this.set(this.parts.title, program.title);
    this.set(this.parts.rep, String(engine.rep));
    this.set(this.parts.reps, String(program.reps));
    this.set(this.parts.cue, phase.cue);
    this.set(this.parts.count, String(engine.remaining));
    this.set(this.parts.label, phase.label);
    this.parts.toggle?.setAttribute('aria-pressed', String(!engine.running));
    this.set(this.parts.toggleLabel, engine.running ? 'Pause' : 'Start');
    // Say what the person just did, not every breath: a screen reader should not be talked over.
    const key = `${program.id}:${engine.running}`;
    if (engine.engaged && key !== this.lastPhase) this.set(this.parts.status, `${program.title}, ${engine.running ? 'started' : 'paused'}. Rep ${engine.rep} of ${program.reps}.`);
    this.lastPhase = key;
    this.breathe();
  }
  breathe() {
    if (reduced.matches) return;
    this.root.style.setProperty('--s', engine.scale.toFixed(4));
  }
}

const views: View[] = [];
/** True once a person has stopped it: scrolling back into view will not restart it. */
let userPaused = false;

export function initPlayers() {
  const roots = [...document.querySelectorAll<HTMLElement>('[data-player]')];
  if (!roots.length) return;
  roots.forEach((root) => views.push(new View(root)));

  // The program switch sits on the page, outside the screen.
  const switches = [...document.querySelectorAll<HTMLButtonElement>('[data-program]')];
  const paint = () => switches.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.program === engine.program.id)));
  switches.forEach((b) => b.addEventListener('click', () => {
    engine.engaged = true;
    userPaused = false;
    engine.setProgram(b.dataset.program as ProgramId);
    engine.start();
  }));
  engine.subscribe(paint);

  // Run only while a screen is in view and the tab is showing. Nothing runs by
  // itself for someone who has asked for less motion: they press Start.
  let visible = false;
  const sync = () => {
    if (visible && !document.hidden && !userPaused && !reduced.matches) engine.start();
    else if (!visible || document.hidden) engine.pause();
  };
  document.addEventListener('pelvy:motion', (e) => {
    userPaused = !(e as CustomEvent<boolean>).detail;
    userPaused ? engine.pause() : sync();
  });
  const seen = new Set<Element>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
    visible = seen.size > 0;
    sync();
  }, { threshold: 0.05 });
  roots.forEach((r) => io.observe(r));
  document.addEventListener('visibilitychange', sync);
}
