import { createContext } from 'react'

interface PreJoinSettings {
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  setAudioEnabled: (value: boolean) => void
  setVideoEnabled: (value: boolean) => void
}

export const PreJoinSettingsContext = createContext<PreJoinSettings | undefined>(undefined)
