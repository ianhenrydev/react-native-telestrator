import { AVPlaybackSource, ResizeMode, VideoReadyForDisplayEvent } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import * as VideoThumbnails from 'expo-video-thumbnails'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Image, LayoutChangeEvent, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { defaultTheme } from '../styles'
import BackIcon from '../svg/BackIcon'
import SinglescreenIcon from '../svg/SinglescreenIcon'
import SplitscreenIcon from '../svg/SplitscreenIcon'
import TrashIcon from '../svg/TrashIcon'
import { DrawTool, IDrawing, IPosition, ISizeProps, ITheme } from '../types'
import { contain } from '../utils'
import Canvas from './canvas/Canvas'
import ColorModal from './ColorModal'
import DrawToolModal from './DrawToolModal'
import ScreenshotModal, { IScreenshotInfo, IScreenshotModalInfo } from './ScreenshotModal'
import ToolButton from './ToolButton'
import VideoPlayer from './VideoPlayer'

interface IProps {
  onBack?(): void
  theme?: ITheme
  splitscreenVideoSource?: AVPlaybackSource
  videoSource?: AVPlaybackSource
}

const headerHeight = 64
const scrubberHeight = 64
const footerHeight = 0
const leftPanelWidth = 0
const rightPanelWidth = 0

export function Telestrator(props: IProps) {
  const theme = props.theme || defaultTheme
  const [showColorModal, setShowColorModal] = useState(false)
  const [showDrawToolModal, setShowDrawToolModal] = useState(false)
  const [color, setColor] = useState('red')
  const [videoSource, setVideoSource] = useState<AVPlaybackSource>()
  const [splitscreenVideoSource, setSplitscreenVideoSource] = useState<AVPlaybackSource>()
  const [tool, setTool] = useState(DrawTool.Pencil)
  const [screenshotModalInfo, setScreenshotModalInfo] = useState<IScreenshotModalInfo>()
  const [drawings, setDrawings] = useState<IDrawing[]>([])
  const [splitscreenDrawing, setSplitscreenDrawings] = useState<IDrawing[]>([])
  const [time, setTime] = useState(0)
  const [splitscreenTime, setSplitscreenTime] = useState(0)
  const [resizeMode, setResizeMode] = useState(ResizeMode.CONTAIN)
  const [screenSize, setScreenSize] = useState<ISizeProps>()
  const [videoSize, setVideoSize] = useState<ISizeProps>()
  const [splitscreenSize, setSplitscreenSize] = useState<ISizeProps>()

  const mainVideoRef = useRef<any>(null)
  const splitscreenVideoRef = useRef<any>(null)

  useEffect(() => {
    if (videoSource != props.videoSource) {
      setVideoSource(props.videoSource)
    }
  }, [props.videoSource])

  useEffect(() => {
    if (splitscreenVideoSource != props.splitscreenVideoSource) {
      setSplitscreenVideoSource(props.splitscreenVideoSource)
    }
  }, [props.splitscreenVideoSource])

  const position: IPosition | null = useMemo(() => {
    if (!screenSize) {
      return null
    }
    const splitscreen = !!splitscreenVideoSource
    const landscape = screenSize.width > screenSize.height
    let height = screenSize.height - headerHeight - scrubberHeight
    let width = screenSize.width

    if (splitscreen) {
      if (landscape) {
        width = width / 2
      } else {
        height = (height - scrubberHeight) / 2
      }
    }

    return { height, width, landscape, splitscreen }
  }, [splitscreenVideoSource, screenSize])

  const flexDirection = useMemo(() => {
    if (!screenSize) {
      return null
    }
    return screenSize?.width > screenSize?.height ? 'row' : 'column'
  }, [screenSize])

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        backgroundColor: theme.colors.background,
        height: '100%',
        width: '100%',
        padding: 0,
      },
      main: {
        flex: 1,
        height: '100%',
      },
      leftPanel: {
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        height: '100%',
        paddingTop: 8,
        width: leftPanelWidth,
        marginTop: 28,
      },
      rightPanel: {
        alignItems: 'center',
        height: '100%',
        paddingTop: 8,
        width: rightPanelWidth,
      },
      header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.card,
        height: headerHeight,
        flexDirection: 'row',
        width: '100%',
        borderColor: theme.colors.border,
        borderStyle: 'solid',
        borderBottomWidth: 1,
      },
      footer: {
        backgroundColor: theme.colors.card,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: footerHeight,
        width: '100%',
      },
      video: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
      },
      frameButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 42,
        width: 42,
        margin: 4,
        borderRadius: 4,
      },
      row: {
        flexDirection: 'row',
        flex: 1,
      },
      drawToolsContainer: {
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        width: 48,
        borderRadius: 8,
        padding: 4,
        marginBottom: 8,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
      },
      toolsButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.card,
        width: 48,
        height: 48,
        borderRadius: 8,
        padding: 4,
        marginBottom: 8,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
      },
      topButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        width: 48,
        marginHorizontal: 2,
      },
    })
  }, [theme])

  const onChooseColor = (value: string) => {
    setShowColorModal(false)
    setColor(value)
  }

  const onOpenDrawToolModal = () => setShowDrawToolModal(true)

  const onPressTool = (value: DrawTool) => {
    setTool(value)
    setShowDrawToolModal(false)
  }

  const toggleResizeMode = () => setResizeMode(resizeMode === ResizeMode.CONTAIN ? ResizeMode.COVER : ResizeMode.CONTAIN)

  const onGenerateThumbnails = async () => {
    try {
      let videoUri = ''
      if (!!(videoSource as any)?.uri) {
        videoUri = (videoSource as any).uri
      }
      const thumbnail = await VideoThumbnails.getThumbnailAsync(videoUri, { time })
      let splitscreen: IScreenshotInfo | null = null
      if (!!splitscreenVideoSource && !!splitscreenCanvasSize) {
        let splitscreenUri = ''
        if (!!(splitscreenVideoSource as any)?.uri) {
          splitscreenUri = (splitscreenVideoSource as any).uri
        }
        const splitscreenThumbnail = await VideoThumbnails.getThumbnailAsync(splitscreenUri, { time: splitscreenTime })
        splitscreen = { thumbnail: splitscreenThumbnail, canvasSize: splitscreenCanvasSize, drawings: splitscreenDrawing }
      }
      if (!!canvasSize && !!flexDirection) {
        setScreenshotModalInfo({
          main: { thumbnail, canvasSize, drawings },
          splitscreen,
          resizeMode: resizeMode === ResizeMode.CONTAIN ? 'contain' : 'cover',
          flexDirection,
        })
      }
    } catch (e) {
      console.warn(e)
    }
  }

  const onAddDrawing = (drawing: IDrawing) => setDrawings((prevDrawings) => [...prevDrawings, drawing])

  const onAddSplitscreenDrawing = (drawing: IDrawing) => setSplitscreenDrawings((prevDrawings) => [...prevDrawings, drawing])

  const onTimeChange = useCallback((newTime: number) => setTime(newTime), [])

  const onSplitscreenTimeChange = useCallback((newTime: number) => setSplitscreenTime(newTime), [])

  const onRemoveDrawing = () => setDrawings((prevDrawings) => [...prevDrawings.slice(0, prevDrawings.length - 1)])

  const onRemoveSplitscreenDrawing = () => setSplitscreenDrawings((prevDrawings) => [...prevDrawings.slice(0, prevDrawings.length - 1)])

  const onRemoveAllDrawings = () => setDrawings([])

  const onRemoveAllSplitscreenDrawings = () => setSplitscreenDrawings([])

  const onChooseVideo = async () => {
    if (!!splitscreenVideoSource) {
      setSplitscreenVideoSource(undefined)
    } else {
      const result: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        exif: true,
      })
      if (!result?.cancelled && !!result?.uri) {
        setSplitscreenVideoSource({ uri: result.uri })
      }
    }
    setDrawings([])
    setSplitscreenDrawings([])
  }

  const onNext = () => {
    mainVideoRef?.current?.goToNextFrame()
    splitscreenVideoRef?.current?.goToNextFrame()
  }

  const onPrev = () => {
    mainVideoRef?.current?.goToPrevFrame()
    splitscreenVideoRef?.current?.goToPrevFrame()
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout
    setScreenSize({ height, width })
  }

  const onReadyForDisplay = (event: VideoReadyForDisplayEvent) => setVideoSize(event.naturalSize)

  const onSplitscreenReadyForDisplay = (event: VideoReadyForDisplayEvent) => setSplitscreenSize(event.naturalSize)

  const canvasSize = useMemo(() => {
    if (!position || !videoSize) {
      return null
    }

    const { height, width } = resizeMode === ResizeMode.CONTAIN ? contain(videoSize, position) : position
    const top = position.height > height ? (position.height - height) / 2 : 0
    return { height, width, top }
  }, [position, videoSize, resizeMode])

  const splitscreenCanvasSize = useMemo(() => {
    if (!videoSize || !position || !splitscreenSize) {
      return null
    }

    const { height, width } = resizeMode === ResizeMode.CONTAIN ? contain(videoSize, position) : position
    const top = position.height > height ? (position.height - height) / 2 : 0
    return { height, width, top }
  }, [position, splitscreenSize, resizeMode])

  useEffect(() => {
    setDrawings([])
    setSplitscreenDrawings([])
  }, [flexDirection])

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} onLayout={onLayout}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row' }}>
            {!!props?.onBack && (
              <TouchableOpacity style={{ alignItems: 'center', height: 48, width: 48, justifyContent: 'center' }} onPress={props.onBack}>
                <BackIcon />
              </TouchableOpacity>
            )}
            <View style={styles.topButton}>
              <TouchableOpacity onPress={() => setShowColorModal(true)}>
                <View style={{ backgroundColor: color, height: 32, width: 32, borderRadius: 8 }} />
              </TouchableOpacity>
            </View>
            <ToolButton theme={theme} tool={tool} onPress={onOpenDrawToolModal} />
            <View style={styles.topButton}>
              <TouchableOpacity onPress={onRemoveDrawing} onLongPress={onRemoveAllDrawings} disabled={!drawings?.length}>
                <TrashIcon color={theme.colors.text} text="A" />
              </TouchableOpacity>
            </View>
            {!!splitscreenVideoSource && (
              <View style={styles.topButton}>
                <TouchableOpacity onPress={onRemoveSplitscreenDrawing} onLongPress={onRemoveAllSplitscreenDrawings} disabled={!splitscreenDrawing?.length}>
                  <TrashIcon color={theme.colors.text} text="B" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.topButton} onPress={onGenerateThumbnails}>
              <Image source={require('../../assets/screenshot.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topButton} onPress={onChooseVideo}>
              {!!splitscreenVideoSource ? <SinglescreenIcon /> : <SplitscreenIcon />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.topButton} onPress={toggleResizeMode}>
              <Image source={resizeMode === ResizeMode.CONTAIN ? require('../../assets/fullscreen.png') : require('../../assets/contain.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.main}>
            <View style={styles.video}>
              {!!position && flexDirection && (
                <View style={{ flexDirection }}>
                  <View style={{ height: position.height + scrubberHeight, width: position.width }}>
                    <VideoPlayer
                      onReadyForDisplay={onReadyForDisplay}
                      onTimeChange={onTimeChange}
                      position={position}
                      ref={mainVideoRef}
                      resizeMode={resizeMode}
                      source={videoSource}
                      theme={theme}
                    />
                    {canvasSize && <Canvas color={color} drawings={drawings} onAdd={onAddDrawing} position={canvasSize} tool={tool} top={canvasSize.top} />}
                  </View>
                  {!!splitscreenVideoSource && (
                    <View style={{ height: position.height + scrubberHeight, width: position.width }}>
                      <VideoPlayer
                        theme={theme}
                        onReadyForDisplay={onSplitscreenReadyForDisplay}
                        onTimeChange={onSplitscreenTimeChange}
                        position={position}
                        ref={splitscreenVideoRef}
                        resizeMode={resizeMode}
                        source={splitscreenVideoSource}
                      />
                      {splitscreenCanvasSize && (
                        <Canvas
                          color={color}
                          drawings={splitscreenDrawing}
                          onAdd={onAddSplitscreenDrawing}
                          position={splitscreenCanvasSize}
                          tool={tool}
                          top={splitscreenCanvasSize.top}
                        />
                      )}
                    </View>
                  )}
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: (position.height - scrubberHeight) / 2,
                      backgroundColor: theme.colors.card,
                      height: 64,
                      width: 64,
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                    }}
                  >
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }} onPress={onPrev}>
                      <Image source={require('../../assets/minus.png')} />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: (position.height - scrubberHeight) / 2,
                      backgroundColor: theme.colors.card,
                      height: 64,
                      width: 64,
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                    }}
                  >
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }} onPress={onNext}>
                      <Image source={require('../../assets/plus.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            <View style={styles.footer}></View>
          </View>
          <View style={styles.rightPanel}></View>
        </View>
        <ColorModal theme={theme} visible={showColorModal} onChooseColor={onChooseColor} />
        <DrawToolModal theme={theme} visible={showDrawToolModal} onChooseTool={onPressTool} />
        <ScreenshotModal theme={theme} info={screenshotModalInfo} onClose={() => setScreenshotModalInfo(undefined)} position={position} />
        <StatusBar hidden />
      </View>
    </SafeAreaView>
  )
}
