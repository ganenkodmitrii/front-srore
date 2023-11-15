import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbProps } from '@chakra-ui/react'

import { ChevronRightIcon } from '@/src/icons'

export interface BreadcrumbType {
  id: number
  name: string
  href?: string
}

interface CustomizedBreadcrumbsProps extends BreadcrumbProps {
  items: BreadcrumbType[]
}

const CustomizedBreadcrumbs = ({ items, ...props }: CustomizedBreadcrumbsProps) => {
  return (
    <Breadcrumb {...props} spacing="8px" separator={<ChevronRightIcon fontSize="24px" color="mid-gray.400" />}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <BreadcrumbItem key={index} isCurrentPage={isLast}>
            <BreadcrumbLink color={isLast ? '' : 'mid-grey.400'} href={item.href}>
              {item.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}

export default CustomizedBreadcrumbs
