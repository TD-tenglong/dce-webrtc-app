import Flex from '@cobalt/react-flex'
import Avatar from '@cobalt/react-avatar'
import Icon from '@cobalt/react-icon'
import { useTheme } from '@cobalt/react-theme-provider'
import styles from './VideoPlaceholder.module.scss'

interface Props {
  opacity?: number
}

export const VideoPlaceholder = (props: Props) => {
  const { opacity = 1 } = props

  const { gray700 } = useTheme()

  return (
    <Flex
      width='100%'
      height='100%'
      alignY='center'
      alignX='center'
      className={styles.videoPlaceholder}
      style={{ opacity: opacity }}
    >
      <Avatar size='medium'>
        <Icon name='person' size='medium' color={gray700}></Icon>
      </Avatar>
    </Flex>
  )
}
