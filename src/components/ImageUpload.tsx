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
          relative border-2 border-dashed rounded-2xl p-8 text-center 
          transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg
          ${!disabled 
            ? 'border-blue-300 hover:border-blue-400 hover:bg-white/90 cursor-pointer hover:shadow-xl' 
            : 'border-gray-300 opacity-60'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <motion.div
          whileHover={!disabled ? { scale: 1.02 } : {}}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`
              mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6
              ${!disabled ? 'bg-blue-100' : 'bg-gray-100'}
            `}
          >
            <ImageIcon className={`h-10 w-10 ${!disabled ? 'text-blue-500' : 'text-gray-400'}`} />
          </motion.div>
          
          <h3 className={`text-2xl font-bold mb-3 ${!disabled ? 'text-gray-800' : 'text-gray-500'}`}>
            Upload Your Image
          </h3>
          <p className={`text-base mb-8 ${!disabled ? 'text-gray-600' : 'text-gray-400'}`}>
            Drag and drop an image here, or click the button below
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
              inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg
              transition-all duration-200 shadow-lg border-2
              ${!disabled 
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 hover:shadow-xl'
                : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
              }
            `}
            disabled={disabled}
          >
            <Upload className="w-6 h-6" />
            Choose Image
          </motion.button>
        </motion.div>
        
        <div className={`mt-8 text-sm ${!disabled ? 'text-gray-500' : 'text-gray-400'}`}>
          Supported formats: JPG, PNG, GIF, WebP
        </div>
      </div>
    </motion.div>
  )
}