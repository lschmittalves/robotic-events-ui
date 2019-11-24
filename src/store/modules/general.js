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
    }
  }
}
