import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PROGRAMMES, TRACKS, type Programme, type Track } from '../data/content'
import { useStore } from '../state/store'

const SHORT: Record<string, string> = {
  'genai-leaders': 'GenAI for Business Leaders',
  'aiml-managers': 'AI & ML for Managers',
  'ai-strategy': 'AI Strategy',
  cert: 'GenAI Certification',
  agentic: 'Agentic AI',
  maker: 'Maker Lab',
  influencer: 'Influencer Analytics',
  theory: 'Theory & Theorizing',
  methods: 'AI Research Methods',
}

export function orderedProgrammes(audience: string | null): Programme[] {
  const order: Track[] = audience === 'academic' ? ['research', 'build', 'business'] : audience === 'student' ? ['build', 'business', 'research'] : ['business', 'build', 'research']
  return order.flatMap((t) => PROGRAMMES.filter((p) => p.track === t))
}

function Tile({ p, x, selected, onPick }: { p: Programme; x: number; selected: boolean; onPick: () => void }) {
  const g = useRef<THREE.Group>(null)
  const [hov, setHov] = useState(false)
  const c = TRACKS[p.track].color
  useFrame(() => {
    const y = 0.95 + (selected ? 0.55 : hov ? 0.25 : 0)
    g.current!.position.y = THREE.MathUtils.damp(g.current!.position.y, y, 7, 0.016)
    g.current!.position.x = THREE.MathUtils.damp(g.current!.position.x, x, 5, 0.016)
  })
  return (
    <group ref={g} position={[x, 0.95, 5.4]} rotation-x={-0.35}>
      <mesh
        castShadow
        onClick={(e) => {
          e.stopPropagation()
          onPick()
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
        <boxGeometry args={[2.05, 1.35, 0.16]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={selected ? 0.55 : hov ? 0.25 : 0.05} roughness={0.55} />
      </mesh>
      <Html position={[0, 0, 0.1]} center transform distanceFactor={4.3} pointerEvents="none" zIndexRange={[3, 0]}>
        <div className="tile3d">{SHORT[p.id]}</div>
      </Html>
    </group>
  )
}

function Student({ col, row, wave }: { col: number; row: number; wave: React.MutableRefObject<number | null> }) {
  const g = useRef<THREE.Group>(null)
  const skin = useMemo(() => ['#c58a5b', '#e0ac82', '#8d5a3b', '#d9a066'][(col * 3 + row) % 4], [col, row])
  const shirt = useMemo(() => ['#4f6bed', '#f2b134', '#e5647b', '#38b6a6', '#9b7bf0'][(col + row * 2) % 5], [col, row])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (wave.current === null) wave.current = t
    const dt = t - wave.current
    const bounce = dt < 2.2 ? Math.max(0, Math.sin(dt * 9 - col * 0.7)) * 0.28 : 0
    g.current!.position.y = bounce
  })
  return (
    <group ref={g} position={[(col - 2) * 2.3, 0, -1.5 + row * 2.4]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.5, 4, 10]} />
        <meshStandardMaterial color={shirt} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 12]} />
        <meshStandardMaterial color={skin} />
      </mesh>
      <mesh position={[0, 0.3, 0.45]} castShadow>
        <boxGeometry args={[0.7, 0.05, 0.5]} />
        <meshStandardMaterial color="#d9cdb6" />
      </mesh>
    </group>
  )
}

export default function Teaching() {
  const { s, d } = useStore()
  const list = orderedProgrammes(s.audience)
  const sel = PROGRAMMES.find((p) => p.id === s.programme)
  const wave = useRef<number | null>(null)
  const last = useRef<string | null>(null)
  if (last.current !== s.programme) {
    last.current = s.programme
    wave.current = null
  }
  const rows = [0, 1, 2]
  const cols = [0, 1, 2, 3, 4]
  const c = sel ? TRACKS[sel.track].color : '#d97706'
  return (
    <group>
      {/* back wall + screen */}
      <mesh position={[0, 3.4, -8]} castShadow receiveShadow>
        <boxGeometry args={[15, 6.8, 0.4]} />
        <meshStandardMaterial color="#f4efe3" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.6, -7.74]}>
        <planeGeometry args={[11.6, 5]} />
        <meshStandardMaterial color="#14182a" emissive={c} emissiveIntensity={0.12} />
      </mesh>
      <Html position={[0, 3.6, -7.7]} center transform distanceFactor={5.6} pointerEvents="none" zIndexRange={[3, 0]}>
        <div className="screen3d" style={{ ['--c' as string]: c }}>
          {sel ? (
            <>
              <small>{TRACKS[sel.track].name}</small>
              <h3>{sel.title}</h3>
              <ul>
                {sel.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <small>Teaching</small>
              <h3>Pick a programme from the rack</h3>
              <p>Case-led for leaders, hands-on for builders, seminars for researchers.</p>
            </>
          )}
        </div>
      </Html>
      {/* podium */}
      <mesh position={[-5.2, 0.6, -5.4]} castShadow>
        <boxGeometry args={[1.5, 1.2, 1]} />
        <meshStandardMaterial color="#9a7b5a" />
      </mesh>
      {rows.flatMap((r) => cols.map((cl) => <Student key={`${r}${cl}`} row={r} col={cl} wave={wave} />))}
      {list.map((p, i) => (
        <Tile key={p.id} p={p} x={(i - 4) * 2.3} selected={s.programme === p.id} onPick={() => d({ type: 'programme', value: p.id })} />
      ))}
    </group>
  )
}
