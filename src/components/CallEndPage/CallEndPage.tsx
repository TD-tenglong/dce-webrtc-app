import { Heading, Text } from '@cobalt/react-typography'
import classes from './CallEndPage.module.scss'
import Flex from '@cobalt/react-flex'
import Box from '@cobalt/react-box'
import talkdeskLogo from '@/assets/images/talkdesk-logo.png'
import Button from '@cobalt/react-button'
import { RoomCallContext } from '@/store/RoomCallContext'
import { useContext, useEffect, useState } from 'react'
import { CallsApiEvent } from 'infobip-rtc'
import Spinner from '@cobalt/react-spinner'
import logger from '@/utils/logger'

interface Props {
  onRejoin: () => void
}

const CallEndPage = (props: Props) => {
  const { onRejoin } = props
  const [isRejoining, setIsRejoining] = useState(false)
  const roomCall = useContext(RoomCallContext)

  const handleOnRejoin = () => {
    setIsRejoining(true)
    onRejoin()
  }

  useEffect(() => {
    const onRoomJoined = () => {
      logger.info('Room joined on Call end Page')
      setIsRejoining(false)
    }

    roomCall?.on(CallsApiEvent.ROOM_JOINED, onRoomJoined)
  }, [])

  return (
    <Flex direction='column' className={classes.wrapper}>
      <Box padding='12'>
        <img src={talkdeskLogo} className={classes.logo} />
      </Box>
      <div className={classes.content}>
        <div className={classes.endImage}></div>
        <div className='call-end-page__text'>
          <Heading level='2' textAlign='center'>
            Call ended
          </Heading>
          <Text size='small'>Continue your conversation with our agent where you left off</Text>
        </div>
        <div className={classes.buttons}>
          <Button disabled={isRejoining} type='secondary' size='small' onClick={handleOnRejoin}>
            {isRejoining && <Spinner size='micro' data-testid='email-touchpoint-confirm-spinner' />}
            Rejoin
          </Button>
          <Button type='primary' size='small'>
            Return to Chat
          </Button>
        </div>
      </div>
    </Flex>
  )
}

export default CallEndPage
