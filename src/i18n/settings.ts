export type SelectedLanguage = 'ro' | 'en'

export const fallbackLng = 'en'
export const languages: SelectedLanguage[] = [fallbackLng, 'ro']
export const defaultNS = 'translation'

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}
