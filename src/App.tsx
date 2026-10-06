import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react'
import { Store, useStore } from './state/store'
import { CHAPTERS } from './data/content'
import TalkingHead from './ui/TalkingHead'
import { Build, Contact, Journey, Research, Teaching, Welcome } from './ui/Sections'
import { assetUrl } from './three/theme'

const World = lazy(() => import('./three/World'))

class Safe extends Component<{ children: ReactNode; fallback: ReactNode }, { bad: boolean }> {
  state = { bad: false }
  static getDerivedStateFromError() {
    return { bad: true }
  }
  render() {
    return this.state.bad ? this.props.fallback : this.props.children
  }
}

function Fallback() {
  return (
    <div className="nogl">
      <img src={assetUrl('media/portrait.webp')} alt="" />
      <p>The 3D view could not start on this device. Everything else still works on the right.</p>
    </div>
  )
}

const TITLES: Record<string, string> = {
  welcome: 'Hi, I’m Abhishek',
  teaching: 'Where I teach',
  research: 'What I research',
  build: 'Build with AI',
  about: 'How I got here',
  contact: 'Let’s talk',
}

function Body() {
  const { id } = useStore()
  switch (id) {
    case 'welcome': return <Welcome />
    case 'teaching': return <Teaching />
    case 'research': return <Research />
    case 'build': return <Build />
    case 'about': return <Journey />
    case 'contact': return <Contact />
  }
}

function Shell() {
  const { s, d, id } = useStore()
  const i = s.chapter

  useEffect(() => {
    history.replaceState(null, '', `${window.location.search}#${id}`)
    document.title = `${TITLES[id]} · Abhishek Kumar Jha`
  }, [id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return
      if (e.key === 'ArrowRight') d({ type: 'chapter', value: i + 1 })
      if (e.key === 'ArrowLeft') d({ type: 'chapter', value: i - 1 })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [i, d])

  return (
    <div className="app">
      <div className="stage">
        <Safe fallback={<Fallback />}>
          <Suspense fallback={<div className="loading">Building the campus…</div>}>
            <World />
          </Suspense>
        </Safe>
        <p className="drag">Drag to look around · scroll to zoom</p>
      </div>
      <aside className="panel">
        <header>
          <div className="brand">Abhishek Kumar Jha</div>
          <nav aria-label="Sections">
            {CHAPTERS.map((c, k) => (
              <button key={c.id} className={k === i ? 'on' : ''} onClick={() => d({ type: 'chapter', value: k })}>
                {c.title}
              </button>
            ))}
          </nav>
        </header>
        <div className="body" key={id}>
          <h1>{TITLES[id]}</h1>
          <TalkingHead />
          <Body />
        </div>
        <footer>
          <button onClick={() => d({ type: 'chapter', value: i - 1 })} disabled={i === 0}>← {i > 0 ? CHAPTERS[i - 1].title : ''}</button>
          {i < CHAPTERS.length - 1 ? (
            <button className="next" onClick={() => d({ type: 'chapter', value: i + 1 })}>{CHAPTERS[i + 1].title} →</button>
          ) : (
            <button onClick={() => d({ type: 'chapter', value: 0 })}>↺ Back to the plaza</button>
          )}
        </footer>
      </aside>
    </div>
  )
}

export default function App() {
  return (
    <Store>
      <Shell />
    </Store>
  )
}
