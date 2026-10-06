import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import * as THREE from 'three'
import { CHAPTERS, type ChapterId } from '../data/content'
import { useStore } from '../state/store'
import { STATION, cameraFor, facing } from './layout'
import { theme } from './theme'
import Island, { Signs } from './Island'
import Guide from './Guide'
import Plaza from './Plaza'
import Teaching from './Teaching'
import Research from './Research'
import Maker from './Maker'
import Journey from './Journey'
import Lighthouse from './Lighthouse'

function Mood() {
  const { s } = useStore()
  const { scene } = useThree()
  const hemi = useRef<THREE.HemisphereLight>(null)
  const sun = useRef<THREE.DirectionalLight>(null)
  useFrame((_, dt) => {
    const t = CHAPTERS[s.chapter].theme
    const k = Math.min(1, dt * 2.2)
    theme.sky.lerp(new THREE.Color(t.sky), k)
    theme.ground.lerp(new THREE.Color(t.ground), k)
    theme.accent.lerp(new THREE.Color(t.accent), k)
    theme.sun.lerp(new THREE.Color(t.sun), k)
    ;(scene.background as THREE.Color).copy(theme.sky)
    ;(scene.fog as THREE.Fog).color.copy(theme.sky)
    hemi.current!.color.copy(theme.sky).lerp(new THREE.Color('#ffffff'), 0.5)
    sun.current!.color.copy(theme.sun)
    document.documentElement.style.setProperty('--accent', `#${theme.accent.getHexString()}`)
  })
  return (
    <>
      <hemisphereLight ref={hemi} args={['#ffffff', '#b8c9a8', 1.0]} />
      <directionalLight
        ref={sun}
        position={[26, 38, 20]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
      />
    </>
  )
}

function Rig() {
  const { id } = useStore()
  const ref = useRef<CameraControls>(null)
  const aspect = useThree((t) => t.size.width / t.size.height)
  const k = Math.round(Math.min(2.4, Math.max(1, 1.5 / aspect)) * 10) / 10
  useEffect(() => {
    const { pos, target } = cameraFor(id)
    const p = pos.map((v, i) => target[i] + (v - target[i]) * k) as [number, number, number]
    ref.current?.setLookAt(...p, ...target, true)
  }, [id, k])
  return <CameraControls ref={ref} makeDefault smoothTime={0.8} minDistance={5} maxDistance={110} maxPolarAngle={Math.PI * 0.49} dollyToCursor />
}

function At({ id, children }: { id: ChapterId; children: React.ReactNode }) {
  const p = STATION[id]
  return (
    <group position={p} rotation-y={facing(p)}>
      {children}
    </group>
  )
}

export default function World() {
  const { s } = useStore()
  const start = cameraFor('welcome')
  return (
    <Canvas className="world" shadows dpr={[1, 1.75]} camera={{ position: start.pos, fov: 40, near: 0.5, far: 400 }} gl={{ antialias: true }}>
      <color attach="background" args={['#fde7d3']} />
      <fog attach="fog" args={['#fde7d3', 70, 190]} />
      <Mood />
      <Island />
      <Plaza />
      <At id="teaching"><Teaching /></At>
      <At id="research"><Research /></At>
      <At id="build"><Maker /></At>
      <At id="about"><Journey /></At>
      <At id="contact"><Lighthouse /></At>
      <Signs />
      <Guide talking={s.talking} />
      <Rig />
    </Canvas>
  )
}
