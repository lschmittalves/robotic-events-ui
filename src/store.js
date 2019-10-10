import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function initialState () {
  return {
    errorMessages: [],
    userIsLogged: false,
    currentUserInfo: {},
    currentEventInfo: {
      registerTeams: [],
      robotsPerCategory: [],
      availableCategories: []
    },
    currentTeam: {
      robots: [],
      registerRobots: [],
      persons: [],
      registeredPersons: []
    }
  }
}

export default new Vuex.Store({
  state: initialState,
  mutations: {
    LOGGOUT: state => {
      // acquire initial state
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    LOGIN: (state, person) => {
      state.currentUserInfo = person
      state.userIsLogged = true
    },
    ADD_ERROR: (state, errorMsg) => {
      state.errorMessages.push(errorMsg)
    },
    CLEAR_ERRORS: (state) => {
      state.errorMessages = []
    }
  },
  actions: {

  }
})
