'use client'

import { useCallback, useRef } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  disabled?: boolean
}

export default function ImageUpload({ onImageSelect, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full">
      <div className="card card-elevated upload-area" onDrop={handleDrop} onDragOver={handleDragOver}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <ImageIcon className={`h-8 w-8 text-white`} />
          </div>

          <div style={{ flex: 1 }}>
            <div className="text-lg font-semibold" style={{ color: 'var(--lego-red)' }}>Upload Your Image</div>
            <div className="muted">Drag & drop here or click the button</div>
            <div className="mt-4">
              <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} disabled={disabled} style={{ display: 'none' }} />
              <button
                className="btn btn-lego"
                disabled={disabled}
                onClick={() => {
                  inputRef.current?.click()
                }}
              >
                <Upload /> Choose Image
              </button>
            </div>
            <div className="mt-2 muted" style={{ fontSize: 12 }}>Supported formats: JPG, PNG, GIF, WebP</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}