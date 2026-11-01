import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'
import Heart from '../components/Heart'
import { content } from '../data/content'
import { ease } from '../lib/motion'
import './Countdown.css'

const DAY = 86400000

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function Tile({ value, label }) {
  const v = String(value).padStart(2, '0')
  return (
    <div className="tile">
      <div className="tile__num">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={v}
            initial={{ y: '-70%', opacity: 0, rotateX: 70 }}
            animate={{ y: '0%', opacity: 1, rotateX: 0 }}
            exit={{ y: '70%', opacity: 0, rotateX: -70 }}
            transition={{ duration: 0.5, ease }}
          >
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="tile__label">{label}</span>
    </div>
  )
}

function CountUp({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 2.4, ease, onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>{n.toLocaleString()}</span>
}

export default function Countdown() {
  const now = useNow()
  const target = new Date(content.countdownTo)
  const diff = Math.max(0, target - now)
  const isOver = diff === 0
  const daysTogether = Math.floor((now - new Date(content.togetherSince)) / DAY)
  const dateLabel = target.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })
  const timeLabel = target.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

  return (
    <section className="section countdown" id="countdown">
      <SectionTitle
        eyebrow={isOver ? 'it was all yours' : `counting down to ${dateLabel}, ${timeLabel}`}
        title={<>Today is <em>your day</em></>}
      />

      <motion.div
        className="countdown__card"
        initial={{ opacity: 0, y: 50, rotateX: 20 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease }}
      >
        {isOver ? (
          <p className="countdown__today">
            Happy birthday! <Heart className="countdown__today-heart" />
          </p>
        ) : (
          <div className="countdown__tiles">
            <Tile value={Math.floor(diff / DAY)} label="days" />
            <Tile value={Math.floor((diff % DAY) / 3600000)} label="hours" />
            <Tile value={Math.floor((diff % 3600000) / 60000)} label="minutes" />
            <Tile value={Math.floor((diff % 60000) / 1000)} label="seconds" />
          </div>
        )}
      </motion.div>

      <motion.div
        className="together"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
      >
        <Heart className="together__heart" />
        <p className="together__num">
          <CountUp to={daysTogether} />
        </p>
        <p className="together__label">
          days of <span className="hand">us</span>, and counting
        </p>
      </motion.div>
    </section>
  )
}
