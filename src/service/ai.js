import axios from "../axios";
import qs from 'qs'


export function getCurDate() {
  return new Promise((resolve,reject)=>{
    const url = '/dev/ai_scanner/currDate'
    axios.get(url).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err)
    })
  })
}

export function getAIPick(date) {
  return new Promise((resolve,reject)=>{
    const url = `/dev/ai_scanner/aiPick?start_date=${date[0]}&end_date=${date[1]}`
    axios.get(url).then(res=>{
      
      resolve(res.data)
    }).catch(err=>{
      reject(err)
    })
  })
}

export function getBacktestInfo(data) {
  return new Promise((resolve,reject)=>{
    const url = '/dev/ai_scanner/bt'
    axios.post(url,qs.stringify(data)).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err)
    })
  })
}



