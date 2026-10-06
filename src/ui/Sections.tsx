import { useEffect, useRef, useState } from 'react'
import { useStore } from '../state/store'
import {
  AGENT_STEPS, AREAS, CHAPTERS, EMAIL, HONOURS, IN_PROGRESS, LINKS, MILESTONES, PAPERS, POLICY, PROGRAMMES, SERVICE, TRACKS,
  type Area, type Audience,
} from '../data/content'
import { orderedProgrammes } from '../three/Teaching'

const mailto = (subject: string, body: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

/* ------------------------------------------------------------- welcome */

const AUD: { id: Audience; label: string; go: string }[] = [
  { id: 'corporate', label: 'I plan training for a company', go: 'teaching' },
  { id: 'academic', label: "I'm an academic or researcher", go: 'research' },
  { id: 'student', label: "I'm a student or early-career", go: 'build' },
]

export function Welcome() {
  const { s, d } = useStore()
  const a = AUD.find((x) => x.id === s.audience)
  return (
    <>
      <p className="lede">Assistant Professor of Information Management & Analytics at SPJIMR, Mumbai. Formerly at Deakin University. PhD, IIM Indore.</p>
      <h4>What brings you here?</h4>
      <div className="stack">
        {AUD.map((x) => (
          <button key={x.id} className={`opt ${s.audience === x.id ? 'on' : ''}`} onClick={() => d({ type: 'audience', value: x.id })}>
            {x.label}
          </button>
        ))}
      </div>
      <h4>Three things I work on · tap an orb on the plaza too</h4>
      <div className="chips">
        {(Object.keys(AREAS) as Area[]).map((k) => (
          <button key={k} className={`chip ${s.area === k ? 'on' : ''}`} style={{ ['--c' as string]: AREAS[k].color }} onClick={() => d({ type: 'area', value: k })}>
            {AREAS[k].name}
          </button>
        ))}
      </div>
      {s.area && <p className="note" style={{ ['--c' as string]: AREAS[s.area].color }}>{AREAS[s.area].blurb}</p>}
      <button className="primary" onClick={() => d({ type: 'chapter', value: CHAPTERS.findIndex((c) => c.id === (a?.go ?? 'teaching')) })}>
        {a ? 'Start with what matters to you →' : 'Start the tour →'}
      </button>
    </>
  )
}

/* ------------------------------------------------------------- teaching */

export function Teaching() {
  const { s, d } = useStore()
  const list = orderedProgrammes(s.audience)
  const sel = PROGRAMMES.find((p) => p.id === s.programme)
  const tracks = [...new Set(list.map((p) => p.track))]
  return (
    <>
      {tracks.map((t) => (
        <div key={t} className="group">
          <h4 style={{ color: TRACKS[t].color }}>{TRACKS[t].name}<small>{TRACKS[t].sub}</small></h4>
          {list.filter((p) => p.track === t).map((p) => (
            <button key={p.id} className={`row ${s.programme === p.id ? 'on' : ''}`} style={{ ['--c' as string]: TRACKS[t].color }} onClick={() => d({ type: 'programme', value: p.id })}>
              <b>{p.title}</b>
              <span>{p.tag ? `${p.tag} · ` : ''}{p.who}</span>
            </button>
          ))}
        </div>
      ))}
      {sel && (
        <div className="detail" style={{ ['--c' as string]: TRACKS[sel.track].color }}>
          <h3>{sel.title}</h3>
          <p>{sel.blurb}</p>
          <ul>{sel.topics.map((t) => <li key={t}>{t}</li>)}</ul>
          <a className="primary" href={mailto(`Programme enquiry: ${sel.title}`, `Hello Abhishek,\n\nI'd like to discuss "${sel.title}".\n\nAudience:\nDate:\nGoals:\n`)}>Enquire about this →</a>
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------- research */

export function Research() {
  const { s, d } = useStore()
  const sel = PAPERS.find((p) => p.id === s.paper)
  const shown = PAPERS.filter((p) => !s.area || p.area === s.area)
  const wip = IN_PROGRESS.filter((w) => !s.area || w.area === s.area)
  return (
    <>
      <div className="chips">
        {(Object.keys(AREAS) as Area[]).map((k) => (
          <button key={k} className={`chip ${s.area === k ? 'on' : ''}`} style={{ ['--c' as string]: AREAS[k].color }} onClick={() => d({ type: 'area', value: k })}>
            {AREAS[k].short}
          </button>
        ))}
      </div>
      {sel && (
        <div className="detail" style={{ ['--c' as string]: AREAS[sel.area].color }}>
          <small>{sel.year} · {AREAS[sel.area].name}</small>
          <h3>{sel.title}</h3>
          <p>{sel.venue}<br />with {sel.with}</p>
          {sel.url && <a className="primary" href={sel.url} target="_blank" rel="noreferrer">Read the paper ↗</a>}
        </div>
      )}
      <h4>Published</h4>
      <div className="list">
        {shown.map((p) => (
          <button key={p.id} className={`row slim ${s.paper === p.id ? 'on' : ''}`} style={{ ['--c' as string]: AREAS[p.area].color }} onClick={() => d({ type: 'paper', value: p.id })}>
            <b>{p.title}</b>
            <span>{p.year} · {p.venue}</span>
          </button>
        ))}
      </div>
      <h4>Currently working on</h4>
      <div className="chips quiet">
        {wip.map((w) => <span key={w.text} className="tag" style={{ ['--c' as string]: AREAS[w.area].color }}>{w.text}</span>)}
      </div>
    </>
  )
}

/* ------------------------------------------------------------- build */

export function Build() {
  const { s, d } = useStore()
  const [playing, setPlaying] = useState(false)
  const step = useRef(s.agentStep)
  step.current = s.agentStep
  const review = useRef(s.humanReview)
  review.current = s.humanReview

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      let n = step.current + 1
      if (n === 4 && !review.current) n = 5
      if (n > 5) {
        setPlaying(false)
        return
      }
      d({ type: 'agentStep', value: n })
    }, 1500)
    return () => clearInterval(t)
  }, [playing, d])

  const cur = s.agentStep >= 0 ? AGENT_STEPS[s.agentStep] : null
  const go = ['agentic', 'maker', 'influencer'].map((id) => PROGRAMMES.find((p) => p.id === id)!)
  return (
    <>
      <p className="lede">An agent is a loop: plan, act with tools, check, and hand over. Run it on the bench and watch where people fit in.</p>
      <div className="row2">
        <button className="primary" onClick={() => { d({ type: 'agentStep', value: 0 }); setPlaying(true) }}>▶ Run the agent</button>
        <label className="switch">
          <input type="checkbox" checked={s.humanReview} onChange={(e) => d({ type: 'humanReview', value: e.target.checked })} />
          <span>Human review</span>
        </label>
      </div>
      <div className={`detail ${!s.humanReview ? 'warn' : ''}`} style={{ ['--c' as string]: '#6d4cf0' }}>
        {cur ? (
          <>
            <small>Step {s.agentStep + 1} of 6</small>
            <h3>{cur.label}</h3>
            <p>{cur.id === 'ship' && !s.humanReview ? 'The result goes out with no one having looked at it. Faster, but nobody signed it off.' : cur.text}</p>
          </>
        ) : (
          <>
            <small>Tap a block on the bench, or press run</small>
            <h3>Agents are not chatbots</h3>
            <p>They decide what to do next. That is why the design question is where a human must stay in control.</p>
          </>
        )}
      </div>
      <h4>Where I teach this</h4>
      {go.map((p) => (
        <button key={p.id} className="row" style={{ ['--c' as string]: TRACKS[p.track].color }} onClick={() => { d({ type: 'programme', value: p.id }); d({ type: 'chapter', value: 1 }) }}>
          <b>{p.title}</b>
          <span>{p.who}</span>
        </button>
      ))}
    </>
  )
}

/* ------------------------------------------------------------- journey */

export function Journey() {
  const { s, d } = useStore()
  const all = [...MILESTONES, ...HONOURS]
  const sel = all.find((m) => m.id === s.milestone)
  return (
    <>
      {sel && (
        <div className="detail" style={{ ['--c' as string]: sel.kind === 'study' ? '#3b82f6' : sel.kind === 'work' ? '#e8590c' : '#d9a406' }}>
          <small>{sel.when}</small>
          <h3>{sel.title}</h3>
          <p>{sel.where}</p>
        </div>
      )}
      <h4>Path</h4>
      <div className="list">
        {MILESTONES.map((m) => (
          <button key={m.id} className={`row slim ${s.milestone === m.id ? 'on' : ''}`} style={{ ['--c' as string]: m.kind === 'study' ? '#3b82f6' : '#e8590c' }} onClick={() => d({ type: 'milestone', value: m.id })}>
            <b>{m.title}</b>
            <span>{m.where} · {m.when}</span>
          </button>
        ))}
      </div>
      <h4>Recognition</h4>
      <div className="list">
        {HONOURS.map((m) => (
          <button key={m.id} className={`row slim ${s.milestone === m.id ? 'on' : ''}`} style={{ ['--c' as string]: '#d9a406' }} onClick={() => d({ type: 'milestone', value: m.id })}>
            <b>{m.title}</b>
            <span>{m.where} · {m.when}</span>
          </button>
        ))}
      </div>
      <h4>Academic service</h4>
      <ul className="plain">{SERVICE.map((x) => <li key={x}>{x}</li>)}</ul>
      <h4>Policy and funded work</h4>
      <ul className="plain">{POLICY.map((x) => <li key={x}>{x}</li>)}</ul>
    </>
  )
}

/* ------------------------------------------------------------- contact */

const KINDS = ['AI programme', 'Keynote or talk', 'Research collaboration', 'Doctoral supervision']

export function Contact() {
  const [kind, setKind] = useState(KINDS[0])
  const [who, setWho] = useState('')
  const [when, setWhen] = useState('')
  const [goals, setGoals] = useState('')
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <>
      <h4>Build your brief</h4>
      <div className="chips">
        {KINDS.map((k) => (
          <button key={k} className={`chip ${kind === k ? 'on' : ''}`} onClick={() => setKind(k)}>{k}</button>
        ))}
      </div>
      <label className="field">Who is the audience?<input value={who} onChange={(e) => setWho(e.target.value)} placeholder="e.g. 40 senior managers in retail" /></label>
      <label className="field">When?<input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="e.g. January, flexible" /></label>
      <label className="field">What should people be able to do afterwards?<textarea rows={3} value={goals} onChange={(e) => setGoals(e.target.value)} /></label>
      <a className="primary" href={mailto(`${kind}: enquiry`, `Hello Abhishek,\n\nI'm writing about: ${kind}\nAudience: ${who}\nTiming: ${when}\nGoals: ${goals}\n`)}>Open the email →</a>
      <div className="row2">
        <code>{EMAIL}</code>
        <button className="ghost" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <h4>Elsewhere</h4>
      <div className="chips">
        <a className="chip" href={LINKS.faculty} target="_blank" rel="noreferrer">SPJIMR profile ↗</a>
        <a className="chip" href={LINKS.scholar} target="_blank" rel="noreferrer">Google Scholar ↗</a>
        <a className="chip" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
      </div>
      <p className="hint">Also open to research collaborations and doctoral supervision.</p>
    </>
  )
}
