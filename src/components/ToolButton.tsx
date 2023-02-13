import React, { useMemo } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import AngleExteriorIcon from '../svg/AngleExteriorIcon'
import AngleIcon from '../svg/AngleIcon'
import ArrowIcon from '../svg/ArrowIcon'
import CircleIcon from '../svg/CircleIcon'
import LineIcon from '../svg/LineIcon'
import RectangleIcon from '../svg/RectangleIcon'
import { DrawTool, ITheme } from '../types'

interface IProps {
  onPress(tool: DrawTool): void
  selected?: boolean
  theme: ITheme
  tool: DrawTool
}

export default function ToolButton(props: IProps) {
  const { onPress, selected, theme, tool } = props

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        width: 48,
        marginVertical: 2,
      },
      selected: {
        backgroundColor: theme.colors.primary,
      },
    })
  }, [theme])

  const onPressTool = () => onPress(tool)

  const renderIcon = () => {
    const color = selected ? '#fff' : theme.colors.text
    switch (tool) {
      case DrawTool.AngleInterior:
        return <AngleIcon color={color} />
      case DrawTool.AngleExterior:
        return <AngleExteriorIcon color={color} />
      case DrawTool.Arrow:
        return <ArrowIcon color={color} />
      case DrawTool.Circle:
        return <CircleIcon color={color} />
      case DrawTool.Line:
        return <LineIcon color={color} />
      case DrawTool.Pencil:
        return <Image style={{ tintColor: color }} source={require('../../assets/pencil.png')} />
      case DrawTool.Rectangle:
        return <RectangleIcon color={color} />
    }
  }

  return (
    <TouchableOpacity style={[styles.container, selected && styles.selected]} onPress={onPressTool}>
      {renderIcon()}
    </TouchableOpacity>
  )
}
