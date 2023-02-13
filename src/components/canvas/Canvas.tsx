import React, { useState } from 'react'
import { GestureResponderEvent, View } from 'react-native'
import { DrawTool, IDrawing, IPoint } from '../../types'
import GestureRecorder from './GestureRecorder'
import SvgDrawings from './SvgDrawings'

interface ICanvasProps {
  color: string
  drawings: IDrawing[]
  onAdd(drawing: IDrawing): void
  position: { height: number; width: number }
  tool: DrawTool
  top?: number
}

export default function Canvas(props: ICanvasProps) {
  const { color, drawings, position, tool, onAdd, top } = props
  const [currentDrawing, setCurrentDrawing] = useState<IDrawing>()

  const isStartEndTool = tool === DrawTool.Rectangle || tool === DrawTool.Circle || tool === DrawTool.Line || tool === DrawTool.Arrow

  const onMove = (points: IPoint[]) => {
    const updatedDrawing = updatePoints(points)
    if (!!updatedDrawing) {
      setCurrentDrawing(updatedDrawing)
    }
  }

  const onRelease = (points: IPoint[]) => {
    const updatedDrawing = updatePoints(points)
    if (!!updatedDrawing) {
      onAdd(updatedDrawing)
      setCurrentDrawing(undefined)
    }
  }

  function updatePoints(points: IPoint[]) {
    let updatedDrawing: IDrawing | null = null
    if (isStartEndTool) {
      if (points?.length > 1) {
        updatedDrawing = { tool, color, points: [points[0], points[points.length - 1]] }
      } else {
        updatedDrawing = { tool, color, points: [...points] }
      }
    } else if (tool === DrawTool.Pencil) {
      updatedDrawing = { tool, color, points: [...points] }
    }
    return updatedDrawing
  }

  const onPressSvg = (event: GestureResponderEvent) => {
    if (tool === DrawTool.AngleInterior || tool === DrawTool.AngleExterior) {
      const point = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY }
      const points = [...(currentDrawing?.points || []), point]
      if (points.length === 3) {
        onAdd({ tool, color, points })
        setCurrentDrawing(undefined)
      } else {
        setCurrentDrawing({ tool, color, points })
      }
    }
  }

  return (
    <View style={{ position: 'absolute', height: position.height, width: position.width, top: top || 0 }} onTouchStart={onPressSvg}>
      <View style={{ position: 'relative', overflow: 'hidden', height: position.height, width: position.width }}>
        <View style={{ height: position.height, width: position.width }}>
          <SvgDrawings currentDrawing={currentDrawing} drawings={drawings} position={position} />
          <GestureRecorder key={`${color}-${tool}`} height={position.height} width={position.width} onMove={onMove} onRelease={onRelease} />
        </View>
      </View>
    </View>
  )
}
