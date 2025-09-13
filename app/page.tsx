"use client"

import { MazeGrid } from "@/components/maze-grid"
import { ElementPalette } from "@/components/element-palette"
import { FloorSelector } from "@/components/floor-selector"
import { Card } from "@/components/ui/card"

export default function MazeConfigTool() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-card-foreground">Maze Configuration Tool</h1>
          <p className="text-muted text-sm mt-1">Design your 3-floor maze game with stairs, poles, walls, and flags</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Combined Elements and Export Panel */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-sidebar border-sidebar-border">
              <ElementPalette />
            </Card>
          </div>

          {/* Main Grid Area */}
          <div className="lg:col-span-3 min-w-0">
            <div className="space-y-4">
              <FloorSelector />
              <Card className="p-4 overflow-hidden">
                <MazeGrid />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
