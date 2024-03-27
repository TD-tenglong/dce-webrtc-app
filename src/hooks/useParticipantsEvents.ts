import { RoomCallContext } from '@/store/RoomCallContext'
import logger from '@/utils/logger'
import { CallsApiEvent, CallsEventHandlers } from 'infobip-rtc'
import { useContext, useState, useEffect, useRef } from 'react'

type Participant = {
  identifier: string
  stream: MediaStream | null
  muted?: boolean
}
const useRoomCallParticipants = () => {
  const [participants, setParticipants] = useState<Record<string, Participant>>({})
  const remoteScreenShareRef = useRef<MediaStream | null>(null)

  const roomCall = useContext(RoomCallContext)

  useEffect(() => {
    if (!roomCall) return

    const onParticipantJoined = (event: any) => {
      logger.info('Participant Joined', event.participant.endpoint)
      const { identifier } = event.participant.endpoint
      setParticipants((prev) => ({
        ...prev,
        [identifier]: { identifier, stream: null }
      }))
    }

    const onParticipantLeft = (event: any) => {
      logger.info('Participant left', event.participant.endpoint)
      const { identifier } = event.participant.endpoint
      setParticipants((prev) => {
        const newParticipants = { ...prev }
        delete newParticipants[identifier]
        return newParticipants
      })
    }

    const onParticipantMuted = (event: any) => {
      logger.info('Participant muted', event.participant.endpoint)
      const { identifier } = event.participant.endpoint
      setParticipants((prev) => ({
        ...prev,
        [identifier]: { ...prev[identifier], muted: true }
      }))
    }

    const onParticipantUnmuted = (event: any) => {
      logger.info('Participant unmuted', event.participant.endpoint)
      const { identifier } = event.participant.endpoint
      setParticipants((prev) => ({
        ...prev,
        [identifier]: { ...prev[identifier], muted: false }
      }))
    }

    const onCameraVideoAdded = (event: any) => {
      logger.info('Participant added camera video', event.participant.endpoint)
      const { identifier } = event.participant.endpoint
      const { stream } = event
      setParticipants((prev) => ({
        ...prev,
        [identifier]: { ...prev[identifier], stream }
      }))
    }

    const onCameraVideoRemoved = (event: any) => {
      const { identifier } = event.participant.endpoint
      setParticipants((prev) => ({
        ...prev,
        [identifier]: { ...prev[identifier], stream: null }
      }))
    }

    const onScreenShareAdded = (event: any) => {
      logger.info('Participant added screen share', event.participant.endpoint)
      const { stream } = event
      remoteScreenShareRef.current = stream
    }

    const onScreenShareRemoved = (event: any) => {
      logger.info('Participant added screen share', event.participant.endpoint)
      remoteScreenShareRef.current = null
    }

    roomCall.on(CallsApiEvent.PARTICIPANT_JOINED, onParticipantJoined)
    roomCall.on(CallsApiEvent.PARTICIPANT_LEFT, onParticipantLeft)
    roomCall.on(CallsApiEvent.PARTICIPANT_CAMERA_VIDEO_ADDED, onCameraVideoAdded)
    roomCall.on(CallsApiEvent.PARTICIPANT_CAMERA_VIDEO_REMOVED, onCameraVideoRemoved)
    roomCall.on(CallsApiEvent.PARTICIPANT_MUTED, onParticipantMuted)
    roomCall.on(CallsApiEvent.PARTICIPANT_UNMUTED, onParticipantUnmuted)
    roomCall.on(CallsApiEvent.PARTICIPANT_SCREEN_SHARE_ADDED, onScreenShareAdded)
    roomCall.on(CallsApiEvent.PARTICIPANT_SCREEN_SHARE_REMOVED, onScreenShareRemoved)

    return () => {}
  }, [roomCall])

  const participantsArray = Object.values(participants)

  return { participants: participantsArray, remoteScreenShareStream: remoteScreenShareRef.current }
}

export default useRoomCallParticipants
