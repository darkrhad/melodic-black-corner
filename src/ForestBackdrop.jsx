// A night pine forest behind the page: a faint moon, mist and four rows of firs,
// drawn once from a fixed seed so it looks the same on every visit.
const WIDTH = 1600
const HEIGHT = 900

function random(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

// a fir: jagged tiers that widen towards the ground, plus a short trunk
function fir(x, base, h, w, rnd) {
  const tiers = 7 + Math.floor(rnd() * 4)
  const top = base - h
  const left = []
  for (let i = 1; i <= tiers; i++) {
    const y = top + (h * 0.92 * i) / tiers
    const half = ((w / 2) * i) / tiers * (0.85 + rnd() * 0.3)
    left.push([x - half, y], [x - half * 0.4, y - (h / tiers) * 0.35])
  }
  left.pop()
  const right = left.map(([px, py]) => [2 * x - px, py]).reverse()
  const trunk = w * 0.05
  const pts = [[x, top], ...left, [x - trunk, top + h * 0.92], [x - trunk, base], [x + trunk, base], [x + trunk, top + h * 0.92], ...right]
  return 'M' + pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join('L') + 'Z'
}

function row(seed, { base, minH, maxH, gap }) {
  const rnd = random(seed)
  let d = ''
  for (let x = -40; x < WIDTH + 40; x += gap * (0.6 + rnd() * 0.8)) {
    const h = minH + rnd() * (maxH - minH)
    d += fir(x, base + 2, h, h * (0.28 + rnd() * 0.08), rnd)
  }
  // ground under the row, so the trees don't float
  return d + `M0,${base}L${WIDTH},${base}L${WIDTH},${HEIGHT}L0,${HEIGHT}Z`
}

const ROWS = [
  { seed: 11, base: 560, minH: 90, maxH: 170, gap: 22, fill: 'var(--forest-far)' },
  { seed: 23, base: 640, minH: 150, maxH: 260, gap: 34, fill: 'var(--forest-mid)' },
  { seed: 37, base: 740, minH: 220, maxH: 340, gap: 50, fill: 'var(--forest-near)' },
  { seed: 51, base: 860, minH: 300, maxH: 460, gap: 110, fill: 'var(--forest-front)' },
]
const paths = ROWS.map((r) => ({ d: row(r.seed, r), fill: r.fill }))

export default function ForestBackdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--night)" />
            <stop offset="0.65" stopColor="var(--sky-low)" />
          </linearGradient>
          <radialGradient id="moon" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--frost)" stopOpacity="0.16" />
            <stop offset="1" stopColor="var(--frost)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--frost)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--frost)" stopOpacity="0.06" />
            <stop offset="1" stopColor="var(--frost)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#sky)" />
        <circle cx="1220" cy="190" r="220" fill="url(#moon)" />
        <circle cx="1220" cy="190" r="34" fill="var(--moon)" />
        {paths.map((p, i) => (
          <g key={i}>
            <path d={p.d} fill={p.fill} />
            {i < paths.length - 1 && <rect y={ROWS[i].base - 90} width={WIDTH} height="160" fill="url(#mist)" />}
          </g>
        ))}
      </svg>
    </div>
  )
}
