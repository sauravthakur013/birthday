import { motion } from 'framer-motion'
import Photo from '../components/Photo'
import TiltCard from '../components/TiltCard'
import Heart from '../components/Heart'
import { content } from '../data/content'
import { ease, fadeUp, stagger } from '../lib/motion'
import './Hero.css'

export default function Hero({ start }) {
  const state = start ? 'show' : 'hidden'

  return (
    <section className="hero">
      <motion.div className="hero__text" initial="hidden" animate={state} variants={stagger}>
        <motion.p className="eyebrow" variants={fadeUp}>
          a little gift for my life saver, who make my life much easier to stay with my bekuaai
        </motion.p>
        <motion.h1 className="hero__title" variants={fadeUp}>
          Happy <em>Birthday,</em>
        </motion.h1>
        <motion.p className="hero__name hand" variants={fadeUp}>
          meri beharan
          <Heart className="hero__name-heart" />
        </motion.p>
        <motion.p className="lead hero__lead" variants={fadeUp}>
          {content.heroLine}
        </motion.p>
        <motion.div className="hero__actions" variants={fadeUp}>
          <a href="#countdown" className="btn">
            Begin
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
          <a href="#wish" className="btn btn--ghost">
            Skip to the cake
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__visual"
        initial={{ opacity: 0, y: 60, rotate: -14, scale: 0.9 }}
        animate={start ? { opacity: 1, y: 0, rotate: -4, scale: 1 } : {}}
        transition={{ duration: 1.3, ease, delay: 0.35 }}
      >
        <motion.div
          className="hero__float"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TiltCard max={12}>
            <div className="polaroid hero__polaroid">
              <span className="tape hero__tape" />
              <Photo id={1} alt={content.name} />
              <p className="polaroid__caption">my favourite person</p>
            </div>
          </TiltCard>
        </motion.div>
        <span className="hero__sticker hand" aria-hidden="true">
          you!
        </span>
        <span className="hero__sparkle hero__sparkle--1" aria-hidden="true">✦</span>
        <span className="hero__sparkle hero__sparkle--2" aria-hidden="true">✦</span>
        <span className="hero__sparkle hero__sparkle--3" aria-hidden="true">✧</span>
      </motion.div>

      <motion.div
        className="hero__scroll"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span>scroll</span>
        <i />
      </motion.div>
    </section>
  )
}
