import * as React from 'react'
import Svg, { Rect, SvgProps } from 'react-native-svg'
import { ColorFontInactive } from '../styles'

export default function RectangleIcon(props: SvgProps) {
  const color = props.color || ColorFontInactive
  return (
    <Svg height={32} width={32}>
      <Rect x={3} y={6} width={26} height={20} stroke={color} strokeWidth={2} />
    </Svg>
  )
}
