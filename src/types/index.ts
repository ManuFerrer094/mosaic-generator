export interface LegoColor {
  name: string;
  hex: string;
  rgb: [number, number, number];
  id: number;
}

export interface MosaicSize {
  value: number;
  label: string;
  description: string;
}

export interface MosaicPixel {
  color: LegoColor;
  x: number;
  y: number;
}

export interface PieceCount {
  color: LegoColor;
  count: number;
}

export interface BaseRequirement {
  size: string;
  count: number;
  color: string;
}

export interface MosaicData {
  pixels: MosaicPixel[];
  size: number; // Para compatibilidad con código existente
  width?: number; // Ancho real del mosaico
  height?: number; // Alto real del mosaico
  pieceCount: PieceCount[];
  baseRequirements: BaseRequirement[];
  totalPieces: number;
}