import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import Heart from '../components/Heart'
import { content } from '../data/content'
import { isMatch } from '../lib/answer'
import { burst } from '../lib/confetti'
import { ease, fadeUp, stagger } from '../lib/motion'
import './Gate.css'

const { secret } = content

const wrongLines = ['Hmm, not quite. Try again?', 'So close… think back ❤', 'Nope! You know this one.']

export default function Gate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [tries, setTries] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const shake = useAnimationControls()
  const inputRef = useRef(null)

  useEffect(() => {
    if (!unlocked) return
    const id = setTimeout(onUnlock, 1300)
    return () => clearTimeout(id)
  }, [unlocked, onUnlock])

  function unlock() {
    setUnlocked(true)
    burst({ x: 0.5, y: 0.45 })
  }

  function submit(e) {
    e.preventDefault()
    if (unlocked || !value.trim()) return
    if (isMatch(value, secret.answers)) {
      inputRef.current?.blur()
      unlock()
    } else {
      setTries((t) => t + 1)
      shake.start({ x: [0, -12, 12, -8, 8, -4, 0], transition: { duration: 0.5 } })
    }
  }

  return (
    <motion.div className="gate" exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.7, ease }}>
      <motion.div className="gate__card" initial="hidden" animate="show" variants={stagger}>
        <motion.div className="gate__lock" variants={fadeUp} aria-hidden="true">
          <svg viewBox="0 0 64 72" className="gate__lock-shape">
            <motion.path
              d="M18 32V22a14 14 0 0 1 28 0v10"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              animate={{ y: unlocked ? -10 : 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 12 }}
            />
            <rect x="8" y="30" width="48" height="38" rx="10" fill="currentColor" />
          </svg>
          <Heart className="gate__lock-heart" />
        </motion.div>

        <motion.p className="eyebrow" variants={fadeUp}>
          just making sure it’s really you
        </motion.p>
        <motion.h1 className="gate__title" variants={fadeUp}>
          A question only <em>you</em> can answer
        </motion.h1>
        <motion.p className="gate__question" variants={fadeUp}>
          {secret.question}
        </motion.p>

        <motion.div variants={fadeUp}>
          <motion.form className="gate__form" onSubmit={submit} animate={shake}>
            <label htmlFor="gate-answer" className="sr-only">
              Your answer
            </label>
            <input
              id="gate-answer"
              ref={inputRef}
              className="gate__input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type your answer…"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              enterKeyHint="go"
              disabled={unlocked}
            />
            <button className="btn gate__btn" type="submit" disabled={unlocked}>
              {unlocked ? 'Unlocked' : 'Unlock'}
              <Heart />
            </button>
          </motion.form>
        </motion.div>

        <div className="gate__feedback" aria-live="polite">
          <AnimatePresence mode="wait">
            {unlocked ? (
              <motion.p key="ok" className="gate__ok hand" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                It’s you! Come in ❤
              </motion.p>
            ) : tries > 0 ? (
              <motion.div key={tries} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="gate__wrong">{wrongLines[(tries - 1) % wrongLines.length]}</p>
                {tries >= 2 && secret.hint && <p className="gate__hint hand">Hint: {secret.hint}</p>}
                {tries >= 4 && (
                  <button className="gate__skip" type="button" onClick={unlock}>
                    Okay okay, let me in anyway
                  </button>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
