"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMazeStore } from "@/stores/maze-store"

export function FloorSelector() {
  const { currentFloor, setCurrentFloor } = useMazeStore()
  
  const floors = [
    { id: 0, name: "Floor 1", description: "Players start here" },
    { id: 1, name: "Floor 2", description: "Middle level" },
    { id: 2, name: "Floor 3", description: "Top level" },
  ]

  return (
    <div className="flex space-x-2">
      {floors.map((floor) => (
        <Button
          key={floor.id}
          variant={currentFloor === floor.id ? "default" : "outline"}
          className={cn("flex-1", currentFloor === floor.id && "bg-primary text-primary-foreground")}
          onClick={() => setCurrentFloor(floor.id)}
        >
          <div className="text-center">
            <div className="font-medium">{floor.name}</div>
            <div className="text-xs opacity-70">{floor.description}</div>
          </div>
        </Button>
      ))}
    </div>
  )
}
