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
              className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 shadow-2xl border border-gray-100" 
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-2xl font-bold mb-2 text-center text-gray-800">
                Choose LEGO Color
              </h4>
              <p className="text-center text-gray-600 mb-6">
                Position ({selectedPixel?.x}, {selectedPixel?.y})
              </p>
              
              {/* Color grid with improved layout */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 max-h-96 overflow-y-auto">
                {LEGO_COLORS.map((color) => (
                  <motion.button
                    key={color.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleColorSelect(color)}
                    className="flex flex-col items-center p-3 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 shadow-md hover:shadow-lg bg-gray-50 hover:bg-white group"
                  >
                    {/* Color swatch - much larger */}
                    <div 
                      className="w-20 h-20 md:w-24 md:h-24 rounded-lg shadow-md mb-3 relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200"
                      style={{ backgroundColor: color.hex }}
                    >
                      {/* Inner stud effect */}
                      <div className="absolute inset-3 rounded-full bg-white/25 group-hover:bg-white/35 transition-colors duration-200" />
                      
                      {/* Selection indicator */}
                      <motion.div
                        className="absolute inset-0 border-3 border-blue-500 rounded-lg opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    
                    {/* Color information */}
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-800 mb-1 leading-tight">
                        {color.name}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {color.hex}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  <div className="font-medium">Click any color to select it</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {LEGO_COLORS.length} authentic LEGO colors available
                  </div>
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