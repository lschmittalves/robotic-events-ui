export default {
  isAuthenticated (state) {
    return state.currentFirebaseUserInfo !== null && state.userIsLogged
  }
}
