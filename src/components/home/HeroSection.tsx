'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Star, Sparkles } from 'lucide-react'
import { useStore } from '@/store/useStore'

export function HeroSection() {
  const { t } = useStore()

  const containerVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.12 } },
  }

  const itemVariants = {
    hidden:  { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-cleano-navy">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient mesh */}
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-cleano-blue/20 blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-cleano-sky/15 blur-[100px]" />

        {/* Floating circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/5"
            style={{
              width:  `${80 + i * 60}px`,
              height: `${80 + i * 60}px`,
              top:    `${10 + i * 12}%`,
              right:  `${5 + i * 8}%`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 20 + i * 4, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* Water drop particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`drop-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-cleano-sky/40"
            style={{
              left: `${10 + i * 12}%`,
              top:  `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold px-4 py-2 rounded-full border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-cleano-gold" />
                #1 Cleaning Brand in Ethiopia
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-4"
            >
              {t.home.heroTitle}
              <br />
              <span className="bg-gradient-to-r from-cleano-sky to-white bg-clip-text text-transparent">
                {t.home.heroTitleHighlight}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-blue-200 text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-8"
            >
              {t.home.heroSubtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                href="/products"
                className="btn-primary bg-white text-cleano-blue hover:bg-blue-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] px-8 py-4 text-base"
              >
                {t.home.shopNow}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/locations"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-white/20 text-base"
              >
                <MapPin className="w-4 h-4" />
                {t.home.findBranch}
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 mt-8 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {['bg-blue-300', 'bg-sky-300', 'bg-indigo-300', 'bg-cyan-300'].map((c, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 ${c} rounded-full border-2 border-cleano-navy flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-blue-200 text-xs mt-0.5">50K+ happy customers</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex justify-center items-center"
          >
            {/* Glow rings */}
            <div className="absolute w-72 h-72 rounded-full border border-blue-400/20 animate-pulse" />
            <div className="absolute w-96 h-96 rounded-full border border-blue-400/10 animate-pulse" style={{ animationDelay: '0.5s' }} />

            {/* Main visual card */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🧴</div>
                <div className="text-white font-display font-black text-2xl mb-1">CLEANO</div>
                <div className="text-blue-200 text-sm mb-4">Ultra Blue Formula</div>
                <div className="flex justify-center gap-2">
                  {['3L', '5L'].map((s) => (
                    <span
                      key={s}
                      className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating badges */}
            {[
              { text: '50K+ Customers', icon: '👥', pos: 'top-4 -left-8'   },
              { text: '5 ★ Rating',     icon: '⭐', pos: 'bottom-4 -right-8' },
            ].map((badge) => (
              <motion.div
                key={badge.text}
                className={`absolute ${badge.pos} bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-2xl border border-gray-100 dark:border-gray-700`}
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <p className="text-lg mb-0.5">{badge.icon}</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {badge.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: '6+',   label: t.home.stats.products   },
            { value: '5',    label: t.home.stats.branches   },
            { value: '50K+', label: t.home.stats.customers  },
            { value: '3+',   label: t.home.stats.years      },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white/8 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
            >
              <div className="font-display font-black text-3xl text-white">{stat.value}</div>
              <div className="text-blue-200 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 fill-white dark:fill-gray-950">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  )
}
