
export function easeInOutCubic(t: number): number {
  return t < 0.5 ?
  4 * t * t * t
  : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Peak speed ~1.57x average vs cubic's 3x — much gentler top speed
export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

// Blends sine with linear so speed never drops to 0 at endpoints — smoother feel at start/end
export function easeInOutSineBlend(t: number): number {
  return 0.6 * t + 0.4 * (-(Math.cos(Math.PI * t) - 1) / 2)
}