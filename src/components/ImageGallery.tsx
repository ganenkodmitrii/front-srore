import React, { useState } from 'react'

import Image from 'next/image'

import { Stack, Card, Center, StackProps, useDisclosure, Text } from '@chakra-ui/react'

import { isValidImage } from '@/src/utils'

import { useTranslation } from '../i18n'

import { ImageGalleryModal } from '.'

interface ImageDisplayProps extends StackProps {
  images?: string[]
  productName?: string
}

const ImageGallery = ({ productName = 'image', images, ...props }: ImageDisplayProps) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const selectedImage = images?.[activeImageIndex]

  return (
    <>
      <Stack
        spacing={selectedImage ? '16px' : '0'}
        direction={{ base: 'column-reverse', sm: 'row' }}
        maxW={{ base: 'calc(100vw - 32px)', md: '500px' }}
        maxH="328px"
        {...props}
      >
        <Stack
          maxW="100%"
          spacing="16px"
          flexShrink="0"
          className="scroll-y scroll-x"
          direction={{ base: 'row', sm: 'column' }}
        >
          {images?.map((url, idx) => (
            <Card
              key={idx}
              variant="thumbnail"
              h="75px"
              flexShrink="0"
              onMouseEnter={() => setActiveImageIndex(idx)}
              onClick={() => {
                setActiveImageIndex(idx)
                onOpen()
              }}
            >
              <Center h="100%" pos="relative">
                {isValidImage(url) && (
                  <Image src={url} alt={`${productName}-${idx}`} fill style={{ objectFit: 'contain' }} />
                )}
              </Center>
            </Card>
          ))}
        </Stack>

        <Card
          variant="thumbnail"
          pos="relative"
          w={{ base: '100%', md: '344px' }}
          cursor={selectedImage ? 'pointer' : 'default'}
        >
          <Center h="100%" pos="relative" onClick={onOpen}>
            {isValidImage(selectedImage) && selectedImage ? (
              <Image fill priority alt={productName} src={selectedImage} style={{ objectFit: 'contain' }} />
            ) : (
              <Text>{t('no_image')}</Text>
            )}
          </Center>
        </Card>
      </Stack>

      {!!images?.length && (
        <ImageGalleryModal
          isOpen={isOpen}
          onClose={onClose}
          images={images}
          productName={productName}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
        />
      )}
    </>
  )
}

export default ImageGallery
