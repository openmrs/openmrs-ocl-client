import axios, { AxiosTransformer } from 'axios'
import { BASE_URL } from './utils'
import { addAuthToken, redirectIfNotLoggedIn } from './apps/authentication/utils' // failed to respect module here because of a circular import issue

axios.defaults.headers.common['Content-Type'] = 'application/json'

const defaultRequestTransformers = (): AxiosTransformer[] => {
  const { transformRequest } = axios.defaults
  if (!transformRequest) {
    return []
  } else if (transformRequest instanceof Array) {
    return transformRequest
  } else {
    return [transformRequest]
  }
}

const defaultResponseTransformers = (): AxiosTransformer[] => {
  const { transformResponse } = axios.defaults
  if (!transformResponse) {
    return []
  } else if (transformResponse instanceof Array) {
    return transformResponse
  } else {
    return [transformResponse]
  }
}

const authenticatedInstance = axios.create({
  baseURL: BASE_URL,
  transformRequest: [...defaultRequestTransformers(), addAuthToken],
  transformResponse: [...defaultResponseTransformers(), redirectIfNotLoggedIn],
})

const unAuthenticatedInstance = axios.create({
  baseURL: BASE_URL,
})

export { authenticatedInstance, unAuthenticatedInstance }
