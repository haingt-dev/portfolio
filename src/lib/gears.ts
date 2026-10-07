// SVG gear geometry. A gear of N teeth with module m has pitch radius r = m·N/2;
// two gears mesh when their centres sit r1 + r2 apart. The motion script turns them
// at the right ratio (driven gear turns N1/N2 as fast, the other way).

export interface GearSpec {
  id: string;
  teeth: number;
  /** Id of the gear this one meshes with (omit for the driver). */
  mesh?: string;
  /** Direction from the parent's centre to this gear's centre, in degrees. */
  angle?: number;
  /** Driver only: centre position. */
  x?: number;
  y?: number;
  /** Hub style: number of lightening holes. */
  holes?: number;
  /** GearTrain `annotate`: direction (degrees) of the tooth-count label from the centre. */
  note?: number;
  /** Annotation text next to the gear (defaults to the tooth count, e.g. "z28"). */
  label?: string;
  /** GearTrain `annotate`: an idler between marked gears. It gets no marks and no data-index,
   *  and marked gears are numbered as if it were not there. */
  quiet?: boolean;
}

export interface PlacedGear extends Required<Pick<GearSpec, 'id' | 'teeth'>> {
  x: number;
  y: number;
  r: number;
  mesh?: string;
  alphaRad: number;
  path: string;
}

const f = (n: number) => n.toFixed(2);

const circle = (cx: number, cy: number, r: number) =>
  `M${f(cx + r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0Z`;

/** Gear outline centred on (0,0), tooth 0 pointing along +x, with a bore and lightening holes. */
export function gearPath(teeth: number, module: number, holes = 0): string {
  const r = (module * teeth) / 2;
  const tip = r + module;
  const root = r - 1.25 * module;
  const p = (2 * Math.PI) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * p;
    const ring: [number, number][] = [
      [root, a - p * 0.5],
      [root, a - p * 0.27],
      [tip, a - p * 0.14],
      [tip, a + p * 0.14],
      [root, a + p * 0.27],
    ];
    for (const [rad, ang] of ring) pts.push(`${f(rad * Math.cos(ang))} ${f(rad * Math.sin(ang))}`);
  }
  let d = `M${pts.join('L')}Z`;
  const bore = Math.max(module * 1.2, r * 0.12);
  d += circle(0, 0, bore);
  if (holes > 0) {
    const ringR = (root + bore) / 2;
    const holeR = Math.min((root - bore) * 0.32, (Math.PI * ringR) / holes * 0.62);
    for (let i = 0; i < holes; i++) {
      const a = (i / holes) * 2 * Math.PI + Math.PI / holes;
      d += circle(ringR * Math.cos(a), ringR * Math.sin(a), holeR);
    }
  }
  return d;
}

/** Place a train of meshing gears that share one module. */
export function placeTrain(specs: GearSpec[], module: number): PlacedGear[] {
  const out = new Map<string, PlacedGear>();
  for (const s of specs) {
    const r = (module * s.teeth) / 2;
    let x = s.x ?? 0;
    let y = s.y ?? 0;
    const alphaRad = ((s.angle ?? 0) * Math.PI) / 180;
    if (s.mesh) {
      const parent = out.get(s.mesh);
      if (!parent) throw new Error(`gear ${s.id}: parent ${s.mesh} must come first`);
      x = parent.x + (parent.r + r) * Math.cos(alphaRad);
      y = parent.y + (parent.r + r) * Math.sin(alphaRad);
    }
    out.set(s.id, { id: s.id, teeth: s.teeth, x, y, r, mesh: s.mesh, alphaRad, path: gearPath(s.teeth, module, s.holes) });
  }
  return [...out.values()];
}
