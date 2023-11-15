import queryString from 'query-string'

export type StringifyQuery = queryString.StringifiableRecord

export const stringifyUrl = (
  url: string,
  query: queryString.StringifiableRecord,
  options?: queryString.StringifyOptions,
) => {
  return queryString.stringifyUrl(
    {
      url,
      query,
    },
    options,
  )
}
