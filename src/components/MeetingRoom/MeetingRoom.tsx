import useLocalEvents from '@/hooks/useLocalEvents'
import useRoomCallParticipants from '@/hooks/useParticipantsEvents'
import classes from './MeetingRoom.module.scss'
import { VideoContainer } from '../VideoContainer/VideoContainer'
import logger from '@/utils/logger'
import Button from '@cobalt/react-button'
import Icon from '@cobalt/react-icon'
import Flex from '@cobalt/react-flex'
import { Text } from '@cobalt/react-typography'
import ConfirmModal from '@/components/LeaveCallModal/LeaveCallModal'
import CallEndPage from '@/components/CallEndPage/CallEndPage'
import { useEffect, useRef, useState } from 'react'
import useDuration from '@/hooks/useDuration'
import { useTheme } from '@cobalt/react-theme-provider'

interface Props {
  onLeftRoom: () => void
  onRejoin?: ({
    isAudioEnabled,
    isVideoEnabled
  }: {
    isAudioEnabled?: boolean
    isVideoEnabled?: boolean
  }) => Promise<void>
  mode?: string
}

const MeetingRoom = (props: Props) => {
  const { onLeftRoom, onRejoin, mode } = props
  const audioRef = useRef<MediaStream | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const { participants, remoteScreenShareStream } = useRoomCallParticipants()
  const [showModal, setShowModal] = useState(false)
  const [isLeavingCall, setIsLeavingCall] = useState(false)
  const theme = useTheme()

  const {
    localStream,
    screenShareStream,
    hasLocalCamera,
    hasLocalAudio,
    toggleCamera,
    toggleMute,
    onClickLeave,
    hasLeftRoom,
    hasLocalScreenShare,
    toggleLocalShareScreen
  } = useLocalEvents({
    audioRef: audioRef,
    setIsLeavingCall: setIsLeavingCall
  })

  const sharedStream = screenShareStream || remoteScreenShareStream

  const { duration } = useDuration()

  const participantCount = participants.length + 1

  const getContainerStyle = () => {
    switch (participantCount) {
      case 0:
        return { gridTemplateColumns: '1fr' }
      case 1:
        return { gridTemplateColumns: '1fr 1fr' }
      default:
        return { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }
    }
  }

  useEffect(() => {
    if (audioElementRef.current && audioRef.current) {
      audioElementRef.current.srcObject = audioRef.current
    }
  }, [audioRef.current])

  useEffect(() => {
    if (hasLeftRoom) {
      setShowModal(false)
      onLeftRoom()
    }
  })

  const handleOnClickLeave = () => {
    setShowModal(true)
  }

  const handleOnRejoin = () => {
    onRejoin?.({ isAudioEnabled: hasLocalAudio, isVideoEnabled: hasLocalCamera })
  }

  const renderScreenShareLayout = () => {
    if (sharedStream) {
      return (
        <div className={classes.sharedWrap}>
          <div className={classes.sharedLayout}>
            <div className={classes.localParticipant}>
              <VideoContainer stream={localStream} hasAudio={hasLocalAudio} label='You' />
              <audio ref={audioElementRef} autoPlay />
            </div>
            {participants.map(({ identifier, stream, muted }) => (
              <div key={identifier} className={classes.remoteParticipant}>
                <VideoContainer stream={stream} hasAudio={!muted} label='Other' />
              </div>
            ))}
          </div>
          <div className={classes.screenShare}>
            <VideoContainer stream={sharedStream} />
          </div>
        </div>
      )
    }
  }

  return !hasLeftRoom ? (
    <div className={classes.meetingRoomContainer}>
      <div className={classes.header}>
        <Icon name='time' color={theme.gray700} size='micro' />
        <Text size='small'>{duration}</Text>
      </div>
      {sharedStream && renderScreenShareLayout()}
      {!sharedStream && (
        <div className={classes.gridLayout} style={getContainerStyle()}>
          <div className={classes.localParticipant}>
            <VideoContainer stream={localStream} hasAudio={hasLocalAudio} label='You' />
            <audio ref={audioElementRef} autoPlay />
          </div>
          {participants.map(({ identifier, stream, muted }) => (
            <div key={identifier} className={classes.remoteParticipant}>
              <VideoContainer stream={stream} hasAudio={!muted} label='Other' />
            </div>
          ))}
        </div>
      )}
      <Flex className={classes.controls} alignY='center' alignX='center'>
        <Button variation='transparent' size='medium' type='secondary' onClick={toggleMute}>
          <Icon name={hasLocalAudio ? 'mic' : 'mic_off'} size='small' />
          <Text size='small' className={classes.controlText} style={{ fontWeight: '400' }}>
            {hasLocalAudio ? 'Mute' : 'Unmute'}
          </Text>
        </Button>
        {mode === 'video' && (
          <Button variation='transparent' size='medium' type='secondary' onClick={toggleCamera}>
            <Icon name={hasLocalCamera ? 'videocam' : 'videocam_off'} size='small' />
            <Text size='small' className={classes.controlText} style={{ fontWeight: '400' }}>
              {hasLocalCamera ? 'Turn off video' : 'Start video'}
            </Text>
          </Button>
        )}
        <Button
          variation='transparent'
          size='medium'
          type='secondary'
          disabled={!!remoteScreenShareStream}
          onClick={toggleLocalShareScreen}
        >
          <Icon name='devices' size='small' />
          <Text className={classes.controlText} style={{ fontWeight: '400' }}>
            {screenShareStream ? 'Stop share' : 'Share screen'}
          </Text>
        </Button>
        <Button size='medium' type='danger' onClick={handleOnClickLeave} className={classes.leaveCallBtn}>
          <Flex gap='1' alignY='center'>
            <Icon name='call_end' />
            <Text className={classes.controlText} size='small'>
              Leave call
            </Text>
          </Flex>
        </Button>
      </Flex>
      {showModal && (
        <ConfirmModal
          icon='call_end'
          title='Leave call'
          message='Are you sure you want to leave the call?'
          onCancel={(): void => {
            setIsLeavingCall(false)
            setShowModal(false)
          }}
          onConfirm={onClickLeave}
          loading={isLeavingCall}
          visible={showModal}
          confirmText='Yes, leave it'
          confirmButtonType='danger'
        />
      )}
    </div>
  ) : (
    <CallEndPage onRejoin={handleOnRejoin} />
  )
}

export default MeetingRoom
