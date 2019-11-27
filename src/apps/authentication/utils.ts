import { AxiosResponse } from 'axios'
import store from '../../store'
import { logoutAction } from './redux'
import { AppState } from '../../redux'

const redirectIfNotLoggedIn = (response: AxiosResponse) => {
  if (response.status === 401) {
    // todo redirect to log in page
    store.dispatch(logoutAction())
  }
  return response
}

const addAuthToken = (data: any, headers: any) => {
  headers['Authorization'] = `Token ${(store.getState() as AppState).auth.token}`
  return data
}

export { redirectIfNotLoggedIn, addAuthToken }
