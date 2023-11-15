export const getDiscountPercentage = (price: number, discountedPrice: number) => {
  const result = 100 - (discountedPrice / price) * 100
  return Math.max(1, Math.min(result, 99)).toFixed()
}
