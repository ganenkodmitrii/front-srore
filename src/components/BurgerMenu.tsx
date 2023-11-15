import React from 'react'

import Link from 'next/link'

import {
  VStack,
  HStack,
  Text,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerOverlay,
  DrawerContent,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react'

import { motion } from 'framer-motion'

import { UserContext } from '@/src/contexts'
import { useTranslation } from '@/src/i18n'
import { UserIcon, CartIcon, HeartIcon, ArchiveIcon, MenuIcon } from '@/src/icons'

import { useGetCategories } from '../hooks'

import CustomAccordion from './CustomAccordion'
import LangSwitcher from './LangSwitcher'

interface BurgerMenuProps {
  onLoginClick: () => void
}

const BurgerMenu = ({ onLoginClick }: BurgerMenuProps) => {
  const context = React.useContext(UserContext)
  const { data } = useGetCategories()
  const { t, i18n } = useTranslation()
  const { t: tProfile } = useTranslation('profile.layout')
  const lang = i18n.language
  const [isOpenMenu, setIsOpenMenu] = React.useState(false)

  const categories = data?.map((category) => category.name)
  const profileLinks = ['details', 'addresses', 'payment-methods', 'orders', 'settings']

  const onCloseDrawer = () => {
    setIsOpenMenu(false)
  }
  return (
    <VStack display={{ base: 'inherit', md: 'none' }} bg="dark-grey.400">
      <HStack w="100%" justify="end" pos="relative" zIndex="2" cursor="pointer" fontSize={32}>
        <motion.div whileHover={{ scale: 1.1 }}>
          <MenuIcon
            onClick={() => {
              setIsOpenMenu(true)
            }}
          />
        </motion.div>
      </HStack>
      <Drawer placement="left" isOpen={isOpenMenu} onClose={onCloseDrawer} size="sm">
        <DrawerOverlay />
        <DrawerContent bg="dark-grey.300" color="white">
          <DrawerCloseButton />
          <DrawerBody>
            <VStack gap="24px" height="100%" pl="15px" align="flex-start" fontSize={18} className="links-hover">
              {context.user ? (
                <>
                  <HStack mt="26px">
                    <Accordion allowToggle>
                      <AccordionItem border="none">
                        <AccordionButton
                          p="0"
                          m="0"
                          fontSize="inherit"
                          textAlign="left"
                          _hover={{ backgroundColor: 'none', WebkitTextStroke: '0.3px white' }}
                        >
                          <UserIcon fontSize="20px" />
                          <Text ml="8px">{context.user?.first_name}</Text>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel p="8px 0 0 0 " m="0" w="full  ">
                          {profileLinks.map((link, idx) => (
                            <Box
                              key={idx}
                              mb="8px"
                              pl="28px"
                              pr="10px"
                              _hover={{ bg: '#42505a' }}
                              borderRadius="8px"
                              onClick={onCloseDrawer}
                            >
                              <Link href={`/${lang}/profile/${link}`}>{tProfile(link.replace('-', '_'))}</Link>
                            </Box>
                          ))}
                          <Box
                            mb="8px"
                            pl="28px"
                            pr="10px"
                            _hover={{ bg: '#42505a' }}
                            borderRadius="8px"
                            color="red.500"
                            onClick={context.logout}
                          >
                            {tProfile('logout')}
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </HStack>
                </>
              ) : (
                <HStack mt="26px" onClick={onCloseDrawer}>
                  <UserIcon fontSize="20px" />
                  <Text onClick={onLoginClick}>{t('login')}</Text>
                </HStack>
              )}

              <HStack onClick={onCloseDrawer} as={Link} href={`/${lang}/checkout/products`}>
                <CartIcon fontSize="20px" />
                <Text>{t('cart')}</Text>
              </HStack>
              <HStack onClick={onCloseDrawer} as={Link} href={`/${lang}/favorites`}>
                <HeartIcon />
                <Text> {t('favorites')} </Text>
              </HStack>
              {context?.user && (
                <HStack onClick={onCloseDrawer} as={Link} href={`/${lang}/profile/orders`}>
                  <ArchiveIcon />
                  <Text>{t('archive')}</Text>
                </HStack>
              )}
              <VStack mt="30px" gap="24px" align="start">
                <Accordion allowToggle>
                  <AccordionItem border="none">
                    <AccordionButton
                      p="0"
                      m="0"
                      fontSize="inherit"
                      textAlign="left"
                      _hover={{ backgroundColor: 'none', WebkitTextStroke: '0.3px white' }}
                    >
                      <Box>{t('all_categories')}</Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pl="8px">
                      {categories?.map((elem) => (
                        <CustomAccordion
                          key={elem}
                          title={elem}
                          childrenItems={data?.find((c) => c.name === elem)?.subcategories ?? []}
                          onClose={onCloseDrawer}
                        />
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                <Link href={`/${lang}/products`} onClick={onCloseDrawer}>
                  {t('top_products')}
                </Link>
                <Link href={`/${lang}/discounts`} onClick={onCloseDrawer}>
                  {t('discounts')}
                </Link>
                <Link href={`/${lang}/faq`} onClick={onCloseDrawer}>
                  {t('faq')}
                </Link>
              </VStack>
              <HStack mt="auto" mb="15px">
                <LangSwitcher />
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </VStack>
  )
}

export default BurgerMenu
