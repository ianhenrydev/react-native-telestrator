import * as React from 'react'
import Svg, { Circle, SvgProps } from 'react-native-svg'
import { ColorFontInactive } from '../styles'

export default function CircleIcon(props: SvgProps) {
  const color = props.color || ColorFontInactive
  return (
    <Svg height={32} width={32}>
      <Circle cx={16} cy={16} r={14} stroke={color} strokeWidth={2} />
    </Svg>
  )
}
