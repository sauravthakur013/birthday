import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Heart from './Heart'
import { celebrate } from '../lib/confetti'
import { ease } from '../lib/motion'
import './RevealCard.css'

// Two-step flip (cover turns away, then the card turns in) instead of backface-visibility,
// because the TiltCard inside creates its own 3D context and breaks backface hiding.
export default function RevealCard({ children }) {
  const done = useRef(false)
  const [side, setSide] = useState('back')

  return (
    <div className="flipcard">
      <motion.div
        className="flipcard__front"
        initial={{ rotateY: -90 }}
        animate={{ rotateY: side === 'front' ? 0 : -90 }}
        transition={{ duration: 0.7, ease }}
        style={{ visibility: side === 'front' ? 'visible' : 'hidden' }}
        onAnimationComplete={() => {
          if (side !== 'front' || done.current) return
          done.current = true
          celebrate()
        }}
      >
        {children}
      </motion.div>

      {side === 'back' && (
        <motion.div
          className="flipcard__back"
          aria-hidden="true"
          initial={{ scale: 0.5, opacity: 0, y: 40, rotateY: 0 }}
          animate={{ scale: [0.5, 1, 1, 1], opacity: [0, 1, 1, 1], y: [40, 0, 0, 0], rotateY: [0, 0, 0, 90] }}
          transition={{ duration: 2.4, times: [0, 0.3, 0.75, 1], ease: 'easeInOut' }}
          onAnimationComplete={() => setSide('front')}
        >
          <Heart className="flipcard__heart" />
          <span className="flipcard__label hand">just for you</span>
        </motion.div>
      )}
    </div>
  )
}
