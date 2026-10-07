// One rAF loop for the gear trains (scrolling cranks them).
// Trains pause when off-screen or when the tab is hidden; nothing runs under
// prefers-reduced-motion, and [data-motion-toggle] lets a visitor stop it all (WCAG 2.2.2).
// The inline script in BaseLayout sets .motion-ok / .motion-paused / .no-motion on <html>
// before first paint, so CSS can gate start states without a flash.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const PAUSE_KEY = 'motion-paused';
let userPaused = false;
try {
  userPaused = localStorage.getItem(PAUSE_KEY) === '1';
} catch {
  /* storage blocked: default to playing */
}
const stopped = () => reduce.matches || userPaused;

interface Gear {
  el: SVGGElement;
  teeth: number;
  alpha: number;
  parent?: Gear;
  theta: number;
}

interface Train {
  gears: Gear[];
  speed: number; // rad/s at rest
  visible: boolean;
}

const trains: Train[] = [];

let lastY = window.scrollY;
let crank = 0; // extra angular velocity from scrolling, signed
let driverAngle = 0;
let last = 0;
let raf = 0;

const bySvg = new Map<Element, Train>();
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    const t = bySvg.get(e.target);
    if (t) t.visible = e.isIntersecting;
  }
  kick();
});

function initTrains() {
  document.querySelectorAll<SVGSVGElement>('[data-gear-train]').forEach((svg) => {
    const byId = new Map<string, Gear>();
    const gears: Gear[] = [];
    svg.querySelectorAll<SVGGElement>('[data-gear]').forEach((el) => {
      const g: Gear = {
        el,
        teeth: Number(el.dataset.teeth),
        alpha: Number(el.dataset.alpha ?? 0),
        parent: el.dataset.mesh ? byId.get(el.dataset.mesh) : undefined,
        theta: 0,
      };
      byId.set(el.dataset.gear!, g);
      gears.push(g);
    });
    if (!gears.length) return;
    const train: Train = { gears, speed: (Number(svg.dataset.speed ?? 6) * Math.PI) / 180, visible: false };
    trains.push(train);
    bySvg.set(svg, train);
    io.observe(svg);
  });
}

function frame(now: number) {
  raf = 0;
  if (stopped()) return;
  const dt = Math.min((now - (last || now)) / 1000, 0.05);
  last = now;

  const y = window.scrollY;
  const dy = y - lastY;
  lastY = y;
  crank += dy * 0.05; // a scroll flick cranks the train
  crank *= Math.exp(-dt * 2.6); // and it winds down
  crank = Math.max(-8, Math.min(8, crank));

  driverAngle += dt * (1 + crank);

  for (const train of trains) {
    if (!train.visible) continue;
    for (const g of train.gears) {
      if (!g.parent) g.theta = driverAngle * train.speed;
      else {
        const p = g.parent;
        g.theta = -(p.teeth / g.teeth) * (p.theta - g.alpha) + g.alpha + Math.PI + Math.PI / g.teeth;
      }
      g.el.style.transform = `rotate(${(g.theta * 180) / Math.PI}deg)`;
    }
  }

  const busy = trains.some((t) => t.visible) || Math.abs(crank) > 0.01;
  if (!document.hidden && busy) raf = requestAnimationFrame(frame);
  else last = 0;
}

function kick() {
  if (!raf && !document.hidden && !stopped()) raf = requestAnimationFrame(frame);
}

let started = false;
function start() {
  if (reduce.matches || started) return;
  started = true;
  initTrains();
  window.addEventListener('scroll', kick, { passive: true });
  document.addEventListener('visibilitychange', kick);
  kick();
}

/* ── Pause toggle ───────────────────────────────────────── */
function setPaused(p: boolean) {
  userPaused = p;
  try {
    localStorage.setItem(PAUSE_KEY, p ? '1' : '0');
  } catch {
    /* ignore */
  }
  document.documentElement.classList.toggle('motion-paused', p);
  document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(p));
    const label = b.querySelector('[data-motion-label]');
    if (label) label.textContent = (p ? b.dataset.labelPlay : b.dataset.labelPause) ?? label.textContent;
  });
  if (p) {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  } else {
    start();
    kick();
  }
}

function initToggle() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]');
  if (reduce.matches) {
    buttons.forEach((b) => (b.hidden = true));
    return;
  }
  buttons.forEach((b) => b.addEventListener('click', () => setPaused(!userPaused)));
  if (userPaused) setPaused(true);
}

initToggle();
if (!userPaused) start();
