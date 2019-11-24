import firebase from 'firebase'
import router from '@/router'

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
      return state.currentUser.fullName
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
    userLogin ({ commit }, {
      email,
      password
    }) {
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => console.log(error))
    },
    userLogInSucess ({
      dispatch,
      commit
    }, {
      email
    }) {
      commit('loginSucess', email)
      return dispatch('getCurrentUserFromFirestore')
        .then((curUser) => {
          if (curUser == null) {
            router.push('/signup')
          } else {
            commit('updateCurrentUser', curUser)
            router.push('/')
          }
        })
        .catch((error) => console.log(error))
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
          .catch((error) => console.log(error))
      }
    },
    userSignOut () {
      return firebase
        .auth()
        .signOut()
        .catch((error) => console.log(error))
    },
    userSignOutSucess ({
      commit
    }) {
      commit('loggout')
      if (router.currentRoute.path !== '/login') {
        router.push('/login')
      }
    },
    userInsert ({
      state
    }) {
      return userColRef
        .doc(firebase.auth().currentUser.uid)
        .set(state.currentUser)
        .catch((error) => console.log(error))
    },
    getCurrentUserFromFirestore () {
      return userColRef
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((doc) => doc.exists ? Promise.resolve(doc.data()) : Promise.resolve(null))
        .catch((error) => console.log(error))
    }

  }
}
