'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Blocks, Sparkles, Zap } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import SizeSelector from '@/components/SizeSelector'
import MosaicPreview from '@/components/MosaicPreview'
import PieceList from '@/components/PieceList'
import ExportControls from '@/components/ExportControls'
import { processImageToMosaic, resizeImageFile } from '@/utils/image-processing'
import type { MosaicData } from '@/types'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedSize, setSelectedSize] = useState<number>(32)
  const [mosaicData, setMosaicData] = useState<MosaicData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'upload' | 'size' | 'processing' | 'result'>('upload')

  const handleImageSelect = useCallback(async (file: File) => {
    try {
      // Resize image if it's too large
      const resizedFile = await resizeImageFile(file, 1024)
      setSelectedImage(resizedFile)
      setStep('size')
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing image. Please try a different image.')
    }
  }, [])

  const handleSizeChange = useCallback((size: number) => {
    setSelectedSize(size)
  }, [])

  const handleGenerateMosaic = useCallback(async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setStep('processing')

    try {
      const data = await processImageToMosaic(selectedImage, selectedSize)
      setMosaicData(data)
      setStep('result')
    } catch (error) {
      console.error('Error generating mosaic:', error)
      alert('Error generating mosaic. Please try again.')
      setStep('size')
    } finally {
      setIsProcessing(false)
    }
  }, [selectedImage, selectedSize])

  const handleStartOver = useCallback(() => {
    setSelectedImage(null)
    setMosaicData(null)
    setStep('upload')
  }, [])

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
        
        {/* Floating LEGO studs background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 900,
                rotate: 0,
              }}
              animate={{
                y: -100,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
              className="absolute w-6 h-6 rounded-sm opacity-20"
              style={{
                backgroundColor: ['#D4282A', '#0055B7', '#FFDE00', '#237841', '#FF6600'][i % 5],
              }}
            />
          ))}
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

          {step === 'size' && (
            <motion.div
              key="size"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Image preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 text-center"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Your Selected Image
                </h3>
                <img
                  src={URL.createObjectURL(selectedImage!)}
                  alt="Selected"
                  className="max-w-sm max-h-64 mx-auto rounded-lg shadow-lg"
                />
              </motion.div>

              <SizeSelector
                selectedSize={selectedSize}
                onSizeChange={handleSizeChange}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateMosaic}
                  className="gradient-button text-lg px-8 py-4"
                >
                  <Zap className="w-6 h-6 mr-2" />
                  Generate LEGO Mosaic
                </motion.button>
                
                <button
                  onClick={handleStartOver}
                  className="ml-4 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Choose Different Image
                </button>
              </motion.div>
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

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <MosaicPreview mosaicData={mosaicData} />
                  <ExportControls mosaicData={mosaicData} />
                </div>
                <div>
                  <PieceList mosaicData={mosaicData} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>Built with ❤️ using Next.js & Tailwind CSS</p>
            <p className="text-sm mt-2">
              Transform your creativity into LEGO masterpieces
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}