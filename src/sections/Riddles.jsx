import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'
import Heart from '../components/Heart'
import { content } from '../data/content'
import { isMatch } from '../lib/answer'
import { burst, celebrate } from '../lib/confetti'
import { ease, fadeUp, stagger } from '../lib/motion'
import './Riddles.css'

const { code, text, choice } = content.riddles
const shakeAnim = { x: [0, -10, 10, -6, 6, -3, 0], transition: { duration: 0.45 } }
const wrongLines = ['Nope! Try again 😌', 'So close… think harder ❤', 'Hmm, not that one!']

function burstAt(el) {
  if (!el) return
  const r = el.getBoundingClientRect()
  burst({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight })
}

function RiddleCard({ index, question, note, solved, children }) {
  return (
    <motion.li
      className={`riddle ${solved ? 'is-solved' : ''}`}
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease, delay: index * 0.1 }}
    >
      <span className="riddle__badge">riddle {String(index + 1).padStart(2, '0')}</span>
      <h3 className="riddle__q">{question}</h3>
      {note && <p className="riddle__note">{note}</p>}
      <div className="riddle__body">{children}</div>

      <AnimatePresence>
        {solved && (
          <motion.span
            className="riddle__stamp"
            initial={{ scale: 2.2, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 16 }}
            aria-hidden="true"
          >
            solved <Heart />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

function Help({ tries, hint, extraHint }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="riddle__help" aria-live="polite">
      <AnimatePresence mode="wait">
        {tries > 0 && (
          <motion.p key={tries} className="riddle__wrong" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {wrongLines[(tries - 1) % wrongLines.length]}
          </motion.p>
        )}
      </AnimatePresence>
      {open ? (
        <motion.p className="riddle__hint hand" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          Hint: {hint}
        </motion.p>
      ) : (
        <button type="button" className="riddle__hint-btn" onClick={() => setOpen(true)}>
          Need a hint?
        </button>
      )}
      {open && tries >= 2 && extraHint && (
        <motion.p className="riddle__hint riddle__hint--extra" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {extraHint}
        </motion.p>
      )}
    </div>
  )
}

function CodeRiddle({ index, solved, onSolve }) {
  const [value, setValue] = useState('')
  const [tries, setTries] = useState(0)
  const [wrong, setWrong] = useState(false)
  const shake = useAnimationControls()
  const cardRef = useRef(null)
  const len = code.answer.length
  const letters = code.word.toUpperCase().split('').map((l) => ({ letter: l, num: l.charCodeAt(0) - 64 }))

  function handleChange(e) {
    if (wrong) return
    const v = e.target.value.replace(/\D/g, '').slice(0, len)
    setValue(v)
    if (v.length < len) return
    if (v === code.answer) {
      e.target.blur()
      onSolve(cardRef.current)
    } else {
      setTries((t) => t + 1)
      setWrong(true)
      shake.start(shakeAnim)
      setTimeout(() => {
        setValue('')
        setWrong(false)
      }, 700)
    }
  }

  return (
    <RiddleCard index={index} question={code.question} note={code.note} solved={solved}>
      <div ref={cardRef}>
        {solved ? (
          <div className="decode">
            <div className="decode__row">
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  className="decode__pair"
                  initial={{ opacity: 0, rotateX: -90, y: 10 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.2, duration: 0.6, ease }}
                >
                  <small>{l.num}</small>
                  <strong>{l.letter}</strong>
                </motion.span>
              ))}
            </div>
            <motion.p
              className="decode__msg hand"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + letters.length * 0.2 }}
            >
              {code.answer} = {code.word} ❤
            </motion.p>
          </div>
        ) : (
          <>
            <motion.label className={`code ${wrong ? 'is-wrong' : ''}`} animate={shake}>
              <span className="sr-only">Enter the {len}-digit number</span>
              <input
                className="code__input"
                value={value}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={len}
                autoComplete="off"
              />
              {Array.from({ length: len }, (_, i) => (
                <span
                  key={i}
                  className={`code__box ${value[i] ? 'is-filled' : ''} ${i === value.length ? 'is-active' : ''}`}
                  aria-hidden="true"
                >
                  {value[i] ?? ''}
                </span>
              ))}
            </motion.label>
            <Help tries={tries} hint={code.hint} extraHint={code.extraHint} />
          </>
        )}
      </div>
    </RiddleCard>
  )
}

