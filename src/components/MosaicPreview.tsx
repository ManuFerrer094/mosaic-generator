
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
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}>
      <div id="mosaic-preview" className={`card p-4 ${className}`}>
        <h3 className="text-lg mb-3 text-center" style={{ color: 'var(--gray-100)' }}>LEGO Mosaic Preview</h3>

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
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: (pixel.x + pixel.y) * 0.002,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
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

        <AnimatePresence>
          {showColorPicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseColorPicker}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 448 }}>
                <h4 className="text-center mb-2 text-lg font-semibold">Choose LEGO Color</h4>
                <div className="text-center mb-4">Position ({selectedPixel?.x}, {selectedPixel?.y})</div>

                <div className="h-8 mb-4 flex items-center justify-center">
                  <AnimatePresence>
                    {hoveredColor && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-default-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        {hoveredColor.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(72px, 1fr))' }}>
                        {LEGO_COLORS.map((color) => (
                          <motion.button key={color.id} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} onClick={() => handleColorSelect(color)} onMouseEnter={() => setHoveredColor(color)} onMouseLeave={() => setHoveredColor(null)} className="rounded-lg relative overflow-hidden" style={{ width: '72px', height: '72px', backgroundColor: color.hex, border: '2px solid rgba(0,0,0,0.06)', margin: '0 auto' }} title={color.name}>
                            <div className="absolute" style={{ inset: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                          </motion.button>
                        ))}
                      </div>

                <div className="flex justify-end gap-3">
                  <button onClick={handleCloseColorPicker} className="px-4 py-2 rounded bg-gray-500 text-white">Cancel</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="mt-3 text-center">
          <div className="text-sm">{mosaicWidth}×{mosaicHeight} studs • {pieceCount} total pieces</div>
          <div className="text-xs mt-1">Hover over studs to see color details</div>
        </div>
      </div>
    </motion.div>
  )
}