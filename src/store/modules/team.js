import firebase from 'firebase'
import {
  messages
} from '../../utils/messages'

const teamsColRef = firebase.firestore().collection('teams')
const robotsColRef = firebase.firestore().collection('robots')
const userColRef = firebase.firestore().collection('users')

export function initialState () {
  return {
    currentTeam: {
      name: '',
      city: '',
      stateRegion: '',
      collegeName: '',
      capitanUserEmail: ''
    },
    memberUsers: [],
    robots: []
  }
}

export default {
  state: initialState(),
  getters: {
    isCurrentUserCapitan: state => {
      return state.currentTeam.capitanUserEmail === firebase.auth().currentUser.email
    },
    currentUserHasATeam: state => {
      return (!!state.currentTeam && state.currentTeam.name) !== ''
    },
    getCurrentTeam: state => {
      return state.currentTeam ? state.currentTeam : initialState().currentTeam
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
    updateCapitanUserEmail: (state, payload) => {
      state.currentUser.capitanUserEmail = payload
    },
    loadMembers: (state, payload) => {
      state.memberUsers = payload
    },
    addMember: (state, payload) => {
      state.memberUsers.push(payload)
    },
    removeMember: (state, payload) => {
      state.memberUsers.splice(state.memberUsers.findIndex(member => member.email === payload.email), 1)
    },
    loadRobots: (state, payload) => {
      state.robots = payload
    },
    addRobot: (state, payload) => {
      state.robots.push(payload)
    },
    removeRobot: (state, payload) => {
      state.robots.splice(state.robots.findIndex(robot => robot.name === payload.name), 1)
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
        .doc(this.state.user.getters.getTeamName)
        .get()
        .then((doc) => doc.exists ? Promise.resolve(doc.data()) : Promise.resolve(null))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
    },
    loadTeamMembersFromFirestore ({
      dispatch,
      commit
    }) {
      return this.dispatch('general/startLoading')
        .then(() => dispatch('getTeamMembersFromFirestore'))
        .then((members) => commit('loadMembers', members))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    },
    getTeamMembersFromFirestore () {
      return teamsColRef
        .doc(this.state.user.getters.getTeamName)
        .collection('members')
        .get()
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
    },
    loadTeamRobotsFromFirestore ({
      dispatch,
      commit
    }) {
      return this.dispatch('general/startLoading')
        .then(() => dispatch('getTeamRobotsFromFirestore'))
        .then((robots) => commit('loadRobots', robots))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    },
    getTeamRobotsFromFirestore () {
      return teamsColRef
        .doc(this.state.user.getters.getTeamName)
        .collection('robots')
        .get()
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
    },
    changeCapitanMember ({
      commit,
      state
    }, newCapitanEmail) {
      let updates = {}
      updates[`/teams/${state.currentTeam.teamName}`] = {
        capitanUserEmail: newCapitanEmail
      }

      return this.dispatch('general/startLoading')
        .then(() => firebase.database().ref().update(updates))
        .then(() => commit('updateCapitanUserEmail', newCapitanEmail))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    },
    addMember ({
      commit,
      state,
      dispatch
    },
    memberUser) {
      let updates = {}
      updates[`/teams/${state.currentTeam.teamName}/members/${memberUser.email}`] = memberUser
      updates[`/users/${memberUser.email}`] = {
        team: state.currentTeam
      }
      return this.dispatch('general/startLoading')
        .then(() => dispatch('checkIfNewMemberIfValid', memberUser))
        .then(() => firebase.database().ref().update(updates))
        .then(() => commit('addMember', memberUser))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    },
    checkIfNewMemberIfValid ({
      commit
    },
    memberUser) {
      return userColRef
        .doc(memberUser.email)
        .get()
        .then((doc) => {
          let error = {
            code: ''
          }
          if (!doc.exists) {
            error.code = 'team/member-not-found'
            throw error
          }

          let foundUser = doc.data()
          if (foundUser.team && foundUser.team.name !== '') {
            error.code = 'team/member-has-team'
            throw error
          }
        })
    },
    removeMember ({
      commit,
      state
    }, memberUser) {
      return this.dispatch('general/startLoading')
        .then(() => teamsColRef.doc(state.currentTeam.teamName).collection('members').doc(memberUser.email).delete())
        .then(() => commit('removeMember', memberUser))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    },
    addRobot ({
      commit,
      state
    }, robot) {
      // refresh robot team information
      robot['team'] = state.currentTeam
      let updates = {}
      updates[`/teams/${state.currentTeam.teamName}/robots/${robot.name}`] = robot
      updates[`/robots/${robot.name}`] = robot

      return this.dispatch('general/startLoading')
        .then(() => firebase.database().ref().update(updates))
        .then(() => commit('addRobot', robot))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    },
    removeRobot ({
      commit,
      state
    }, robot) {
      return this.dispatch('general/startLoading')
        .then(() => teamsColRef.doc(state.currentTeam.teamName).collection('robots').doc(robot.name).delete())
        .then(() => robotsColRef.doc(robot.name).doc(robot.name).delete())
        .then(() => commit('removeRobot', robot))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: messages[error.code],
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    }

  }
}
