import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import Background from './components/Background'
import Heart from './components/Heart'
import Gate from './sections/Gate'
import Envelope from './sections/Envelope'
import Hero from './sections/Hero'
import Countdown from './sections/Countdown'
import Timeline from './sections/Timeline'
import LoveLetter from './sections/LoveLetter'
import Reasons from './sections/Reasons'
import Riddles from './sections/Riddles'
import ScratchReveal from './sections/ScratchReveal'
import WishCake from './sections/WishCake'
import { content } from './data/content'

const UNLOCK_KEY = 'birthday-unlocked'

function initialStage() {
  if (!content.secret?.enabled) return 'envelope'
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === '1' ? 'envelope' : 'gate'
  } catch {
    return 'gate'
  }
}

export default function App() {
  const [stage, setStage] = useState(initialStage)
  const opened = stage === 'open'
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  const handleUnlocked = useCallback(() => {
    try {
      sessionStorage.setItem(UNLOCK_KEY, '1')
    } catch {
      // private browsing can block storage; the gate just shows again next visit
    }
    setStage('envelope')
  }, [])
  const handleOpened = useCallback(() => setStage('open'), [])

  useEffect(() => {
    document.body.classList.toggle('is-locked', !opened)
  }, [opened])

  return (
    <MotionConfig reducedMotion="user">
      <Background />
      <div className="grain" aria-hidden="true" />
      {opened && <motion.div className="progress-bar" style={{ scaleX: progress }} />}

      <AnimatePresence mode="wait">
        {stage === 'gate' && <Gate key="gate" onUnlock={handleUnlocked} />}
        {stage === 'envelope' && <Envelope key="envelope" name={content.name} onDone={handleOpened} />}
      </AnimatePresence>

      <main aria-hidden={!opened}>
        <Hero start={opened} />
        <Countdown />
        <Timeline />
        <LoveLetter />
        <Reasons />
        <Riddles />
        <ScratchReveal />
        <WishCake />
        <footer className="footer">
          <span className="hand">made with all my love</span>
          just for you, {content.name} <Heart style={{ width: 14, height: 14, color: 'var(--rose)', verticalAlign: '-2px' }} />
        </footer>
      </main>
    </MotionConfig>
  )
}
