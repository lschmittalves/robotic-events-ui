import firebase from 'firebase'
import router from '@/router'

export function initialState () {
  return {
    token: localStorage.getItem('token') || '',
    errorMessages: [],
    userIsLogged: false,
    currentFirebaseUserInfo: {},
    currentPersonInfo: {}
  }
}

export default {
  state: initialState(),
  getters: {
    isAuthenticated: state => {
      return state.userIsLogged
    }
  },
  mutations: {
    LOGGOUT: state => {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    LOGIN_SUCESS: (state, payload) => {
      state.currentFirebaseUserInfo = payload
      state.userIsLogged = true
    },
    ADD_ERROR: (state, payload) => {
      state.errorMessages.push(payload)
    },
    CLEAR_ERRORS: (state) => {
      state.errorMessages = []
    }
  },
  actions: {
    userLogin ({
      commit
    }, {
      email,
      password
    }) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          commit('LOGIN_SUCESS', user)
          router.push('/')
        })
        .catch(() => {
          commit('LOGGOUT', null)
        })
    },
    userSignUp ({
      commit
    }, {
      email,
      password
    }) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          commit('LOGIN_SUCESS', user)
          router.push('/')
        })
        .catch(() => {
          commit('LOGGOUT')
        })
    },
    userSignOut ({
      commit
    }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit('LOGGOUT')
          router.push('/login')
        })
        .catch(() => {
          commit('LOGGOUT')
          router.push('/login')
        })
    }
  }
}
