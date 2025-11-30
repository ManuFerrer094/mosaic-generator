'use client'

import { motion } from 'framer-motion'
import { Palette, Package } from 'lucide-react'
import type { MosaicData } from '@/types'

interface PieceListProps {
  mosaicData: MosaicData
}

export default function PieceList({ mosaicData }: PieceListProps) {
  const { pieceCount, baseRequirements, totalPieces } = mosaicData

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
      <div className="card p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Required LEGO Pieces</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {pieceCount.map((piece, index) => (
              <motion.div key={piece.color.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-8 h-8 rounded-lg shadow" style={{ backgroundColor: piece.color.hex }} title={piece.color.name} />
                <div className="flex-1">
                  <div style={{ fontWeight: 600, color: 'var(--gray-100)' }}>{piece.color.name}</div>
                  <div className="muted">1×1 stud pieces</div>
                </div>
                <div className="text-right">
                  <div style={{ fontWeight: 700 }}>{piece.count.toLocaleString()}</div>
                  <div className="muted text-xs">{((piece.count / totalPieces) * 100).toFixed(1)}%</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Base Requirements</h3>
          </div>

          <div className="space-y-2">
            {baseRequirements.map((base, index) => (
              <motion.div key={`${base.size}-${index}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }}>
                <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded border-2 border-gray-400" />
                    <div>
                      <div style={{ fontWeight: 600 }}>{base.size} {base.color} Baseplate</div>
                      <div className="muted">LEGO Building Platform</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontWeight: 700 }}>{base.count}</div>
                    <div className="muted text-xs">piece{base.count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="border-t pt-4">
              <div className="rounded p-3 text-center" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--gray-100)' }}>{totalPieces.toLocaleString()}</div>
                <div className="muted">Total LEGO pieces needed</div>
                <div className="grid grid-cols-2 gap-4 mt-3 text-center">
                  <div>
                    <div style={{ fontWeight: 600 }}>{pieceCount.length}</div>
                    <div className="muted text-xs">Different colors</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{baseRequirements.reduce((sum, base) => sum + base.count, 0)}</div>
                    <div className="muted text-xs">Baseplates needed</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}