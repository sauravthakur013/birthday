import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'
import Photo from '../components/Photo'
import { content } from '../data/content'
import { burst } from '../lib/confetti'
import { ease } from '../lib/motion'
import './ScratchReveal.css'

const BRUSH = 46
const REVEAL_AT = 0.5

export default function ScratchReveal() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)
  const width = useRef(0)
  const [revealed, setRevealed] = useState(false)
  const [open, setOpen] = useState(false)
  const celebrated = useRef(false)

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const { width: w, height: h } = wrap.getBoundingClientRect()
    if (!w || w === width.current) return
    width.current = w
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#e6cf9c')
    g.addColorStop(0.5, '#c9a45c')
    g.addColorStop(1, '#d9a07a')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    for (let i = 0; i < 140; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.35})`
      ctx.beginPath()
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.8 + 0.3, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = 'rgba(110, 31, 51, 0.85)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `600 ${Math.max(28, w * 0.075)}px Caveat, cursive`
    ctx.fillText('scratch me ✨', w / 2, h / 2 - 8)
    ctx.font = `500 ${Math.max(11, w * 0.026)}px "DM Sans", sans-serif`
    ctx.fillText('USE YOUR FINGER', w / 2, h / 2 + Math.max(26, w * 0.06))
  }, [])

  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => !cancelled && paint())
    paint()
    const ro = new ResizeObserver(() => {
      if (!revealed) paint()
    })
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [paint, revealed])

  function point(e) {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  function scratch(p) {
    const ctx = canvasRef.current.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = BRUSH
    ctx.beginPath()
    const from = last.current ?? p
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(p.x + 0.01, p.y)
    ctx.stroke()
    last.current = p
  }

  function checkProgress() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++
      if (data[i] === 0) clear++
    }
    if (clear / total > REVEAL_AT) reveal()
  }

  function reveal() {
    if (revealed) return
    setRevealed(true)
    setTimeout(() => setOpen(true), 650)
  }

  function celebrateOpen() {
    if (!open || celebrated.current) return
    celebrated.current = true
    const r = wrapRef.current.getBoundingClientRect()
    burst({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight })
  }

  const handlers = {
    onPointerDown(e) {
      e.currentTarget.setPointerCapture(e.pointerId)
      drawing.current = true
      last.current = null
      scratch(point(e))
    },
    onPointerMove(e) {
      if (drawing.current) scratch(point(e))
    },
    onPointerUp() {
      drawing.current = false
      last.current = null
      checkProgress()
    },
  }
  handlers.onPointerCancel = handlers.onPointerUp

  return (
    <section className="section" id="surprise">
      <SectionTitle eyebrow="one more thing" title={<>A little <em>surprise</em></>} />

      <motion.div
        layout
        className={`scratch${open ? ' is-open' : ''}`}
        ref={wrapRef}
        initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
        whileInView={{ opacity: 1, scale: 1, rotate: open ? 0 : -1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease, layout: { duration: 1.1, ease } }}
        onLayoutAnimationComplete={celebrateOpen}
      >
        <motion.div layout className="scratch__prize" transition={{ layout: { duration: 1.1, ease } }}>
          <Photo id={content.scratchImage} alt="" />
        </motion.div>

        <motion.canvas
          ref={canvasRef}
          className="scratch__canvas"
          animate={{ opacity: revealed ? 0 : 1 }}
          transition={{ duration: 0.7 }}
          style={{ pointerEvents: revealed ? 'none' : 'auto' }}
          aria-hidden="true"
          {...handlers}
        />
      </motion.div>

      {!revealed && (
        <button className="scratch__skip" onClick={reveal}>
          or just tap here to reveal
        </button>
      )}
    </section>
  )
}
