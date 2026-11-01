import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'
import Heart from '../components/Heart'
import Photo from '../components/Photo'
import { content } from '../data/content'
import { images as photoSrc } from '../data/images'
import { ease } from '../lib/motion'
import './Reasons.css'

const tones = ['rose', 'blush', 'wine', 'cream', 'gold', 'rose']

function ReasonCard({ text, images, fit, focus, index }) {
  const [flipped, setFlipped] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.li
      className="reason"
      initial={{ opacity: 0, y: 50, rotateY: -25 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease, delay: (index % 3) * 0.1 }}
    >
      <button
        className="reason__btn"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? text : `Reason ${index + 1}, tap to reveal`}
      >
        <motion.div
          className="reason__inner"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        >
          <div className={`reason__face reason__front tone-${tones[index % tones.length]}`}>
            <span className="reason__num">{num}</span>
            <Heart className="reason__heart" />
            <span className="reason__hint hand">tap to flip</span>
          </div>
          {images?.length ? (
            <div className="reason__face reason__back has-photos">
              <div
                className={`reason__photos${fit === 'contain' ? ' is-contain' : ''}`}
                style={{
                  ...(fit === 'contain' && { '--bg': `url(${photoSrc[images[0]]})` }),
                  ...(focus && { '--focus': focus }),
                }}
              >
                {images.map((id) => (
                  <Photo key={id} id={id} />
                ))}
              </div>
              <div className="reason__note">
                <span className="reason__back-num">reason {num}</span>
                <p>{text}</p>
              </div>
            </div>
          ) : (
            <div className="reason__face reason__back">
              <span className="reason__back-num">reason {num}</span>
              <p>{text}</p>
              <Heart className="reason__back-heart" />
            </div>
          )}
        </motion.div>
      </button>
    </motion.li>
  )
}

export default function Reasons() {
  return (
    <section className="section" id="reasons">
      <SectionTitle
        eyebrow="just a few of them"
        title={<>Why I <em>love</em> you</>}
        lead="Tap each card. I could have made a thousand of these."
      />
      <ul className="reasons">
        {content.reasons.map((r, i) => {
          const reason = typeof r === 'string' ? { text: r } : r
          return <ReasonCard key={reason.text} {...reason} index={i} />
        })}
      </ul>
    </section>
  )
}
