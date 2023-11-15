import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  useUpdateEffect,
} from '@chakra-ui/react'

import models from '../models'

interface CustomAccordionProps {
  title: string
  childrenItems?: models.CategoryWithSubcategories[]
  onClose?: () => void
}

const CustomAccordion = ({ title, childrenItems, onClose }: CustomAccordionProps) => {
  const { lang } = useParams()
  const search = useSearchParams()

  useUpdateEffect(() => {
    // this is a hack to close BurgerMenu on change search params
    // because onClose is undefined in AccordionPanel
    onClose?.()
  }, [search])

  return (
    <Accordion allowToggle>
      <AccordionItem border="none">
        <AccordionButton p="8px 0" m="0" fontSize="inherit" textAlign="left" _hover={{ backgroundColor: 'none' }}>
          <Box>{title}</Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          {childrenItems?.map((elem: models.CategoryWithSubcategories) => {
            return !elem.subcategories ? (
              <Box
                key={elem.id}
                as={Link}
                href={`/${lang}/products?categories=${elem.id}`}
                display="block"
                color="gray.300"
                p="8px 0px"
              >
                {elem.name}
              </Box>
            ) : (
              <CustomAccordion key={elem.id} title={elem.name} childrenItems={elem.subcategories} />
            )
          })}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default CustomAccordion
