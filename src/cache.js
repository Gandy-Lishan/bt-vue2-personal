/**
 *	2.2.0
 *	customized cache pool
 */
let CACHES = {}
 
export default class Cache {
  constructor(axios) {
    this.axios = axios
    this.cancelToken = axios.CancelToken
    this.options = {}
  }
 
  use(options) {
    let defaults = {
      expire: 3600000*24, // timeout period, 1 days as default
      storage: false, // use storage or not
      storage_expire: 3600000*24*7, // local storage timeout period, 7 days as default
      instance: this.axios, // an instance of axios
      requestConfigFn: null, // event function in request interceptor, take a config object as parameter, return a Promise
      responseConfigFn: null, // event function in response interceptor, take a config object as parameter, return a Promise
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
        console.log(_x+" = "+ (_xLen/1024).toFixed(2)+" KB");
      }
        console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");      
  }

  init() {
    // initiate cache
    let options = this.options
    this.testUsage()
    if (options.storage) {
      // if use local storage cache, setup a timeout period
      this._storageExpire('expire').then(() => {
        if (localStorage.length === 0){
            console.log("storage_expire expired")
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
      let newConfig = cb && (await cb(config))
      config = newConfig || config
      // req only handle get method
      if (config.method === 'get' && config.cache) {
        let source = this.cancelToken.source()
        config.cancelToken = source.token
        let data = CACHES[config.url]
        let expire = getExpireTime()
        // Check whether cached data exists, if not expired, return it
        if (data && expire - data.expire < this.options.expire) {
            console.log('valid',config.url)
            source.cancel(data)
        }else{
            console.log('expired',config.url,data)
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
    // response interceptor
    this.options.instance.interceptors.response.use(
      async response => {
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
        //if a request opened cache reading&writing , store response data from post method
        if (response.config.method === 'put' && response.config.cache) {   
          let data = {
            expire: getExpireTime(),
            data: response
          }
          //console.log("put response",data)
          CACHES[`${response.config.url}`] = data
          if (this.options.storage) mapStorage(CACHES)
        }
        
        return response
      },
      error => {
        // return cached data
        if (this.axios.isCancel(error)) {
          return Promise.resolve(error.message.data)
        }
        return Promise.reject(error)
      }
    )
  }

  _storageExpire(cacheKey) {
    return new Promise(resolve => {
        
      let key = getStorage(cacheKey)
      
      let date = getExpireTime()
      if (key) {
        let isExpire = date - key < this.options.storage_expire
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
 * caches: cache list
 * type: set->store data get->get data
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
      let reg = /\{/g
      if (reg.test(cache)) CACHES[key] = JSON.parse(cache)
      else CACHES[key] = cache
    }
  })
}
 
function removeStorage() {
  localStorage.clear()
}
 
function setStorage(key, cache) {
  localStorage.setItem(key, JSON.stringify(cache))
}
 
function getStorage(key) {
  let data = localStorage.getItem(key)
  return JSON.parse(data)
}
 
function getExpireTime() {
  return new Date().getTime()
}