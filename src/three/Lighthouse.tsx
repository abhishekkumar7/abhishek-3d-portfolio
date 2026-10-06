import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PortraitFrame } from './Plaza'

export default function Lighthouse() {
  const beam = useRef<THREE.Group>(null)
  const flag = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    beam.current!.rotation.y = clock.elapsedTime * 0.8
    flag.current!.rotation.z = Math.sin(clock.elapsedTime * 3) * 0.12 - 0.2
  })
  const stripes = [0, 1, 2, 3, 4]
  return (
    <group>
      <group position={[0, 0, -3.5]}>
        {stripes.map((i) => (
          <mesh key={i} position={[0, 0.9 + i * 1.8, 0]} castShadow>
            <cylinderGeometry args={[1.5 - (i + 1) * 0.14, 1.5 - i * 0.14, 1.8, 20]} />
            <meshStandardMaterial color={i % 2 ? '#d9480f' : '#faf6ee'} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 9.4, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 1.1, 16]} />
          <meshStandardMaterial color="#ffe08a" emissive="#ffd24d" emissiveIntensity={1.6} transparent opacity={0.95} />
        </mesh>
        <mesh position={[0, 10.3, 0]} castShadow>
          <coneGeometry args={[1.1, 1.1, 16]} />
          <meshStandardMaterial color="#d9480f" />
        </mesh>
        <pointLight position={[0, 9.4, 0]} color="#ffd24d" intensity={25} distance={26} />
        <group ref={beam} position={[0, 9.4, 0]}>
          <mesh position={[5.5, 0, 0]} rotation-z={-Math.PI / 2}>
            <coneGeometry args={[1.8, 11, 20, 1, true]} />
            <meshBasicMaterial color="#ffe9a8" transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
      </group>
      {/* mailbox */}
      <group position={[3.6, 0, 3]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 1.2, 8]} />
          <meshStandardMaterial color="#6b5a45" />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[1.5, 0.9, 1]} />
          <meshStandardMaterial color="#e03131" />
        </mesh>
        <mesh ref={flag} position={[0.9, 1.7, 0]}>
          <boxGeometry args={[0.08, 0.7, 0.3]} />
          <meshStandardMaterial color="#ffd43b" />
        </mesh>
      </group>
      <PortraitFrame size={2.4} position={[-6.2, 3, -1.5]} />
    </group>
  )
}
