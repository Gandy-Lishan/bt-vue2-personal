/**
 *	2.2.0
 *	customized axios.js for local cache setup
 */
import axios from 'axios'
import Cache from './cache'
import cookies from 'vue-cookies'
 
// Custom instances of Axios
let instance = axios.create({
  baseURL: ''
})
 
//set 10 sec as default,However, some time-consuming requests are processed separately
//instance.defaults.timeout = 30000;
// //define the global retry count in main.js
// instance.defaults.retry = 4;
// instance.defaults.retryDelay = 1000;

// request interceptor




instance.interceptors.request.use((config) => {
	config.headers.Authorization = window.sessionStorage.getItem('token')
	config.auth = {
		username: 'sentimentrader_backtest_api',
		password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
	}
	return config
})


// retry the request(for handling request error or timeout)
instance.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        console.error('timeout! ',config.url)
        alert('request timeout, please refresh the page')
        location.reload();
        return Promise.reject(err);
    }
    
    // Increase the retry count
    config.__retryCount += 1;
     
    
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });
    
    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
		console.log('retry the request...')
        return axios(config);
    });
});



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