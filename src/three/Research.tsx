import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { AREAS, PAPERS, type Area, type Paper } from '../data/content'
import { useStore } from '../state/store'

const RING: Record<Area, { r: number; y: number; v: number }> = {
  genai: { r: 6.2, y: 4.2, v: 0.09 },
  ml: { r: 8.6, y: 3.2, v: -0.06 },
  methods: { r: 11, y: 2.4, v: 0.045 },
}

function PaperCard({ p, i, n }: { p: Paper; i: number; n: number }) {
  const { s, d } = useStore()
  const g = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const [hov, setHov] = useState(false)
  const ring = RING[p.area]
  const c = AREAS[p.area].color
  const selected = s.paper === p.id
  const dim = s.area !== null && s.area !== p.area
  useFrame(({ clock }) => {
    const a = clock.elapsedTime * ring.v + (i / n) * Math.PI * 2
    const y = ring.y + Math.sin(clock.elapsedTime * 0.8 + i * 2) * 0.18
    g.current!.position.set(Math.cos(a) * ring.r, y, Math.sin(a) * ring.r)
    g.current!.rotation.y = -a + Math.PI / 2
    const sc = selected ? 1.55 : hov ? 1.25 : 1
    g.current!.scale.setScalar(THREE.MathUtils.damp(g.current!.scale.x, sc, 7, 0.016))
    mat.current!.opacity = THREE.MathUtils.damp(mat.current!.opacity, dim ? 0.18 : 1, 6, 0.016)
    mat.current!.emissiveIntensity = selected ? 0.7 : hov ? 0.4 : 0.12
  })
  return (
    <group ref={g}>
      <mesh
        castShadow
        onClick={(e) => {
          e.stopPropagation()
          d({ type: 'paper', value: p.id })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHov(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHov(false)
          document.body.style.cursor = ''
        }}
      >
        <boxGeometry args={[1.7, 2.1, 0.1]} />
        <meshStandardMaterial ref={mat} color={c} emissive={c} transparent roughness={0.5} />
      </mesh>
      {/* text lines */}
      {[0.55, 0.3, 0.05, -0.2].map((y, k) => (
        <mesh key={k} position={[0, y, 0.06]}>
          <planeGeometry args={[1.2 - k * 0.12, 0.08]} />
          <meshBasicMaterial color="#fff" transparent opacity={dim ? 0.1 : 0.8} />
        </mesh>
      ))}
      <Html position={[0, -1.45, 0.1]} center distanceFactor={12} pointerEvents="none" zIndexRange={[3, 0]}>
        <div className={`yr3d ${selected || hov ? 'on' : ''}`} style={{ opacity: dim ? 0.25 : 1 }}>{p.year}</div>
      </Html>
    </group>
  )
}

export default function Research() {
  const core = useRef<THREE.Mesh>(null)
  const grouped = useMemo(() => (['genai', 'ml', 'methods'] as Area[]).map((a) => PAPERS.filter((p) => p.area === a)), [])
  useFrame(({ clock }) => {
    core.current!.rotation.y = clock.elapsedTime * 0.4
    core.current!.rotation.x = clock.elapsedTime * 0.25
  })
  return (
    <group position={[0, 0, -4]}>
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.4, 2.8, 0.5, 32]} />
        <meshStandardMaterial color="#e9e4d6" />
      </mesh>
      <mesh ref={core} position={[0, 2.6, 0]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color="#0ea5a4" emissive="#0ea5a4" emissiveIntensity={0.6} wireframe />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <sphereGeometry args={[0.55, 20, 16]} />
        <meshStandardMaterial color="#fff" emissive="#7ff2ef" emissiveIntensity={1} />
      </mesh>
      <pointLight position={[0, 2.6, 0]} color="#7ff2ef" intensity={18} distance={22} />
      {(['genai', 'ml', 'methods'] as Area[]).map((a) => (
        <mesh key={a} position={[0, 0.06, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[RING[a].r - 0.05, RING[a].r + 0.05, 96]} />
          <meshBasicMaterial color={AREAS[a].color} transparent opacity={0.45} />
        </mesh>
      ))}
      {grouped.map((arr) => arr.map((p, i) => <PaperCard key={p.id} p={p} i={i} n={arr.length} />))}
    </group>
  )
}
