'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FlaskConical, Banknote, Heart, Zap } from 'lucide-react'
import { useStore } from '@/store/useStore'

export function FeaturesSection() {
  const { t } = useStore()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      icon: FlaskConical,
      color: 'bg-blue-100 dark:bg-blue-950 text-cleano-blue',
      title: t.home.features.quality,
      desc:  t.home.features.qualityDesc,
    },
    {
      icon: Banknote,
      color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
      title: t.home.features.affordable,
      desc:  t.home.features.affordableDesc,
    },
    {
      icon: Heart,
      color: 'bg-rose-100 dark:bg-rose-950 text-rose-500',
      title: t.home.features.local,
      desc:  t.home.features.localDesc,
    },
    {
      icon: Zap,
      color: 'bg-amber-100 dark:bg-amber-950 text-amber-500',
      title: t.home.features.delivery,
      desc:  t.home.features.deliveryDesc,
    },
  ]

  return (
    <section ref={ref} className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">{t.home.whyChoose}</h2>
          <div className="w-16 h-1 bg-cleano-blue rounded-full mx-auto mt-3" />
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-6 flex flex-col items-start gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
