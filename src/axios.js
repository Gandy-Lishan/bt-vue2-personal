/**
 *	2.2.0
 *	customized axios.js for local cache setup
 */
import axios from 'axios'
import Cache from './cache'
 
// Custom instances of Axios
let instance = axios.create({
  baseURL: ''
})
 
let cache = new Cache(axios) // pass current axios to Cache
cache.use({
  expire: 3600000*24*7, // default timeout period, 7 days
  storage: true,
  instance,
  requestConfigFn: config => {
    // customized request interceptor
    // if (config.header) {
    //   config.header.token = 'i am token'
    // } else {
    //   config.header = { token: 'i am token' }
    // }
    // need to return the Config object through the Promise cache. You can also use the new Promise notation
    return Promise.resolve(config)
  },
  responseConfigFn: res => {
    // customized response interceptor
    if (!res.data || !res.data.code) {
      // need to return the Config object through the Promise cache. You can also use the new Promise notation
      return Promise.resolve(res)
    }
  }
})
 
export default instance