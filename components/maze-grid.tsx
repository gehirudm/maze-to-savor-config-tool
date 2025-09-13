"use client"

import { useState } from "react"
import { ElementType, MazeElement } from '@/lib/types'
import { cn } from "@/lib/utils"
import { useMazeStore } from "@/stores/maze-store"

export function MazeGrid() {
  const {
    currentFloor: floor,
    selectedTool,
    elements,
    wallStart,
    stairStart,
    polePosition,
    showPoleEndFloorDialog,
    addElement,
    removeElement,
    updateElement,
    setWallStart,
    setStairStart,
    setPolePosition,
    setShowPoleEndFloorDialog,
    clearAllPlacements,
  } = useMazeStore()

  const GRID_WIDTH = 25
  const GRID_HEIGHT = 10

  const getAvailableEndFloors = (startFloor: number) => {
    const availableFloors = []
    for (let i = startFloor + 1; i < 3; i++) {
      availableFloors.push(i)
    }
    return availableFloors
  }

  // Define inaccessible areas for each floor
  const getInaccessibleAreas = (floorNum: number) => {
    switch (floorNum) {
      case 0: // Floor 1 - rectangle in middle-right area
        return [{ x1: 8, y1: 6, x2: 16, y2: 9 }]
      case 1: // Floor 2 - rectangle on left side
        return [{ x1: 8, y1: 0, x2: 16, y2: 6 }]
      case 2: // Floor 3 - two rectangles on left and right sides
        return [
          { x1: 0, y1: 0, x2: 7, y2: 10 }, // Left rectangle
          { x1: 17, y1: 0, x2: 24, y2: 9 }, // Right rectangle
        ]
      default:
        return []
    }
  }

  const isInaccessible = (x: number, y: number) => {
    const areas = getInaccessibleAreas(floor)
    return areas.some((area) => x >= area.x1 && x <= area.x2 && y >= area.y1 && y <= area.y2)
  }

  const getElementAt = (x: number, y: number) => {
    return elements.find((el) => {
      if (el.floor === floor && el.x === x && el.y === y) {
        return true
      }
      // Also check for stair end positions on current floor
      if (el.type === "stair" && el.endFloor === floor && el.endX === x && el.endY === y) {
        return true
      }
      return false
    })
  }

  const isValidWallPlacement = (startX: number, startY: number, endX: number, endY: number) => {
    // Must be horizontal or vertical, and not the same tile
    if (startX === endX && startY === endY) return false // Same tile
    return startX === endX || startY === endY // Only horizontal or vertical walls
  }

  const getMaxPoleHeight = (currentFloor: number) => {
    // Height 1 means pole extends to next floor, so max floors above current floor
    return 3 - currentFloor // Floor 0 can have height 3, Floor 1 can have height 2, Floor 2 can have height 1
  }

  const canPlacePole = (currentFloor: number) => {
    // Poles can only be placed if there's at least one floor above to extend to
    return currentFloor < 2 // Can place on floors 0 and 1, but not on floor 2 (last floor)
  }

  const handleCellClick = (x: number, y: number) => {
    const existingElement = getElementAt(x, y)

    // If clicking on existing element, remove it
    if (existingElement) {
      removeElement(existingElement.id)
      return
    }

    if (!selectedTool) return

    if (selectedTool === "pole") {
      if (!canPlacePole(floor)) {
        alert(`Poles cannot be placed on Floor ${floor + 1} as there are no floors above to extend to!`)
        return
      }
      setPolePosition({ x, y })
      setShowPoleEndFloorDialog(true)
      return
    }

    // Handle wall placement (requires two clicks on same floor)
    if (selectedTool === "wall") {
      if (!wallStart) {
        setWallStart({ x, y })
      } else {
        if (!isValidWallPlacement(wallStart.x, wallStart.y, x, y)) {
          if (wallStart.x === x && wallStart.y === y) {
            alert("Wall end position cannot be the same as the start position!")
          } else {
            alert("Walls can only be placed horizontally or vertically, not diagonally!")
          }
          return
        }

        // Create single wall element with start and end positions
        const id = `wall-${Date.now()}`
        addElement({
          id,
          type: "wall",
          floor,
          x: wallStart.x,
          y: wallStart.y,
          endWallX: x,
          endWallY: y,
        })
        
        setWallStart(null)
      }
      return
    }

    // Handle stair placement (requires two clicks on different floors)
    if (selectedTool === "stair") {
      if (!stairStart) {
        // First click: set stair start position with current floor
        setStairStart({ x, y, floor })
      } else {
        // Second click: validate it's not the same floor and create stair
        if (stairStart.floor === floor) {
          alert("Stairs cannot start and end on the same floor! Please select a position on a different floor.")
          return
        }
        
        // Create stair directly - we have all the information we need
        const id = `stair-${Date.now()}`
        addElement({
          id,
          type: "stair",
          floor: stairStart.floor,
          x: stairStart.x,
          y: stairStart.y,
          endFloor: floor,
          endX: x,
          endY: y,
        })
        
        // Clear stair placement state
        setStairStart(null)
      }
      return
    }

    // Handle other elements (single click)
    const id = `${selectedTool}-${Date.now()}`
    addElement({
      id,
      type: selectedTool,
      floor,
      x,
      y,
    })
  }

  const handlePoleEndFloorSelect = (endFloor: number) => {
    if (!polePosition) return

    // Create single pole element with ending floor information
    const id = `pole-${Date.now()}`
    addElement({
      id,
      type: "pole",
      floor,
      x: polePosition.x,
      y: polePosition.y,
      endFloor,
    })

    setShowPoleEndFloorDialog(false)
    setPolePosition(null)
  }

  const cancelPolePlacement = () => {
    setShowPoleEndFloorDialog(false)
    setPolePosition(null)
  }

  const getCellContent = (x: number, y: number) => {
    // Check if this position has a stair start on a different floor
    const isStairStartOnOtherFloor = stairStart && stairStart.x === x && stairStart.y === y && stairStart.floor !== floor
    
    if (isStairStartOnOtherFloor) {
      return `🪜F${stairStart.floor + 1}`
    }

    // Check for walls that span through this position (for visual display)
    const wallOnThisPosition = elements.find(el => 
      el.type === "wall" && 
      el.floor === floor &&
      (
        // Horizontal wall: same Y, X between start and end
        (el.y === y && el.endWallY === y && 
         x >= Math.min(el.x, el.endWallX || el.x) && 
         x <= Math.max(el.x, el.endWallX || el.x)) ||
        // Vertical wall: same X, Y between start and end
        (el.x === x && el.endWallX === x && 
         y >= Math.min(el.y, el.endWallY || el.y) && 
         y <= Math.max(el.y, el.endWallY || el.y))
      )
    )
    
    if (wallOnThisPosition) {
      return "🧱"
    }

    // Check for poles that span through this floor (for visual display)
    const poleOnThisPosition = elements.find(el => 
      el.type === "pole" && 
      el.x === x && 
      el.y === y && 
      el.floor <= floor && 
      (el.endFloor || el.floor) >= floor
    )
    
    if (poleOnThisPosition) {
      return `🏛️${poleOnThisPosition.endFloor ? poleOnThisPosition.endFloor + 1 : poleOnThisPosition.floor + 1}`
    }

    const element = getElementAt(x, y)
    if (!element) return null

    switch (element.type) {
      case "stair":
        // Show different symbols for start and end of stairs
        const isStairStart = element.x === x && element.y === y && element.floor === floor
        const isStairEnd = element.endX === x && element.endY === y && element.endFloor === floor
        
        if (isStairStart) {
          return `🪜↗${element.endFloor !== undefined ? element.endFloor + 1 : ''}`
        } else if (isStairEnd) {
          return `🪜↙${element.floor + 1}`
        }
        return "🪜"
      case "pole":
        // Handled above for visual spanning
        return `🏛️${element.endFloor ? element.endFloor + 1 : element.floor + 1}`
      case "wall":
        return "🧱"
      case "flag":
        return "🚩"
      case "player":
        return element.playerType || "P"
      default:
        return null
    }
  }

  const getCellClass = (x: number, y: number, isHeader = false, headerType?: 'corner' | 'column' | 'row') => {
    if (isHeader) {
      return cn(
        "border-r border-b border-border text-xs flex items-center justify-center font-medium transition-colors",
        {
          "bg-muted text-muted-foreground": headerType === 'corner',
          "bg-muted/50 text-muted-foreground": headerType === 'column' || headerType === 'row',
        }
      )
    }

    const isWallStartSelected = wallStart && wallStart.x === x && wallStart.y === y
    const isStairStartSelected = stairStart && stairStart.x === x && stairStart.y === y && stairStart.floor === floor
    const isStairStartOnOtherFloor = stairStart && stairStart.x === x && stairStart.y === y && stairStart.floor !== floor
    const hasElement = getElementAt(x, y)
    const inaccessible = isInaccessible(x, y)

    return cn(
      "border-r border-b border-border text-xs flex items-center justify-center cursor-pointer transition-colors",
      {
        "bg-destructive/40": inaccessible,
        "bg-card hover:bg-accent/20": !inaccessible && !hasElement && !isStairStartOnOtherFloor,
        "bg-primary text-primary-foreground": hasElement,
        "bg-secondary text-secondary-foreground": isWallStartSelected || isStairStartSelected,
        "bg-orange-200 border-2 border-orange-400 text-orange-800": isStairStartOnOtherFloor,
        "hover:bg-accent/40": !inaccessible && !isStairStartOnOtherFloor,
      },
    )
  }

  const renderCell = (x: number, y: number, isHeader = false, headerType?: 'corner' | 'column' | 'row', content?: string | number) => {
    const cellProps = {
      className: getCellClass(x, y, isHeader, headerType),
      style: { width: "2rem", height: "2rem" },
    }

    if (isHeader) {
      return (
        <div {...cellProps}>
          {content}
        </div>
      )
    }

    return (
      <div
        {...cellProps}
        onClick={() => handleCellClick(x, y)}
        title={`Row ${y + 1}, Column ${x + 1} (${x}, ${y})`}
      >
        {getCellContent(x, y)}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Floor {floor + 1}</h3>
        <div className="flex items-center gap-4">
          {stairStart && selectedTool === "stair" && (
            <div className="text-sm text-primary bg-primary/10 px-2 py-1 rounded">
              Stair Start: Floor {stairStart.floor + 1} → Row {stairStart.y + 1}, Col {stairStart.x + 1}
            </div>
          )}
          {(wallStart || stairStart || showPoleEndFloorDialog) && (
            <button
              onClick={() => {
                clearAllPlacements()
              }}
              className="text-sm text-muted hover:text-foreground"
            >
              Cancel placement
            </button>
          )}
        </div>
      </div>

      <div className="w-full pb-2 overflow-auto rounded-lg">
        <div className="min-w-fit">
          {/* Column headers */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_WIDTH + 1}, 2rem)`,
              gap: "0",
            }}
          >
            {/* Corner cell */}
            {renderCell(-1, -1, true, 'corner', '#')}
            
            {/* Column number headers */}
            {Array.from({ length: GRID_WIDTH }, (_, x) => 
              renderCell(x, -1, true, 'column', x + 1)
            )}
          </div>
          
          {/* Grid rows with row numbers */}
          {Array.from({ length: GRID_HEIGHT }, (_, y) => (
            <div
              key={`row-${y}`}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${GRID_WIDTH + 1}, 2rem)`,
                gap: "0",
              }}
            >
              {/* Row number header */}
              {renderCell(-1, y, true, 'row', y + 1)}
              
              {/* Grid cells */}
              {Array.from({ length: GRID_WIDTH }, (_, x) => 
                renderCell(x, y)
              )}
            </div>
          ))}
        </div>
      </div>

      {showPoleEndFloorDialog && polePosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">Select Pole Ending Floor</h3>
            <p className="text-sm text-muted">
              Position: Row {polePosition.y + 1}, Column {polePosition.x + 1} on Floor {floor + 1}
            </p>
            <p className="text-sm text-muted">Choose ending floor (must be above current floor):</p>
            <div className="flex gap-2">
              {getAvailableEndFloors(floor).map((endFloor) => (
                <button
                  key={endFloor}
                  onClick={() => handlePoleEndFloorSelect(endFloor)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Floor {endFloor + 1}
                </button>
              ))}
            </div>
            <button
              onClick={cancelPolePlacement}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="text-xs text-muted space-y-1">
        <p>• Click on cells to place selected elements</p>
        <p>• Click on existing elements to remove them</p>
        <p>• Red areas are inaccessible regions</p>
        {selectedTool === "wall" && <p>• Click two points to create a wall (horizontal/vertical only)</p>}
        {selectedTool === "stair" && !stairStart && <p>• Click to place stair starting position</p>}
        {selectedTool === "stair" && stairStart && <p>• Click on a different floor to place stair ending position</p>}
        {selectedTool === "pole" && <p>• Click to place pole, then select height</p>}
      </div>
    </div>
  )
}
