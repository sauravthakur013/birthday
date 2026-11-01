import Heart from './Heart'
import './Background.css'

const hearts = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 7) % 100,
  size: 10 + ((i * 7) % 18),
  duration: 16 + ((i * 5) % 12),
  delay: -((i * 2.7) % 24),
  opacity: 0.12 + ((i * 13) % 25) / 100,
  sway: i % 2 ? 1 : -1,
}))

export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__blob bg__blob--1" />
      <div className="bg__blob bg__blob--2" />
      <div className="bg__blob bg__blob--3" />
      {hearts.map((h, i) => (
        <span
          key={i}
          className="bg__heart"
          style={{
            left: `${h.left}%`,
            '--size': `${h.size}px`,
            '--dur': `${h.duration}s`,
            '--delay': `${h.delay}s`,
            '--op': h.opacity,
            '--sway': h.sway,
          }}
        >
          <Heart />
        </span>
      ))}
    </div>
  )
}
