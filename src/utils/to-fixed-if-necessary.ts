/**
 *
 * @example
 * toFixedIfNecessary(324, 2) === "324"
 * toFixedIfNecessary(18.3563, 2) -> "18.35"
 * toFixedIfNecessary(18.3, 2) -> "18.30"
 */
export const toFixedIfNecessary = (value: number, decimals: number) => {
  return value.toFixed(2).replace(new RegExp(`.${'0'.repeat(decimals)}$`), '')
}
