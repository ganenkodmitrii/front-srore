import React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Container, HStack, Box, Text } from '@chakra-ui/react'

import { AnimatePresence, motion } from 'framer-motion'

import { Categories } from '@/src/components'
import { useTranslation } from '@/src/i18n'
import { MenuIcon } from '@/src/icons'

const Menu = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const [isOpenCategories, setIsOpenCategories] = React.useState(false)
  const [isHoveringMenu, setIsHoveringMenu] = React.useState(false)
  const [isHoveringCategories, setIsHoveringCategories] = React.useState(false)
  const path = usePathname()

  const onMouseEnterMenu = () => {
    setIsOpenCategories(true)
    setIsHoveringMenu(true)
  }

  const onMouseLeaveMenu = () => {
    setTimeout(() => {
      setIsHoveringMenu(false)
    }, 300)
  }

  const onMouseEnterCategories = () => {
    setIsHoveringCategories(true)
  }

  const onMouseLeaveCategories = () => {
    setIsHoveringCategories(false)
  }

  React.useEffect(() => {
    setIsOpenCategories(false)
  }, [path])

  React.useEffect(() => {
    !isHoveringCategories && !isHoveringMenu && setIsOpenCategories(false)
  }, [isHoveringCategories, isHoveringMenu])

  return (
    <Box color="white" bg="dark-grey.300" display={{ base: 'none', md: 'inherit' }}>
      <Container>
        <HStack as="nav" gap="24px" pt="16px" pb="16px" className="links-hover">
          <HStack gap="5px" onMouseEnter={onMouseEnterMenu} onMouseLeave={onMouseLeaveMenu} cursor="pointer">
            <MenuIcon fontSize={24} color="white" />
            <Text>{t('all_categories')}</Text>
          </HStack>
          <Link href={`/${lang}/products`}>{t('top_products')}</Link>
          <Link href={`/${lang}/discounts`}>{t('discounts')}</Link>
          <Link href={`/${lang}/faq`}>{t('faq')}</Link>
        </HStack>
        <AnimatePresence>
          {isOpenCategories && (
            <>
              <motion.div
                onClick={() => setIsOpenCategories(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  left: '0',
                  width: '100%',
                  height: 'calc(100vh - 152px)',
                  background: 'rgba(37, 44, 50, 0.44)',
                }}
              />

              <Categories onMouseLeave={onMouseLeaveCategories} onMouseEnter={onMouseEnterCategories} />
            </>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  )
}

export default Menu
