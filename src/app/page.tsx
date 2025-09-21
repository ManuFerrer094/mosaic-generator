'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Blocks, Sparkles, Zap } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import MosaicPreview from '@/components/MosaicPreview'
import PieceList from '@/components/PieceList'
import ExportControls from '@/components/ExportControls'
import { processImageToMosaic, resizeImageFile } from '@/utils/image-processing'
import type { MosaicData, LegoColor } from '@/types'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [mosaicData, setMosaicData] = useState<MosaicData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload')

  const handleImageSelect = useCallback(async (file: File) => {
    try {
      // Resize image if it's too large
      const resizedFile = await resizeImageFile(file, 1024)
      setSelectedImage(resizedFile)
      
      // Procesar inmediatamente después de seleccionar la imagen
      setIsProcessing(true)
      setStep('processing')
      
      const data = await processImageToMosaic(resizedFile)
      setMosaicData(data)
      setStep('result')
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing image. Please try a different image.')
      setStep('upload')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleStartOver = useCallback(() => {
    setSelectedImage(null)
    setMosaicData(null)
    setStep('upload')
  }, [])

  const handlePixelEdit = useCallback((x: number, y: number, newColor: LegoColor) => {
    if (!mosaicData) return
    
    const updatedPixels = mosaicData.pixels.map(pixel => {
      if (pixel.x === x && pixel.y === y) {
        return { ...pixel, color: newColor }
      }
      return pixel
    })
    
    // Recalcular conteo de colores
    const colorCounts = new Map<string, number>()
    updatedPixels.forEach(pixel => {
      const colorKey = pixel.color.hex
      colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1)
    })
    
    const pieceCount = Array.from(colorCounts.entries()).map(([hex, count]) => {
      const color = updatedPixels.find(p => p.color.hex === hex)!.color
      return { color, count }
    }).sort((a, b) => b.count - a.count)
    
    setMosaicData({
      ...mosaicData,
      pixels: updatedPixels,
      pieceCount
    })
  }, [mosaicData])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Blocks className="w-12 h-12 text-purple-500" />
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Mosaic Maker
              </h1>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your favorite images into amazing LEGO mosaics with precise piece calculations
            </p>
          </motion.div>
        </div>
        
        {/* Static LEGO studs background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-6 h-6 rounded-sm opacity-20" style={{ backgroundColor: '#D4282A' }} />
          <div className="absolute top-20 right-20 w-6 h-6 rounded-sm opacity-20" style={{ backgroundColor: '#0055B7' }} />
          <div className="absolute top-32 left-1/3 w-6 h-6 rounded-sm opacity-20" style={{ backgroundColor: '#FFDE00' }} />
          <div className="absolute top-40 right-1/3 w-6 h-6 rounded-sm opacity-20" style={{ backgroundColor: '#237841' }} />
          <div className="absolute top-52 left-1/2 w-6 h-6 rounded-sm opacity-20" style={{ backgroundColor: '#FF6600' }} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <ImageUpload onImageSelect={handleImageSelect} />
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.div
                className="glass-card p-12"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-6"
                >
                  <Blocks className="w-full h-full text-purple-500" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  Building Your Mosaic
                </h3>
                <p className="text-gray-600">
                  Converting your image into LEGO magic...
                </p>
                <div className="mt-6 w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === 'result' && mosaicData && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartOver}
                  className="gradient-button"
                >
                  Create Another Mosaic
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Imagen original */}
                <div className="space-y-4">
                  <div className="glass-card p-4">
                    <h3 className="text-xl mb-4 text-center">Original Image</h3>
                    <img
                      src={selectedImage ? URL.createObjectURL(selectedImage) : ''}
                      alt="Original"
                      className="w-full rounded-lg shadow-lg"
                      style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </div>
                  <ExportControls mosaicData={mosaicData} />
                </div>
                
                {/* Mosaico LEGO */}
                <div>
                  <MosaicPreview mosaicData={mosaicData} onPixelEdit={handlePixelEdit} />
                </div>
                
                {/* Lista de piezas */}
                <div>
                  <PieceList mosaicData={mosaicData} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1rem' }}>
          <div className="text-center text-sm">
            <p>Built with ❤️ using Next.js</p>
            <p className="mt-2 text-xs">
              Transform your creativity into LEGO masterpieces
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}