import type { ChapterId } from '../data/content'

type V3 = [number, number, number]

const R = 30
const at = (deg: number): V3 => [Math.round(Math.cos((deg * Math.PI) / 180) * R * 100) / 100, 0, Math.round(Math.sin((deg * Math.PI) / 180) * R * 100) / 100]

export const STATION: Record<ChapterId, V3> = {
  welcome: [0, 0, 0],
  teaching: at(180),
  research: at(0),
  build: at(270),
  about: at(135),
  contact: at(45),
}

/** Yaw so a station's local +z faces the plaza. */
export const facing = (p: V3) => (p[0] === 0 && p[2] === 0 ? 0 : Math.atan2(-p[0], -p[2]))

function unitToCentre(p: V3): V3 {
  const l = Math.hypot(p[0], p[2]) || 1
  return [-p[0] / l, 0, -p[2] / l]
}

/** Where the guide stands: in front of the station, a little to one side. */
export function guideSpot(id: ChapterId): V3 {
  const p = STATION[id]
  if (id === 'welcome') return [3.2, 0, 4]
  const u = unitToCentre(p)
  const side: V3 = [-u[2], 0, u[0]]
  return [p[0] + u[0] * 8.5 + side[0] * 3.4, 0, p[2] + u[2] * 8.5 + side[2] * 3.4]
}

export function cameraFor(id: ChapterId): { pos: V3; target: V3 } {
  const p = STATION[id]
  if (id === 'welcome') return { pos: [-6, 7.5, 24], target: [0, 3.2, 0] }
  const u = unitToCentre(p)
  const side: V3 = [-u[2], 0, u[0]]
  const dist = { teaching: 23, research: 23, build: 28, about: 26, contact: 24 }[id as 'teaching']
  const tgt = id === 'research' ? -3 : 4
  return {
    pos: [p[0] + u[0] * dist - side[0] * 2, 9, p[2] + u[2] * dist - side[2] * 2],
    target: [p[0] + u[0] * tgt + side[0] * 0.8, 3, p[2] + u[2] * tgt + side[2] * 0.8],
  }
}

export const OVERVIEW = { pos: [38, 46, 58] as V3, target: [0, 0, 0] as V3 }

export function rng(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
