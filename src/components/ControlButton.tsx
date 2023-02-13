import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface ControlButtonProps {
  onPress(): void
  text: string
}

export default function ControlButton(props: ControlButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    backgroundColor: '#212121',
    borderRadius: 5,
    alignContent: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 26
  }
})
