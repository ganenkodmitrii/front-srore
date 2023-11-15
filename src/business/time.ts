import { SelectedLanguage } from '@/src/i18n'
import enTranslation from '@/src/i18n/locales/en.json'
import roTranslation from '@/src/i18n/locales/ro.json'

//  24.05.2023 (13:58)
export const formateDate = (date?: string) => {
  if (!date) return ''

  const dateObj = new Date(date)

  return `${dateObj.getDate().toString().padStart(2, '0')}.${dateObj
    .getMonth()
    .toString()
    .padStart(2, '0')}.${dateObj.getFullYear()} (${dateObj.getHours()}:${dateObj.getMinutes()})`
}

// 2 zile in urma
export const timeAgo = (date: string, lang: SelectedLanguage) => {
  const translations = lang === 'ro' ? roTranslation : enTranslation

  const dateObj = new Date(date)
  const currentDate = new Date()

  const diff = currentDate.getTime() - dateObj.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return translations.time.today
  }

  if (days === 1) {
    return translations.time.yesterday
  }

  return `${days} ${translations.time.days_ago}`
}
