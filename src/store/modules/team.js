import firebase from 'firebase'
import router from '@/router'

import {
  messages
} from '../../utils/messages'
import axios from 'axios'

const dbRef = firebase.firestore()
const teamsColRef = dbRef.collection('teams')
const robotsColRef = dbRef.collection('robots')
const userColRef = dbRef.collection('users')

export function initialState () {
  return {
    currentTeam: {
      name: '',
      city: '',
      province: '',
      collegeName: '',
      capitanUser: {
        email: ''
      }
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
      return state.currentTeam.capitanUser ? state.currentTeam.capitanUser.email === firebase.auth().currentUser.email : false
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
      return state.currentTeam && state.currentTeam.capitanUser ? state.currentTeam.capitanUser.email : ''
    },
    getProvincesDescriptions: state => {
      return state.provinces ? state.provinces.map((a) => a.description) : []
    },
    getCitiesDescriptions: state => {
      return state.provinceCities ? state.provinceCities.map((a) => a.description) : []
    },
    getMembersDescriptions: state => {
      return state.memberUsers ? state.memberUsers.map((a) => a.email) : []
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
      state.currentTeam.capitanUser['email'] = payload
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
      let teamToUpdate = {
        ...state.currentTeam
      }
      let userToUpdate = {
        team: teamToUpdate
      }

      // check the capitan user before send the update to the firebase
      if (!teamToUpdate.capitanUser || !teamToUpdate.capitanUser.email) {
        teamToUpdate.capitanUser = {
          ...this.getters['user/getCurrentUser']
        }
      } else {
        teamToUpdate.capitanUser = {
          ...state.memberUsers.find(user => user.email === state.currentTeam.capitanUser.email)
        }
      }

      // failsafe, if we dont find a valid user as capitain
      if (!teamToUpdate.capitanUser || !teamToUpdate.capitanUser.email) {
        return this.dispatch('general/reportError', {
          userMessage: 'Capitao nao encontrado!'
        })
      }

      delete teamToUpdate.capitanUser.team

      let batchUpdate = dbRef.batch()
      batchUpdate.set(teamsColRef.doc(teamToUpdate.name), teamToUpdate)
      batchUpdate.update(userColRef.doc(teamToUpdate.capitanUser.email), userToUpdate)

      state.memberUsers.forEach(member => {
        if (member.email !== teamToUpdate.capitanUser.email) {
          batchUpdate.update(userColRef.doc(member.email), { ...userToUpdate })
        }
      })

      state.robots.forEach(robot => {
        batchUpdate.update(robotsColRef.doc(robot.name), { team: { ...teamToUpdate } })
      })

      return this.dispatch('general/startLoading')
        .then(() => batchUpdate.commit())
        .then(() => router.push('/team'))
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
      let teamToUpdate = {
        ...state.currentTeam
      }
      let memberToUpdate = { ...memberUser }
      memberToUpdate.team = teamToUpdate

      let userToUpdate = {
        team: teamToUpdate
      }

      delete teamToUpdate.capitanUser.team

      return this.dispatch('general/startLoading')
        .then(() => dispatch('checkIfNewMemberIfValid', memberUser))
        .then(() => teamsColRef.doc(memberToUpdate.team.name).collection('members').doc(memberToUpdate.email).set(memberToUpdate))
        .then(() => userColRef.doc(memberToUpdate.email).update(userToUpdate))
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
        .then(() => teamsColRef.doc(state.currentTeam.name).collection('members').doc(memberUser.email).delete())
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
      let robotToUpdate = { ...robot }
      robotToUpdate['team'] = {
        ...state.currentTeam
      }

      delete robotToUpdate.team.capitanUser.team

      return this.dispatch('general/startLoading')
        .then(() => teamsColRef.doc(robotToUpdate.team.name).collection('robots').doc(robotToUpdate.name).set(robotToUpdate))
        .then(() => robotsColRef.doc(robotToUpdate.name).set(robotToUpdate))
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
        .then(() => teamsColRef.doc(state.currentTeam.name).collection('robots').doc(robot.name).delete())
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
      return this.dispatch('general/startLoading')
        .then(() => axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados'))
        .then(response => response.data.map(province => {
          return {
            ibgeId: province.id,
            description: `${province.sigla} - ${province.nome}`
          }
        }).sort((a, b) => {
          const descA = a.description.toUpperCase()
          const descB = b.description.toUpperCase()

          let comparison = 0
          if (descA > descB) {
            comparison = 1
          } else if (descA < descB) {
            comparison = -1
          }
          return comparison
        }))
        .then((provinces) => commit('loadProvinces', provinces))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: 'Nao foi possivel carregar a lista de estados',
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    },
    loadProviceCitiesFromIBGE ({
      commit,
      getters
    }) {
      return this.dispatch('general/startLoading')
        .then(() => axios.get(`http://servicodados.ibge.gov.br/api/v1/localidades/estados/${getters['getSelectedProvinceId']}/municipios`))
        .then(response => response.data.map(city => {
          return {
            ibgeId: city.id,
            description: `${city.nome}`
          }
        }).sort((a, b) => {
          const descA = a.description.toUpperCase()
          const descB = b.description.toUpperCase()

          let comparison = 0
          if (descA > descB) {
            comparison = 1
          } else if (descA < descB) {
            comparison = -1
          }
          return comparison
        }))
        .then((cities) => commit('loadProvinceCities', cities))
        .catch((error) => this.dispatch('general/reportError', {
          userMessage: 'Nao foi possivel carregar a lista de cidades',
          errorObj: error
        }))
        .finally(() => this.dispatch('general/finishLoading'))
    }

  }
}
