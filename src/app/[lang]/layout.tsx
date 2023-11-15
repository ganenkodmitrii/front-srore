'use client'

import { Box, VStack } from '@chakra-ui/react'
import { Footer, Header } from '@/src/components'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <VStack align="stretch" minHeight="100vh" bgColor="light-grey.200" gap="0">
      <Header />
      <Box as="main" flexGrow="1">
        {children}
      </Box>
      <Footer />
    </VStack>
  )
}
