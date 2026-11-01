import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'
import Photo from '../components/Photo'
import TiltCard from '../components/TiltCard'
import Heart from '../components/Heart'
import SecretMemory from '../components/SecretMemory'
import RevealCard from '../components/RevealCard'
import { content } from '../data/content'
import { ease } from '../lib/motion'
import './Timeline.css'

export default function Timeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [unlocked, setUnlocked] = useState(false)

  const secretAt = content.timeline.findIndex((m) => m.secret)
  const items = secretAt === -1 || unlocked ? content.timeline : content.timeline.slice(0, secretAt + 1)

  useEffect(() => {
    if (!unlocked) return
    const id = setTimeout(() => {
      document.getElementById('final-memory')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 900)
    return () => clearTimeout(id)
  }, [unlocked])

  return (
    <section className="section" id="memories">
      <SectionTitle
        eyebrow="our little story"
        title={<>Memories with <em>you</em></>}
        lead="A few of my favourite moments. There are so many more, but these are the ones I replay the most."
      />

      <div className="timeline" ref={ref}>
        <div className="timeline__line" aria-hidden="true">
          <motion.div className="timeline__progress" style={{ scaleY: progress }} />
        </div>

        <ol className="timeline__list">
          {items.map((m, i) => {
            const card = (
              <TiltCard max={7}>
                <figure
                  className={`polaroid tl-item__card ${i % 2 ? 'is-tilt-r' : 'is-tilt-l'}${m.wide ? ' is-wide' : ''}${m.images ? ' is-stack' : ''}`}
                >
                  {(m.images || [m.image]).map((id) => (
                    <Photo key={id} id={id} alt={m.caption} />
                  ))}
                  <figcaption className="polaroid__caption">{m.caption}</figcaption>
                </figure>
              </TiltCard>
            )

            return (
              <motion.li
                key={m.date}
                id={m.reveal ? 'final-memory' : undefined}
                className={`tl-item ${i % 2 ? 'tl-item--right' : 'tl-item--left'}`}
                initial={m.reveal ? false : { opacity: 0, y: 70, rotateX: 22, rotateZ: i % 2 ? 3 : -3 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease }}
              >
                <span className="tl-item__dot" aria-hidden="true">
                  <Heart />
                </span>
                <div className="tl-item__body">
                  <span className="tl-item__date">{m.date}</span>
                  {m.secret ? (
                    <SecretMemory text={m.caption} taps={m.taps} onReveal={() => setUnlocked(true)} />
                  ) : m.reveal ? (
                    <RevealCard>{card}</RevealCard>
                  ) : (
                    card
                  )}
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
