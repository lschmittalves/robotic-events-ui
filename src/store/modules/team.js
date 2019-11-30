import firebase from 'firebase'
import {
  messages
} from '../../utils/messages'
import axios from 'axios'

const teamsColRef = firebase.firestore().collection('teams')
const robotsColRef = firebase.firestore().collection('robots')
const userColRef = firebase.firestore().collection('users')

export function initialState () {
  return {
    currentTeam: {
      name: '',
      city: '',
      province: '',
      collegeName: '',
      capitanUserEmail: ''
    },
    provinces: [],
    provinceCities: [],
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
    getCurrentTeam: state => {
      return state.currentTeam ? state.currentTeam : initialState().currentTeam
    },
    getSelectedProvinceId: state => {
      let curProvince = state.provinces.find(province => province.description === state.currentTeam.province)
      if (curProvince) {
        return curProvince.ibgeId
      }
      return 0
    },
    getSelectedCityId: state => {
      let curCity = state.provinceCities.find(city => city.description === state.currentTeam.city)
      if (curCity) {
        return curCity.ibgeId
      }
      return 0
    },
    getTeamName: state => {
      return state.currentTeam ? state.currentTeam.name : ''
    },
    getTeamCity: state => {
      return state.currentTeam ? state.currentTeam.city : ''
    },
    getTeamProvince: state => {
      return state.currentTeam ? state.currentTeam.province : ''
    },
    getTeamCollege: state => {
      return state.currentTeam ? state.currentTeam.collegeName : ''
    },
    getTeamCapitan: state => {
      return state.currentTeam ? state.currentTeam.capitanUserEmail : ''
    }
  },
  mutations: {
    updateCurrentTeam: (state, payload) => {
      state.currentTeam = {
        ...state.currentTeam,
        ...(payload || initialState().currentTeam)
      }
    },
    updateTeamName: (state, payload) => {
      state.currentTeam.name = payload
    },
    updateTeamCity: (state, payload) => {
      state.currentTeam.city = payload
    },
    updateTeamProvince: (state, payload) => {
      state.currentTeam.province = payload
    },
    updateCollegeName: (state, payload) => {
      state.currentTeam.collegeName = payload
    },
    updateCapitanUserEmail: (state, payload) => {
      state.currentTeam.capitanUserEmail = payload
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
    },
    loadProvinces: (state, payload) => {
      state.provinces = payload
    },
    loadProvinceCities: (state, payload) => {
      state.provinceCities = payload
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
      let curUserTeamName = this.getters['user/getTeamName']

      if (!curUserTeamName) {
        return Promise.resolve(null)
      }

      return teamsColRef
        .doc(curUserTeamName)
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
      let curUserTeamName = this.getters['user/getTeamName']

      if (!curUserTeamName) {
        return Promise.resolve([])
      }

      return teamsColRef
        .doc(curUserTeamName)
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
      let curUserTeamName = this.getters['user/getTeamName']

      if (!curUserTeamName) {
        return Promise.resolve([])
      }

      return teamsColRef
        .doc(curUserTeamName)
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
    },
    loadProvincesFromIBGE ({
      commit
    }) {
      return axios
        .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => response.data.map(province => {
          return {
            ibgeId: province.id,
            description: `${province.sigla} - ${province.nome}`
          }
        }))
        .then((provinces) => commit('loadProvinces', provinces))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: 'Nao foi possivel carregar a lista de estados',
          errorObj: error
        }))
    },
    loadProviceCitiesFromIBGE ({
      commit,
      getters
    }) {
      return axios
        .get(`http://servicodados.ibge.gov.br/api/v1/localidades/estados/${getters['getSelectedProvinceId']}/municipios`)
        .then(response => response.data.map(city => {
          return {
            ibgeId: city.id,
            description: `${city.sigla} - ${city.nome}`
          }
        }))
        .then((cities) => commit('loadProvincesCities', cities))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: 'Nao foi possivel carregar a lista de cidades',
          errorObj: error
        }))
    }

  }
}
