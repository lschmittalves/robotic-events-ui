/**
 * Vue Router
 *
 * @library
 *
 * https://router.vuejs.org/en/
 */

// Lib imports
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

// Routes
import paths from './paths'

function route (path, view, name, meta) {
  return {
    name: name || view,
    path,
    component: (resovle) => import(
      `@/views/${view}.vue`
    ).then(resovle),
    meta
  }
}

Vue.use(Router)

// Create a new router
const router = new Router({
  mode: 'history',
  routes: paths.map(path => route(path.path, path.view, path.name, path.meta)).concat([{
    path: '*',
    redirect: '/'
  }]),
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
    return {
      x: 0,
      y: 0
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired) && store.getters['user/isAuthenticated']) {
    next()
    return
  }

  if (to.path.includes('login') || to.path.includes('signup')) {
    next()
  } else {
    next('/login')
  }
})

export default router
