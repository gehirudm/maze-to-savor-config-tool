import { ElementType, MazeElement } from '@/lib/types'
import { create } from 'zustand'

interface MazeState {
  // Current state
  currentFloor: number
  selectedTool: ElementType | null
  elements: MazeElement[]
  
  // Placement states
  wallStart: { x: number; y: number } | null
  stairStart: { x: number; y: number; floor: number } | null
  polePosition: { x: number; y: number } | null
  
  // Dialog states
  showPoleEndFloorDialog: boolean
  
  // Actions
  setCurrentFloor: (floor: number) => void
  setSelectedTool: (tool: ElementType | null) => void
  addElement: (element: MazeElement) => void
  removeElement: (id: string) => void
  updateElement: (id: string, updates: Partial<MazeElement>) => void
  
  // Placement actions
  setWallStart: (position: { x: number; y: number } | null) => void
  setStairStart: (position: { x: number; y: number; floor: number } | null) => void
  setPolePosition: (position: { x: number; y: number } | null) => void
  
  // Dialog actions
  setShowPoleEndFloorDialog: (show: boolean) => void
  
  // Utility actions
  clearAllPlacements: () => void
  resetStore: () => void
}

export const useMazeStore = create<MazeState>((set, get) => ({
  // Initial state
  currentFloor: 0,
  selectedTool: null,
  elements: [
    // Initial players on Floor 1
    { id: "player-A", type: "player", floor: 0, x: 8, y: 9, playerType: "A" },
    { id: "player-B", type: "player", floor: 0, x: 12, y: 6, playerType: "B" },
    { id: "player-C", type: "player", floor: 0, x: 16, y: 9, playerType: "C" },
  ],
  
  // Placement states
  wallStart: null,
  stairStart: null,
  polePosition: null,
  
  // Dialog states
  showPoleEndFloorDialog: false,
  
  // Basic actions
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  
  addElement: (element) => set((state) => ({
    elements: [...state.elements, element]
  })),
  
  removeElement: (id) => set((state) => ({
    elements: state.elements.filter((el) => el.id !== id)
  })),
  
  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map((el) => 
      el.id === id ? { ...el, ...updates } : el
    )
  })),
  
  // Placement actions
  setWallStart: (position) => set({ wallStart: position }),
  setStairStart: (position) => set({ stairStart: position }),
  setPolePosition: (position) => set({ polePosition: position }),
  
  // Dialog actions
  setShowPoleEndFloorDialog: (show) => set({ showPoleEndFloorDialog: show }),
  
  // Utility actions
  clearAllPlacements: () => set({
    wallStart: null,
    stairStart: null,
    polePosition: null,
    showPoleEndFloorDialog: false,
  }),
  
  resetStore: () => set({
    currentFloor: 0,
    selectedTool: null,
    elements: [
      { id: "player-A", type: "player", floor: 0, x: 8, y: 9, playerType: "A" },
      { id: "player-B", type: "player", floor: 0, x: 12, y: 6, playerType: "B" },
      { id: "player-C", type: "player", floor: 0, x: 16, y: 9, playerType: "C" },
    ],
    wallStart: null,
    stairStart: null,
    polePosition: null,
    showPoleEndFloorDialog: false,
  }),
}))