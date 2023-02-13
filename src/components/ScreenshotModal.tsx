import * as VideoThumbnails from 'expo-video-thumbnails'
import React, { useMemo, useRef } from 'react'
import { Image, Modal, SafeAreaView, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { captureRef } from 'react-native-view-shot'
import { IDrawing, IPosition, ITheme } from '../types'
import SvgDrawings from './canvas/SvgDrawings'

export interface IScreenshotInfo {
  thumbnail: VideoThumbnails.VideoThumbnailsResult
  canvasSize: { height: number; width: number }
  drawings: IDrawing[]
}

export interface IScreenshotModalInfo {
  main: IScreenshotInfo
  splitscreen?: IScreenshotInfo | null
  resizeMode: 'contain' | 'cover'
  flexDirection: 'column' | 'row'
}

interface IProps {
  info?: IScreenshotModalInfo
  onClose(): void
  position: IPosition | null
  theme: ITheme
}

export default function ScreenshotModal(props: IProps) {
  const { info, onClose, position, theme } = props
  const screenshotRef = useRef<View>(null)

  const onShare = async () => {
    try {
      const uri = await captureRef(screenshotRef, {
        result: 'tmpfile',
        quality: 1,
        format: 'png',
      })
      await Share.share({
        url: uri,
      })
    } catch (err) {}
  }

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        backgroundColor: theme.colors.background,
        width: '100%',
        flex: 1,
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        width: 64,
      },
      buttonText: {
        marginTop: 8,
      },
    })
  }, [theme])

  return (
    <Modal visible={!!info} animationType="fade" supportedOrientations={['landscape', 'portrait']} statusBarTranslucent>
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={styles.container}>
            <View style={{ padding: 16 }}>
              <View style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 22 }}>New Screenshot</Text>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: 32, width: 32 }} onPress={onClose}>
                  <Image style={{ tintColor: theme.colors.text, height: 24, width: 24 }} source={require('../../assets/x.png')} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={styles.button} onPress={onShare}>
                    <Image style={{ tintColor: theme.colors.text }} source={require('../../assets/share.png')} />
                    <Text style={[styles.buttonText]}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              <View style={{ borderColor: theme.dark ? '#fff' : '#000' }}>
                <View ref={screenshotRef} style={{ flexDirection: info?.flexDirection, backgroundColor: theme.colors.background }}>
                  {!!info?.main && !!position && (
                    <View style={{ height: info.main.canvasSize.height, width: info.main.canvasSize.width }}>
                      <Image style={{ height: '100%', width: '100%' }} source={{ uri: info.main.thumbnail.uri }} resizeMode={info.resizeMode} />
                      <View style={{ height: '100%', width: '100%', position: 'absolute' }}>
                        <SvgDrawings drawings={info.main.drawings} position={info.main.canvasSize} />
                      </View>
                    </View>
                  )}
                  {!!info?.splitscreen && !!position && (
                    <View style={{ height: info.splitscreen.canvasSize.height, width: info.splitscreen.canvasSize.width }}>
                      <Image style={{ height: '100%', width: '100%' }} source={{ uri: info.splitscreen.thumbnail.uri }} resizeMode={info.resizeMode} />
                      <View style={{ height: '100%', width: '100%', position: 'absolute' }}>
                        <SvgDrawings drawings={info.splitscreen.drawings} position={info.splitscreen.canvasSize} />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  )
}
