import firebase from 'firebase'
import store from '@/store'

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    store.dispatch('user/userLogInSucess', user.email)
  } else {
    store.dispatch('user/userSignOutSucess')
  }
})
