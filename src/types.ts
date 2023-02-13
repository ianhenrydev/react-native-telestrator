export interface ITheme {
  dark: boolean
  colors: {
    primary: string
    background: string
    card: string
    text: string
    border: string
    notification: string
  }
}

export interface IVideoResult {
  duration: number
  height: number
  uri: string
  width: number
}

export enum DrawTool {
  Pencil = 'pencil',
  Line = 'line',
  Circle = 'circle',
  Rectangle = 'rectangle',
  AngleInterior = 'angleInterior',
  AngleExterior = 'angleExterior',
  Arrow = 'arrow',
}

export interface IDrawing {
  tool: DrawTool
  points: IPoint[]
  color: string
}

export interface ISizeProps {
  height: number
  width: number
}

export interface IPoint {
  x: number
  y: number
}

export interface IPosition {
  height: number
  width: number
  landscape: boolean
  splitscreen: boolean
}
