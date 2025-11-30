'use client'

import { motion } from 'framer-motion'
import { MOSAIC_SIZES } from '@/lib/lego-colors'
import type { MosaicSize } from '@/types'

interface SizeSelectorProps {
  selectedSize: number
  onSizeChange: (size: number) => void
  disabled?: boolean
}

export default function SizeSelector({ selectedSize, onSizeChange, disabled }: SizeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="w-full"
    >
      <div className="card p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Choose Mosaic Size</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOSAIC_SIZES.map((size, index) => {
            const selected = selectedSize === size.value
            return (
              <motion.button key={size.value} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.06 }} onClick={() => !disabled && onSizeChange(size.value)} disabled={disabled} className={`p-4 rounded-lg text-left ${selected ? 'border-2 border-yellow-500 bg-opacity-10' : 'border border-transparent hover:border-gray-300'}`}>
                <div className="flex flex-col items-start gap-1 w-full">
                  <div className="text-semibold" style={{ fontWeight: 700, color: 'var(--gray-100)' }}>{size.label}</div>
                  <div className="muted">{size.description}</div>
                  <div className="mt-3 w-full flex justify-center">
                    <div className="grid gap-px bg-gray-200 p-1 rounded" style={{ gridTemplateColumns: `repeat(${Math.min(size.value / 4, 8)}, 1fr)`, width: '80%' }}>
                      {Array.from({ length: Math.min(size.value / 4, 8) ** 2 }).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-gray-500 rounded-sm" />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs muted mt-2">{(size.value ** 2).toLocaleString()} pieces</div>
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-4 text-center text-sm muted">Larger sizes create more detailed mosaics but require more pieces</div>
      </div>
    </motion.div>
  )
}