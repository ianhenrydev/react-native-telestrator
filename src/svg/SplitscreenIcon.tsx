import * as React from 'react'
import Svg, { Line, Rect, SvgProps, Text } from 'react-native-svg'

export default function SplitscreenIcon(props: SvgProps) {
  const color = props.color || '#fff'
  const height = 26
  const width = 32
  return (
    <Svg height={height} width={width}>
      <Rect x={0} y={0} width={width} height={height} stroke={color} strokeWidth={2} fillOpacity={0} />
      <Line x1={width / 2} y1={0} x2={width / 2} y2={height} stroke={color} strokeWidth={1} />
      <Text fill={color} fontSize="8" x={6} y={16}>
        A
      </Text>
      <Text fill={color} fontSize="8" x={21} y={16}>
        B
      </Text>
    </Svg>
  )
}
