import confetti from 'canvas-confetti'

const colors = ['#d9475f', '#f6d9d3', '#c9a45c', '#6e1f33', '#ffffff']

const heart = confetti.shapeFromPath({
  path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
})

const base = { colors, disableForReducedMotion: true, shapes: [heart, 'circle', 'square'], scalar: 1 }

export function burst(origin = { x: 0.5, y: 0.6 }) {
  confetti({ ...base, particleCount: 90, spread: 75, startVelocity: 38, origin })
}

export function celebrate(duration = 2600) {
  const end = Date.now() + duration
  const frame = () => {
    confetti({ ...base, particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.75 } })
    confetti({ ...base, particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.75 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
  confetti({ ...base, particleCount: 140, spread: 100, startVelocity: 45, origin: { x: 0.5, y: 0.55 } })
}
