import { useQuery } from '@tanstack/react-query'

import queries from '../api/queries'
import models from '../models'

const buildCategoryTree = (
  categories: models.Category[],
  parentId: number | null = null,
): models.CategoryWithSubcategories[] | undefined => {
  const filteredCategories = categories.filter((category) => category.parent === parentId)

  if (!filteredCategories?.length) return undefined

  return filteredCategories.map((category) => ({
    id: category.id,
    name: category.name,
    subcategories: buildCategoryTree(categories, category.id),
  }))
}

export const useGetCategories = () => {
  const query = useQuery({
    ...queries.categories.getAll(),
    select: (data: models.Category[]) => {
      const allCategories = data.filter((c) => c.show_in_menu && c.visible && c.visible_for_users)
      const categoriesWithParent = allCategories.filter((category) => category.parent)
      const directParents = allCategories.filter((category) =>
        categoriesWithParent.find((childCategory) => childCategory.parent === category.id),
      )
      const parentsWithGrandparent = directParents.filter((parentCategory) =>
        directParents.find((childCategory) => childCategory.parent === parentCategory.id),
      )

      const topCategories = parentsWithGrandparent.map((parent) => ({
        id: parent.id,
        name: parent.name,
        subcategories: buildCategoryTree(allCategories, parent.id),
      }))

      return topCategories
    },
  })

  return query
}
