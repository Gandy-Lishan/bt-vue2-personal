import axios from "../axios";
import qs from 'qs'


export function getCurDate() {
  return new Promise((resolve,reject)=>{
    const url = '/ai/currDate'
    axios.get(url).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err)
    })
  })
}

export function getAIPick(date) {
  return new Promise((resolve,reject)=>{
    const url = '/ai/aiPick?date='+ date
    axios.get(url).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err)
    })
  })
}

export function getBacktestInfo(data) {
  return new Promise((resolve,reject)=>{
    const url = '/ai/bt'
    axios.post(url,qs.stringify(data)).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err)
    })
  })
}



