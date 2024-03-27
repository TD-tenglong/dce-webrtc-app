import VideoPlaceholder from '../VideoPlaceholder'
import { useEffect, useRef } from 'react'
import classes from './VideoContainer.module.scss'
import Icon from '@cobalt/react-icon'

interface Props {
  isAudioEnabled?: boolean
  isVideoEnabled?: boolean
  toggleCamera?: () => void
  toggleAudio?: () => void
  showSwitchButton?: boolean
  stream: MediaStream | null
  hasAudio?: boolean
  label?: string
}

export const VideoContainer = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const { stream, hasAudio, label, toggleCamera, toggleAudio, isAudioEnabled, isVideoEnabled, showSwitchButton } = props

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream, videoRef.current])

  return (
    <div className={classes.videoContainer}>
      <video ref={videoRef} autoPlay playsInline />
      <VideoPlaceholder opacity={stream ? 0 : 1} />
      {showSwitchButton && (
        <div className={classes.deviceSwitch}>
          <div className={classes.switchButton} onClick={toggleCamera}>
            <Icon name={isVideoEnabled ? 'videocam_off' : 'videocam'} size='tiny' color='#fff' />
          </div>
          <div className={classes.switchButton} onClick={toggleAudio}>
            <Icon name={hasAudio ? 'mic' : 'mic_off'} size='tiny' color='#fff' />
          </div>
        </div>
      )}
      {label && (
        <div className={classes.overlay}>
          <Icon name={hasAudio ? 'mic' : 'mic_off'} size='tiny' color='#fff' />
          {label && <span>{label}</span>}
        </div>
      )}
    </div>
  )
}
