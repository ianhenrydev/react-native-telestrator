import * as React from 'react'
import Svg, { Rect, SvgProps, Text } from 'react-native-svg'

export default function SinglescreenIcon(props: SvgProps) {
  const color = props.color || '#fff'
  const height = 26
  const width = 32
  return (
    <Svg height={height} width={width}>
      <Rect x={0} y={0} width={width} height={height} stroke={color} strokeWidth={2} fillOpacity={0} />
      <Text fill={color} fontSize="8" x={13} y={16}>
        A
      </Text>
    </Svg>
  )
}
