import Vue from 'vue'
import Vuex from 'vuex'

// Store functionality
import user from './user'

Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  user
})

export default store
