import React, { useMemo } from 'react'
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AngleExteriorIcon from '../svg/AngleExteriorIcon'
import AngleIcon from '../svg/AngleIcon'
import ArrowIcon from '../svg/ArrowIcon'
import CircleIcon from '../svg/CircleIcon'
import LineIcon from '../svg/LineIcon'
import RectangleIcon from '../svg/RectangleIcon'
import { DrawTool, ITheme } from '../types'

interface IProps {
  onChooseTool(tool: DrawTool): void
  theme: ITheme
  visible: boolean
}

export default function DrawToolModal(props: IProps) {
  const { onChooseTool, theme, visible } = props

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        backgroundColor: theme.colors.card,
        maxWidth: 400,
        width: '100%',
        maxHeight: 250,
        height: '100%',
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 8,
      },
      modal: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
      },
      tool: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 48,
        marginLeft: 12,
      },
      toolText: {
        color: theme.colors.text,
        marginLeft: 8,
        fontSize: 16,
      },
    })
  }, [theme])

  return (
    <Modal visible={visible} transparent={true} supportedOrientations={['landscape', 'portrait']}>
      <View style={styles.modal}>
        <View style={styles.container}>
          <Text style={{ margin: 8, fontSize: 20, color: theme.colors.text }}>Select Draw Tool</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.tool} onPress={() => onChooseTool(DrawTool.Pencil)}>
                <Image source={require('../../assets/pencil.png')} />
                <Text style={styles.toolText}>Pencil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tool} onPress={() => onChooseTool(DrawTool.Rectangle)}>
                <RectangleIcon />
                <Text style={styles.toolText}>Rectangle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tool} onPress={() => onChooseTool(DrawTool.Line)}>
                <LineIcon />
                <Text style={styles.toolText}>Line</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tool} onPress={() => onChooseTool(DrawTool.Arrow)}>
                <ArrowIcon />
                <Text style={styles.toolText}>Arrow</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.tool} onPress={() => onChooseTool(DrawTool.Circle)}>
                <CircleIcon />
                <Text style={styles.toolText}>Circle</Text>
              </TouchableOpacity>
              {true && (
                <TouchableOpacity style={styles.tool} onPress={() => onChooseTool(DrawTool.AngleInterior)}>
                  <AngleIcon />
                  <Text style={styles.toolText}>Interior Angle</Text>
                </TouchableOpacity>
              )}
              {true && (
                <TouchableOpacity style={styles.tool} onPress={() => onChooseTool(DrawTool.AngleExterior)}>
                  <AngleExteriorIcon />
                  <Text style={styles.toolText}>Exterior Angle</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
