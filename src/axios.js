import axios from 'axios'
import Cache from './cache'
 
// Custom instances of Axios
let instance = axios.create({
  baseURL: ''
})
 
let cache = new Cache(axios) // Pass the current Axios object into the cache
cache.use({
  expire: 3600000*24*7, // Expiration time: 7 days
  storage: true,
  instance, // If there is a custom Axios instance, such as the above instance, it needs to be passed into the instance. If there is no instance, it will not be transferred
  requestConfigFn: config => {
    // Request to intercept custom actions
    // The config object needs to be returned to the cache through promise. You can also use the writing method of new promise
    return Promise.resolve(config)
  },
  responseConfigFn: res => {
    // Response to intercepted custom actions
    if (!res.data.code) {
      // Res needs to be returned through promise
      return Promise.resolve(res)
    }
  }
})
 
export default instance