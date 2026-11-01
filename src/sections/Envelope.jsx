import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Heart from '../components/Heart'
import { ease } from '../lib/motion'
import './Envelope.css'

export default function Envelope({ name, onDone }) {
  const [phase, setPhase] = useState('closed')
  const reduce = useReducedMotion()

  useEffect(() => {
    if (phase === 'closed') return
    const id =
      phase === 'flap'
        ? setTimeout(() => setPhase('letter'), reduce ? 50 : 700)
        : setTimeout(onDone, reduce ? 200 : 1500)
    return () => clearTimeout(id)
  }, [phase, reduce, onDone])

  function open() {
    if (phase === 'closed') setPhase('flap')
  }

  const isOpen = phase !== 'closed'

  return (
    <motion.div
      className="intro"
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.8, ease }}
    >
      <motion.p
        className="intro__hint hand"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: isOpen ? 0 : 1, y: 0 }}
        transition={{ duration: 0.8, delay: isOpen ? 0 : 0.3 }}
      >
        Something special just arrived for you…
      </motion.p>

      <motion.div
        className="env-wrap"
        role="button"
        tabIndex={0}
        aria-label="Open your birthday letter"
        onClick={open}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
        initial={{ opacity: 0, y: 40, rotateX: 25 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.1, ease }}
      >
        <motion.div
          className="env"
          animate={isOpen ? { y: 50 } : { y: [0, -10, 0] }}
          transition={isOpen ? { duration: 0.9, ease } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="env__back" />

          <motion.div
            className="env__letter"
            animate={{ y: phase === 'letter' ? '-58%' : '0%' }}
            transition={{ duration: 1.1, ease }}
          >
            <span className="hand env__letter-for">for you,</span>
            <strong className="env__letter-name">{name}</strong>
            <Heart className="env__letter-heart" />
          </motion.div>

          <div className="env__pocket">
            <span className="env__to hand">To: {name}</span>
            <span className="env__stamp" aria-hidden="true">
              <Heart />
              <small>with love</small>
            </span>
          </div>

          <motion.div
            className="env__flap"
            style={{ zIndex: phase === 'letter' ? 1 : 4 }}
            animate={{ rotateX: isOpen ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          />

          <motion.span
            className="env__seal"
            animate={isOpen ? { scale: 0.3, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <Heart />
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.p
        className="intro__tap"
        animate={{ opacity: isOpen ? 0 : [0.45, 1, 0.45] }}
        transition={isOpen ? { duration: 0.3 } : { duration: 2.2, repeat: Infinity }}
      >
        Tap the envelope to open
      </motion.p>
    </motion.div>
  )
}
