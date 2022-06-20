// Cache pool
let CACHES = {}
 
export default class Cache {
  constructor(axios) {
    this.axios = axios
    this.cancelToken = axios.CancelToken
    this.options = {}
  }
 
  use(options) {
    let defaults = {
      expire: 3600000*24, // The default expiration time is one day
      storage: false, // Whether cache is enabled
      storage_expire: 3600000*24*7, // Local cache expiration time defaults to one week
      instance: this.axios, // The instance object of Axios points to the current Axios by default
      requestConfigFn: null, // The operation function parameter requesting interception returns a promise for the requested config object
      responseConfigFn: null, // The operation function parameter of response interception returns a promise for the response object of response data
      ...options
    }
    this.options = defaults
    this.init()
    // if (options && !options.instance) return this.options.instance
  }
 
  testUsage() {
    var _lsTotal=0,_xLen,_x;
    for(_x in localStorage){ 
        if(!localStorage.hasOwnProperty(_x)){continue;} 
        _xLen= ((localStorage[_x].length + _x.length)* 2);
        _lsTotal+=_xLen; 
        // if(_x.indexOf('cognito') != -1){
        //   console.log(_x+" = "+ localStorage[_x])
        // };
        console.log(_x+" = "+ (_xLen/1024).toFixed(2)+" KB");
      }
        console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");      
  }

  init() {
    // initialization
    let options = this.options
    this.testUsage()
    if (options.storage) {
      // If the local cache is enabled, set an expiration time to avoid the cache remaining for too longg
      this._storageExpire('expire').then(() => {
        if (localStorage.length === 0){
            CACHES = {}
        }
        else mapStorage(localStorage, 'get')
      })
    }
    this.request(options.requestConfigFn)
    this.response(options.responseConfigFn)
  }
 
  request(cb) {
    // request interceptor 
    let options = this.options
    options.instance.interceptors.request.use(async config => {
      // Judge whether the user returns the promise of config
      let newConfig = cb && (await cb(config))
      config = newConfig || config
      // Req only processes get, post is not intercepted, and requests are sent as usual
      if (config.method === 'get' && config.cache) {
        let source = this.cancelToken.source()
        config.cancelToken = source.token
        let data = CACHES[config.url]
        let expire = getExpireTime()
        // Judge whether the cached data exists. If so, whether it is expired. If not, return
        
        // Whether the current time minus the set cache time is less than the expiration time
        if (data && expire - data.expire < this.options.expire) {
            console.log('Not expired',config.url)
            source.cancel(data)
        }else{
            console.log('be overdue',config.url,data)
        }
      }

      config.headers.Authorization = window.sessionStorage.getItem('token')
      config.auth = {
          username: 'sentimentrader_backtest_api',
          password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }
      
      return config
    })
  }
 
  response(cb) {
    // Response interceptor
    this.options.instance.interceptors.response.use(
      async response => {
        // Determine whether the user has returned the promise of the response
        let newResponse = cb && (await cb(response))
        response = newResponse || response

        if (response.config.method === 'get' && response.config.cache) {
            
          let data = {
            expire: getExpireTime(),
            data: response
          }
          CACHES[`${response.config.url}`] = data
          if (this.options.storage) mapStorage(CACHES)
          
        }
        // Res lets post cache the request return value
        if (response.config.method === 'put' && response.config.cache) {   
          let data = {
            expire: getExpireTime(),
            data: response
          }
          CACHES[`${response.config.url}`] = data
          if (this.options.storage) mapStorage(CACHES)
        }
        
        return response
      },
      error => {
        // Return cached data
        if (this.axios.isCancel(error)) {
          return Promise.resolve(error.message.data)
        }
        return Promise.reject(error)
      }
    )
  }
 
  // Local cache expiration judgment
  _storageExpire(cacheKey) {
    return new Promise(resolve => {
        
      let key = getStorage(cacheKey)
      
      let date = getExpireTime()
      if (key) {
        // Whether the cache is expired
        let isExpire = date - key < this.options.storage_expire
        // If expired, reset the expiration time and empty the cache
        if (!isExpire) {
          removeStorage()
        }
      } else {
        setStorage(cacheKey, date)
      }
      resolve()
    })
  }
}
 
/**
 * caches: Cache list
 * type: set->Save get->take
 */
function mapStorage(caches, type = 'set') {
  Object.entries(caches).map(([key, cache]) => {
    if (type === 'set') {
    
      let val = cache
      if(key == 'expire'){
          val = parseInt(cache) 
      }
      setStorage(key, val)
    } else {  
      // The regular is too weak. You can only simply judge whether it is a JSON string
      let reg = /\{/g
      if (reg.test(cache)) CACHES[key] = JSON.parse(cache)
      else CACHES[key] = cache
    }
  })
}
 
// Clear local cache
function removeStorage() {
  localStorage.clear()
}
 
// Set cache
function setStorage(key, cache) {
  localStorage.setItem(key, JSON.stringify(cache))
}
 
// Get cache
function getStorage(key) {
  let data = localStorage.getItem(key)
  return JSON.parse(data)
}
 
// Set expiration time
function getExpireTime() {
  return new Date().getTime()
}