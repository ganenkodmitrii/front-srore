import React, { useEffect } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Box, Container, List, ListItem, Grid, Flex, Text, useMediaQuery } from '@chakra-ui/react'

import { motion } from 'framer-motion'

import { useGetCategories } from '../hooks'
import models from '../models'

const activeStyle = {
  bg: 'primary.100',
  color: 'primary.500',
}

interface CategoriesProps {
  onMouseLeave: () => void
  onMouseEnter: () => void
}

const Categories = ({ onMouseLeave, onMouseEnter }: CategoriesProps) => {
  const { lang } = useParams()
  const { data } = useGetCategories()
  const [activeCategory, setActiveCategory] = React.useState('')
  const [isSmaller1080] = useMediaQuery('(max-width: 1080px)')
  const [isSmaller780] = useMediaQuery('(max-width: 780px)')
  const numberOfColumns = isSmaller780 ? 2 : isSmaller1080 ? 3 : 4
  const onCategoryClick = (e: React.SyntheticEvent<HTMLLIElement>) => {
    setActiveCategory(e.currentTarget.innerText)
  }

  useEffect(() => {
    setActiveCategory(data?.[0]?.name ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const categories = data?.filter((category) => category.name === activeCategory)?.[0]?.subcategories
  //Sort descending by number of subcategories
  categories?.sort((a, b) => (b.subcategories?.length ?? 0) - (a.subcategories?.length ?? 0))

  const chunkCategories: Array<Array<Partial<models.CategoryWithSubcategories> | null>> = []

  if (categories?.length) {
    for (let i = 0, cnt = 0; i < categories.length; i += numberOfColumns, cnt++) {
      chunkCategories[cnt] = categories.slice(i, i + numberOfColumns)
      if (chunkCategories[cnt].length < numberOfColumns) {
        const chuckLength = chunkCategories[cnt].length
        for (let j = 0; j < numberOfColumns - chuckLength; j++) chunkCategories[cnt].push(null)
        chunkCategories[cnt].reverse()
      } else if (cnt % 2) chunkCategories[cnt]?.reverse()
    }
  }

  return (
    <Container pos="relative" zIndex="4">
      {categories && (
        <motion.div
          onMouseLeave={onMouseLeave}
          onMouseEnter={onMouseEnter}
          transition={{ type: 'tween', ease: 'linear', duration: 0.3 }}
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          style={{
            overflow: 'hidden',
            display: 'flex',
            position: 'absolute',
            left: '0',
            width: '100%',
            borderBottomRightRadius: '8px',
            borderBottomLeftRadius: '8px',
            backgroundColor: '#e5e9eb',
          }}
        >
          <List bg="white" color="black" p="16px" borderBottomLeftRadius="8px">
            {data?.map((elem) => (
              <ListItem
                key={elem.id}
                mt="10px"
                p="8px"
                cursor="pointer"
                borderRadius="4px"
                whiteSpace="nowrap"
                _hover={{ ...activeStyle }}
                onMouseOver={onCategoryClick}
                bg={elem.name === activeCategory ? 'primary.100' : 'unset'}
                color={elem.name === activeCategory ? 'primary.500' : 'unset'}
                transition="all ease 0.3s"
              >
                <Link href={`/${lang}/products?categories=${elem.id}`} onClick={onMouseLeave}>
                  {elem.name}
                </Link>
              </ListItem>
            ))}
          </List>

          <Grid
            p="16px 40px"
            templateColumns={`repeat(${numberOfColumns}, 1fr)`}
            columnGap="40px"
            w="100%"
            color="dark-grey.400"
          >
            {[...Array(numberOfColumns)].map((_, idx) => (
              <Flex key={idx} direction="column" gap="24px" fontSize="14px" color="dark-grey.400">
                {chunkCategories.map((elem, i) => (
                  <Box key={i}>
                    <Text
                      fontWeight="600"
                      mb="8px"
                      cursor="default"
                      w="fit-content"
                      textTransform="capitalize"
                      transition="all 0.2s ease"
                      _hover={{ color: 'primary.400' }}
                    >
                      <Link href={`/${lang}/products/?categories=${elem[idx]?.id}`} onClick={onMouseLeave}>
                        {elem[idx]?.name}
                      </Link>
                    </Text>
                    {elem[idx]?.subcategories?.map((sub) => (
                      <Text
                        key={sub.id}
                        color="mid-grey.400"
                        mb="4px"
                        cursor="pointer"
                        textTransform="capitalize"
                        _hover={{ WebkitTextStroke: '0.4px black' }}
                        w="fit-content"
                      >
                        <Link href={`/${lang}/products?categories=${sub?.id}`} onClick={onMouseLeave}>
                          {sub.name}
                        </Link>
                      </Text>
                    ))}
                  </Box>
                ))}
              </Flex>
            ))}
          </Grid>
        </motion.div>
      )}
    </Container>
  )
}

export default Categories
