import React, { useMemo } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ITheme } from '../types'

interface IProps {
  onChooseColor(color: string): void
  theme: ITheme
  visible: boolean
}

const colorOptions = ['red', 'blue', 'green', 'orange', 'yellow', 'pink']

export default function ColorModal(props: IProps) {
  const { onChooseColor, theme, visible } = props

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        backgroundColor: theme.colors.card,
        width: 400,
        height: 110,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 8,
      },
      color: {
        height: 48,
        width: 48,
        borderRadius: 4,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
      },
      modal: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
      },
    })
  }, [theme])

  return (
    <Modal visible={visible} transparent={true} supportedOrientations={['landscape', 'portrait']}>
      <View style={styles.modal}>
        <View style={styles.container}>
          <Text style={{ margin: 8, fontSize: 20, color: theme.colors.text }}>Select Draw Color</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {colorOptions.map((x) => (
              <TouchableOpacity key={x} style={[styles.color, { backgroundColor: x }]} onPress={() => onChooseColor(x)} />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}
