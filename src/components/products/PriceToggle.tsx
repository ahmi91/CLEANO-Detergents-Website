'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import type { SizeOption } from '@/lib/types'

interface PriceToggleProps {
  value?: SizeOption
  onChange?: (size: SizeOption) => void
  className?: string
}

export function PriceToggle({ value, onChange, className }: PriceToggleProps) {
  const { t, selectedSize, setSelectedSize } = useStore()

  const currentSize = value ?? selectedSize
  const handleChange = (size: SizeOption) => {
    onChange ? onChange(size) : setSelectedSize(size)
  }

  const options: { size: SizeOption; label: string }[] = [
    { size: '3L', label: t.productDetail.threeL },
    { size: '5L', label: t.productDetail.fiveL },
  ]

  return (
    <div className={cn('size-toggle', className)}>
      {/* Sliding pill */}
      <motion.div
        className="absolute inset-y-1 bg-cleano-blue rounded-[10px] shadow-md"
        initial={false}
        animate={{
          left: currentSize === '3L' ? '4px' : '50%',
          width: 'calc(50% - 4px)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ position: 'absolute' }}
      />

      {options.map(({ size, label }) => (
        <button
          key={size}
          onClick={() => handleChange(size)}
          className={cn(
            'size-option',
            currentSize === size ? 'active' : 'inactive'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
