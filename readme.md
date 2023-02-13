# react-native-telestrator

[![npm](https://img.shields.io/npm/v/react-native-telestrator.svg)](https://www.npmjs.com/package/react-native-telestrator)

Video telestrator that allows for playback, canvas drawings, and screenshots.

![Example Screenshot](assets/example-screenshot.png)

## Installation

Install the library using yarn:

`yarn add react-native-telestrator`

Or npm:

`npm install --save react-native-telestrator`

## Usage

React Native Telestrator uses `expo-av` for video playback. Simply pass an `AVPlaybackSource` object to the `Telestrator` component.

See the [expo-av documentation](https://docs.expo.dev/versions/latest/sdk/av/) for more information.

```typescript
import { Telestrator } from 'react-native-telestrator'

const videoSource: AVPlaybackSource = { uri: require('../assets/example.mp4') }

export default function App() {
  return <Telestrator videoSource={videoSource} />
}
```

## Splitscreen

React Native Telestrator supports playback and drawing of two videos side by side. To use just pass `splitscreenVideoSource` as a prop.

`<Telestrator videoSource={videoSource} splitscreenVideoSource={splitscreenVideoSource}/>`
