export function initialState () {
  return {
    token: localStorage.getItem('token') || '',
    errorMessages: [],
    userIsLogged: false,
    currentFirebaseUserInfo: {},
    currentPersonInfo: {}
  }
}
const state = initialState()

export default {
  state
}
