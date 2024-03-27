import { RoomCallContext } from '@/store/RoomCallContext'
import { useCallback, useContext, useEffect, useState } from 'react'

const useDuration = () => {
  const roomCall = useContext(RoomCallContext)
  const [duration, setDuration] = useState('00:00:00')

  const calculateDuration = useCallback(() => {
    if (!roomCall) return

    let durationInSeconds = roomCall.duration()
    let seconds = `${String(Math.floor(durationInSeconds % 60)).padStart(2, '0')}`
    let minutes = `${String(Math.floor(durationInSeconds / 60) % 60).padStart(2, '0')}`
    let hours = `${String(Math.floor(durationInSeconds / 3600)).padStart(2, '0')}`

    setDuration(`${hours}:${minutes}:${seconds}`)
  }, [roomCall])

  useEffect(() => {
    const intervalId = setInterval(calculateDuration, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [calculateDuration])

  return { duration }
}

export default useDuration
