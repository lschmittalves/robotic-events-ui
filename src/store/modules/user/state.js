export function initialState () {
  return {
    token: localStorage.getItem('token') || '',
    errorMessages: [],
    userIsLogged: false,
    currentGoogleUserInfo: {},
    currentPersonInfo: {}
  }
}
const state = initialState()

export default {
  state
}
