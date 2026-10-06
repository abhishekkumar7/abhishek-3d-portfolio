import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../state/store'
import { STATION, guideSpot, facing } from './layout'

const SKIN = '#c58a5b'
const HAIR = '#15151b'
const SHIRT = '#1b1f2b'

/** A stylised stand-in for Abhishek that walks between stations, gestures while he talks, and waves on arrival. */
export default function Guide({ talking }: { talking: boolean }) {
  const { id } = useStore()
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const legL = useRef<THREE.Group>(null)
  const legR = useRef<THREE.Group>(null)
  const target = useRef(new THREE.Vector3(...guideSpot(id)))
  const yaw = useRef(0)
  const arrived = useRef(0)
  const first = useRef(true)

  useEffect(() => {
    target.current.set(...guideSpot(id))
    arrived.current = 0
  }, [id])

  useFrame(({ clock }, dt) => {
    const g = root.current!
    if (first.current) {
      g.position.copy(target.current)
      first.current = false
    }
    const t = clock.elapsedTime
    const to = target.current.clone().sub(g.position)
    const dist = to.length()
    const walking = dist > 0.25
    if (walking) {
      const step = Math.min(dist, Math.min(dt, 0.05) * (dist > 12 ? 9 : 5))
      g.position.addScaledVector(to.normalize(), step)
      const want = Math.atan2(to.x, to.z)
      yaw.current = THREE.MathUtils.damp(yaw.current, want, 8, dt)
      arrived.current = 0
    } else {
      arrived.current += dt
      // turn to face the camera side of the station
      const p = STATION[id]
      const want = id === 'welcome' ? 0.35 : facing(p) + 0.5
      yaw.current = THREE.MathUtils.damp(yaw.current, want, 4, dt)
    }
    g.rotation.y = yaw.current

    const stride = walking ? Math.sin(t * 10) : 0
    legL.current!.rotation.x = stride * 0.7
    legR.current!.rotation.x = -stride * 0.7
    body.current!.position.y = walking ? Math.abs(Math.sin(t * 10)) * 0.07 : Math.sin(t * 1.6) * 0.012
    head.current!.rotation.y = walking ? 0 : Math.sin(t * 0.7) * 0.18
    head.current!.rotation.x = talking ? Math.sin(t * 7) * 0.05 : 0

    // arms: swing when walking, wave right after arrival, gesture while talking
    const wave = !walking && arrived.current < 1.8
    armL.current!.rotation.x = walking ? -stride * 0.6 : talking ? -0.5 + Math.sin(t * 4.3) * 0.25 : 0.05
    armL.current!.rotation.z = talking ? 0.25 : 0.08
    if (wave) {
      armR.current!.rotation.x = -2.5
      armR.current!.rotation.z = -0.3 + Math.sin(t * 12) * 0.35
    } else if (talking) {
      armR.current!.rotation.x = -0.9 + Math.sin(t * 3.6 + 1) * 0.4
      armR.current!.rotation.z = -0.25
    } else {
      armR.current!.rotation.x = walking ? stride * 0.6 : 0.05
      armR.current!.rotation.z = -0.08
    }
  })

  const limb = (len: number, r: number, color: string) => (
    <mesh position={[0, -len / 2, 0]} castShadow>
      <capsuleGeometry args={[r, len - r * 2, 4, 10]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )

  return (
    <group ref={root} scale={1.3}>
      <group ref={body}>
        {/* legs */}
        <group ref={legL} position={[-0.17, 0.95, 0]}>{limb(0.95, 0.12, '#262a38')}</group>
        <group ref={legR} position={[0.17, 0.95, 0]}>{limb(0.95, 0.12, '#262a38')}</group>
        {/* torso */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <capsuleGeometry args={[0.36, 0.5, 6, 14]} />
          <meshStandardMaterial color={SHIRT} roughness={0.75} />
        </mesh>
        {/* arms */}
        <group ref={armL} position={[-0.46, 1.8, 0]}>{limb(0.85, 0.1, SHIRT)}</group>
        <group ref={armR} position={[0.46, 1.8, 0]}>{limb(0.85, 0.1, SHIRT)}</group>
        {/* head */}
        <group ref={head} position={[0, 2.35, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.31, 24, 18]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.1, -0.04]} scale={[1.04, 0.9, 1.04]}>
            <sphereGeometry args={[0.31, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          {/* short beard */}
          <mesh position={[0, -0.12, 0.05]} scale={[0.95, 0.62, 0.9]}>
            <sphereGeometry args={[0.3, 20, 12, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55]} />
            <meshStandardMaterial color={HAIR} roughness={0.95} />
          </mesh>
          <mesh position={[-0.11, 0.03, 0.28]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#111" />
          </mesh>
          <mesh position={[0.11, 0.03, 0.28]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#111" />
          </mesh>
        </group>
      </group>
      <Html position={[0, 3.25, 0]} center distanceFactor={14} className="nametag" zIndexRange={[5, 0]}>
        <b>Abhishek</b>
        {talking && (
          <span className="wave" aria-hidden>
            <i /><i /><i /><i />
          </span>
        )}
      </Html>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.7, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={0.13} />
      </mesh>
    </group>
  )
}
