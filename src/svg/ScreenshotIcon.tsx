import * as React from 'react'
import { View } from 'react-native'
import Svg, { Rect, SvgProps } from 'react-native-svg'

export default function ScreenshotIcon(props: SvgProps) {
  const color = props.color || '#fff'
  const height = props.height || 24
  const width = props.width || 24
  return (
    <View style={{ height, width }}>
      <Svg height={height} width={width}>
        <Rect x={0} y={0} width={width} height={height} stroke={color} strokeWidth={1} strokeDasharray={[2]} />
      </Svg>
    </View>
  )
}
