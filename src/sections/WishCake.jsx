import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'
import Photo from '../components/Photo'
import TiltCard from '../components/TiltCard'
import Heart from '../components/Heart'
import { content } from '../data/content'
import { celebrate } from '../lib/confetti'
import { ease } from '../lib/motion'
import './WishCake.css'

const CANDLES = 3

export default function WishCake() {
  const [out, setOut] = useState(() => Array(CANDLES).fill(false))
  const [listening, setListening] = useState(false)
  const [micError, setMicError] = useState(false)
  const stopMic = useRef(null)
  const timers = useRef([])
  const finaleRef = useRef(null)
  const allOut = out.every(Boolean)

  useEffect(() => {
    if (!allOut) return
    stopMic.current?.()
    celebrate()
    const id = setTimeout(() => finaleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 900)
    return () => clearTimeout(id)
  }, [allOut])

  useEffect(
    () => () => {
      stopMic.current?.()
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  function blow(i) {
    setOut((o) => o.map((v, j) => (j === i ? true : v)))
  }

  function blowAll() {
    for (let i = 0; i < CANDLES; i++) timers.current.push(setTimeout(() => blow(i), i * 180))
  }

  function relight() {
    setOut(Array(CANDLES).fill(false))
  }

  async function listen() {
    if (listening) return stopMic.current?.()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(analyser)
      const data = new Uint8Array(analyser.fftSize)
      let raf = 0
      let hits = 0

      const stop = () => {
        cancelAnimationFrame(raf)
        stream.getTracks().forEach((t) => t.stop())
        ctx.close()
        stopMic.current = null
        setListening(false)
      }
      stopMic.current = stop

      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }
        hits = Math.sqrt(sum / data.length) > 0.2 ? hits + 1 : Math.max(0, hits - 1)
        if (hits > 8) {
          blowAll()
          stop()
          return
        }
        raf = requestAnimationFrame(tick)
      }
      tick()
      setListening(true)
    } catch {
      setMicError(true)
    }
  }

  return (
    <section className="section wish" id="wish">
      <SectionTitle
        eyebrow="close your eyes"
        title={<>Make a <em>wish</em></>}
        lead={allOut ? 'Wish made. I hope every bit of it comes true.' : 'Tap each candle to blow it out, or really blow into your mic.'}
      />

      <motion.div
        className="cake-stage"
        initial={{ opacity: 0, y: 60, rotateX: 25 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease }}
      >
        <div className={`cake ${allOut ? 'is-dark' : ''}`}>
          <div className="cake__glow" aria-hidden="true" />
          <div className="cake__candles">
            {out.map((isOut, i) => (
              <button
                key={i}
                className={`candle ${isOut ? 'is-out' : ''}`}
                onClick={() => blow(i)}
                disabled={isOut}
                aria-label={isOut ? `Candle ${i + 1} is out` : `Blow out candle ${i + 1}`}
              >
                <span className="candle__flame" />
                <span className="candle__smoke" />
                <span className="candle__stick" />
              </button>
            ))}
          </div>
          <div className="cake__tier cake__tier--top" />
          <div className="cake__tier cake__tier--bottom">
            <span className="cake__text hand">{content.name}</span>
          </div>
          <div className="cake__plate" />
        </div>

        {!allOut && (
          <div className="wish__controls">
            <button className="btn btn--ghost" onClick={listen}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
              {listening ? 'Listening… blow!' : 'Blow with your mic'}
            </button>
            {micError && <p className="wish__error">Mic isn’t available here, just tap the candles instead.</p>}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {allOut && (
          <motion.div
            ref={finaleRef}
            className="finale"
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 1, ease, delay: 0.4 }}
          >
            <TiltCard max={10} className="finale__photo">
              <div className="polaroid">
                <Photo id={content.finaleImage} alt={content.name} />
                <p className="polaroid__caption">
                  happy birthday from lachu <Heart className="finale__caption-heart" />
                </p>
              </div>
            </TiltCard>
            <h3 className="finale__title">
              Happy Birthday, <em>{content.name}</em>
            </h3>
            <p className="finale__msg">{content.finaleMessage}</p>
            <button className="btn btn--ghost finale__again" onClick={relight}>
              Light the candles again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
