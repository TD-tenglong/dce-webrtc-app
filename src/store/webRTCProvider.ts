import { CallsApiEvent, InfobipRTC, InfobipRTCEvent, RoomCall, RoomCallOptions, createInfobipRtc } from 'infobip-rtc'
import logger from '@/utils/logger'

class WebRTCProvider {
  private client: InfobipRTC | null
  private roomCall: RoomCall | null
  private connectedPromise: Promise<void>
  private resolveConnectedPromise!: () => void
  private token: string
  private roomName: string
  public deviceOptions: { video: boolean; audio: boolean }

  constructor(token: string, roomName: string, deviceOptions: { video: boolean; audio: boolean }) {
    this.client = null
    this.roomCall = null
    this.token = token
    this.roomName = roomName
    this.deviceOptions = deviceOptions
    this.connectedPromise = new Promise((resolve) => {
      this.resolveConnectedPromise = resolve
    })

    this.initialize()
  }

  public initialize() {
    // Create a new instance of InfobipRTC
    this.client = createInfobipRtc(this.token, { debug: true })

    this.addEventListenersOnConnection()
    this.connect()

    return this
  }

  private connect() {
    if (this.client) {
      this.client.connect()
    }
  }

  private addEventListenersOnConnection() {
    if (this.client) {
      this.client.on(InfobipRTCEvent.CONNECTED, (event: any) => {
        logger.info('Connected with : ' + event)
        this.joinRoom()
        this.resolveConnectedPromise()
      })
      this.client.on(InfobipRTCEvent.DISCONNECTED, (event: any) => {
        logger.info('Disconnected!', event)
      })
    }
  }

  private joinRoom() {
    // Join a specific room by room name
    if (this.client) {
      const roomOptions = this.deviceOptions
      const roomCallOptions = RoomCallOptions.builder()
        .setVideo(roomOptions.video)
        .setAudio(roomOptions.audio)
        .setAutoRejoin(true)
        .build()
      const roomCall = this.client.joinRoom(this.roomName, roomCallOptions)
      return (this.roomCall = roomCall)
    }
    return null
  }

  public async getRoomCallInstance(): Promise<RoomCall | null> {
    await this.connectedPromise
    return this.roomCall
  }
}

export default WebRTCProvider
