'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileImage, FileText, ShoppingCart, Loader2 } from 'lucide-react'
import { exportAsPNG, exportAsPDF, downloadShoppingList } from '@/utils/export'
import type { MosaicData } from '@/types'

interface ExportControlsProps {
  mosaicData: MosaicData
}

export default function ExportControls({ mosaicData }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  
  const handleExportPNG = async () => {
    setIsExporting('png')
    try {
      await exportAsPNG('mosaic-preview', 'lego-mosaic')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export PNG. Please try again.')
    }
    setIsExporting(null)
  }
  
  const handleExportPDF = async () => {
    setIsExporting('pdf')
    try {
      await exportAsPDF('mosaic-preview', mosaicData, 'lego-mosaic-instructions')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export PDF. Please try again.')
    }
    setIsExporting(null)
  }
  
  const handleDownloadShoppingList = () => {
    setIsExporting('shopping')
    try {
      downloadShoppingList(mosaicData, 'lego-shopping-list')
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download shopping list. Please try again.')
    }
    setIsExporting(null)
  }
  
  const exportButtons = [
    {
      id: 'png',
      icon: FileImage,
      label: 'Export PNG',
      description: 'High-quality image of your mosaic',
      color: 'from-green-500 to-emerald-500',
      onClick: handleExportPNG,
    },
    {
      id: 'pdf',
      icon: FileText,
      label: 'Export PDF',
      description: 'Complete instructions with piece list',
      color: 'from-red-500 to-pink-500',
      onClick: handleExportPDF,
    },
    {
      id: 'shopping',
      icon: ShoppingCart,
      label: 'Shopping List',
      description: 'Text file with all required pieces',
      color: 'from-blue-500 to-cyan-500',
      onClick: handleDownloadShoppingList,
    },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Download className="w-5 h-5 text-purple-500" />
        <h3 className="text-xl font-semibold text-gray-700">
          Export & Download
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportButtons.map((button, index) => {
          const Icon = button.icon
          const isLoading = isExporting === button.id
          
          return (
            <motion.button
              key={button.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={button.onClick}
              disabled={isLoading}
              className={`
                relative p-4 rounded-xl bg-gradient-to-r ${button.color}
                text-white shadow-lg hover:shadow-xl transform transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <div className="flex flex-col items-center text-center">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 mb-3 animate-spin" />
                ) : (
                  <Icon className="w-8 h-8 mb-3" />
                )}
                
                <div className="font-semibold mb-1">
                  {button.label}
                </div>
                
                <div className="text-sm opacity-90">
                  {button.description}
                </div>
              </div>
              
              {isLoading && (
                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                  <div className="text-sm font-medium">
                    Exporting...
                  </div>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 bg-yellow-400 rounded-full flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <div className="font-medium mb-1">Export Tips:</div>
            <ul className="space-y-1 text-xs">
              <li>• PNG: Perfect for sharing or printing your mosaic design</li>
              <li>• PDF: Complete building instructions with piece requirements</li>
              <li>• Shopping List: Text file for ordering LEGO pieces online</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}