'use client'

import { useState } from 'react'

import { notFound, useRouter } from 'next/navigation'

import { Box, Container, Grid, Skeleton, Text } from '@chakra-ui/react'

import { useQuery } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { ProductInfo, CustomizedBreadcrumbs, SpecificationsCard } from '@/src/components'
import { BreadcrumbType } from '@/src/components/CustomizedBreadcrumbs'
import { useTranslation } from '@/src/i18n'

interface PageProps {
  params: { lang: string; slug: string }
}

export const ClientProductDetailsPage = ({ params: { slug, lang } }: PageProps) => {
  const [newSlug, setNewSlug] = useState(slug)
  const { t } = useTranslation('products')
  const router = useRouter()

  const {
    data: product,
    isError,
    isSuccess,
  } = useQuery({
    ...queries.products.getBySlug(newSlug),
    retry: false,
    onSuccess: (data) => router.replace(`/${lang}/products/${data.slug}`),
  })
  if (isError) notFound()

  const generalAttributes = product?.attributes.filter((a) => !a.is_different).map((a) => [a.attribute.name, a.value])

  const breadcrumbItems = [
    ...(product?.categories?.[0]
      ?.map((c) => ({
        id: c.id,
        name: c.name,
        href: `/${lang}/products?categories=${c.id}`,
      }))
      .filter(Boolean) || []),
    product ? { id: product.id, name: product.name } : undefined,
  ].filter(Boolean) as BreadcrumbType[]

  return (
    <Container p="32px 20px 64px">
      <Skeleton isLoaded={isSuccess} mb="8px">
        <CustomizedBreadcrumbs mb="8px" items={breadcrumbItems} />
      </Skeleton>

      <Skeleton isLoaded={isSuccess} mb="40px">
        <ProductInfo mb="40px" product={product} onProductChange={(slug) => slug && setNewSlug(slug)} />
      </Skeleton>

      <Skeleton isLoaded={isSuccess} mb="40px">
        <Box as="section" mb="40px">
          <Text variant="capitalize-first" as="h4" mb="8px">
            {t('description')}
          </Text>

          <p className="text-14">{product?.description}</p>
        </Box>
      </Skeleton>

      {!!generalAttributes?.length && (
        <Skeleton isLoaded={isSuccess} mb="40px">
          <Text variant="capitalize-first" as="h4" mb="8px">
            {t('specifications')}
          </Text>

          <Grid as="section" mb="40px">
            <SpecificationsCard title="general" specifications={generalAttributes} />
          </Grid>
        </Skeleton>
      )}
    </Container>
  )
}
