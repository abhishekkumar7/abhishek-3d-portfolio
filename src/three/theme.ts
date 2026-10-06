import * as THREE from 'three'

/** Shared, smoothly-animated colours. World updates these every frame; scene parts read them. */
export const theme = {
  sky: new THREE.Color('#fde7d3'),
  ground: new THREE.Color('#d8ecd3'),
  accent: new THREE.Color('#e8590c'),
  sun: new THREE.Color('#fff1dc'),
}

export const assetUrl = (p: string) => `${import.meta.env.BASE_URL}${p}`
