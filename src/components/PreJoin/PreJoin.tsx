import { useRef, useEffect, useState } from 'react'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import DeviceSelector from '../DeviceSelector/DeviceSelector'
import Flex from '@cobalt/react-flex'
import Spinner from '@cobalt/react-spinner'
import Box from '@cobalt/react-box'
import Grid, { Column } from '@cobalt/react-grid'
import { VideoPlaceholder } from '../VideoPlaceholder/VideoPlaceholder'
import styles from './PreJoin.module.scss'
import { Heading } from '@cobalt/react-typography'
import Button from '@cobalt/react-button'
import PrejoinRight from '@/assets/images/prejoin-right.png'
import talkdeskLogo from '@/assets/images/talkdesk-logo.png'
import { useTheme } from '@cobalt/react-theme-provider'
import { MEDIA_DEVICES_MAP } from '@/utils/constant'
import logger from '@/utils/logger'
import { useViewport } from '@cobalt/react-viewport-provider'
import Icon from '@cobalt/react-icon'
import { VideoContainer } from '../VideoContainer/VideoContainer'
import { RTCMediaDevice } from 'infobip-rtc'

interface Props {
  onClickJoin: ({
    isAudioEnabled,
    isVideoEnabled
  }: {
    isAudioEnabled: boolean
    isVideoEnabled: boolean
  }) => Promise<void>
  isLoadingJoin: boolean
  mode: string
  roomName: string
}

