import { motion } from 'framer-motion'
import { fadeUp, stagger } from '../lib/motion'

export default function SectionTitle({ eyebrow, title, lead }) {
  return (
    <motion.header
      className="section-title"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      variants={stagger}
    >
      <motion.p className="eyebrow" variants={fadeUp}>
        {eyebrow}
      </motion.p>
      <motion.h2 className="title" variants={fadeUp}>
        {title}
      </motion.h2>
      {lead && (
        <motion.p className="lead" variants={fadeUp}>
          {lead}
        </motion.p>
      )}
    </motion.header>
  )
}
