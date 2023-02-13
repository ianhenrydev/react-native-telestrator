import * as React from 'react'
import Svg, { Circle, Line, Marker, SvgProps, Text } from 'react-native-svg'
import { ColorFontInactive } from '../styles'

export default function AngleExteriorIcon(props: SvgProps) {
  const color = props.color || ColorFontInactive
  return (
    <Svg height={32} width={32}>
      <Marker id="circleMarker" markerWidth={2} markerHeight={2} refX={1} refY={1} orient="auto">
        <Circle cx={1} cy={1} r={1} fill={'context-stroke'} />
      </Marker>
      <Line x1={3} y1={29} x2={24} y2={8} stroke={color} strokeWidth={2} marker="url(#circleMarker)" />
      <Line x1={3} y1={29} x2={3} y2={3} stroke={color} strokeWidth={2} marker="url(#circleMarker)" />
      <Text stroke={color} fill={color} fontSize="10" x={18} y={28}>
        x°
      </Text>
    </Svg>
  )
}
