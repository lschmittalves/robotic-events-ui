import firebase from 'firebase'
import {
  messages
} from '../../utils/messages'

const teamsColRef = firebase.firestore().collection('teams')
// const usersColRef = firebase.firestore().collection('users')

export function initialState () {
  return {
    currentTeam: {
      name: '',
      city: '',
      stateRegion: '',
      collegeName: '',
      capitanUserId: '',
      memberUsers: [],
      robots: []
    },
    loadedMembersInfo: []
  }
}

export default {
  state: initialState(),
  getters: {
    isCurrentUserCapitan: state => {
      return state.currentTeam.capitanUserId === firebase.auth().currentUser.uid
    },
    currentUserHasATeam: state => {
      return (!!state.currentTeam && state.currentTeam.name) !== ''
    },
    getCurrentTeam: state => {
      return state.currentTeam ? state.currentTeam : initialState().currentTeam
    },
    getTeamMembers: state => {
      return state.loadedMembersInfo ? state.loadedMembersInfo : []
    }
  },
  mutations: {
    updateCurrentTeam: (state, payload) => {
      state.currentTeam = {
        ...state.currentTeam,
        ...(payload || initialState().currentTeam)
      }
    },
    updateName: (state, payload) => {
      state.currentUser.email = payload
    },
    updateCity: (state, payload) => {
      state.currentUser.fullName = payload
    },
    updateStateRegion: (state, payload) => {
      state.currentUser.birthDate = payload
    },
    updateCollegeName: (state, payload) => {
      state.currentUser.phone = payload
    },
    updateCapitanUserId: (state, payload) => {
      state.currentUser.phone = payload
    }
  },
  actions: {
    loadCurrentTeamFromFirestore ({
      dispatch,
      commit
    }) {
      return this.dispatch('general/startLoading')
        .then(() => dispatch('getCurrentTeamFromFirestore'))
        .then((team) => commit('updateCurrentTeam', team))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    },
    getCurrentTeamFromFirestore () {
      return teamsColRef
        .doc(this.state.user.currentUser.teamName)
        .get()
        .then((doc) => doc.exists ? Promise.resolve(doc.data()) : Promise.resolve(null))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
    },
    teamAddUpdate ({
      state
    }) {
      let updates = {}
      updates[`/teams/${state.currentTeam.teamName}`] = state.currentTeam
      updates[`/users/${firebase.auth().currentUser.uid}`] = {
        teamName: state.currentTeam.teamName
      }

      return this.dispatch('general/startLoading')
        .then(() => firebase.database().ref().update(updates))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    }

  }
}
