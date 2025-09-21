'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { MosaicData, LegoColor } from '@/types'
import { useEffect, useState } from 'react'
import { LEGO_COLORS } from '@/lib/lego-colors'

interface MosaicPreviewProps {
  mosaicData: MosaicData
  className?: string
  onPixelEdit?: (x: number, y: number, newColor: LegoColor) => void
}

export default function MosaicPreview({ mosaicData, className = '', onPixelEdit }: MosaicPreviewProps) {
  const { pixels, size, width, height } = mosaicData
  
  // Usar dimensiones reales si están disponibles, sino usar size como cuadrado
  const mosaicWidth = width || size
  const mosaicHeight = height || size

  // Estado para el selector de colores
  const [selectedPixel, setSelectedPixel] = useState<{x: number, y: number} | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [hoveredColor, setHoveredColor] = useState<LegoColor | null>(null)

  // Debug: verificar los datos del mosaico
  useEffect(() => {
    console.log('MosaicPreview data:', { 
      totalPixels: pixels.length, 
      size,
      width: mosaicWidth,
      height: mosaicHeight,
      firstFewPixels: pixels.slice(0, 5).map(p => ({ x: p.x, y: p.y, color: p.color.name, hex: p.color.hex }))
    })
  }, [pixels, size, mosaicWidth, mosaicHeight])

  // Calculate appropriate stud size based on container and mosaic size
  const getStudSize = () => {
    const maxSize = 400 // Maximum container size in pixels
    const maxDimension = Math.max(mosaicWidth, mosaicHeight)
    return Math.floor(maxSize / maxDimension)
  }

  const studSize = getStudSize()

  // Evitar hydration mismatch con toLocaleString
  const [pieceCount, setPieceCount] = useState<string>(pixels.length.toString())
  useEffect(() => {
    setPieceCount(pixels.length.toLocaleString())
  }, [pixels.length])

  // Handlers para edición de píxeles
  const handlePixelClick = (x: number, y: number) => {
    if (onPixelEdit) {
      setSelectedPixel({ x, y })
      setShowColorPicker(true)
    }
  }

  const handleColorSelect = (color: LegoColor) => {
    if (selectedPixel && onPixelEdit) {
      onPixelEdit(selectedPixel.x, selectedPixel.y, color)
      setShowColorPicker(false)
      setSelectedPixel(null)
    }
  }

  const handleCloseColorPicker = () => {
    setShowColorPicker(false)
    setSelectedPixel(null)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass-card ${className}`}
      id="mosaic-preview"
    >
      <h3 className="text-xl mb-4 text-center">
        LEGO Mosaic Preview
      </h3>

      <div>
        <div
          className="mosaic-grid"
          style={{
            gridTemplateColumns: `repeat(${mosaicWidth}, 1fr)`,
            gridTemplateRows: `repeat(${mosaicHeight}, 1fr)`,
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
              className={`lego-stud stud ${onPixelEdit ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`}
              style={{
                width: `${studSize}px`,
                height: `${studSize}px`,
                backgroundColor: pixel.color.hex,
              }}
              title={`${pixel.color.name} (${pixel.x}, ${pixel.y})${onPixelEdit ? ' - Click to edit' : ''}`}
              onClick={() => handlePixelClick(pixel.x, pixel.y)}
            />
          ))}
        </div>
      </div>

      {/* Selector de colores */}
      <AnimatePresence>
        {showColorPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseColorPicker}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-100" 
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-2xl font-bold mb-2 text-center text-gray-800">
                Choose LEGO Color
              </h4>
              <p className="text-center text-gray-600 mb-6">
                Position ({selectedPixel?.x}, {selectedPixel?.y})
              </p>
              
              {/* Tooltip display area */}
              <div className="h-8 mb-4 flex items-center justify-center">
                <AnimatePresence>
                  {hoveredColor && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {hoveredColor.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-8">
                {LEGO_COLORS.map((color) => (
                  <motion.button
                    key={color.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleColorSelect(color)}
                    onMouseEnter={() => setHoveredColor(color)}
                    onMouseLeave={() => setHoveredColor(null)}
                    className="w-16 h-16 rounded-xl border-4 border-gray-200 hover:border-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {/* Inner stud effect */}
                    <div className="absolute inset-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-200" />
                    
                    {/* Selection indicator */}
                    <motion.div
                      className="absolute inset-0 border-4 border-blue-500 rounded-xl opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Click a color to select
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseColorPicker}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-4 text-center">
        <div className="text-sm">
          {mosaicWidth}×{mosaicHeight} studs • {pieceCount} total pieces
        </div>
        <div className="text-xs mt-1">
          Hover over studs to see color details
        </div>
      </div>
    </motion.div>
  )
}