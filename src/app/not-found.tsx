'use client'
import 'src/styles/globals.css'
import React from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Box, Button, Grid, Stack, Text, VStack } from '@chakra-ui/react'

import notFoundImage from '@/public/not-found-image.jpg'
import { Header } from '@/src/components'
import { useTranslation } from '@/src/i18n'
import { ArrowBackIcon, SparklesIcon, Icon404 } from '@/src/icons'

const MainImage = () => {
  return (
    <Box position="absolute" inset="0" overflow="hidden">
      <Text
        position="absolute"
        zIndex="10"
        bottom={{ base: '0', md: '-100px' }}
        fontSize={{ base: '300px', sm: '400px', md: '450px', lg: '550px', xl: '650px' }}
      >
        <Icon404 />
      </Text>

      <Image src={notFoundImage} alt="404" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
    </Box>
  )
}

export default function NotFound() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    setIsLoaded(true)
  }, [])
  return (
    <>
      {isLoaded && (
        <VStack align="stretch" minHeight="100vh" bgColor="light-grey.200" gap="0px">
          <Header />
          <Grid as="main" position="relative" templateColumns={{ base: '1fr', md: '1fr 1fr' }} flexGrow="1">
            <Grid placeItems="center">
              <Box
                position="relative"
                zIndex="15"
                p="24px"
                borderRadius="8px"
                bgColor={{ base: 'dark-grey.transparent', md: 'transparent' }}
                color={{ base: 'white', md: 'black' }}
                width={{ base: 300, sm: 400, md: 320, lg: 400, xl: 540 }}
              >
                <Text as="h1" mb="24px">
                  {t('page_not_found')}
                </Text>

                <Text className="text-18" mb="48px">
                  {t('page_not_found_message')}
                </Text>

                <Stack direction={{ base: 'column', lg: 'row' }} spacing="8px">
                  {history.length > 1 && (
                    <Button
                      variant="outline"
                      as="button"
                      gap="8px"
                      color="black"
                      bgColor="white"
                      fontWeight={600}
                      onClick={() => router.back()}
                    >
                      <ArrowBackIcon fontSize="24px" />
                      {t('go_back')}
                    </Button>
                  )}

                  <Button as="button" gap="8px" colorScheme="primary" onClick={() => router.push('/')}>
                    {t('magic_button')}
                    <SparklesIcon fontSize="24px" />
                  </Button>
                </Stack>
              </Box>

              <Box display={{ base: 'block', md: 'none' }} overflow="hidden">
                <MainImage />
              </Box>
            </Grid>

            <Box display={{ base: 'none', md: 'block' }} position="relative" overflow="hidden">
              <MainImage />
            </Box>
          </Grid>
        </VStack>
      )}
    </>
  )
}
