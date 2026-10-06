import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { HONOURS, MILESTONES, type Milestone } from '../data/content'
import { useStore } from '../state/store'

const KIND = { study: '#3b82f6', work: '#e8590c', honour: '#d9a406' } as const

function Post({ m, x, z }: { m: Milestone; x: number; z: number }) {
  const { s, d } = useStore()
  const g = useRef<THREE.Group>(null)
  const [hov, setHov] = useState(false)
  const on = s.milestone === m.id
  useFrame(() => {
    g.current!.scale.setScalar(THREE.MathUtils.damp(g.current!.scale.x, on ? 1.2 : hov ? 1.1 : 1, 7, 0.016))
  })
  return (
    <group ref={g} position={[x, 0, z]}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 2, 8]} />
        <meshStandardMaterial color="#8a6a4d" />
      </mesh>
      <mesh
        position={[0, 2.25, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation()
          d({ type: 'milestone', value: m.id })
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
        <boxGeometry args={[2.3, 0.9, 0.14]} />
        <meshStandardMaterial color={KIND[m.kind]} emissive={KIND[m.kind]} emissiveIntensity={on ? 0.5 : 0.08} />
      </mesh>
      <Html position={[0, 2.25, 0.1]} center transform distanceFactor={4.3} pointerEvents="none" zIndexRange={[3, 0]}>
        <div className="post3d">{m.when}</div>
      </Html>
    </group>
  )
}

function Trophy({ m, x }: { m: Milestone; x: number }) {
  const { s, d } = useStore()
  const g = useRef<THREE.Group>(null)
  const on = s.milestone === m.id
  useFrame(({ clock }) => {
    g.current!.rotation.y = clock.elapsedTime * (on ? 2 : 0.6)
    g.current!.scale.setScalar(THREE.MathUtils.damp(g.current!.scale.x, on ? 1.35 : 1, 7, 0.016))
  })
  return (
    <group position={[x, 1.7, -5.2]}>
      <group ref={g}>
        <mesh
          castShadow
          onClick={(e) => {
            e.stopPropagation()
            d({ type: 'milestone', value: m.id })
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <cylinderGeometry args={[0.5, 0.2, 0.9, 14]} />
          <meshStandardMaterial color="#e8b923" metalness={0.8} roughness={0.25} emissive="#e8b923" emissiveIntensity={on ? 0.5 : 0.1} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 10]} />
          <meshStandardMaterial color="#e8b923" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

export default function Journey() {
  const all = MILESTONES
  return (
    <group>
      {/* winding path */}
      {Array.from({ length: 26 }, (_, i) => {
        const t = i / 25
        const x = -9 + t * 18
        const z = 2.5 + Math.sin(t * Math.PI * 2) * 1.8
        return (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[x, 0.04, z]}>
            <circleGeometry args={[0.5, 12]} />
            <meshStandardMaterial color="#d8c8a6" />
          </mesh>
        )
      })}
      {all.map((m, i) => {
        const t = (i + 0.5) / all.length
        return <Post key={m.id} m={m} x={-9 + t * 18} z={2.5 + Math.sin(t * Math.PI * 2) * 1.8 - 1.6} />
      })}
      {/* trophy shelf */}
      <mesh position={[0, 0.9, -5.3]} castShadow receiveShadow>
        <boxGeometry args={[9.5, 0.3, 1.4]} />
        <meshStandardMaterial color="#a98866" />
      </mesh>
      <mesh position={[0, 0.45, -5.3]}>
        <boxGeometry args={[9.2, 0.9, 1.2]} />
        <meshStandardMaterial color="#8d6f50" />
      </mesh>
      {HONOURS.map((h, i) => (
        <Trophy key={h.id} m={h} x={-3.6 + i * 2.4} />
      ))}
    </group>
  )
}
