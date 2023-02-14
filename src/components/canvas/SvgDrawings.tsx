import React from 'react'
import Svg, { Circle, Defs, Line, Marker, Path, Polygon, Polyline, Rect, Text } from 'react-native-svg'
import { DrawTool, IDrawing } from '../../types'
import { findAngle } from '../../utils'

interface ISvgDrawingsProps {
  currentDrawing?: IDrawing
  drawings: IDrawing[]
  position: { height: number; width: number }
}

interface IDrawingProps {
  drawing: IDrawing
}

const CircleDrawing = (props: IDrawingProps) => {
  const { drawing } = props
  const start = drawing.points[0]
  const end = drawing.points.length > 1 ? drawing.points[1] : drawing.points[0]
  const xDiff = Math.abs(start.x - end.x)
  const yDiff = Math.abs(start.y - end.y)
  const r = xDiff + yDiff
  return <Circle cx={start.x} cy={start.y} r={r} stroke={drawing.color} strokeWidth="2" fillOpacity={0} />
}

const RectangleDrawing = (props: IDrawingProps) => {
  const { drawing } = props
  const start = drawing.points[0]
  const end = drawing.points.length > 1 ? drawing.points[1] : drawing.points[0]
  const width = end.x - start.x
  const height = end.y - start.y
  return <Rect x={start.x} y={start.y} height={height} width={width} stroke={drawing.color} strokeWidth="2" fillOpacity={0} />
}

const LineDrawing = (props: IDrawingProps) => {
  const { drawing } = props
  const { color } = drawing
  const start = drawing.points[0]
  const end = drawing.points.length > 1 ? drawing.points[1] : drawing.points[0]
  return <Line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={color} strokeWidth="2" />
}

const ArrowDrawing = (props: IDrawingProps) => {
  const { drawing } = props
  const { color } = drawing
  const start = drawing.points[0]
  const end = drawing.points.length > 1 ? drawing.points[1] : drawing.points[0]
  return <Line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={color} strokeWidth="2" markerEnd="url(#arrowhead)" />
}

interface IAngleDrawingProps extends IDrawingProps {
  exterior?: boolean
}

const AngleDrawing = (props: IAngleDrawingProps) => {
  const { exterior, drawing } = props
  const { color, points } = drawing
  if (points.length === 1) {
    return <Circle cx={points[0].x} cy={points[0].y} r={4} fill={color} />
  } else if (points.length === 2) {
    return (
      <Path d={`M${points[0].x} ${points[0].y} L${points[1].x} ${points[1].y}`} stroke={color} strokeWidth="2" marker="url(#circleMarker)" fillOpacity={0} />
    )
  } else if (points.length === 3) {
    const angle = findAngle(points[0], points[1], points[2], exterior)
    const above = points[1].y > points[2].y
    return (
      <>
        <Text stroke={color} fill={color} fontSize="24" x={points[1].x} y={!above ? points[1].y - 5 : points[1].y + 24}>{`${angle}°`}</Text>
        <Path
          d={`M${points[0].x} ${points[0].y} L${points[1].x} ${points[1].y} L${points[2].x} ${points[2].y}`}
          stroke={color}
          strokeWidth="2"
          marker="url(#circleMarker)"
          fillOpacity={0}
        />
      </>
    )
  }
  return null
}

const PencilDrawing = (props: IDrawingProps) => {
  const { drawing } = props
  const points = drawing.points.map((p) => `${p.x},${p.y}`).join(' ')
  return <Polyline points={points} fill="none" stroke={drawing.color} strokeWidth="2" />
}

export default function SvgDrawings(props: ISvgDrawingsProps) {
  const { currentDrawing, drawings, position } = props

  const renderDrawing = (drawing: IDrawing, key: string) => {
    switch (drawing.tool) {
      case DrawTool.Circle:
        return <CircleDrawing key={key} drawing={drawing} />
      case DrawTool.Rectangle:
        return <RectangleDrawing key={key} drawing={drawing} />
      case DrawTool.Line:
        return <LineDrawing key={key} drawing={drawing} />
      case DrawTool.Arrow:
        return <ArrowDrawing key={key} drawing={drawing} />
      case DrawTool.AngleInterior:
        return <AngleDrawing key={key} drawing={drawing} />
      case DrawTool.AngleExterior:
        return <AngleDrawing key={key} drawing={drawing} exterior={true} />
      case DrawTool.Pencil:
        return <PencilDrawing key={key} drawing={drawing} />
    }
  }

  return (
    <Svg height="100%" width="100%" viewBox={`0 0 ${position.width} ${position.height}`}>
      <Defs>
        <Marker id="arrowhead" markerWidth={10} markerHeight={7} refX={0} refY={3.5} orient="auto">
          <Polygon points="0 0, 10 3.5, 0 7" fill={'context-stroke'} />
        </Marker>
        <Marker id="circleMarker" markerWidth={4} markerHeight={4} refX={2} refY={2} orient="auto">
          <Circle cx={2} cy={2} r={2} fill={'context-stroke'} />
        </Marker>
      </Defs>
      {currentDrawing && renderDrawing(currentDrawing, 'currentDrawing')}
      {drawings.map((drawing, i) => {
        return renderDrawing(drawing, `drawing-${i}`)
      })}
    </Svg>
  )
}
