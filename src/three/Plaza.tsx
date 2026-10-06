import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { AREAS, type Area } from '../data/content'
import { useStore } from '../state/store'
import { assetUrl } from './theme'

/** Framed portrait that floats and turns gently toward the pointer. */
export function PortraitFrame({ size = 3.4, position = [0, 3.4, 0] as [number, number, number] }: { size?: number; position?: [number, number, number] }) {
  const tex = useTexture(assetUrl('media/portrait.webp'))
  tex.colorSpace = THREE.SRGBColorSpace
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime
    g.current!.position.y = position[1] + Math.sin(t * 1.1) * 0.12
    g.current!.rotation.y = THREE.MathUtils.damp(g.current!.rotation.y, pointer.x * 0.35, 4, 0.016)
    g.current!.rotation.x = THREE.MathUtils.damp(g.current!.rotation.x, -pointer.y * 0.15, 4, 0.016)
  })
  return (
    <group ref={g} position={position}>
      <mesh position={[0, 0, -0.08]} castShadow>
        <boxGeometry args={[size + 0.4, size + 0.4, 0.14]} />
        <meshStandardMaterial color="#1f2433" roughness={0.5} />
      </mesh>
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  )
}

const ORBS: Area[] = ['genai', 'ml', 'methods']

function Orb({ area, i }: { area: Area; i: number }) {
  const { s, d } = useStore()
  const g = useRef<THREE.Group>(null)
  const [hov, setHov] = useState(false)
  const on = s.area === area
  useFrame(({ clock }) => {
    const a = clock.elapsedTime * 0.35 + (i * Math.PI * 2) / 3
    g.current!.position.set(Math.cos(a) * 5.6, 3.1 + Math.sin(clock.elapsedTime * 0.9 + i) * 0.4, Math.sin(a) * 5.6)
    const sc = on || hov ? 1.35 : 1
    g.current!.scale.setScalar(THREE.MathUtils.damp(g.current!.scale.x, sc, 6, 0.016))
  })
  const c = AREAS[area].color
  return (
    <group ref={g}>
      <mesh
        castShadow
        onClick={(e) => {
          e.stopPropagation()
          d({ type: 'area', value: area })
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
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={on ? 0.8 : 0.3} flatShading roughness={0.4} />
      </mesh>
      <Html position={[0, 1.1, 0]} center distanceFactor={13} zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`orblabel ${on ? 'on' : ''}`} style={{ ['--c' as string]: c }}>{AREAS[area].short}</div>
      </Html>
    </group>
  )
}

export default function Plaza() {
  const ring = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    ring.current!.rotation.z = clock.elapsedTime * 0.2
  })
  return (
    <group>
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.6, 4, 0.4, 40]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.8} />
      </mesh>
      <mesh ref={ring} position={[0, 0.5, 0]} rotation-x={-Math.PI / 2}>
        <torusGeometry args={[3.1, 0.05, 8, 64]} />
        <meshStandardMaterial color="#e8590c" emissive="#e8590c" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.22, 2.4, 12]} />
        <meshStandardMaterial color="#1f2433" />
      </mesh>
      <PortraitFrame />
      {ORBS.map((a, i) => (
        <Orb key={a} area={a} i={i} />
      ))}
    </group>
  )
}
