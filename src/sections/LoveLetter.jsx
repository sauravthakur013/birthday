import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'
import Heart from '../components/Heart'
import { content } from '../data/content'
import { ease } from '../lib/motion'
import './LoveLetter.css'

const full = content.letter

function delayFor(ch) {
  if (ch === '\n') return 420
  if ('.,!?—'.includes(ch)) return 200
  return 32
}

export default function LoveLetter() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const reduce = useReducedMotion()
  const [count, setCount] = useState(0)
  const done = reduce || count >= full.length

  useEffect(() => {
    if (!inView || done) return
    const id = setTimeout(() => setCount((c) => c + 1), delayFor(full[count]))
    return () => clearTimeout(id)
  }, [inView, done, count])

  const typed = done ? full : full.slice(0, count)

  return (
    <section className="section" id="letter">
      <SectionTitle eyebrow="read this slowly" title={<>A letter <em>for you</em></>} />

      <motion.div
        ref={ref}
        className="letter"
        initial={{ opacity: 0, rotateX: -35, y: 40 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease }}
        onClick={() => setCount(full.length)}
      >
        <span className="tape letter__tape" aria-hidden="true" />
        <p className="letter__date hand">
          {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="letter__body hand">
          <p className="letter__sizer" aria-hidden="true">
            {full}
          </p>
          <p className="letter__typed" aria-label={full}>
            {typed}
            {!done && <span className="letter__caret" aria-hidden="true" />}
          </p>
        </div>

        <motion.div
          className="letter__seal"
          initial={{ scale: 0, rotate: -40 }}
          animate={done && inView ? { scale: 1, rotate: -12 } : {}}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          aria-hidden="true"
        >
          <Heart />
        </motion.div>

        {!done && inView && <span className="letter__skip">tap to show the whole letter</span>}
      </motion.div>
    </section>
  )
}
