import axios from 'axios'
import store from '@/store'

const http = axios.create()

http.interceptors.request.use(config => {
  store.dispatch('general/startLoading')
  return config
}, error => {
  store.dispatch('general/finishLoading')
  return Promise.reject(error)
})

http.interceptors.response.use(response => {
  store.dispatch('general/finishLoading')
  return response
}, error => {
  store.dispatch('general/finishLoading')
  return Promise.reject(error)
})

export default http
