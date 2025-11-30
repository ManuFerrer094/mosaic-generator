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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
      <div className="card card-elevated p-4">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Export & Download</h3>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-lego" onClick={handleExportPNG} disabled={isExporting !== null}>{isExporting === 'png' ? 'Exporting PNG...' : 'Export PNG'}</button>
          <button className="btn btn-ghost" onClick={handleExportPDF} disabled={isExporting !== null}>{isExporting === 'pdf' ? 'Exporting PDF...' : 'Export PDF'}</button>
          <button className="btn btn-ghost" onClick={handleDownloadShoppingList} disabled={isExporting !== null}>{isExporting === 'shopping' ? 'Downloading...' : 'Shopping List'}</button>
        </div>

        <div className="mt-4" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Export Tips:</div>
          <ul style={{ marginLeft: 16 }}>
            <li style={{ marginBottom: 4 }}>PNG: High-quality image for sharing</li>
            <li style={{ marginBottom: 4 }}>PDF: Instructions with piece list</li>
            <li>Shopping List: Text file with required pieces</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}