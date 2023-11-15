import models from '../models'

export function getNameAndValues(nameOfAttributes: string[], variants: models.Product[] | undefined) {
  return nameOfAttributes.map((name) => ({
    name,
    values: Array.from(
      new Set(
        variants?.map((v) => {
          return {
            name: v.attributes.find((a) => a.attribute.name === name)?.value,
            image: v.attributes.find((a) => a.attribute.name === name)?.image,
          }
        }),
      ),
    ).filter((val): val is { name: string; image: string } => !!val.name),
  }))
}
