'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Info } from 'lucide-react'

interface ImageQualityModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  imageSize: { width: number; height: number }
}

export default function ImageQualityModal({ 
  isOpen, 
  onClose, 
  onContinue, 
  imageSize 
}: ImageQualityModalProps) {
  const isLowResolution = Math.max(imageSize.width, imageSize.height) < 800
  const maxDimension = Math.max(imageSize.width, imageSize.height)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-backdrop"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-3 rounded-full ${
                isLowResolution 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {isLowResolution ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isLowResolution ? 'Image Quality Warning' : 'Image Quality Information'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your image is <span className="font-semibold">{imageSize.width} × {imageSize.height}</span> pixels.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {isLowResolution ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">Recommended Action:</h4>
                  <p className="text-amber-800 text-sm">
                    For the best mosaic quality, we recommend using images with at least 800px on the longest side. 
                    Higher resolution images produce more detailed and accurate LEGO mosaics.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Great Resolution!</h4>
                  <p className="text-green-800 text-sm">
                    Your image has excellent resolution for creating a detailed LEGO mosaic.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-medium text-gray-900">Current Size</div>
                  <div className="text-gray-600">{maxDimension}px</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-medium text-gray-900">Recommended</div>
                  <div className="text-gray-600">≥800px</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="modern-button-secondary flex-1"
              >
                Choose Different Image
              </button>
              <button
                onClick={() => {
                  onContinue()
                  onClose()
                }}
                className="modern-button flex-1"
              >
                Continue Anyway
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}