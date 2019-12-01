import { AxiosResponse } from 'axios'
import store from '../../store'
import { logoutAction } from './redux'
import { AppState } from '../../redux'
import { USER_TYPE } from '../../utils/constants'
import { APIOrg, APIProfile } from './types'

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

const canModifyContainer = (ownerType: string, owner: string, profile?: APIProfile, usersOrgs: APIOrg[] = []) => Boolean(ownerType === USER_TYPE ? profile?.username === owner : profile?.username && usersOrgs.map(org => org.id).indexOf(profile.username) > -1)

export { redirectIfNotLoggedIn, addAuthToken, canModifyContainer }
