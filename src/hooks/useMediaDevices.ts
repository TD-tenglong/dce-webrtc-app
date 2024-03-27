import { useState, useEffect } from 'react'

type DeviceType = 'audioinput' | 'videoinput' | 'audiooutput'
type PermissionStatus = 'granted' | 'prompt' | 'denied'

interface MediaDeviceInfo {
  title: string
  value: string
  deviceId: string
}
interface MediaDevicesInfo {
  devices: MediaDeviceInfo[]
  selectedDeviceId: string
  setSelectedDeviceId: (deviceId: string) => void
  permissionStatus: PermissionStatus
}

export const useMediaDevices = (deviceType: DeviceType): MediaDevicesInfo => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt')

  useEffect(() => {
    // Prompt for permissions when the hook is used
    ;(async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        setPermissionStatus('granted')
        const deviceInfos = await navigator.mediaDevices.enumerateDevices()
        const filteredDevices = deviceInfos
          .filter((device) => device.kind === deviceType && device.deviceId !== 'default')
          .map((device) => ({
            title: device.label,
            value: device.deviceId,
            deviceId: device.deviceId
          }))
        setDevices(filteredDevices)
        if (filteredDevices.length > 0) {
          setSelectedDeviceId(filteredDevices[0].deviceId)
        }
      } catch (error) {
        console.error('Error accessing media devices:', error)
        setPermissionStatus('denied')
      }
    })()
  }, [deviceType])

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    permissionStatus
  }
}
