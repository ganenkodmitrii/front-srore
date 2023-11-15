import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Text,
  chakra,
  Switch,
  useBoolean,
  useDisclosure,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  ButtonGroup,
  PopoverTrigger,
  ChakraProps,
} from '@chakra-ui/react'

import { useTranslation } from '@/src/i18n'
import { PaypalIcon } from '@/src/icons'

const PaymentCard = (props: ChakraProps) => {
  const { t } = useTranslation('profile.payment_methods')

  const [isActive, setIsActive] = useBoolean()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const ChakraPaypal = chakra(PaypalIcon)

  return (
    <>
      <Card p="24px" maxW="560px" {...props}>
        <CardHeader p="0px" display="flex" gap="24px" justifyContent="space-between" mb="24px">
          <HStack justifyContent="space-between" w="full">
            <HStack fontSize="14px">
              <ChakraPaypal fontSize="24px" />
              <Text fontWeight="600">Paypal</Text>
            </HStack>
            {isActive && <Switch defaultChecked />}
          </HStack>
        </CardHeader>

        <CardBody p="0" mb="24px">
          {t('card_description')}
        </CardBody>
        <CardFooter p="0px">
          {isActive ? (
            <Popover placement="right" isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
              <PopoverTrigger>
                <Button size="sm" variant="outline" color="dark-grey.400">
                  {t('delete_payment_card')}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader fontWeight="semibold">{t('confirmation')}</PopoverHeader>
                <PopoverBody>{t('confirmation_description')}</PopoverBody>
                <PopoverFooter display="flex" justifyContent="flex-end">
                  <ButtonGroup size="sm">
                    <Button variant="outline" onClick={onClose}>
                      {t('cancel')}
                    </Button>
                    <Button
                      variant="delete"
                      onClick={() => {
                        setIsActive.toggle()
                        onClose()
                      }}
                    >
                      {t('delete')}
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          ) : (
            <Button variant="outline" onClick={setIsActive.toggle}>
              {t('connect_paypal_account')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  )
}

export default PaymentCard
