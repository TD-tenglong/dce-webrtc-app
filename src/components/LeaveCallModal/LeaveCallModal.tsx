import Button from '@cobalt/react-button'
import Flex from '@cobalt/react-flex'
import Icon, { Name } from '@cobalt/react-icon'
import Modal, { Dialog } from '@cobalt/react-modal'
import { Portal } from '@cobalt/react-portal-provider'
import Spinner from '@cobalt/react-spinner'
import { useTheme } from '@cobalt/react-theme-provider'
import { Heading, Text } from '@cobalt/react-typography'

interface Props {
  icon?: Name
  title: string
  message: string | JSX.Element
  subMessage?: string
  loading: boolean
  visible: boolean
  onCancel: () => void
  onConfirm: () => void
  confirmText: string
  confirmButtonType?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success'
  disableConfirmButton?: boolean
  size?: React.ComponentProps<typeof Modal>['size']
}

const LeaveCallModal = (props: Props): JSX.Element => {
  const {
    icon,
    title,
    message,
    subMessage,
    onCancel,
    onConfirm,
    loading,
    visible,
    confirmText,
    confirmButtonType = 'primary',
    disableConfirmButton,
    size = 'small'
  } = props
  const theme = useTheme()

  function handleCancel(): void {
    onCancel()
  }

  function handleConfirm(): void {
    onConfirm()
  }

  return (
    <Portal>
      {visible && (
        <Modal visible size={size}>
          <Dialog style={{ minHeight: '250px' }}>
            <Flex padding='6' direction='column' width='100%'>
              {icon && (
                <Flex width='100%' alignX='center' paddingBottom='6'>
                  <Icon name={icon} size='large' color={theme.gray500} />
                </Flex>
              )}
              <Flex width='100%' alignX='center' paddingBottom='2'>
                <Heading level='3' data-testid='email-touchpoint-confirm-title'>
                  {title}
                </Heading>
              </Flex>
              <Flex width='100%' alignX='center' paddingBottom='6' direction='column'>
                {typeof message === 'string' ? (
                  <>
                    <Text
                      data-testid='email-touchpoint-confirm-message'
                      textAlign='center'
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {message}
                    </Text>
                    {subMessage && <Text data-testid='confirm-sub-message'>{subMessage}</Text>}
                  </>
                ) : (
                  message
                )}
              </Flex>
              <Flex width='100%' alignX='center' gap='3'>
                <Button
                  type='secondary'
                  onClick={handleCancel}
                  data-testid='email-touchpoint-confirm-modal-cancel-button'
                >
                  Cancel
                </Button>

                <Button
                  type={confirmButtonType}
                  disabled={loading}
                  onClick={handleConfirm}
                  data-testid='email-touchpoint-confirm-modal-confirm-button'
                >
                  <Flex gap='1' alignY='center'>
                    {loading && <Spinner size='micro' data-testid='email-touchpoint-confirm-spinner' />}
                    <Text color='inherit' weight='inherit'>
                      {confirmText}
                    </Text>
                  </Flex>
                </Button>
              </Flex>
            </Flex>
          </Dialog>
        </Modal>
      )}
    </Portal>
  )
}

export default LeaveCallModal
