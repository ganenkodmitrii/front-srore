import { UseTranslationOptions } from 'react-i18next'

import { Namespace, createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'

import { SelectedLanguage, getOptions, languages } from './settings'

const initI18next = async (lng: SelectedLanguage, ns: Namespace) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string) => import(`./locales/${language}.json`)))
    .init(getOptions(lng, ns as string))
  return i18nInstance
}

export async function useTranslationServer(
  lng: SelectedLanguage,
  ns?: Namespace,
  options?: UseTranslationOptions<undefined>,
) {
  const language = lng || languages[0]
  const i18nextInstance = await initI18next(language, ns as string)
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options?.keyPrefix),
    i18n: i18nextInstance,
  }
}
