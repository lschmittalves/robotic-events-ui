import firebase from 'firebase'
import router from '@/router'
import {
  messages
} from '../../utils/messages'

const userColRef = firebase.firestore().collection('users')

export function initialState () {
  return {
    userIsLogged: false,
    userIsRegistered: false,
    currentUser: {
      email: '',
      fullName: '',
      birthDate: '',
      phone: ''
    }
  }
}

export default {
  state: initialState(),
  getters: {
    isAuthenticated: state => {
      return state.userIsLogged
    },
    userRegisterIsCompleted: state => {
      return state.userIsRegistered
    },
    getUserName: state => {
      return state.currentUser ? state.currentUser.fullName : ''
    }
  },
  mutations: {
    loggout: state => {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    loginSucess: (state, payload) => {
      state.currentUser.email = payload
      state.userIsLogged = true
    },
    updateCurrentUser: (state, payload) => {
      state.currentUser = payload
      state.userIsRegistered = true
    },
    updateEmail: (state, payload) => {
      state.currentUser.email = payload
    },
    updateFullName: (state, payload) => {
      state.currentUser.fullName = payload
    },
    updateBirthDate: (state, payload) => {
      state.currentUser.birthDate = payload
    },
    updatePhone: (state, payload) => {
      state.currentUser.phone = payload
    }
  },
  actions: {
    userLogin ({
      dispatch
    }, {
      email,
      password
    }) {
      this.dispatch('general/startLoading')
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
    },
    userLoginWithGoogle () {
      var provider = new firebase.auth.GoogleAuthProvider()
      this.dispatch('general/startLoading')
      return firebase
        .auth()
        .signInWithPopup(provider)
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
    },
    userLogInSucess ({
      dispatch,
      commit
    }, email) {
      commit('loginSucess', email)
      return dispatch('getCurrentUserFromFirestore')
        .then((curUser) => {
          if (curUser == null && router.currentRoute.path !== '/signup') {
            router.push('/signup')
          } else {
            commit('updateCurrentUser', curUser)
            if (router.currentRoute.path !== '/') {
              router.push('/')
            }
          }
        })
        .then(() => this.dispatch('general/finishLoading'))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
    },
    userSignUp ({
      dispatch,
      commit,
      state
    }, {
      email,
      password
    }) {
      this.dispatch('general/startLoading')
      if (state.userIsLogged) {
        return dispatch('userInsert')
          .then(() => dispatch('userLogInSucess', email))
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => dispatch('userInsert'))
          .catch((error) => this.dispatch('general/reportError', {
            userMessage: messages[error.code],
            errorObj: error
          }))
      }
    },
    userSignOut () {
      this.dispatch('general/startLoading')
      return firebase
        .auth()
        .signOut()
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
    },
    userSignOutSucess ({
      commit
    }) {
      commit('loggout')
      if (router.currentRoute.path !== '/login') {
        router.push('/login')
      }
      this.dispatch('general/finishLoading')
    },
    userInsert ({
      dispatch,
      state
    }) {
      return userColRef
        .doc(firebase.auth().currentUser.uid)
        .set(state.currentUser)
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
    },
    getCurrentUserFromFirestore ({
      dispatch
    }) {
      this.dispatch('general/startLoading')
      return userColRef
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((doc) => doc.exists ? Promise.resolve(doc.data()) : Promise.resolve(null))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
    }

  }
}
