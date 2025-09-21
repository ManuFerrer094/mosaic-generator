'use client'

import { motion } from 'framer-motion'
import type { MosaicData } from '@/types'

interface MosaicPreviewProps {
  mosaicData: MosaicData
  className?: string
}

export default function MosaicPreview({ mosaicData, className = '' }: MosaicPreviewProps) {
  const { pixels, size } = mosaicData
  
  // Calculate appropriate stud size based on container and mosaic size
  const getStudSize = () => {
    const maxSize = 400 // Maximum container size in pixels
    return Math.floor(maxSize / size)
  }
  
  const studSize = getStudSize()
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass-card p-6 ${className}`}
      id="mosaic-preview"
    >
      <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        LEGO Mosaic Preview
      </h3>
      
      <div className="flex justify-center">
        <div 
          className="grid gap-px bg-gray-800 p-2 rounded-lg shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            width: 'fit-content',
          }}
        >
          {pixels.map((pixel, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: (pixel.x + pixel.y) * 0.002,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="lego-stud stud"
              style={{
                width: `${studSize}px`,
                height: `${studSize}px`,
                backgroundColor: pixel.color.hex,
              }}
              title={`${pixel.color.name} (${pixel.x}, ${pixel.y})`}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          {size}×{size} studs • {pixels.length.toLocaleString()} total pieces
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Hover over studs to see color details
        </div>
      </div>
    </motion.div>
  )
}