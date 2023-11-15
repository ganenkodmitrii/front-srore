import { useEffect } from 'react'

import { Button, Card, Center, HStack, Text, useToast } from '@chakra-ui/react'

import { useMediaQuery } from '@react-hookz/web'

import { useTranslation } from '@/src/i18n'

interface ConfirmPopupProps {
  text: string
  header?: string
  isOpen: boolean
  onConfirm: () => void
  onClose: () => void
}

const ConfirmPopup = ({ isOpen, text, header, onConfirm, onClose }: ConfirmPopupProps) => {
  const isLarger1140 = useMediaQuery('(min-width: 1140px)')
  const toast = useToast()
  const { t } = useTranslation('forms')

  useEffect(() => {
    !isLarger1140 &&
      isOpen &&
      toast({
        render: ({ onClose: onToastClose }) => (
          <Center
            bg="white"
            p="16px"
            flexDirection="column"
            borderRadius="16px"
            border="1px solid"
            borderColor="mid-grey.400"
          >
            <Text>{text}</Text>
            <HStack w="100%" mt="8px">
              <Button variant="outline" onClick={onToastClose} flex="1" size="sm">
                {t('no')}
              </Button>

              <Button
                onClick={() => {
                  onConfirm()
                  onToastClose()
                }}
                flex="1"
                size="sm"
              >
                {t('yes')}
              </Button>
            </HStack>
          </Center>
        ),
        position: 'bottom',
        isClosable: true,
        duration: null,
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <>
      {isLarger1140 && isOpen && (
        <Card minW="200px" p="24px" borderRadius="8px" alignSelf="flex-start">
          {header && <Text>{header}</Text>}
          <Text fontWeight="semibold">{text}</Text>
          <HStack pt="8px">
            <Button variant="outline" onClick={onClose} flex="1">
              {t('no')}
            </Button>

            <Button onClick={onConfirm} flex="1">
              {t('yes')}
            </Button>
          </HStack>
        </Card>
      )}
    </>
  )
}

export default ConfirmPopup
