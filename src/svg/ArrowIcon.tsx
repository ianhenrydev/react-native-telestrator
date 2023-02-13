import * as React from 'react'
import Svg, { Defs, Line, Marker, Polygon, SvgProps } from 'react-native-svg'
import { ColorFontInactive } from '../styles'

export default function ArrowIcon(props: SvgProps) {
  const color = props.color || ColorFontInactive
  return (
    <Svg height={32} width={32}>
      <Defs>
        <Marker id="arrowhead" markerWidth={10} markerHeight={7} refX={0} refY={3.5} orient="auto">
          <Polygon points="0 0, 10 3.5, 0 7" fill={color} />
        </Marker>
      </Defs>
      <Line x1={3} y1={29} x2={29} y2={3} stroke={color} strokeWidth={2} markerEnd={'url(#arrowhead)'} />
    </Svg>
  )
}
