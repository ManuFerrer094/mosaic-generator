import { findClosestLegoColor } from '@/lib/lego-colors'
import type { MosaicData, MosaicPixel, PieceCount, BaseRequirement } from '@/types'

/**
 * Process an image and convert it to a LEGO mosaic
 */
export async function processImageToMosaic(
  imageFile: File,
  mosaicSize: number
): Promise<MosaicData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    img.onload = () => {
      // Set canvas size to mosaic dimensions
      canvas.width = mosaicSize
      canvas.height = mosaicSize

      // Draw and scale the image to fit the mosaic size
      ctx.drawImage(img, 0, 0, mosaicSize, mosaicSize)

      // Get image data
      const imageData = ctx.getImageData(0, 0, mosaicSize, mosaicSize)
      const pixels: MosaicPixel[] = []
      const colorCounts = new Map<string, number>()

      // Process each pixel
      for (let y = 0; y < mosaicSize; y++) {
        for (let x = 0; x < mosaicSize; x++) {
          const index = (y * mosaicSize + x) * 4
          const r = imageData.data[index]
          const g = imageData.data[index + 1]
          const b = imageData.data[index + 2]

          // Find closest LEGO color
          const legoColor = findClosestLegoColor([r, g, b])
          
          pixels.push({
            color: legoColor,
            x,
            y
          })

          // Count colors
          const colorKey = legoColor.hex
          colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1)
        }
      }

      // Create piece count array
      const pieceCount: PieceCount[] = Array.from(colorCounts.entries()).map(([hex, count]) => {
        const color = pixels.find(p => p.color.hex === hex)!.color
        return { color, count }
      }).sort((a, b) => b.count - a.count)

      // Calculate base requirements
      const baseRequirements = calculateBaseRequirements(mosaicSize)

      // Calculate total pieces
      const totalPieces = pixels.length

      resolve({
        pixels,
        size: mosaicSize,
        pieceCount,
        baseRequirements,
        totalPieces
      })
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    // Create object URL and load image
    const url = URL.createObjectURL(imageFile)
    img.src = url
  })
}

/**
 * Calculate base requirements for a given mosaic size
 */
function calculateBaseRequirements(size: number): BaseRequirement[] {
  const totalStuds = size * size
  
  // Standard LEGO baseplate sizes (in studs)
  const baseplateSizes = [
    { size: '32×32', studs: 32 * 32, name: '32×32 Baseplate' },
    { size: '16×16', studs: 16 * 16, name: '16×16 Baseplate' },
    { size: '8×16', studs: 8 * 16, name: '8×16 Baseplate' },
  ]

  const requirements: BaseRequirement[] = []
  let remainingStuds = totalStuds

  // Try to use the largest baseplates first
  for (const baseplate of baseplateSizes) {
    if (remainingStuds >= baseplate.studs) {
      const count = Math.floor(remainingStuds / baseplate.studs)
      if (count > 0) {
        requirements.push({
          size: baseplate.size,
          count,
          color: 'Gray'
        })
        remainingStuds -= count * baseplate.studs
      }
    }
  }

  // If there are remaining studs, add smaller baseplates
  if (remainingStuds > 0) {
    requirements.push({
      size: '8×16',
      count: Math.ceil(remainingStuds / 128),
      color: 'Gray'
    })
  }

  return requirements
}

/**
 * Resize image file to a reasonable size for processing
 */
export function resizeImageFile(file: File, maxSize: number = 1024): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }

      // Set canvas size and draw
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob and then to file
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          })
          resolve(resizedFile)
        } else {
          resolve(file)
        }
      }, file.type, 0.9)
    }

    img.src = URL.createObjectURL(file)
  })
}