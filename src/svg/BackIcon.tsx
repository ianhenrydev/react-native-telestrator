import * as React from 'react'
import Svg, { Line, SvgProps } from 'react-native-svg'
import { ColorFontInactive } from '../styles'

export default function BackIcon(props: SvgProps) {
  const color = props.color || ColorFontInactive
  const height = 18
  const width = 12
  return (
    <Svg height={height} width={width}>
      <Line x1={0} y1={height / 2} x2={width} y2={0} stroke={color} strokeWidth={2} markerEnd={'url(#arrowhead)'} />
      <Line x1={0} y1={height / 2} x2={width} y2={height} stroke={color} strokeWidth={2} markerEnd={'url(#arrowhead)'} />
    </Svg>
  )
}
