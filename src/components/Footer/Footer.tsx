import { Box, Container, Divider, Stack, StackProps, Text } from '@chakra-ui/react'

import { useTranslation } from '@/src/i18n'

import { CustomizedLink } from '..'

import { ContactForm } from './ContactForm'
import { SocialLinks } from './SocialLinks'

const businessInfo = {
  srl: 'ENTERPRISE BUSINESS SOLUTIONS',
  idno: '1010607002906',
  physical_address: 'str. Columna, 170, Chișinău, MD2004',
  legal_address: 'mun. Chişinău, sec. Centru, str. Inculeţ Ion, 33',
}
const leftMenu = ['company', 'about_company', 'order', 'delivery', 'payment', 'return']
const rightMenu = ['legal', 'terms_and_conditions', 'privacy_policy', 'cookies', 'anpc']

interface MenuProps extends StackProps {
  items: string[]
}

const Menu = ({ items, ...props }: MenuProps) => {
  const { t, i18n } = useTranslation()

  return (
    <Stack {...props} as="nav" color="white" borderColor="primary.500">
      {items.map((item) => (
        <CustomizedLink key={item} href={`/${i18n.language}/${item}`}>
          {t(item)}
        </CustomizedLink>
      ))}
    </Stack>
  )
}

const Footer = () => {
  const { t } = useTranslation()
  return (
    <Box as="footer" color="white" bgColor="dark-grey.400" padding="64px 0">
      <Container borderColor="dark-grey.200">
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          justify="space-between"
          spacing={{ base: '40px', xl: '200px', '2xl': '400px' }}
        >
          <ContactForm />

          <Stack
            direction={{ base: 'column', md: 'row', lg: 'column' }}
            justify={{ md: 'space-between', lg: 'flex-start' }}
            alignItems={{ base: 'center', md: 'flex-start' }}
            gap="40px"
          >
            <Stack alignItems="flex-start" gap="25px">
              <h2>{t('contact_information')}</h2>

              <p className="text-18">
                <CustomizedLink href="tel:+373 22 022 096">+373 22 022 096</CustomizedLink> <br />
                <CustomizedLink href="mailto:sales@ebs-integrator.com">sales@ebs-integrator.com</CustomizedLink>
              </p>

              <p className="text-18">
                {t('mon_fri')}: 09:00 - 20:00 <br />
                {t('sat_sun')}: 09:00 - 19:00
              </p>
            </Stack>

            <Stack alignItems={{ base: 'flex-start', md: 'flex-end', lg: 'flex-start' }} gap="25px">
              <h2>{t('follow_us')}</h2>
              <SocialLinks />
            </Stack>
          </Stack>
        </Stack>

        <Divider margin="40px 0 24px" />

        <Stack
          overflow="hidden"
          direction={{ base: 'column', sm: 'row', lg: 'column', xl: 'row' }}
          gap="24px"
          justify="space-between"
          alignItems={{ base: 'center', sm: 'flex-start' }}
          className="text-14"
        >
          <Menu
            direction={{ base: 'column', lg: 'row' }}
            alignItems={{ base: 'center', sm: 'flex-start' }}
            gap={{ base: '6px', lg: '24px' }}
            items={leftMenu}
          />
          <Menu
            direction={{ base: 'column', lg: 'row' }}
            alignItems={{ base: 'center', sm: 'flex-end', lg: 'flex-start' }}
            gap={{ base: '6px', lg: '24px' }}
            items={rightMenu}
          />
        </Stack>

        <Divider margin="24px 0 40px" />

        <Stack
          direction={{ base: 'column', xl: 'row' }}
          gap={{ base: '12px', xl: '24px' }}
          justify="space-between"
          alignItems="flex-start"
          className="text-14"
        >
          <Text color="mid-grey.400">
            <Text as="span">{`${t('srl')}  ${businessInfo.srl} | `}</Text>
            <Text as="span">{`${t('idno')}: ${businessInfo.idno}`}</Text>
            <br />
            <Text as="span">{`${t('physical_address')}: ${businessInfo.physical_address} | `}</Text>
            <Text as="span">{`${t('legal_address')}: ${businessInfo.legal_address}`}</Text>
          </Text>

          <Text>© {new Date().getFullYear()} EBS Integrator. All rights reserved</Text>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
