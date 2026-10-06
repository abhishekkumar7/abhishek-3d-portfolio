import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { CHAPTERS, SAY, type Area, type Audience, type ChapterId } from '../data/content'

export interface State {
  chapter: number
  audience: Audience | null
  line: number // which of the guide's lines is showing
  programme: string | null
  paper: string | null
  area: Area | null
  milestone: string | null
  agentStep: number // -1 idle
  humanReview: boolean
  agentRun: number // bumps to restart the packet animation
  talking: boolean
}

type Action =
  | { type: 'chapter'; value: number }
  | { type: 'audience'; value: Audience | null }
  | { type: 'line'; value: number }
  | { type: 'programme'; value: string | null }
  | { type: 'paper'; value: string | null }
  | { type: 'area'; value: Area | null }
  | { type: 'milestone'; value: string | null }
  | { type: 'agentStep'; value: number }
  | { type: 'humanReview'; value: boolean }
  | { type: 'talking'; value: boolean }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'chapter':
      return { ...s, chapter: Math.max(0, Math.min(CHAPTERS.length - 1, a.value)), line: 0, agentStep: -1 }
    case 'audience':
      return { ...s, audience: a.value, line: 0 }
    case 'line':
      return { ...s, line: a.value }
    case 'programme':
      return { ...s, programme: a.value }
    case 'paper':
      return { ...s, paper: a.value }
    case 'area':
      return { ...s, area: s.area === a.value ? null : a.value }
    case 'milestone':
      return { ...s, milestone: a.value }
    case 'agentStep':
      return { ...s, agentStep: a.value, agentRun: s.agentRun + (a.value === 0 ? 1 : 0) }
    case 'talking':
      return s.talking === a.value ? s : { ...s, talking: a.value }
    case 'humanReview':
      return { ...s, humanReview: a.value, line: a.value ? 0 : 2 }
  }
}

function init(): State {
  const idx = CHAPTERS.findIndex((c) => c.id === window.location.hash.replace('#', ''))
  return { chapter: idx >= 0 ? idx : 0, audience: null, line: 0, programme: null, paper: null, area: null, milestone: null, agentStep: -1, humanReview: true, agentRun: 0, talking: false }
}

interface Ctx {
  s: State
  d: Dispatch<Action>
  id: ChapterId
  lines: string[]
}

const C = createContext<Ctx | null>(null)

export function Store({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, undefined, init)
  const value = useMemo<Ctx>(() => {
    const id = CHAPTERS[s.chapter].id
    const say = SAY[id]
    const extra = s.audience ? (say[s.audience] ?? []) : []
    let lines = [...(s.audience && id === 'welcome' ? extra : say.all), ...(id === 'welcome' ? [] : extra)]
    if (id === 'welcome' && s.audience) lines = [...extra, say.all[1]]
    if (id === 'build') {
      lines = [...say.all, 'With no human review it is faster. But when something goes wrong, who is accountable?']
    }
    return { s, d, id, lines }
  }, [s])
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useStore() {
  const v = useContext(C)
  if (!v) throw new Error('Store missing')
  return v
}
