export function initialState () {
  return {
    currentErrorMessage: '',
    isLoading: false
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
    },
    isLoading: state => {
      return state.isLoading
    }
  },
  mutations: {
    setErrorMessage: (state, payload) => {
      state.currentErrorMessage = payload
    },
    setLoading: (state, payload) => {
      state.isLoading = payload
    }
  },
  actions: {
    reportErrorMessage ({
      commit
    }, errorMessage) {
      commit('setErrorMessage', errorMessage || 'Erro nao mapeado, reporte ao administrador do sistema!')
    },
    clearErrorMessage ({
      commit
    }) {
      commit('setErrorMessage', '')
    },
    reportError ({
      dispatch
    }, {
      userMessage,
      errorObj
    }) {
      if (process.env.NODE_ENV === 'development') {
        console.error(errorObj)
      }
      dispatch('reportErrorMessage', userMessage)
    },
    startLoading ({
      commit
    }) {
      commit('setLoading', true)
    },
    finishLoading ({
      commit
    }) {
      commit('setLoading', false)
    }
  }
}
