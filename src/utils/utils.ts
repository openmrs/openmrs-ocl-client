import { LOCALES } from './constants'
import { snakeCase } from 'lodash'

const findLocale = (localeCode: string, fallback = 'en') => LOCALES.find(
  currentLocale => currentLocale.value === localeCode,
) || LOCALES.find(currentLocale => currentLocale.value === fallback)

const getPrettyError = (errors: { [key: string]: string[] | undefined } | undefined, field?: string) => {
  if (!errors) return

  const errorList: string[] | undefined = field ? errors[field] : errors['__all__']
  if (!errorList) return

  return errorList.join(', ')
}

const keysToSnakeCase = (item?: any) => {
  const isArray = (a: any) => {
    return Array.isArray(a)
  }

  const isObject = (o: any) => {
    return o === Object(o) && !isArray(o) && typeof o !== 'function'
  }

  if (isObject(item)) {
    const newItem: { [key: string]: any } = {}

    Object.keys(item)
      .forEach((k) => {
        newItem[snakeCase(k)] = keysToSnakeCase(item[k])
      })

    return newItem
  } else if (isArray(item)) {
    return item.map((i: any) => {
      return keysToSnakeCase(i)
    })
  }

  return item
}

const buildPartialSearchQuery = (query: string): string => `${query.replace(new RegExp(' ', 'g'), '* ')}*`

export { findLocale, getPrettyError, keysToSnakeCase, buildPartialSearchQuery }