const PreJoin = (props: Props) => {
  const { onClickJoin, isLoadingJoin, mode, roomName } = props
  const audioRef = useRef<MediaStream | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)

  const [isVideoEnabled, setVideoEnabled] = useState(false)
  const [isAudioEnabled, setAudioEnabled] = useState(true)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { basic800 } = useTheme()
  const viewport = useViewport()

  const microphone = useMediaDevices('audioinput')
  const camera = useMediaDevices('videoinput')
  const speaker = useMediaDevices('audiooutput')

  useEffect(() => {
    if (audioElementRef.current && audioRef.current) {
      audioElementRef.current.srcObject = audioRef.current
    }
  }, [audioRef.current])

  const toggleVideo = async () => {
    if (isVideoEnabled && stream) {
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      stream.getVideoTracks().forEach((track) => track.stop())
      setStream(null)
      setVideoEnabled(false)
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: camera.selectedDeviceId ? { deviceId: { exact: camera.selectedDeviceId } } : true
        })
        setStream(newStream)
        if (videoRef.current) {
          videoRef.current.srcObject = newStream
        }
        setVideoEnabled(true)
      } catch (error) {
        console.error('Unable to access the selected video device:', error)
      }
    }
  }

  const toggleAudio = async () => {
    if (audioStream) {
      const audioTrack = audioStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setAudioEnabled(audioTrack.enabled)
      }
    } else {
      try {
        const newAudioStream = await RTCMediaDevice.getAudioMediaStream(microphone.selectedDeviceId)
        setAudioStream(newAudioStream)
        setAudioEnabled(true)
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = newAudioStream
        }
      } catch (error) {
        console.error('Unable to access the selected Audio device:', error)
        setStream(null)
      }
    }
  }

  useEffect(() => {
    if (camera.selectedDeviceId && mode === 'video') {
      // Attempt to get the video stream when a camera is selected or changed.
      const getMediaStream = async () => {
        try {
          const newVideoStream = await RTCMediaDevice.getVideoMediaStream(camera.selectedDeviceId)
          setStream(newVideoStream)
          setVideoEnabled(true)
          if (videoRef.current) {
            videoRef.current.srcObject = newVideoStream
          }
        } catch (error) {
          console.error('Unable to access the selected video device:', error)
          setStream(null)
        }
      }

      getMediaStream()
    }

    // Clean up the stream when the camera changes or the component unmounts.
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [camera.selectedDeviceId])

  useEffect(() => {
    if (microphone.selectedDeviceId) {
      // Attempt to get the video stream when a camera is selected or changed.
      const getMediaStream = async () => {
        try {
          const newAudioStream = await RTCMediaDevice.getAudioMediaStream(microphone.selectedDeviceId)
          setAudioStream(newAudioStream)
          setAudioEnabled(true)
          if (audioElementRef.current) {
            audioElementRef.current.srcObject = newAudioStream
          }
        } catch (error) {
          console.error('Unable to access the selected Audio device:', error)
          setStream(null)
        }
      }

      getMediaStream()
    }

    // Clean up the stream when the camera changes or the component unmounts.
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [microphone.selectedDeviceId])

  const handleOnClick = async () => {
    logger.info('Join now clicked')
    const videoTracks = stream?.getVideoTracks()

    videoTracks?.forEach((track) => {
      track.stop()
    })
    onClickJoin({ isAudioEnabled, isVideoEnabled })
  }

  return (
    <Flex direction='column' className={styles.wrapper}>
      <Box padding='12' style={{ display: viewport === 'small' ? 'none' : 'block' }}>
        <img src={talkdeskLogo} className={styles.logo} />
      </Box>
      <Grid height='100%' columns='12' padding='12' gap='2' width='100%'>
        <Column length={['12', '8', '8']}>
          <Flex gap='4' direction='column' width='100%'>
            <Box className={styles.videoPreview} width='100%' backgroundColor={basic800}>
              <VideoContainer stream={stream} hasAudio={isAudioEnabled} />
              <audio ref={audioElementRef} autoPlay />
              {/* <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }}></video>
              {!stream && <VideoPlaceholder />} */}
              <div className={styles.deviceSwitch}>
                {mode === 'video' && (
                  <Button type='mono-dark' onClick={toggleVideo}>
                    <Icon name={isVideoEnabled ? 'videocam' : 'videocam_off'} size='tiny' color='#fff' />
                  </Button>
                )}
                <Button type='mono-dark' onClick={toggleAudio}>
                  <Icon name={isAudioEnabled ? 'mic' : 'mic_off'} size='tiny' color='#fff' />
                </Button>
              </div>
            </Box>
            <Grid columns={mode === 'video' ? '20' : '13'} gap={['1', '2', '2']} style={{ width: '100%' }}>
              <Column length='7'>
                <DeviceSelector
                  type={MEDIA_DEVICES_MAP.AUDIOINPUT}
                  devices={microphone.devices}
                  selectedDeviceId={microphone.selectedDeviceId}
                  onDeviceIdChange={(deviceId) => {
                    microphone.setSelectedDeviceId(deviceId)
                  }}
                />
              </Column>
              <Column length='6'>
                <DeviceSelector
                  type={MEDIA_DEVICES_MAP.AUDIOOUTPUT}
                  devices={speaker.devices}
                  selectedDeviceId={speaker.selectedDeviceId}
                  onDeviceIdChange={speaker.setSelectedDeviceId}
                />
              </Column>
              <Column length='7' style={{ display: mode === 'video' ? 'block' : 'none' }}>
                <DeviceSelector
                  type={MEDIA_DEVICES_MAP.VIDEOINPUT}
                  devices={camera.devices}
                  selectedDeviceId={camera.selectedDeviceId}
                  onDeviceIdChange={(deviceId) => {
                    camera.setSelectedDeviceId(deviceId)
                  }}
                />
              </Column>
            </Grid>
          </Flex>
        </Column>
        <Column length={['12', '4', '4']}>
          <Flex direction='column' alignX='center' alignY='center' height='100%' className={styles.PrejoinRight}>
            <img
              src={PrejoinRight}
              alt='placeholder'
              style={{ maxWidth: '200px', display: viewport === 'small' ? 'none' : 'block' }}
            />
            <Heading level='2' className={styles.PrejoinRighHead}>
              Ready to join?
            </Heading>
            <Button type='primary' disabled={isLoadingJoin} className={styles.PrejoinNow} onClick={handleOnClick}>
              {isLoadingJoin && <Spinner size='micro' style={{ marginRight: 4 }} />}
              Join now
            </Button>
          </Flex>
        </Column>
      </Grid>
    </Flex>
  )
}

export default PreJoin
