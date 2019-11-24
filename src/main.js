import Vue from 'vue'
import firebase from 'firebase'

// Plugins
import vuetify from './plugins/vuetify'
import './plugins/firebase'
import {
  sync
} from 'vuex-router-sync'

// Application imports
import App from './App'
import router from '@/router'
import store from '@/store'

// Sync store with router
sync(store, router)

Vue.config.productionTip = false

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    store.dispatch('user/userLogInSucess', user.email)
  } else {
    store.dispatch('user/userSignOutSucess')
  }
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
