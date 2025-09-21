import { findClosestLegoColor } from '@/lib/lego-colors'
import type { MosaicData, MosaicPixel, PieceCount, BaseRequirement } from '@/types'

/**
 * Calculate optimal mosaic size based on image dimensions and complexity
 */
function calculateOptimalMosaicSize(width: number, height: number): { size: number, aspectRatio: number } {
  // Determinar el tamaño base según la resolución
  const maxDimension = Math.max(width, height)
  const minDimension = Math.min(width, height)
  
  let baseSize: number
  if (maxDimension > 800) {
    baseSize = 64
  } else if (maxDimension > 400) {
    baseSize = 48
  } else {
    baseSize = 32
  }
  
  // Calcular tamaños proporcionales
  const aspectRatio = width / height
  let mosaicWidth: number, mosaicHeight: number
  
  if (width >= height) {
    mosaicWidth = baseSize
    mosaicHeight = Math.round(baseSize / aspectRatio)
  } else {
    mosaicHeight = baseSize
    mosaicWidth = Math.round(baseSize * aspectRatio)
  }
  
  // Asegurar tamaños mínimos
  mosaicWidth = Math.max(16, mosaicWidth)
  mosaicHeight = Math.max(16, mosaicHeight)
  
  return { size: Math.max(mosaicWidth, mosaicHeight), aspectRatio }
}

/**
 * Process an image and convert it to a LEGO mosaic with automatic sizing
 */
export async function processImageToMosaic(
  imageFile: File
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
      // Calcular tamaño óptimo del mosaico manteniendo proporciones
      const { size: mosaicSize } = calculateOptimalMosaicSize(img.width, img.height)
      
      // Mantener proporciones de la imagen original
      const aspectRatio = img.width / img.height
      let mosaicWidth: number, mosaicHeight: number
      
      if (aspectRatio >= 1) {
        // Imagen horizontal o cuadrada
        mosaicWidth = mosaicSize
        mosaicHeight = Math.round(mosaicSize / aspectRatio)
      } else {
        // Imagen vertical
        mosaicHeight = mosaicSize
        mosaicWidth = Math.round(mosaicSize * aspectRatio)
      }
      
      // Asegurar tamaños mínimos
      mosaicWidth = Math.max(16, mosaicWidth)
      mosaicHeight = Math.max(16, mosaicHeight)
      
      console.log(`Original image: ${img.width}x${img.height}, Mosaic: ${mosaicWidth}x${mosaicHeight}`)
      
      // Set canvas size to mosaic dimensions
      canvas.width = mosaicWidth
      canvas.height = mosaicHeight

      // Draw and scale the image to fit the mosaic size maintaining aspect ratio
      ctx.drawImage(img, 0, 0, mosaicWidth, mosaicHeight)

      // Get image data
      const imageData = ctx.getImageData(0, 0, mosaicWidth, mosaicHeight)
      const pixels: MosaicPixel[] = []
      const colorCounts = new Map<string, number>()

      // Process each pixel
      for (let y = 0; y < mosaicHeight; y++) {
        for (let x = 0; x < mosaicWidth; x++) {
          const index = (y * mosaicWidth + x) * 4
          const r = imageData.data[index]
          const g = imageData.data[index + 1]
          const b = imageData.data[index + 2]

          // Find closest LEGO color
          const legoColor = findClosestLegoColor([r, g, b])
          
          // Debug: log some color conversions
          if (x < 3 && y < 3) {
            console.log(`Pixel (${x},${y}): RGB(${r},${g},${b}) -> ${legoColor.name} (${legoColor.hex})`)
          }
          
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

      // Calculate base requirements using the larger dimension
      const baseRequirements = calculateBaseRequirements(Math.max(mosaicWidth, mosaicHeight))

      // Calculate total pieces
      const totalPieces = pixels.length

      console.log(`Generated mosaic: ${mosaicWidth}x${mosaicHeight} pixels, ${totalPieces} total pieces`)

      resolve({
        pixels,
        size: Math.max(mosaicWidth, mosaicHeight), // Para compatibilidad con el grid cuadrado
        width: mosaicWidth,
        height: mosaicHeight,
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