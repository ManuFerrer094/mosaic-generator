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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Choose Mosaic Size
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOSAIC_SIZES.map((size, index) => (
            <motion.button
              key={size.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!disabled ? { scale: 1.05 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              onClick={() => !disabled && onSizeChange(size.value)}
              disabled={disabled}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${selectedSize === size.value
                  ? 'border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {selectedSize === size.value && (
                <motion.div
                  layoutId="size-selector"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative z-10">
                <div className="text-2xl font-bold text-gray-700 mb-1">
                  {size.label}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {size.description}
                </div>
                
                {/* Visual representation */}
                <div className="flex justify-center mb-2">
                  <div 
                    className="grid gap-px bg-gray-300 p-1 rounded"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(size.value / 4, 8)}, 1fr)`,
                    }}
                  >
                    {Array.from({ length: Math.min(size.value / 4, 8) ** 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-sm"
                      />
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  {(size.value ** 2).toLocaleString()} pieces
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          Larger sizes create more detailed mosaics but require more pieces
        </div>
      </div>
    </motion.div>
  )
}