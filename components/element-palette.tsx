"use client"

import { ElementType } from '@/lib/types'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useMazeStore } from "@/stores/maze-store"

const tools: { type: ElementType; label: string; icon: string; description: string }[] = [
  { type: "stair", label: "Stairs", icon: "🪜", description: "Connect floors" },
  { type: "pole", label: "Poles", icon: "🏛️", description: "Vertical connections" },
  { type: "wall", label: "Walls", icon: "🧱", description: "Block movement" },
  { type: "flag", label: "Flag", icon: "🚩", description: "Goal position" },
]

export function ElementPalette() {
  const { selectedTool, setSelectedTool, elements } = useMazeStore()
  const [copiedFile, setCopiedFile] = useState<string | null>(null)

  // Export functionality
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
    return poles.map((pole) => `${pole.floor},${pole.endFloor || pole.floor + 1},${pole.x},${pole.y}`).join("\n")
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

  const copyToClipboard = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedFile(filename)
      setTimeout(() => setCopiedFile(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const FileContentBlock = ({ filename, content, description }: { filename: string, content: string, description: string }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{filename}</h4>
        <div className="flex gap-1">
          <Button
            onClick={() => copyToClipboard(content, filename)}
            variant="outline"
            size="sm"
            className="h-7 px-2"
          >
            {copiedFile === filename ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
          <Button
            onClick={() => downloadFile(content, filename)}
            variant="outline"
            size="sm"
            className="h-7 px-2"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-foreground mb-1">{description}</div>
      <pre className="bg-muted/20 border border-border rounded text-xs p-2 overflow-auto max-h-20 font-mono">
        <code>{content || '(empty)'}</code>
      </pre>
    </div>
  )

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
      <h3 className="text-lg font-semibold text-sidebar-foreground">Elements</h3>

      <div className="space-y-2">
        {tools.map((tool) => (
          <Button
            key={tool.type}
            variant={selectedTool === tool.type ? "default" : "outline"}
            className={cn(
              "w-full justify-start text-left h-auto p-3",
              selectedTool === tool.type && "bg-sidebar-primary text-sidebar-primary-foreground",
            )}
            onClick={() => setSelectedTool(selectedTool === tool.type ? null : tool.type)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{tool.icon}</span>
              <div>
                <div className="font-medium">{tool.label}</div>
                <div className="text-xs opacity-70">{tool.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>

      <div className="pt-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => setSelectedTool(null)}
          disabled={!selectedTool}
        >
          Clear Selection
        </Button>
      </div>

      <div className="text-xs text-muted space-y-1">
        <p>
          <strong>Players:</strong>
        </p>
        <p>• A: (10,9) on Floor 1</p>
        <p>• B: (7,13) on Floor 1</p>
        <p>• C: (10,17) on Floor 1</p>
      </div>

      {/* Export Configuration Section */}
      <Separator className="my-6" />
      
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

          <div className="space-y-4">
            <FileContentBlock
              filename="stairs.txt"
              content={generateStairsFile()}
              description="Format: floor,x,y,end_floor,end_x,end_y"
            />
            
            <FileContentBlock
              filename="poles.txt"
              content={generatePolesFile()}
              description="Format: start_floor,end_floor,x,y"
            />
            
            <FileContentBlock
              filename="walls.txt"
              content={generateWallsFile()}
              description="Format: floor,start_x,start_y,end_x,end_y"
            />
            
            <FileContentBlock
              filename="flag.txt"
              content={generateFlagFile()}
              description="Format: floor,x,y"
            />
          </div>

          <Button
            onClick={downloadAll}
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All Files
          </Button>
        </div>
      </div>
    </div>
  )
}
