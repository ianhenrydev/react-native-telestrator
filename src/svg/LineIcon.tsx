import * as React from 'react'
import Svg, { Line, SvgProps } from 'react-native-svg'
import { ColorFontInactive } from '../styles'

export default function LineIcon(props: SvgProps) {
  const color = props.color || ColorFontInactive
  return (
    <Svg height={32} width={32}>
      <Line x1={3} y1={29} x2={29} y2={3} stroke={color} strokeWidth={2} />
    </Svg>
  )
}
