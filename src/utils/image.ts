export const isValidImage = (url?: string) => {
  if (!url) return false

  if (url.startsWith('http')) {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  if (url.startsWith('/')) {
    return /\.(apng|avig|jpg|jpeg|jfif|pjpeg|pjp|svg|png|gif|webp)$/.test(url)
  }

  return false
}
