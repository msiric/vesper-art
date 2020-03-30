import store from 'store'
import axios from 'axios'

const instance = axios.create()
instance.interceptors.request.use(
  config => {
    const token = store.get('jwt.token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

export default instance
