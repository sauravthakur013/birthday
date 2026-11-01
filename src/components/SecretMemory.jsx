import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Heart from './Heart'
import { burst } from '../lib/confetti'
import { ease } from '../lib/motion'
import './SecretMemory.css'

const hints = ['tap the heart', 'aur', 'thoda aur', 'ruko mat', 'bas thoda sa', 'almost…', 'ek aakhri baar']

export default function SecretMemory({ text, taps = 7, onReveal }) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const open = count >= taps

  const tap = () => {
    const next = count + 1
    setCount(next)
    if (next >= taps) {
      if (ref.current) {
        const r = ref.current.getBoundingClientRect()
        burst({ x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight })
      }
      onReveal?.()
    }
  }

  return (
    <div className="secret">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.p
            key="text"
            className="secret__text hand"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease }}
          >
            {text}
          </motion.p>
        ) : (
          <motion.div
            key="lock"
            className="secret__lock"
            exit={{ opacity: 0, scale: 1.6, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease }}
          >
            <motion.button
              ref={ref}
              type="button"
              className="secret__heart"
              onClick={tap}
              aria-label={`Tap ${taps - count} more times to reveal`}
              animate={{ scale: 1 + count * 0.07 }}
              whileTap={{ scale: 0.85 + count * 0.07, rotate: count % 2 ? 10 : -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14 }}
            >
              <Heart />
            </motion.button>
            <p className="secret__hint hand">{hints[Math.min(count, hints.length - 1)]}</p>
            <p className="secret__count">
              {taps - count} {taps - count === 1 ? 'tap' : 'taps'} left
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
