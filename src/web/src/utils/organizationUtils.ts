import { TFunction } from "i18next"
import { Category } from "../models/organization"

export function getCategoryLabel(category: Category | undefined, t: TFunction): string {
  switch (category) {
    case Category.FacultyAndUmbrella:
      return t("organization.category.FacultyAndUmbrella")
    case Category.Hobby:
      return t("organization.category.Hobby")
    case Category.StudentAssociation:
      return t("organization.category.StudentAssociation")
    case Category.Other:
      return t("organization.category.Other")
    default:
      return t("organization.category.Unknown")
  }
}

export function getCategoryColor(
  category?: Category,
): "primary" | "secondary" | "success" | "warning" {
  switch (category) {
    case Category.FacultyAndUmbrella:
      return "primary"
    case Category.Hobby:
      return "success"
    case Category.StudentAssociation:
      return "secondary"
    case Category.Other:
      return "warning"
    default:
      return "primary"
  }
}
