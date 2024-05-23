import axios from 'axios';
import {useAppStore} from "../stores/app";

const appStore = useAppStore()

const client = (() => {
  const getBasicAuth = async () => {
    try {
      return 'Basic ' + btoa(appStore.getAuthCredentials.username + ':' + appStore.getAuthCredentials.password)
    } catch (error) {
      console.error('Error getting auth token', error)
    }
  }

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })

  instance.interceptors.request.use(async (config: any) => {
    config.headers['Authorization'] = await getBasicAuth()
    return config
  })

  const subscriptionKey = import.meta.env.VITE_API_SUBSCRIPTION_KEY
  instance.interceptors.request.use((config) => {
    config.params = {...config.params, 'subscription-key': subscriptionKey}
    return config
  })

  instance.interceptors.response.use((response) => {
    return response
  }, (error) => {
    if (error.response.status === 401) {
      appStore.setAuthCredentials('', '')
      appStore.setCurrentStore({})
      window.location.reload()
    }
    return Promise.reject(error)
  })

  return instance
})()

export default client
