import { HStack } from '@chakra-ui/react'

import { FacebookOutlinedIcon, InstagramIcon, TwitterIcon, TiktokIcon, PinterestIcon } from '@/src/icons'

import { CustomizedLink } from '..'

export const SocialLinks = () => {
  return (
    <HStack as="ul" gap="24px" fontSize="32px" color="white" borderColor="primary.500">
      <CustomizedLink href="https://www.facebook.com/ebsintegrator" target="_blank">
        <FacebookOutlinedIcon />
      </CustomizedLink>

      <CustomizedLink href="https://www.instagram.com/ebs_integrator" target="_blank">
        <InstagramIcon />
      </CustomizedLink>

      <CustomizedLink href="https://twitter.com/ebsintegrator" target="_blank">
        <TwitterIcon />
      </CustomizedLink>

      <CustomizedLink href="https://www.tiktok.com/@ebsintegrator" target="_blank">
        <TiktokIcon />
      </CustomizedLink>

      <CustomizedLink href="https://www.pinterest.com/ebsintegrator" target="_blank">
        <PinterestIcon />
      </CustomizedLink>
    </HStack>
  )
}
