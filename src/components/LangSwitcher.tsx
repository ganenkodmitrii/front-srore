import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { HStack, Text } from '@chakra-ui/react'

import { languages } from '@/src/i18n'

const LangSwitcher = () => {
  const router = useRouter()
  const currentRoute = usePathname()
  const [langFromPath, ...rest] = currentRoute.slice(1).split('/')
  const searchParams = useSearchParams().toString()
  const pathWithoutLang = `${rest.join('/')}${searchParams ? `?${searchParams}` : ''}`

  return (
    <HStack gap="16px">
      {languages.map((language, idx) => {
        const active = language === langFromPath
        return (
          <Text
            key={idx}
            as="button"
            className="text-16"
            color={active ? 'mid-grey.400' : 'white'}
            pointerEvents={active ? 'none' : 'auto'}
            onClick={() => {
              router.push(`/${language}/${pathWithoutLang}`)
            }}
          >
            {language.toLocaleUpperCase()}
          </Text>
        )
      })}
    </HStack>
  )
}

export default LangSwitcher
