import { useContext, useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  Container,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Tag,
  TagLabel,
  TagRightIcon,
} from '@chakra-ui/react'

import { useQuery } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { FavoritesContext, UserContext } from '@/src/contexts'
import { useTranslation } from '@/src/i18n'
import { ArchiveIcon, HeartIcon, SearchIcon, UserIcon, LogoIcon, ChevronDownIcon } from '@/src/icons'

import { AuthModal, BurgerMenu, LangSwitcher, ToolbarCart } from '.'

const UserToolbar = () => {
  const context = useContext(UserContext)
  const router = useRouter()
  const params = useSearchParams()
  const uid = params.get('uid')
  const token = params.get('token')
  const { favorites } = useContext(FavoritesContext)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isHoveringMenuButton, setIsHoveringMenuButton] = useState<boolean>(false)
  const [isHoveringMenuList, setIsHoveringMenuList] = useState<boolean>(false)

  const [searchText, setSearchText] = useState<string>('')

  const { data } = useQuery({ ...queries.products.getFavorites(), enabled: !!context.user })

  const { t, i18n } = useTranslation()
  const { t: tProfile } = useTranslation('profile.layout')
  const lang = i18n.language

  const profileLinks = ['details', 'addresses', 'payment-methods', 'orders', 'settings']

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.key === 'Enter' && onSearch()
  }

  const onSearch = () => {
    if (!searchText) return

    router.push(`/${lang}/products/?search=${searchText}`)
    setSearchText('')
  }

  useEffect(() => {
    if (uid && token) {
      onOpen()
    }
  }, [uid, token, onOpen])

  return (
    <>
      <Box bg="dark-grey.400" p="28px 0" color="#fff">
        <Container>
          <Flex as="nav" justify="space-between" gap="20px">
            <HStack gap={{ base: '30px', lg: '88px' }}>
              <Box
                as={Link}
                href={`/${lang}/`}
                aspectRatio="270/40"
                fontSize={{
                  base: '12px',
                  md: '18px',
                  lg: '28px',
                  xl: '40px',
                }}
              >
                <LogoIcon />
              </Box>
              <InputGroup w={{ base: '120px', sm: '220px', lg: '330px', xl: '440px' }}>
                <Input h="40px" placeholder="Search" onChange={onChange} value={searchText} onKeyDown={onKeyDown} />
                <InputRightElement cursor="pointer" onClick={onSearch} h="100%">
                  <SearchIcon fontSize="18px" color="#B0BABF" />
                </InputRightElement>
              </InputGroup>
            </HStack>
            {!context.isLoading && (
              <HStack gap="16px" display={{ base: 'none', md: 'inherit' }}>
                {!context.user ? (
                  <HStack gap="4px" cursor="pointer" onClick={onOpen}>
                    <UserIcon fontSize="24px" />
                    <>{t('login')}</>
                  </HStack>
                ) : (
                  <Box zIndex="10">
                    <Menu placement="bottom-end" isOpen={isHoveringMenuButton || isHoveringMenuList}>
                      <MenuButton
                        p="0"
                        m="0"
                        variant=""
                        size="sm"
                        as={Button}
                        fontSize={16}
                        onMouseEnter={() => setIsHoveringMenuButton(true)}
                        onMouseLeave={() => setTimeout(() => setIsHoveringMenuButton(false), 500)}
                      >
                        <HStack color="white">
                          <>{context.user?.first_name}</>
                          <ChevronDownIcon fontSize="24px" />
                        </HStack>
                      </MenuButton>
                      <MenuList
                        color="mid-grey.400"
                        onMouseEnter={() => setIsHoveringMenuList(true)}
                        onMouseLeave={() => setTimeout(() => setIsHoveringMenuList(false), 500)}
                      >
                        {profileLinks.map((link, idx) => (
                          <Link
                            key={idx}
                            href={`/${lang}/profile/${link}`}
                            onClick={() => setIsHoveringMenuList(false)}
                          >
                            <MenuItem>{tProfile(link.replace('-', '_'))}</MenuItem>
                          </Link>
                        ))}
                        <MenuItem
                          color="red.500"
                          onClick={() => {
                            context.logout()
                            setIsHoveringMenuList(false)
                          }}
                        >
                          {tProfile('logout')}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                )}
                <HStack gap="16px">
                  <ToolbarCart />

                  <Tag
                    as={Link}
                    href="/favorites"
                    color="white"
                    bg="dark-grey.100"
                    cursor="pointer"
                    borderRadius="16px"
                  >
                    <TagLabel>{context.user ? data?.length : favorites.length}</TagLabel>
                    <TagRightIcon boxSize="22px">
                      <HeartIcon fontSize="24px" cursor="pointer" />
                    </TagRightIcon>
                  </Tag>
                  {context.user && (
                    <Link href="/profile/orders">
                      <ArchiveIcon fontSize="24px" cursor="pointer" />
                    </Link>
                  )}
                </HStack>

                <LangSwitcher />
              </HStack>
            )}
            <BurgerMenu onLoginClick={onOpen} />
          </Flex>
        </Container>
      </Box>

      <AuthModal isOpen={isOpen} onClose={onClose} uid={uid} token={token} />
    </>
  )
}

export default UserToolbar
