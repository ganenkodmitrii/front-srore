'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Box, Button, Center, HStack, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'

import { motion, AnimatePresence } from 'framer-motion'

import { ChevronLeftIcon, ChevronRightIcon } from '@/src/icons'
import models from '@/src/models'

interface Props {
  banners: models.ItemsBanner[]
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

const Carousel = ({ banners }: Props) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [[page, direction], setPage] = useState([0, 0])

  const paginate = (newDirection: number) => {
    const nextPage = page + newDirection

    if (nextPage < 0) {
      setPage([banners.length - 1, newDirection])
    } else if (nextPage >= banners.length) {
      setPage([0, newDirection])
    } else {
      setPage([nextPage, newDirection])
    }
  }

  return (
    <Center
      overflow="hidden"
      bgColor="light-grey.400"
      p="32px"
      borderRadius="16px"
      minH="480px"
      maxW="1400px"
      mb="64px"
      position="relative"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit={{ display: 'none' }}
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 60 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x)

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1)
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1)
            }
          }}
        >
          <>
            {banners ? (
              <SimpleGrid alignItems="center" minChildWidth="300px" spacing="40px">
                <VStack align="start" spacing="16px">
                  <Heading as="h3" size="xl" fontSize="36px" noOfLines={1} p="0px">
                    {banners[page]?.title}
                  </Heading>

                  <Text lineHeight="24px" fontSize="14px" color="mid-grey.400">
                    {banners[page]?.description}
                  </Text>

                  <Button
                    minW="200px"
                    type="submit"
                    colorScheme="primary"
                    onClick={() => router.push(`${banners[page]?.url}`)}
                  >
                    {t('products.view_product')}
                  </Button>
                </VStack>

                {banners[page]?.image?.url && (
                  <Box h="380px" position="relative">
                    <Image
                      alt="image"
                      fill
                      src={banners[page]?.image?.url as string}
                      draggable={false}
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                )}
              </SimpleGrid>
            ) : null}
          </>
        </motion.div>
      </AnimatePresence>

      <HStack zIndex={1} position="absolute" right="32px" bottom="32px" align="center" justify="end">
        <Box bgColor="white" cursor="pointer" fontSize="25px" borderRadius="32px" padding="5px">
          <ChevronLeftIcon onClick={() => paginate(-1)} />
        </Box>

        <Box fontWeight="bold">{`${page + 1}/${banners?.length}`}</Box>

        <Box bgColor="white" cursor="pointer" fontSize="25px" borderRadius="32px" padding="5px">
          <ChevronRightIcon onClick={() => paginate(1)} />
        </Box>
      </HStack>
    </Center>
  )
}

export default Carousel
