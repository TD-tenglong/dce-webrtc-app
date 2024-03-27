import { RoomCallContext } from '@/store/RoomCallContext'
import logger from '@/utils/logger'
import { CallsApiEvent, CallsApiEvents, CallsEventHandlers } from 'infobip-rtc'
import { useContext, useState, useEffect, useRef, MutableRefObject } from 'react'

interface Props {
  audioRef: MutableRefObject<MediaStream | null>
  setIsLeavingCall: (isLeavingCall: boolean) => void
}

const useLocalEvents = (props: Props) => {
  const { audioRef } = props
  const localStreamRef = useRef<MediaStream | null>(null)
  const localScreenShareRef = useRef<MediaStream | null>(null)

  const [hasLocalCamera, setHasLocalCamera] = useState(false)
  const [hasLocalAudio, setHasLocalAudio] = useState(false)
  const [hasLeftRoom, setHasLeftRoom] = useState(false)
  const [hasLocalScreenShare, setHasLocalScreenShare] = useState(false)

  const roomCall = useContext(RoomCallContext)

  useEffect(() => {
    if (!roomCall) return

    const onRoomJoined: CallsEventHandlers.RoomJoined = (event: CallsApiEvents.RoomJoinedEvent) => {
      logger.info('Room joined')
      audioRef.current = event.stream
      const currentMuteStatus = roomCall?.muted()
      setHasLocalAudio(!currentMuteStatus)
      setHasLeftRoom(false)
    }

    const onRoomLeft: CallsEventHandlers.RoomLeft = (event: CallsApiEvents.RoomLeftEvent) => {
      logger.info('Room left', event.errorCode.name, event.errorCode.description)
      setHasLeftRoom(true)
    }

    const onRoomRejoined: CallsEventHandlers.RoomRejoined = () => {
      logger.info('Room re-joined')
    }

    const onCameraVideoAdded: CallsEventHandlers.CameraVideoAdded = (event: CallsApiEvents.CameraVideoAddedEvent) => {
      logger.info('Local user added local camera video')
      localStreamRef.current = event.stream
      setHasLocalCamera(true)
    }

    const onCameraVideoRemoved: CallsEventHandlers.CameraVideoRemoved = () => {
      logger.info('Local user Removed local camera video')

      localStreamRef.current = null
      setHasLocalCamera(false)
    }

    const onScreenShareAdded: CallsEventHandlers.ScreenShareAdded = (event: CallsApiEvents.ScreenShareAddedEvent) => {
      logger.info('Local user added local screen share')
      localScreenShareRef.current = event.stream
    }

    const onScreenShareRemoved: CallsEventHandlers.ScreenShareRemoved = () => {
      logger.info('Local user removed local screen share')
      localScreenShareRef.current = null
      setHasLocalScreenShare(false)
    }

    roomCall.on(CallsApiEvent.ROOM_JOINED, onRoomJoined)
    roomCall.on(CallsApiEvent.ROOM_LEFT, onRoomLeft)
    roomCall.on(CallsApiEvent.ROOM_REJOINED, onRoomRejoined)
    roomCall.on(CallsApiEvent.CAMERA_VIDEO_ADDED, onCameraVideoAdded)
    roomCall.on(CallsApiEvent.CAMERA_VIDEO_REMOVED, onCameraVideoRemoved)
    roomCall.on(CallsApiEvent.SCREEN_SHARE_ADDED, onScreenShareAdded)
    roomCall.on(CallsApiEvent.SCREEN_SHARE_REMOVED, onScreenShareRemoved)

    return () => {}
  }, [roomCall])

  const toggleCamera = async () => {
    await roomCall?.cameraVideo(!hasLocalCamera)
  }

  const toggleMute = async () => {
    const currentMuteStatus = roomCall?.muted()
    await roomCall?.mute(!currentMuteStatus)
    setHasLocalAudio(currentMuteStatus!)
  }

  const toggleLocalShareScreen = async () => {
    await roomCall?.screenShare(!hasLocalScreenShare)
    setHasLocalScreenShare(roomCall?.hasScreenShare()!)
  }

  const onClickLeave = () => {
    logger.info('Leaving the call')
    roomCall?.leave()
  }

  return {
    localStream: localStreamRef.current,
    screenShareStream: roomCall?.hasScreenShare() ? localScreenShareRef.current : null,
    hasLocalCamera,
    hasLocalAudio,
    toggleCamera,
    toggleMute,
    toggleLocalShareScreen,
    onClickLeave,
    hasLeftRoom,
    hasLocalScreenShare
  }
}

export default useLocalEvents
