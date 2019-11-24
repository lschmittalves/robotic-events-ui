
export function initialState () {
  return {
    currentErrorMessage: ''
  }
}

export default {
  state: initialState(),
  getters: {
    displayErrorMessage: state => {
      return !!state.currentErrorMessage
    },
    getErrorMessage: state => {
      return state.currentErrorMessage
    }
  },
  mutations: {
    setErrorMessage: (state, payload) => {
      state.currentErrorMessage = payload
    }
  },
  actions: {
    reportErrorMessage ({
      commit
    }, {
      errorMessage
    }) {
      commit('setErrorMessage', errorMessage)
    },
    clearErrorMessage ({
      commit
    }) {
      commit('setErrorMessage', '')
    }
  }
}
