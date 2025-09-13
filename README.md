# Maze to Savor - Configuration Tool

<div align="center">
  <img src="./images/logo.png" alt="Maze to Savor Logo" width="200" />
  
  **An interactive web-based configuration tool for creating custom maze layouts**
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
</div>

## 🎮 About

**Maze to Savor** is an exciting game that challenges players to navigate through complex multi-floor maze environments. This configuration tool allows game designers and enthusiasts to create custom maze layouts with various elements and export them for use in the game.

## ✨ Features

### 🏗️ Interactive Maze Builder
- **25x10 grid layout** with visual cell-by-cell editing
- **3-floor support** with easy floor navigation
- **Real-time preview** with intuitive drag-and-drop interface
- **1-indexed row/column headers** for precise positioning

### 🧩 Element Placement System
- **🪜 Stairs**: Connect different floors with two-click placement
- **🏛️ Poles**: Vertical structures spanning multiple floors
- **🧱 Walls**: Horizontal and vertical barriers with visual spanning
- **🚩 Flags**: Goal markers and checkpoints
- **👥 Players**: Starting positions for players A, B, and C

### 🎯 Advanced Features
- **Cross-floor visual feedback**: See stair starting positions across floors
- **Smart validation**: Prevents invalid placements and provides helpful error messages
- **Optimized storage**: Efficient element representation for clean exports
- **Inaccessible areas**: Pre-defined blocked regions per floor

### 📁 Export Functionality
Generate ready-to-use configuration files:
- **Stairs file**: Floor connections with start/end coordinates
- **Poles file**: Vertical elements with floor ranges
- **Walls file**: Barrier definitions with spanning coordinates
- **Flag file**: Goal position markers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gehirudm/maze-config-tool.git
   cd maze-config-tool
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎲 How to Use

### Creating Your First Maze

1. **Select a tool** from the element palette (stairs, poles, walls, or flags)
2. **Choose your floor** using the floor selector (1, 2, or 3)
3. **Click on grid cells** to place elements:
   - **Stairs**: First click sets start, second click on different floor sets end
   - **Poles**: Click to place, then select ending floor from dialog
   - **Walls**: First click sets start, second click sets end (same floor, horizontal/vertical only)
   - **Flags**: Single click placement

### Floor-Specific Layouts

- **Floor 1**: Rectangle blocked area in middle-right (rows 7-10, cols 9-17)
- **Floor 2**: Rectangle blocked area on left side (rows 1-7, cols 9-17)  
- **Floor 3**: Two rectangles on left and right sides

### Exporting Your Maze

1. Scroll down to the **Export Configuration** section
2. Click **Download** or **Copy** for any file type:
   - `stairs.txt` - Floor connections
   - `poles.txt` - Vertical structures  
   - `walls.txt` - Barrier definitions
   - `flag.txt` - Goal position

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for centralized state
- **UI Components**: Comprehensive shadcn/ui library
- **Build Tool**: pnpm for fast, efficient package management

## 📁 Project Structure

```
maze-config-tool/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── element-palette.tsx # Tool selection & export
│   ├── floor-selector.tsx  # Floor navigation
│   └── maze-grid.tsx      # Main grid interface
├── stores/                # Zustand state management
├── lib/                   # Utilities and types
├── images/                # Assets and logo
└── public/               # Static files
```

## 🎮 Game Integration

The exported configuration files are designed to integrate seamlessly with the **Maze to Savor** game engine. Each file follows a specific format:

- **Stairs**: `startFloor,startX,startY,endFloor,endX,endY`
- **Poles**: `startFloor,endFloor,x,y`
- **Walls**: `floor,startX,startY,endX,endY`
- **Flag**: `floor,x,y`

## 🤝 Contributing

We welcome contributions to improve the Maze to Savor configuration tool! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🔗 Links

- **Issues**: [Bug Reports & Feature Requests](https://github.com/gehirudm/maze-config-tool/issues)