'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Blocks, Sparkles, Zap } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import MosaicPreview from '@/components/MosaicPreview'
import PieceList from '@/components/PieceList'
import ExportControls from '@/components/ExportControls'
import ImageQualityModal from '@/components/ImageQualityModal'
import { processImageToMosaic, resizeImageFile } from '@/utils/image-processing'
import type { MosaicData, LegoColor } from '@/types'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [mosaicData, setMosaicData] = useState<MosaicData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload')
  const [showQualityModal, setShowQualityModal] = useState(false)
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const processImage = useCallback(async (file: File) => {
    try {
      // Resize image if it's too large
      const resizedFile = await resizeImageFile(file, 1024)
      setSelectedImage(resizedFile)
      
      // Process immediately after selecting the image
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

  const handleImageSelect = useCallback(async (file: File) => {
    // Check image dimensions
    const img = new Image()
    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img
      setImageSize({ width, height })
      
      const maxDimension = Math.max(width, height)
      
      if (maxDimension < 800) {
        setPendingImageFile(file)
        setShowQualityModal(true)
      } else {
        processImage(file)
      }
    }
    img.src = URL.createObjectURL(file)
  }, [processImage])

  const handleContinueWithLowRes = useCallback(() => {
    if (pendingImageFile) {
      processImage(pendingImageFile)
      setPendingImageFile(null)
    }
  }, [pendingImageFile, processImage])

  const handleStartOver = useCallback(() => {
    setSelectedImage(null)
    setMosaicData(null)
    setStep('upload')
    setShowQualityModal(false)
    setPendingImageFile(null)
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
      {/* Background Elements */}
      <div className="floating-elements">
        <div className="floating-element top-10 left-10 w-8 h-8 bg-lego-red/20" />
        <div className="floating-element top-20 right-20 w-6 h-6 bg-lego-blue/20" />
        <div className="floating-element top-32 left-1/3 w-10 h-10 bg-lego-yellow/20" />
        <div className="floating-element top-40 right-1/3 w-7 h-7 bg-lego-green/20" />
        <div className="floating-element top-52 left-1/2 w-9 h-9 bg-lego-orange/20" />
        <div className="floating-element top-64 right-1/4 w-6 h-6 bg-lego-purple/20" />
        <div className="floating-element top-80 left-1/4 w-8 h-8 bg-lego-pink/20" />
      </div>

      {/* Header */}
      <header className="relative overflow-hidden py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg"
              >
                <Blocks className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-6xl font-bold gradient-text text-shadow-lg">
                Mosaic Maker
              </h1>
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-10 h-10 text-amber-400" />
              </motion.div>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your favorite images into stunning LEGO mosaics with precise piece calculations and modern design
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
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
                className="glass-card p-12 max-w-lg mx-auto"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-8"
                >
                  <div className="relative">
                    <Blocks className="w-full h-full text-primary-500" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-xl opacity-30"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Building Your Mosaic
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  Converting your image into LEGO magic...
                </p>
                <div className="w-full h-3 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 rounded-full"
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
              <div className="text-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartOver}
                  className="modern-button"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Create Another Mosaic
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Imagen original */}
                <div className="space-y-4">
                  <div className="glass-card p-6">
                    <h3 className="text-2xl font-bold text-center mb-6 gradient-text">Original Image</h3>
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={selectedImage ? URL.createObjectURL(selectedImage) : ''}
                        alt="Original"
                        className="w-full rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                      />
                    </div>
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
      <footer className="bg-white/40 backdrop-blur-md border-t border-white/30 mt-16">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center">
            <p className="text-gray-700 font-medium">Built with ❤️ using Next.js and Tailwind CSS</p>
            <p className="mt-2 text-sm text-gray-600">
              Transform your creativity into LEGO masterpieces
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-3 h-3 bg-lego-red rounded-full"></div>
              <div className="w-3 h-3 bg-lego-blue rounded-full"></div>
              <div className="w-3 h-3 bg-lego-yellow rounded-full"></div>
              <div className="w-3 h-3 bg-lego-green rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>

      {/* Quality Modal */}
      <ImageQualityModal
        isOpen={showQualityModal}
        onClose={() => {
          setShowQualityModal(false)
          setPendingImageFile(null)
        }}
        onContinue={handleContinueWithLowRes}
        imageSize={imageSize}
      />
    </div>
  )
}