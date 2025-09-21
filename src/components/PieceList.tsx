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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="space-y-6">
        {/* Piece Count Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-700">
              Required LEGO Pieces
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {pieceCount.map((piece, index) => (
              <motion.div
                key={piece.color.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg shadow-md lego-stud"
                  style={{ backgroundColor: piece.color.hex }}
                  title={piece.color.name}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-700">
                    {piece.color.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    1×1 stud pieces
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">
                    {piece.count.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {((piece.count / totalPieces) * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Base Requirements Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-700">
              Base Requirements
            </h3>
          </div>
          
          <div className="space-y-3">
            {baseRequirements.map((base, index) => (
              <motion.div
                key={`${base.size}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded border-2 border-gray-400" />
                  <div>
                    <div className="font-medium text-gray-700">
                      {base.size} {base.color} Baseplate
                    </div>
                    <div className="text-sm text-gray-500">
                      LEGO Building Platform
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">
                    {base.count}
                  </div>
                  <div className="text-xs text-gray-500">
                    piece{base.count !== 1 ? 's' : ''}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t pt-4"
        >
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {totalPieces.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Total LEGO pieces needed
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3 text-center">
              <div>
                <div className="font-semibold text-gray-700">
                  {pieceCount.length}
                </div>
                <div className="text-xs text-gray-500">
                  Different colors
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">
                  {baseRequirements.reduce((sum, base) => sum + base.count, 0)}
                </div>
                <div className="text-xs text-gray-500">
                  Baseplates needed
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}