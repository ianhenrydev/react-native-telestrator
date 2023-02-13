import { useEffect, useRef } from 'react'
import { IPoint, ISizeProps } from './types'

export const useDidUpdate = (callback: any, dependencies: any) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) {
      callback()
    } else {
      didMount.current = true
    }
  }, [callback, dependencies])
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
