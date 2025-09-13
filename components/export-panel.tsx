"use client"

import { MazeElement } from '@/lib/types'
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportPanelProps {
  elements: MazeElement[]
}

export function ExportPanel({ elements }: ExportPanelProps) {
  const generateStairsFile = () => {
    const stairs = elements.filter((el) => el.type === "stair")
    return stairs
      .map(
        (stair) =>
          `${stair.floor},${stair.x},${stair.y},${stair.endFloor || stair.floor},${stair.endX || stair.x},${stair.endY || stair.y}`,
      )
      .join("\n")
  }

  const generatePolesFile = () => {
    const poles = elements.filter((el) => el.type === "pole")
    return poles.map((pole) => `${pole.floor},${pole.floor + 1},${pole.x},${pole.y}`).join("\n")
  }

  const generateWallsFile = () => {
    const walls = elements.filter((el) => el.type === "wall")
    return walls
      .map((wall) => `${wall.floor},${wall.x},${wall.y},${wall.endWallX || wall.x},${wall.endWallY || wall.y}`)
      .join("\n")
  }

  const generateFlagFile = () => {
    const flag = elements.find((el) => el.type === "flag")
    return flag ? `${flag.floor},${flag.x},${flag.y}` : ""
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    downloadFile(generateStairsFile(), "stairs.txt")
    downloadFile(generatePolesFile(), "poles.txt")
    downloadFile(generateWallsFile(), "walls.txt")
    downloadFile(generateFlagFile(), "flag.txt")
  }

  const getElementCounts = () => {
    const counts = {
      stairs: elements.filter((el) => el.type === "stair").length,
      poles: elements.filter((el) => el.type === "pole").length,
      walls: elements.filter((el) => el.type === "wall").length,
      flags: elements.filter((el) => el.type === "flag").length,
    }
    return counts
  }

  const counts = getElementCounts()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-sidebar-foreground">Export Configuration</h3>

      <div className="space-y-3">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Stairs:</span>
            <span className="font-medium">{counts.stairs}</span>
          </div>
          <div className="flex justify-between">
            <span>Poles:</span>
            <span className="font-medium">{counts.poles}</span>
          </div>
          <div className="flex justify-between">
            <span>Walls:</span>
            <span className="font-medium">{counts.walls}</span>
          </div>
          <div className="flex justify-between">
            <span>Flags:</span>
            <span className="font-medium">{counts.flags}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => downloadFile(generateStairsFile(), "stairs.txt")}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Download className="w-4 h-4 mr-2" />
            stairs.txt
          </Button>

          <Button
            onClick={() => downloadFile(generatePolesFile(), "poles.txt")}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Download className="w-4 h-4 mr-2" />
            poles.txt
          </Button>

          <Button
            onClick={() => downloadFile(generateWallsFile(), "walls.txt")}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Download className="w-4 h-4 mr-2" />
            walls.txt
          </Button>

          <Button
            onClick={() => downloadFile(generateFlagFile(), "flag.txt")}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Download className="w-4 h-4 mr-2" />
            flag.txt
          </Button>
        </div>

        <Button
          onClick={downloadAll}
          className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Download All Files
        </Button>
      </div>

      <div className="text-xs text-muted space-y-1">
        <p>
          <strong>File Formats:</strong>
        </p>
        <p>• Stairs: floor,x,y,end_floor,end_x,end_y</p>
        <p>• Poles: start_floor,end_floor,x,y</p>
        <p>• Walls: floor,start_x,start_y,end_x,end_y</p>
        <p>• Flag: floor,x,y</p>
      </div>
    </div>
  )
}
