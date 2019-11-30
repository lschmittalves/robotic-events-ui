import Vue from 'vue'

// Plugins
import vuetify from './plugins/vuetify'
import './plugins/firebase'
import './services/http'
import './services/firebase'
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

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
