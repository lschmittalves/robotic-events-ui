import { initialState } from './state'

export default {
  LOGGOUT: state => {
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },
  LOGIN_SUCESS: (state, payload) => {
    state.currentGoogleUserInfo = payload
    state.userIsLogged = true
  },
  ADD_ERROR: (state, payload) => {
    state.errorMessages.push(payload)
  },
  CLEAR_ERRORS: (state) => {
    state.errorMessages = []
  }
}
