import { useEffect, useState } from 'react'
import { useStore } from '../state/store'
import { assetUrl } from '../three/theme'

const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Portrait + speech: the line types out, sound bars move while "speaking". */
export default function TalkingHead() {
  const { s, d, lines, id } = useStore()
  const line = lines[Math.min(s.line, lines.length - 1)] ?? ''
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (reduce()) {
      setShown(line.length)
      return
    }
    setShown(0)
    let n = 0
    const t = setInterval(() => {
      n += 2
      setShown(n)
      if (n >= line.length) clearInterval(t)
    }, 22)
    return () => clearInterval(t)
  }, [line, id])

  const speaking = shown < line.length
  useEffect(() => {
    d({ type: 'talking', value: speaking })
  }, [speaking, d])

  const more = s.line < lines.length - 1

  return (
    <div className="talk">
      <div className={`face ${speaking ? 'on' : ''}`}>
        <img src={assetUrl('media/portrait.webp')} alt="Abhishek Kumar Jha" width={72} height={72} />
        <span className="ring" aria-hidden />
      </div>
      <div className="say">
        <div className="who">
          Abhishek
          <span className={`bars ${speaking ? 'on' : ''}`} aria-hidden>
            <i /><i /><i /><i /><i />
          </span>
        </div>
        <p aria-live="polite" aria-label={line}>
          {line.slice(0, shown)}
          <span className="caret" aria-hidden>{speaking ? '▍' : ''}</span>
        </p>
        <div className="sayrow">
          {more ? (
            <button onClick={() => d({ type: 'line', value: s.line + 1 })}>Go on →</button>
          ) : lines.length > 1 ? (
            <button onClick={() => d({ type: 'line', value: 0 })}>↺ Again</button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
