import http from '../utils/http'
import { nanoid } from 'nanoid'

export type ReturnType = {
  token: string
  expirationTime: string
}

const API_BASE_URL = 'https://2vdwrp.api.infobip.com/webrtc/1/token'
const PAYLOAD = {
  identity: nanoid(8),
  applicationId: '2277594c-76ea-4b8e-a299-e2b6db41b9dc',
  displayName: 'WebRTC User',
  capabilities: {
    recording: 'DISABLED'
  },
  timeToLive: 43200
}

type TokenRequest = {
  identity: string
  applicationId: string
  displayName: string
  capabilities: {
    recording: string
  }
  timeToLive: number
}

export async function getAuthorization(): Promise<ReturnType> {
  try {
    const { token, expirationTime } = await http.post<ReturnType, TokenRequest>(API_BASE_URL, PAYLOAD)
    console.log(token)

    if (!token) return { token: '', expirationTime: '' }
    return { token, expirationTime }
  } catch (error) {
    return { token: '', expirationTime: '' }
  }
}
