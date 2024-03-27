import PreJoin from '@/components/PreJoin/index'
import PortalProvider from '@cobalt/react-portal-provider'
import ThemeProvider from '@cobalt/react-theme-provider'
import ViewportProvider from '@cobalt/react-viewport-provider'
import theme from '@/assets/theme/styles.json'
import { RoomCallContext } from './store/RoomCallContext'
import { useEffect, useState } from 'react'
import { getAuthorization } from '@/api/getAuthorization'
import webRTCProvider from '@/store/webRTCProvider'
import logger from '@/utils/logger'
import { RoomCall } from 'infobip-rtc'
import MeetingRoom from '@/components/MeetingRoom/MeetingRoom'

interface Props {
  isAudioEnabled?: boolean
  isVideoEnabled?: boolean
}

const App = () => {
  const [token] = useState<string | null>(null)
  const [activeRoomCall, setActiveRoomCall] = useState<RoomCall | null>(null)
  const [isLoadingJoin, setIsLoadingJoin] = useState(false)
  const [roomName, setRoomName] = useState('td-meet') // Default room name
  const [mode, setMode] = useState('video') // Default mode

  const handleClickJoin = async (props: Props) => {
    const { isAudioEnabled = true, isVideoEnabled = true } = props
    setIsLoadingJoin(true)
    const { token } = await getAuthorization()
    if (token) {
      try {
        const webRTCInstance = new webRTCProvider(token, roomName, {
          video: mode === 'video' && isVideoEnabled ? true : false,
          audio: !!isAudioEnabled
        })
        webRTCInstance.getRoomCallInstance().then(setActiveRoomCall)
      } catch (error) {
        setIsLoadingJoin(false)
        logger.error('Error initializing WebRTC client', error)
      }
    }
  }

  useEffect(() => {}, [token])

  useEffect(() => {
    if (activeRoomCall) {
      setIsLoadingJoin(false)
      logger.info('activeRoomCall', activeRoomCall)
    }
  }, [activeRoomCall])

  const handleLeftRoom = () => {}

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const roomNameParam = urlParams.get('roomName')
    const modeParam = urlParams.get('mode')

    if (roomNameParam) {
      setRoomName(roomNameParam)
    }

    if (modeParam) {
      setMode(modeParam)
    }
  }, [])

  return (
    <ThemeProvider loader={() => Promise.resolve(theme)}>
      <ViewportProvider>
        <PortalProvider>
          <RoomCallContext.Provider value={activeRoomCall}>
            {activeRoomCall ? (
              <MeetingRoom onLeftRoom={handleLeftRoom} onRejoin={handleClickJoin} mode={mode} />
            ) : (
              <PreJoin mode={mode} roomName={roomName} onClickJoin={handleClickJoin} isLoadingJoin={isLoadingJoin} />
            )}
          </RoomCallContext.Provider>
        </PortalProvider>
      </ViewportProvider>
    </ThemeProvider>
  )
}

export default App
