import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { CHAPTERS, type ChapterId } from '../data/content'
import { STATION, rng } from './layout'
import { theme } from './theme'
import { useStore } from '../state/store'

const RADIUS = 54

function Ground() {
  const m = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(() => m.current!.color.copy(theme.ground))
  return (
    <group>
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <cylinderGeometry args={[RADIUS, RADIUS, 1.2, 80]} />
        <meshStandardMaterial ref={m} color="#d8ecd3" roughness={1} />
      </mesh>
      <mesh position={[0, -8.2, 0]}>
        <cylinderGeometry args={[RADIUS, 24, 14, 64]} />
        <meshStandardMaterial color="#b9a58c" roughness={1} />
      </mesh>
    </group>
  )
}

function Pads() {
  return (
    <group>
      {CHAPTERS.map((c) => {
        const p = STATION[c.id]
        return (
          <group key={c.id} position={p}>
            <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]} receiveShadow>
              <circleGeometry args={[c.id === 'welcome' ? 8 : 10.5, 56]} />
              <meshStandardMaterial color="#f7f3ea" roughness={0.9} />
            </mesh>
            <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
              <ringGeometry args={[c.id === 'welcome' ? 7.7 : 10.2, c.id === 'welcome' ? 8 : 10.5, 64]} />
              <meshBasicMaterial color={c.theme.accent} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function Stones() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const spots = useMemo(() => {
    const out: [number, number][] = []
    for (const c of CHAPTERS) {
      if (c.id === 'welcome') continue
      const p = STATION[c.id]
      for (let i = 1; i <= 7; i++) {
        const t = 0.27 + (i / 8) * 0.46
        out.push([p[0] * t, p[2] * t])
      }
    }
    return out
  }, [])
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    spots.forEach(([x, z], i) => {
      m.compose(new THREE.Vector3(x, 0.03, z), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1))
      ref.current!.setMatrixAt(i, m)
    })
    ref.current!.instanceMatrix.needsUpdate = true
  }, [spots])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, spots.length]} receiveShadow>
      <cylinderGeometry args={[0.7, 0.7, 0.06, 18]} />
      <meshStandardMaterial color="#ece4d3" />
    </instancedMesh>
  )
}

function Trees() {
  const cones = useRef<THREE.InstancedMesh>(null)
  const trunks = useRef<THREE.InstancedMesh>(null)
  const pts = useMemo(() => {
    const r = rng(11)
    const out: { x: number; z: number; s: number }[] = []
    let guard = 0
    while (out.length < 46 && guard++ < 4000) {
      const a = r() * Math.PI * 2
      const d = 20 + r() * 31
      const x = Math.cos(a) * d
      const z = Math.sin(a) * d
      if (Object.values(STATION).some((p) => Math.hypot(p[0] - x, p[2] - z) < 14)) continue
      if (Math.hypot(x, z) < 15) continue
      if (z > 8 && Math.abs(x) < 26 && z < 40) continue
      out.push({ x, z, s: 0.55 + r() * 0.7 })
    }
    return out
  }, [])
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    pts.forEach((t, i) => {
      m.compose(new THREE.Vector3(t.x, 1.9 * t.s, t.z), q, new THREE.Vector3(t.s, t.s, t.s))
      cones.current!.setMatrixAt(i, m)
      m.compose(new THREE.Vector3(t.x, 0.5 * t.s, t.z), q, new THREE.Vector3(t.s, t.s, t.s))
      trunks.current!.setMatrixAt(i, m)
    })
    cones.current!.instanceMatrix.needsUpdate = true
    trunks.current!.instanceMatrix.needsUpdate = true
  }, [pts])
  return (
    <group>
      <instancedMesh ref={cones} args={[undefined, undefined, pts.length]} castShadow>
        <coneGeometry args={[1.1, 3, 7]} />
        <meshStandardMaterial color="#6bb273" flatShading />
      </instancedMesh>
      <instancedMesh ref={trunks} args={[undefined, undefined, pts.length]}>
        <cylinderGeometry args={[0.18, 0.22, 1, 6]} />
        <meshStandardMaterial color="#8a6a4d" />
      </instancedMesh>
    </group>
  )
}

function Clouds() {
  const ref = useRef<THREE.Group>(null)
  const items = useMemo(() => {
    const r = rng(5)
    return Array.from({ length: 9 }, () => ({ a: r() * 6.28, d: 28 + r() * 40, y: 16 + r() * 14, s: 2 + r() * 2.5, v: 0.01 + r() * 0.02 }))
  }, [])
  useFrame((_, dt) => {
    ref.current!.children.forEach((c, i) => {
      items[i].a += items[i].v * dt
      c.position.set(Math.cos(items[i].a) * items[i].d, items[i].y, Math.sin(items[i].a) * items[i].d)
    })
  })
  return (
    <group ref={ref}>
      {items.map((c, i) => (
        <group key={i} scale={c.s}>
          <mesh><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#fff" transparent opacity={0.9} /></mesh>
          <mesh position={[1, -0.15, 0.1]} scale={0.8}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#fff" transparent opacity={0.9} /></mesh>
          <mesh position={[-1.05, -0.2, 0]} scale={0.7}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#fff" transparent opacity={0.9} /></mesh>
        </group>
      ))}
    </group>
  )
}

const SIGN: Record<ChapterId, string> = {
  welcome: 'The plaza',
  teaching: 'Teaching Studio',
  research: 'Research Observatory',
  build: 'Maker Lab',
  about: 'The journey',
  contact: 'Lighthouse',
}

const SIGN_Y: Record<ChapterId, number> = { welcome: 0, teaching: 8.6, research: 8.2, build: 7.4, about: 6.4, contact: 12.8 }

export function Signs() {
  const { id, d } = useStore()
  return (
    <>
      {CHAPTERS.filter((c) => c.id !== 'welcome').map((c, i) => {
        const p = STATION[c.id]
        const here = id === c.id
        return (
          <Html key={c.id} position={[p[0], SIGN_Y[c.id], p[2]]} center distanceFactor={20} zIndexRange={[4, 0]}>
            <button className={`sign3d ${here ? 'on' : ''}`} style={{ ['--c' as string]: c.theme.accent }} onClick={() => d({ type: 'chapter', value: CHAPTERS.findIndex((x) => x.id === c.id) })}>
              {SIGN[c.id]}
            </button>
            <span hidden>{i}</span>
          </Html>
        )
      })}
    </>
  )
}

export default function Island() {
  return (
    <>
      <Ground />
      <Pads />
      <Stones />
      <Trees />
      <Clouds />
    </>
  )
}
