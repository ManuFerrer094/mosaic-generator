import type { LegoColor } from '@/types'

export const LEGO_COLORS: LegoColor[] = [
  { id: 1, name: 'White', hex: '#FFFFFF', rgb: [255, 255, 255] },
  { id: 2, name: 'Black', hex: '#1E1E1E', rgb: [30, 30, 30] },
  { id: 3, name: 'Bright Red', hex: '#D4282A', rgb: [212, 40, 42] },
  { id: 4, name: 'Bright Blue', hex: '#0055B7', rgb: [0, 85, 183] },
  { id: 5, name: 'Bright Yellow', hex: '#FFDE00', rgb: [255, 222, 0] },
  { id: 6, name: 'Dark Green', hex: '#237841', rgb: [35, 120, 65] },
  { id: 7, name: 'Orange', hex: '#FF6600', rgb: [255, 102, 0] },
  { id: 8, name: 'Medium Blue', hex: '#4B9FD1', rgb: [75, 159, 209] },
  { id: 9, name: 'Light Gray', hex: '#9B9B9B', rgb: [155, 155, 155] },
  { id: 10, name: 'Dark Gray', hex: '#595959', rgb: [89, 89, 89] },
  { id: 11, name: 'Purple', hex: '#6B1C7A', rgb: [107, 28, 122] },
  { id: 12, name: 'Pink', hex: '#F5989D', rgb: [245, 152, 157] },
  { id: 13, name: 'Lime Green', hex: '#9BCA3C', rgb: [155, 202, 60] },
  { id: 14, name: 'Tan', hex: '#DEB887', rgb: [222, 184, 135] },
  { id: 15, name: 'Brown', hex: '#5C4037', rgb: [92, 64, 55] },
  { id: 16, name: 'Magenta', hex: '#E91E63', rgb: [233, 30, 99] },
]

/**
 * Calculate color distance using Euclidean distance in RGB space
 */
export function colorDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const [r1, g1, b1] = rgb1
  const [r2, g2, b2] = rgb2
  return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2))
}

/**
 * Find the closest LEGO color to a given RGB value
 */
export function findClosestLegoColor(rgb: [number, number, number]): LegoColor {
  let closestColor = LEGO_COLORS[0]
  let minDistance = colorDistance(rgb, closestColor.rgb)

  for (const color of LEGO_COLORS) {
    const distance = colorDistance(rgb, color.rgb)
    if (distance < minDistance) {
      minDistance = distance
      closestColor = color
    }
  }

  return closestColor
}

/**
 * Convert hex color to RGB array
 */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    throw new Error('Invalid hex color')
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ]
}

/**
 * Get available mosaic sizes
 */
export const MOSAIC_SIZES = [
  { value: 16, label: '16×16', description: 'Small mosaic (256 pieces)' },
  { value: 32, label: '32×32', description: 'Medium mosaic (1,024 pieces)' },
  { value: 48, label: '48×48', description: 'Large mosaic (2,304 pieces)' },
  { value: 64, label: '64×64', description: 'Extra large mosaic (4,096 pieces)' },
]