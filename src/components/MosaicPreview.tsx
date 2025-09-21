'use client'

import { motion } from 'framer-motion'
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
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseColorPicker}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-lg font-semibold mb-4 text-center">
              Choose LEGO Color for ({selectedPixel?.x}, {selectedPixel?.y})
            </h4>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {LEGO_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color)}
                  className="w-12 h-12 rounded border-2 border-gray-300 hover:border-blue-500 transition-colors relative group"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {color.name}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseColorPicker}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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