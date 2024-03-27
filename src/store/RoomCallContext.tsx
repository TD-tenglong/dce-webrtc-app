import { RoomCall } from 'infobip-rtc'
import { createContext, useContext } from 'react'

export const RoomCallContext = createContext<RoomCall | null>(null)

export function useRoomCall() {
  return useContext(RoomCallContext)
}
