import * as React from 'react'
import { Image, Text, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  text: string
}

export default function TrashIcon(props: Props) {
  const color: any = props.color || '#fff'
  return (
    <View style={{ height: 32, width: 32 }}>
      <Image style={{ tintColor: color }} source={require('../../assets/trash.png')} />
      <View style={{ backgroundColor: 'rgba(0,0,0,0.9)', position: 'absolute', bottom: -4, right: -2, paddingHorizontal: 2, borderRadius: 2 }}>
        <Text style={{ color: '#fff' }}>{props.text}</Text>
      </View>
    </View>
  )
}
