import Image from 'next/image'

import {
  Card,
  Center,
  Modal,
  ModalProps,
  ModalContent,
  ModalCloseButton,
  VStack,
  HStack,
  ModalOverlay,
  chakra,
} from '@chakra-ui/react'

import { isValidImage } from '@/src/utils'

import { ChevronLeftIcon, ChevronRightIcon } from '../icons'

export const calculateFirstAndLastIndex = (index: number, length: number) => {
  if (length <= 4) return { firstIndex: 0, lastIndex: length - 1 }

  let firstIndex = index - 2
  let lastIndex = index + 2

  if (firstIndex < 0) {
    firstIndex = 0
    lastIndex = 4
  }

  return { firstIndex, lastIndex }
}

interface ImageGalleryModalProps extends Omit<ModalProps, 'children'> {
  images: string[]
  productName: string
  activeImageIndex: number
  setActiveImageIndex: (index: number) => void
}

const baseStyle = {
  fontSize: '56px',
  color: { base: 'black', md: 'white' },
  pos: 'absolute',
  top: 'calc(50% - 28px)',
  cursor: 'pointer',
}

const ChakraIconRight = chakra(ChevronRightIcon, { baseStyle })
const ChakraIconLeft = chakra(ChevronLeftIcon, { baseStyle })

const ImageGalleryModal = ({
  images,
  productName,
  activeImageIndex = 0,
  setActiveImageIndex,
  ...props
}: ImageGalleryModalProps) => {
  const { firstIndex, lastIndex } = calculateFirstAndLastIndex(activeImageIndex, images?.length || 0)
  const previewImages = images?.slice(firstIndex, lastIndex)

  return (
    <Modal isCentered {...props}>
      <ModalOverlay />

      <ModalContent bg="transparent" boxShadow="none">
        <ModalCloseButton zIndex="1" bg="white" right="8px" top="8px" />

        <VStack gap="48px">
          <Card bg="light-grey.400" aspectRatio={1} minW="100%" pos="relative" userSelect="none">
            {isValidImage(images?.[activeImageIndex]) && (
              <Image
                fill
                alt={productName}
                priority
                src={images?.[activeImageIndex]}
                style={{ objectFit: 'contain' }}
              />
            )}

            <ChakraIconRight
              right={{ base: '0', md: '-96px' }}
              display={activeImageIndex === (images?.length || 0) - 1 ? 'none' : 'block'}
              onClick={() => setActiveImageIndex(activeImageIndex + 1)}
            />
            <ChakraIconLeft
              left={{ base: '0', md: '-96px' }}
              display={activeImageIndex === 0 ? 'none' : 'block'}
              onClick={() => setActiveImageIndex(activeImageIndex - 1)}
            />
          </Card>
          <HStack gap="16px">
            {previewImages?.map((url, idx) => {
              return (
                <Card
                  key={idx}
                  variant="thumbnail"
                  h="75px"
                  flexShrink="0"
                  borderRadius="4px"
                  onClick={() => setActiveImageIndex(firstIndex + idx)}
                >
                  <Center h="100%" pos="relative">
                    {isValidImage(url) && (
                      <Image src={url} alt={`${productName}-${idx}`} fill style={{ objectFit: 'contain' }} />
                    )}
                  </Center>
                </Card>
              )
            })}
          </HStack>
        </VStack>
      </ModalContent>
    </Modal>
  )
}

export default ImageGalleryModal
