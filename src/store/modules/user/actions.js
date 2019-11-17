import firebase from 'firebase'
import router from '@/router'

export default {
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
        router.push('/login')
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
        router.push('/signup')
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
