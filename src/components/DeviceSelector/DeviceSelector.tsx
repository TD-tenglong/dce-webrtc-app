import DropDown, { Option } from '@cobalt-marketplace/react-dropdown'
import Icon, { Name } from '@cobalt/react-icon'
import Box from '@cobalt/react-box'
import styles from './DeviceSelector.module.scss'

interface MediaDeviceInfo {
  title: string
  value: string
  deviceId: string
}

interface DeviceSelectorProps {
  type: string
  devices: MediaDeviceInfo[]
  selectedDeviceId: string
  onDeviceIdChange: (deviceId: string) => void
}

const DEVICE_SELECTOR_LABELS: Record<string, Name> = {
  audioinput: 'mic',
  videoinput: 'videocam',
  audiooutput: 'volume_mute'
}

const DeviceSelector = ({ type, devices, selectedDeviceId, onDeviceIdChange }: DeviceSelectorProps): JSX.Element => {
  const displayValue = devices.find((device) => device.value === selectedDeviceId)?.title

  const handleChange = (option: any) => {
    onDeviceIdChange(option.value)
  }

  return (
    <Box style={{ position: 'relative' }}>
      <Icon className={styles.icon} name={DEVICE_SELECTOR_LABELS[type]} />
      <DropDown className={styles.DropDown} onChange={handleChange} value={displayValue}>
        {devices.map((device) => (
          <Option
            key={device.value}
            selected={selectedDeviceId === device.value}
            title={device.title}
            value={device.value}
          />
        ))}
      </DropDown>
    </Box>
  )
}

export default DeviceSelector
