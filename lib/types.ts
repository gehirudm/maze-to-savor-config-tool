export type ElementType = "stair" | "pole" | "wall" | "flag" | "player"

export interface MazeElement {
  id: string
  type: ElementType
  floor: number
  x: number
  y: number
  // For stairs and poles
  endFloor?: number
  endX?: number
  endY?: number
  // For walls
  endWallX?: number
  endWallY?: number
  // For players
  playerType?: "A" | "B" | "C"
  height?: number
}