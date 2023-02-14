import { AVPlaybackSource } from 'expo-av'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { IPoint, ISizeProps } from './types'

export async function selectVideoFromGallery() {
  const result = await launchImageLibraryAsync({
    mediaTypes: MediaTypeOptions.Videos,
    quality: 1,
    exif: true,
  })
  if (!!result?.assets?.length) {
    const asset = result.assets[0]
    const videoSource: AVPlaybackSource = { uri: asset.uri }
    return videoSource
  }
  return undefined
}

export function findAngle(P2: IPoint, middle: IPoint, P3: IPoint, exterior?: boolean) {
  const radians = Math.atan2(P3.y - middle.y, P3.x - middle.x) - Math.atan2(P2.y - middle.y, P2.x - middle.x)
  const degrees = Math.abs(Math.round(radians * (180 / Math.PI)))
  const alt = 360 - degrees
  const smallest = degrees < alt ? degrees : alt
  return exterior ? 180 - smallest : smallest
}

export function contain({ width: imageWidth, height: imageHeight }: ISizeProps, { width: areaWidth, height: areaHeight }: ISizeProps) {
  const imageRatio = imageWidth / imageHeight
  const areaRatio = areaWidth / areaHeight

  if (imageRatio >= areaRatio) {
    return { width: areaWidth, height: areaWidth / imageRatio }
  } else {
    return { width: areaHeight * imageRatio, height: areaHeight }
  }
}

export function cover({ width: imageWidth, height: imageHeight }: ISizeProps, { width: areaWidth, height: areaHeight }: ISizeProps) {
  const imageRatio = imageWidth / imageHeight
  const areaRatio = areaWidth / areaHeight

  if (areaRatio > imageRatio) {
    return { width: areaWidth, height: areaWidth / imageRatio }
  } else {
    return { width: areaHeight * imageRatio, height: areaHeight }
  }
}
