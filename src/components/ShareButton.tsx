'use client'

import React, { useEffect, useState } from 'react'

import { Box, UseToastOptions, useToast } from '@chakra-ui/react'

import { TFunction } from 'i18next'

import { useTranslation } from '@/src/i18n'
import { ShareIcon } from '@/src/icons'

const getToastOptions = (t: TFunction<string, string>): Record<string, UseToastOptions> => ({
  error: {
    status: 'error',
    description: t('error'),
  },
  info: {
    status: 'info',
    description: t('info'),
  },
})

export interface ShareButtonProps {
  title?: string
  url?: string
}

const ShareButton = ({ title, url }: ShareButtonProps) => {
  const { t } = useTranslation('share')
  const toast = useToast()
  const [currentUrl, setCurrentUrl] = useState<string>(url ?? '')

  useEffect(() => {
    !url && setCurrentUrl(window.location.href)
  }, [url])

  return (
    <Box transition="color 0.2s ease-in-out" fontSize="33px" cursor="pointer" _hover={{ color: 'primary.500' }}>
      <ShareIcon
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title, url: currentUrl }).catch(() => {
              try {
                navigator.clipboard.writeText(currentUrl)
                toast(getToastOptions(t).info)
              } catch (err) {
                toast(getToastOptions(t).error)
              }
            })
          } else {
            navigator.clipboard.writeText(currentUrl)
            toast(getToastOptions(t).info)
          }
        }}
      />
    </Box>
  )
}

export default ShareButton
