import { useState, useEffect } from 'react'

interface Props {
  audioDeviceId: string
  speakerDeviceId: string
  videoDeviceId: string
}

const useMediaStream = (props: Props) => {
  const { audioDeviceId, videoDeviceId } = props

  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)

  const getAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: audioDeviceId } })
      setAudioStream(stream)
    } catch (error) {
      console.error('Unable to access the audio device:', error)
      setAudioStream(null)
    }
  }

  const getVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDeviceId } })
      setVideoStream(stream)
    } catch (error) {
      console.error('Unable to access the video device:', error)
      setVideoStream(null)
    }
  }

  useEffect(() => {
    getAudioStream()
    getVideoStream()

    return () => {
      audioStream?.getTracks().forEach((track) => track.stop())
      videoStream?.getTracks().forEach((track) => track.stop())
    }
  }, [audioDeviceId, videoDeviceId])

  const toggleAudio = () => {
    if (audioStream) {
      const audioTrack = audioStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        if (!audioTrack.enabled) {
          setAudioStream(null)
        } else {
          getAudioStream()
        }
      }
    } else {
      getAudioStream()
    }
  }

  const toggleVideo = () => {
    if (videoStream) {
      const videoTrack = videoStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        if (!videoTrack.enabled) {
          setVideoStream(null)
        } else {
          getVideoStream()
        }
      }
    } else {
      getVideoStream()
    }
  }

  return { audioStream, videoStream, toggleAudio, toggleVideo }
}

export default useMediaStream
