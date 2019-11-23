import firebase from 'firebase'
import router from '@/router'

const userColRef = firebase.firestore().collection('users')

export function initialState () {
  return {
    token: localStorage.getItem('token') || '',
    errorMessages: [],
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
    updateUserRegistered: (state, payload) => {
      state.userIsRegistered = payload
    },
    addError: (state, payload) => {
      state.errorMessages.push(payload)
    },
    clearError: (state) => {
      state.errorMessages = []
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
      dispatch,
      commit
    }, {
      email,
      password
    }) {
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userInfo) => commit('loginSucess', userInfo.user.email))
        .then(() => dispatch('updateCurrentUser'))
        .catch(() => commit('loggout'))
    },
    userSignUp ({
      dispatch,
      commit,
      state
    }, {
      email,
      password
    }) {
      if (state.userIsLogged) {
        return dispatch('userInsert')
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => commit('loginSucess', true))
          .then(() => dispatch('userInsert'))
          .then(() => router.push('/'))
          .catch(() => {
            commit('loggout')
          })
      }
    },
    userSignOut ({
      commit
    }) {
      return firebase
        .auth()
        .signOut()
        .then(() => {
          commit('loggout')
          router.push('/login')
        })
        .catch(() => {
          commit('loggout')
          router.push('/login')
        })
    },
    userInsert ({
      commit,
      state
    }) {
      return userColRef
        .doc(firebase.auth().currentUser.uid)
        .set(state.currentUser).then(() => commit('updateUserRegistered', true))
        .then(() => router.push('/'))
        .catch((error) => {
          console.log('Error getting document:', error)
        })
    },
    updateCurrentUser ({
      commit
    }) {
      var docRef = userColRef.doc(firebase.auth().currentUser.uid)
      return docRef.get().then((doc) => {
        if (doc.exists) {
          commit('updateCurrentUser', doc.data())
        } else {
          router.push('/signup')
        }
      }).catch((error) => {
        console.log('Error getting document:', error)
      })
    }

  }
}