function TextRiddle({ index, solved, onSolve }) {
  const [value, setValue] = useState('')
  const [tries, setTries] = useState(0)
  const shake = useAnimationControls()
  const formRef = useRef(null)

  function submit(e) {
    e.preventDefault()
    if (!value.trim()) return
    if (isMatch(value, text.answers)) {
      document.activeElement?.blur()
      onSolve(formRef.current)
    } else {
      setTries((t) => t + 1)
      shake.start(shakeAnim)
    }
  }

  return (
    <RiddleCard index={index} question={text.question} solved={solved}>
      <div ref={formRef}>
        {solved ? (
          <motion.div
            className="reveal"
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          >
            <span className="reveal__label">the answer</span>
            <p className="reveal__text hand">{text.reveal}</p>
          </motion.div>
        ) : (
          <>
            <motion.form className="answer" onSubmit={submit} animate={shake}>
              <label className="sr-only" htmlFor="riddle-text">
                Your answer
              </label>
              <input
                id="riddle-text"
                className="answer__input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type your answer…"
                autoComplete="off"
                autoCapitalize="none"
                enterKeyHint="go"
              />
              <button className="answer__btn" type="submit" aria-label="Check answer">
                <Heart />
              </button>
            </motion.form>
            <Help tries={tries} hint={text.hint} />
          </>
        )}
      </div>
    </RiddleCard>
  )
}

function Option({ label, letter, state, onPick }) {
  const controls = useAnimationControls()

  function handleClick(e) {
    if (state !== 'idle') return
    if (!onPick(e.currentTarget)) controls.start(shakeAnim)
  }

  return (
    <motion.li variants={fadeUp}>
      <motion.button
        type="button"
        className={`option is-${state}`}
        onClick={handleClick}
        animate={controls}
        whileHover={state === 'idle' ? { y: -3, scale: 1.01 } : undefined}
        whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
        aria-disabled={state !== 'idle'}
      >
        <span className="option__letter">{letter}</span>
        <span className="option__label">{label}</span>
        <AnimatePresence>
          {state === 'right' && (
            <motion.span
              className="option__heart"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 12 }}
            >
              <Heart />
            </motion.span>
          )}
          {state === 'wrong' && (
            <motion.span className="option__x" initial={{ scale: 0 }} animate={{ scale: 1 }} aria-hidden="true">
              ✕
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.li>
  )
}

function ChoiceRiddle({ index, solved, onSolve }) {
  const [wrongPicks, setWrongPicks] = useState([])
  const [reply, setReply] = useState(null)

  function pick(i, el) {
    if (i === choice.correct) {
      setReply(choice.rightReply)
      onSolve(el)
      return true
    }
    setWrongPicks((w) => [...w, i])
    setReply(choice.wrongReplies[wrongPicks.length % choice.wrongReplies.length])
    return false
  }

  function stateFor(i) {
    if (solved) return i === choice.correct ? 'right' : 'dim'
    return wrongPicks.includes(i) ? 'wrong' : 'idle'
  }

  return (
    <RiddleCard index={index} question={choice.question} solved={solved}>
      <motion.ul className="options" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
        {choice.options.map((label, i) => (
          <Option
            key={label}
            label={label}
            letter={String.fromCharCode(65 + i)}
            state={stateFor(i)}
            onPick={(el) => pick(i, el)}
          />
        ))}
      </motion.ul>
      <div className="riddle__help" aria-live="polite">
        <AnimatePresence mode="wait">
          {reply && (
            <motion.p
              key={reply}
              className={solved ? 'riddle__right hand' : 'riddle__wrong'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {reply}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </RiddleCard>
  )
}

export default function Riddles() {
  const [solved, setSolved] = useState([false, false, false])
  const count = solved.filter(Boolean).length
  const allSolved = count === solved.length

  useEffect(() => {
    if (!allSolved) return
    const id = setTimeout(() => celebrate(1800), 900)
    return () => clearTimeout(id)
  }, [allSolved])

  const solve = (i) => (el) => {
    setSolved((s) => s.map((v, j) => (j === i ? true : v)))
    burstAt(el)
  }

  return (
    <section className="section" id="riddles">
      <SectionTitle
        eyebrow="let’s see how well you know us"
        title={<>Three little <em>riddles</em></>}
        lead="Solve all three. No pressure… okay, a little pressure."
      />

      <div className="riddles__progress" aria-live="polite">
        {solved.map((s, i) => (
          <motion.span
            key={i}
            className={`riddles__dot ${s ? 'is-on' : ''}`}
            animate={s ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Heart />
          </motion.span>
        ))}
        <span className="riddles__count">
          {count} of {solved.length} solved
        </span>
      </div>

      <ol className="riddles">
        <CodeRiddle index={0} solved={solved[0]} onSolve={solve(0)} />
        <TextRiddle index={1} solved={solved[1]} onSolve={solve(1)} />
        <ChoiceRiddle index={2} solved={solved[2]} onSolve={solve(2)} />
      </ol>

      <AnimatePresence>
        {allSolved && (
          <motion.p
            className="riddles__done"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
          >
            You know us <em>so</em> well. Of course you do ❤
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}
