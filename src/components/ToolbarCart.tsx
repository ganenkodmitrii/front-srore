import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Tag, TagLabel, TagRightIcon } from '@chakra-ui/react'

import { useQuery } from '@tanstack/react-query'

import queries from '@/src/api/queries'
import { Currency } from '@/src/business'
import { useAuth, useCart } from '@/src/contexts'
import { CartIcon } from '@/src/icons'
import models from '@/src/models'

import DropDownCart from './DropDownCart'

const variants = {
  default: { bg: 'primary.500', color: 'white' },
  hover: { bg: 'white', color: 'primary.500' },
}

const ToolbarCart = () => {
  const pathname = usePathname()
  const { user, isAuth } = useAuth()
  const { cart, setCart } = useCart()
  const [isHoveringTag, setIsHoveringTag] = useState(false)
  const [isHoveringBox, setIsHoveringBox] = useState(false)
  const showDropDown = isHoveringTag || isHoveringBox

  useQuery({
    ...queries.cart.get(),
    enabled: !!isAuth,
    onSuccess: (data) => {
      setCart((prev) => ({
        ...prev,
        products: data.products,
        currency_code: user?.currency.code ?? Currency.USD,
        cart_products: data?.products?.map((p) => ({ product: p.product.id, quantity: p.quantity })),
      }))
    },
  })

  const cartIsDifferent = cart.cart_products?.some((cp) => !cart.products?.find((p) => p.product.id === cp.product))

  useQuery({
    queryKey: queries.products.getPaginated().queryKey,
    queryFn: queries.products.getPaginated({ ids: cart.cart_products?.map((p) => p.product).join(',') || '0' }).queryFn,
    enabled: !isAuth && cartIsDifferent,
    onSuccess: (data) => {
      const productsWithInfo = data.results?.map((p) => ({
        id: p.id,
        product: p,
        quantity: cart?.cart_products?.find((cp) => cp.product === p.id)?.quantity ?? 1,
      }))

      setCart((prev) => ({
        ...prev,
        cart_products: productsWithInfo?.map((p) => ({ product: p.product?.id, quantity: p.quantity })),
        products: productsWithInfo as models.ProductWithInfo[],
      }))
    },
  })

  return (
    <>
      <Tag
        as={Link}
        href="/checkout/products"
        cursor="pointer"
        borderRadius="16px"
        transition={'all 0.2s ease-in-out'}
        {...(showDropDown ? variants.hover : variants.default)}
        _hover={showDropDown ? variants.hover : {}}
        onMouseEnter={() => {
          const onCheckoutPage = pathname.includes('/checkout')
          const cartIsEmpty = !cart.products?.length

          if (onCheckoutPage || cartIsEmpty) return
          setIsHoveringTag(true)
        }}
        onMouseLeave={() => setTimeout(() => setIsHoveringTag(false), 500)}
      >
        <TagLabel>{cart.products?.reduce((acc, curr) => acc + curr.quantity, 0) ?? 0}</TagLabel>
        <TagRightIcon boxSize="22px">
          <CartIcon fontSize="24px" />
        </TagRightIcon>
      </Tag>

      <DropDownCart isOpen={showDropDown} setIsHoveringBox={setIsHoveringBox} />
    </>
  )
}

export default ToolbarCart
