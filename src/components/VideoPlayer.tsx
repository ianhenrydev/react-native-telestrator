import Slider from '@react-native-community/slider'
import { AVPlaybackSource, AVPlaybackStatus, ResizeMode, Video, VideoReadyForDisplayEvent } from 'expo-av'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { IPosition, ITheme } from '../types'

interface IProps {
  onReadyForDisplay(event: VideoReadyForDisplayEvent): void
  onTimeChange?(time: number): void
  position: IPosition
  resizeMode: ResizeMode
  source?: AVPlaybackSource
  theme: ITheme
}

const VideoPlayer = forwardRef((props: IProps, ref) => {
  const { resizeMode, position, source, onReadyForDisplay, theme } = props
  const videoRef = useRef<Video>(null)
  const [isSeeking, setIsSeeking] = useState(false)
  const [status, setStatus] = useState<AVPlaybackStatus>()
  const [speed, setSpeed] = useState(1)
  const [duration, setDuration] = useState(0)

  useImperativeHandle(ref, () => ({
    goToNextFrame() {
      onNext()
    },
    goToPrevFrame() {
      onPrev()
    },
  }))

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        borderColor: theme.colors.border,
        borderStyle: 'solid',
        position: 'relative',
        overflow: 'hidden',
      },
      overlay: {
        position: 'absolute',
        backgroundColor: '#000',
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 42,
        width: 60,
      },
      scrubberContainer: {
        backgroundColor: theme.colors.card,
        paddingHorizontal: 8,
        width: '100%',
        height: 64,
      },
      playContainer: {
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        height: '100%',
      },
      circleButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 54,
        width: 54,
        backgroundColor: theme.colors.card,
        borderRadius: 32,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
      },
      squareButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        width: 48,
        borderRadius: 12,
      },
      row: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      },
    })
  }, [theme])

  const onTimeChange = (value: number) => {
    if (!!videoRef?.current && !isSeeking) {
      setIsSeeking(true)
      videoRef.current
        .setPositionAsync(value, { toleranceMillisBefore: 25, toleranceMillisAfter: 25 })
        .then(() => {
          setIsSeeking(false)
        })
        .catch((error) => {
          console.warn(error)
          setIsSeeking(false)
        })
    }
  }

  const onPlay = () => {
    isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync()
  }

  const onPlaybackStatusUpdate = (value: AVPlaybackStatus) => {
    if (!!value?.isLoaded && !!value?.positionMillis && !value.isPlaying) {
      props.onTimeChange?.(value.positionMillis)
    }
    setStatus(value)
  }

  const isPlaying = useMemo(() => {
    if (!!status?.isLoaded) {
      return status.isPlaying
    }
    return false
  }, [status])

  const time = useMemo(() => {
    if (!!status?.isLoaded) {
      return status.positionMillis
    }
    return 0
  }, [status])

  const onLoad = (status: AVPlaybackStatus) => {
    if (!!status?.isLoaded && !!status?.durationMillis) {
      setDuration(status.durationMillis)
    }
  }

  const onSpeed = () => {
    if (speed === 1) {
      setSpeed(0.5)
    } else if (speed === 0.5) {
      setSpeed(0.25)
    } else if (speed === 0.25) {
      setSpeed(1)
    }
  }

  useEffect(() => {
    videoRef?.current?.setRateAsync(speed, false)
  }, [speed])

  const onPrev = () => {
    const newTime = time - 30
    if (newTime > 0) {
      onTimeChange(newTime)
    }
  }

  const onNext = () => {
    const newTime = time + 30
    if (newTime < duration) {
      onTimeChange(newTime)
    }
  }

  return (
    <View style={[styles.container, { height: '100%', width: '100%' }]}>
      <View style={{ alignItems: 'center', justifyContent: 'center', height: position.height, width: position.width }}>
        <Video
          ref={videoRef}
          style={{ height: position.height, width: position.width }}
          source={source}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          isLooping
          progressUpdateIntervalMillis={30}
          onLoad={onLoad}
          isMuted
          resizeMode={resizeMode}
          onReadyForDisplay={onReadyForDisplay}
        />
      </View>
      <View style={styles.scrubberContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.circleButton} onPress={onPlay}>
            <Image
              style={{ tintColor: theme.colors.text, height: 24, width: 24 }}
              source={isPlaying ? require('../../assets/pause.png') : require('../../assets/play.png')}
            />
          </TouchableOpacity>
          <Slider
            style={{ height: 32, width: position.width - 64 - 16 - 64 }}
            minimumValue={0}
            maximumValue={Math.floor(duration)}
            minimumTrackTintColor={theme.colors.text}
            maximumTrackTintColor={theme.colors.border}
            step={30}
            value={time}
            onValueChange={onTimeChange}
          />
          <TouchableOpacity style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }} onPress={onSpeed}>
            <Text style={{ fontSize: 18, color: theme.colors.text }}>{`${speed}x`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
})

export default VideoPlayer
