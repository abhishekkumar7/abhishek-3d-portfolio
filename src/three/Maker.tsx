import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { AGENT_STEPS } from '../data/content'
import { useStore } from '../state/store'

const XS = [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5]
const pos = (i: number) => new THREE.Vector3(XS[i], 1.9 + (i % 2) * 0.6, -1 + Math.sin(i * 1.2) * 1.2)
const COLORS = ['#7c5cff', '#9b7bf0', '#0ea5a4', '#f59e0b', '#22a06b', '#e5647b']

function Node({ i }: { i: number }) {
  const { s, d } = useStore()
  const g = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const skipped = AGENT_STEPS[i].id === 'human' && !s.humanReview
  const active = s.agentStep === i
  useFrame(({ clock }) => {
    const p = pos(i)
    g.current!.position.set(p.x, p.y + Math.sin(clock.elapsedTime * 1.2 + i) * 0.08, p.z)
    const sc = active ? 1.18 : 1
    g.current!.scale.setScalar(THREE.MathUtils.damp(g.current!.scale.x, sc, 7, 0.016))
    mat.current!.emissiveIntensity = active ? 0.8 : skipped ? 0 : 0.1
  })
  return (
    <group ref={g}>
      <mesh
        castShadow
        onClick={(e) => {
          e.stopPropagation()
          d({ type: 'agentStep', value: i })
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <boxGeometry args={[2.2, 1.2, 1.1]} />
        <meshStandardMaterial ref={mat} color={skipped ? '#c9c4d6' : COLORS[i]} emissive={COLORS[i]} roughness={0.5} />
      </mesh>
      <Html position={[0, 0, 0.6]} center transform distanceFactor={4.2} pointerEvents="none" zIndexRange={[3, 0]}>
        <div className={`node3d ${skipped ? 'skip' : ''}`}>{skipped ? 'Skipped' : AGENT_STEPS[i].label}</div>
      </Html>
    </group>
  )
}

function Packets() {
  const { s } = useStore()
  const ref = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const prog = useRef(0)
  const path = useMemo(() => [0, 1, 2, 3, 4, 5].map(pos), [])
  useFrame((_, dt) => {
    // idle: loop along the path. Stepping: ease toward the chosen node.
    let want: number
    if (s.agentStep >= 0) {
      want = s.agentStep
      if (!s.humanReview && s.agentStep === 4) want = 3.5
      prog.current = THREE.MathUtils.damp(prog.current, want, 3, dt)
    } else {
      prog.current = (prog.current + dt * 0.5) % 5
    }
    const f = Math.min(prog.current, 4.9999)
    const k = Math.floor(f)
    const v = path[k].clone().lerp(path[k + 1], f - k)
    v.y += 1.15
    ref.current!.position.copy(v)
    mat.current!.color.set(!s.humanReview ? '#e5484d' : '#fff')
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 16, 12]} />
      <meshBasicMaterial ref={mat} toneMapped={false} />
    </mesh>
  )
}

function Links() {
  const pts = useMemo(() => [0, 1, 2, 3, 4, 5].map(pos), [])
  return (
    <>
      {pts.slice(0, -1).map((a, i) => {
        const b = pts[i + 1]
        const mid = a.clone().add(b).multiplyScalar(0.5)
        const len = a.distanceTo(b)
        const dir = b.clone().sub(a).normalize()
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
        return (
          <mesh key={i} position={mid} quaternion={q}>
            <cylinderGeometry args={[0.05, 0.05, len, 8]} />
            <meshStandardMaterial color="#b9b0d9" />
          </mesh>
        )
      })}
    </>
  )
}

export default function Maker() {
  const { s } = useStore()
  const light = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(({ clock }) => {
    light.current!.emissiveIntensity = s.humanReview ? 0.9 : 0.4 + Math.abs(Math.sin(clock.elapsedTime * 5)) * 1.2
  })
  return (
    <group>
      <mesh position={[0, 0.3, -1]} receiveShadow castShadow>
        <boxGeometry args={[19, 0.6, 5]} />
        <meshStandardMaterial color="#e6e1f2" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.4, -5]} receiveShadow>
        <boxGeometry args={[19, 7, 0.3]} />
        <meshStandardMaterial color="#f1eefb" />
      </mesh>
      <Links />
      {AGENT_STEPS.map((_, i) => (
        <Node key={i} i={i} />
      ))}
      <Packets />
      {/* oversight lamp */}
      <group position={[9.6, 0.6, 1.4]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 1.2, 10]} />
          <meshStandardMaterial color="#444a5e" />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.38, 20, 16]} />
          <meshStandardMaterial ref={light} color={s.humanReview ? '#22a06b' : '#e5484d'} emissive={s.humanReview ? '#22a06b' : '#e5484d'} />
        </mesh>
        <Html position={[0, 2.2, 0]} center distanceFactor={12} pointerEvents="none" zIndexRange={[3, 0]}>
          <div className={`lamp3d ${s.humanReview ? 'ok' : 'bad'}`}>{s.humanReview ? 'Human in the loop' : 'No oversight'}</div>
        </Html>
      </group>
    </group>
  )
}
