'use client'

import { useCallback } from 'react'
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  disabled?: boolean
}

export default function ImageUpload({ onImageSelect, disabled }: ImageUploadProps) {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file)
    }
  }, [onImageSelect])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file)
    }
  }, [onImageSelect])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className={`upload-zone ${!disabled ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <motion.div
          whileHover={!disabled ? { scale: 1.02 } : {}}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`
              mx-auto w-24 h-24 rounded-2xl flex items-center justify-center mb-8 relative
              ${!disabled ? 'bg-gradient-to-br from-primary-100 to-secondary-100' : 'bg-gray-100'}
            `}
          >
            <ImageIcon className={`h-12 w-12 ${!disabled ? 'text-primary-600' : 'text-gray-400'}`} />
            {!disabled && (
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
              </motion.div>
            )}
          </motion.div>
          
          <h3 className={`text-3xl font-bold mb-4 ${!disabled ? 'text-gray-800' : 'text-gray-500'}`}>
            Upload Your Image
          </h3>
          <p className={`text-lg mb-10 ${!disabled ? 'text-gray-600' : 'text-gray-400'} max-w-md mx-auto leading-relaxed`}>
            Drag and drop an image here, or click the button below to start creating your LEGO mosaic
          </p>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          <motion.button
            whileHover={!disabled ? { scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={`
              ${!disabled ? 'modern-button' : 'modern-button-secondary opacity-50 cursor-not-allowed'}
              inline-flex items-center gap-3
            `}
            disabled={disabled}
          >
            <Upload className="w-6 h-6" />
            Choose Image
          </motion.button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-10 text-sm ${!disabled ? 'text-gray-500' : 'text-gray-400'}`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            </div>
            <span>Supported formats</span>
          </div>
          <p>JPG, PNG, GIF, WebP • For best results, use high-resolution images (≥800px)</p>
        </motion.div>
      </div>
    </motion.div>
  )
}