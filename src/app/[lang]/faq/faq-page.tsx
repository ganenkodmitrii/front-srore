'use client'

import { useState } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Heading,
  Box,
  Button,
  Card,
  Container,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Center,
} from '@chakra-ui/react'

import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'

import groupAvatar from '@/public/avatar-group.png'
import queries from '@/src/api/queries'
import { FAQ_API_NAME, FAQ_SLUG } from '@/src/app-constants'
import { useTranslation } from '@/src/i18n'
import { ChevronDownIcon } from '@/src/icons'
import models from '@/src/models'

interface AccordionSectionProps {
  question: string
  answer: string
}

interface FAQItems {
  [category: string]: AccordionSectionProps[]
}

export const ClientFAQPage = () => {
  const { t } = useTranslation('faq_page')
  const { lang } = useParams()
  const [activeTab, setActiveTab] = useState(0)
  const [collapse, setCollapse] = useState([0])

  const { data } = useQuery({
    ...queries.contentDelivery.getContentBySlug(FAQ_API_NAME, `${FAQ_SLUG}-${lang}`, 1),
    select: (data) => {
      const faqItems: FAQItems = data?.items.reduce((acc: FAQItems, currentValue: models.Faq) => {
        if (!acc[currentValue.category]) {
          acc[currentValue.category] = []
        }
        acc[currentValue.category].push({ question: currentValue.question, answer: currentValue.answer })

        return acc
      }, {})

      return {
        title: data?.title,
        description: data?.description,
        faqItems: faqItems,
      }
    },
  })

  return (
    <Container maxW="1440px" p="0 20px" m="56px auto 64px">
      <Center>
        <Heading fontSize="36px" fontWeight="bold" mb="24px">
          {data?.title}
        </Heading>
      </Center>
      <Center mb="64px">
        <Text as="h2" color="mid-grey.400" maxW="680px" align="center">
          {data?.description}
        </Text>
      </Center>

      <Tabs
        width={{ base: '100%', md: '700px' }}
        m="0 auto"
        onChange={(index) => {
          setCollapse([0])
          setActiveTab(index)
        }}
      >
        <TabList border="0" justifyContent="center">
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing="6px"
            border="1px solid"
            borderColor="light-grey.400"
            borderRadius="6px"
            p="6px"
          >
            {data?.faqItems &&
              Object.keys(data?.faqItems)?.map((key) => (
                <motion.div
                  key={key}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <Tab
                    borderRadius="6px"
                    border="1px solid transparent"
                    _selected={{
                      bgColor: 'white',
                      borderColor: 'light-grey.400',
                    }}
                    _hover={{ borderColor: 'light-grey.400' }}
                  >
                    {t(key)}
                  </Tab>
                </motion.div>
              ))}
          </Stack>
        </TabList>

        <TabPanels mt="64px">
          {data?.faqItems &&
            Object.keys(data?.faqItems)?.map((tab, index) => (
              <TabPanel key={`${tab}--${index}`}>
                <AnimatePresence mode="wait">
                  {index === activeTab && (
                    <motion.div
                      key={tab}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Accordion defaultIndex={[0]} allowToggle onChange={(v) => setCollapse([Number(v)])}>
                        {data?.faqItems[tab]?.map((item, i) => {
                          const isActive = collapse.includes(i)

                          return (
                            <AccordionItem
                              key={i}
                              borderBottom="none"
                              borderTop={i === 0 ? 'none' : '1px solid'}
                              borderColor="light-grey.500"
                            >
                              <AccordionButton p="16px 10px">
                                <Box
                                  as="h3"
                                  flex="1"
                                  textAlign="left"
                                  color={isActive ? 'dark-grey.500' : 'mid-grey.400'}
                                >
                                  {item?.question}
                                </Box>

                                <Box
                                  transformOrigin="0 13px"
                                  transform={isActive ? 'scaleY(-1)' : ''}
                                  transition="transform 0.3s ease-in-out"
                                >
                                  <ChevronDownIcon fontSize="32px" />
                                </Box>
                              </AccordionButton>
                              <AccordionPanel p="4px 10px 20px 10px">
                                <Text className="text-16">{item?.answer}</Text>
                              </AccordionPanel>
                            </AccordionItem>
                          )
                        })}
                      </Accordion>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabPanel>
            ))}
        </TabPanels>
      </Tabs>

      <Card mt="64px" p="40px 32px" borderRadius="16px" bgColor="light-grey.100" boxShadow="">
        <VStack spacing="32px" alignItems="center">
          <Image src={groupAvatar} width={120} height={56} alt="FAQ" />

          <Box>
            <Box as="h2" textAlign="center">
              {t('cant_find_answer')}
            </Box>

            <Text textAlign="center" color="mid-grey.400" mt="8px">
              {t('please_talk_to_our_friendly_team')}
            </Text>
          </Box>

          <Button as="a" href="mailto:sales@ebs-integrator.com" colorScheme="primary">
            {t('contact_us')}
          </Button>
        </VStack>
      </Card>
    </Container>
  )
}
