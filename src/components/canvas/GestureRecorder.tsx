import React, { useRef } from 'react'
import { PanResponder, View } from 'react-native'
import { IPoint, ISizeProps } from '../../types'

interface IGestureRecorderProps extends ISizeProps {
  onMove(points: IPoint[]): void
  onRelease(points: IPoint[]): void
}

export default function GestureRecorder(props: IGestureRecorderProps) {
  const { onMove, onRelease, height, width } = props
  const pointsRef = useRef<IPoint[]>([])

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pointsRef.current = []
      },
      onPanResponderMove: (event) => {
        pointsRef.current.push({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY,
        })
        onMove([...pointsRef.current])
      },
      onPanResponderRelease: (event) => {
        pointsRef.current.push({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY,
        })
        onRelease([...pointsRef.current])
      },
    })
  ).current

  return <View style={{ position: 'absolute', height, width }} {...panResponder.panHandlers} />
}
