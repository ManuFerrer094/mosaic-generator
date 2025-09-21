'use client'

import { useCallback } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div
        className={`
          relative border-2 border-dashed border-purple-300 rounded-2xl p-12 
          text-center transition-all duration-300 glass-card
          ${!disabled ? 'hover:border-purple-400 hover:bg-purple-50/50 cursor-pointer' : 'opacity-50'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <motion.div
          whileHover={!disabled ? { scale: 1.05 } : {}}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ImageIcon className="mx-auto h-16 w-16 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Upload Your Image
          </h3>
          <p className="text-gray-500 mb-6">
            Drag and drop an image here, or click to select
          </p>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          <motion.button
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium
              transition-all duration-200
              ${!disabled 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
            disabled={disabled}
          >
            <Upload className="w-5 h-5" />
            Choose Image
          </motion.button>
        </motion.div>
        
        <div className="mt-6 text-sm text-gray-400">
          Supported formats: JPG, PNG, GIF, WebP
        </div>
      </div>
    </motion.div>
  )
}