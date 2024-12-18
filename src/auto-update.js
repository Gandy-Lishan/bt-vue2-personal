import moment from 'moment'
import { printConsole } from '@/utils'

let version // 新版本
let hidden = false // 页面是否隐藏
let setTimeoutId
let needTip = true // 默认开启提示
let needPrint = true

// 获取版本号
const getVersion = async () => {
  return fetch('/version.json?timestep=' + Date.now()).then((res) => res.json())
}

// 计算距离下一个凌晨2点的时间差（单位：毫秒），使用 moment
const getTimeUntilNext2AM = () => {
  const now = moment() // 获取当前时间
  const target = moment().hour(3).minute(0).second(0).millisecond(0) // 设置目标时间为凌晨3点

  // 如果当前时间已经过了当天的凌晨2点，目标时间就设为明天的凌晨2点
  if (now.isAfter(target)) {
    target.add(1, 'days') // 增加1天
  }

  // 计算时间差
  return target.diff(now) // 返回毫秒差
}

// 检查更新
const checkUpdate = async () => {
  if (needPrint) printConsole('***************🚀checkUpdate**************')
  const currentVersion = sessionStorage.getItem('version')
  version = (await getVersion()).version
  // 本地没有 version，表示刚进入系统，直接塞值
  if (!currentVersion) return sessionStorage.setItem('version', version)

  if (needPrint) printConsole('🚀 ~ file: auto-update.js:19 ~ version:', version)
  if (needPrint) printConsole('🚀 ~ file: auto-update.js:21 ~ currentVersion:', currentVersion)
  if (needPrint) printConsole('🚀 ~ file: auto-update.js:23 ~ Number(version) !== Number(currentVersion):', Number(version) !== Number(currentVersion))
  let needRefresh = false
  if (Number(version) !== Number(currentVersion)) {
    if (needPrint) printConsole('%c 发现新版本', 'color: red')
    needRefresh = true
  }
  return needRefresh
}

// 自动更新
const autoUpdate = async () => {
  const willUpdate = await checkUpdate()
  if (needPrint) printConsole('🚀 ~ file: auto-update.js:71 ~ willUpdate, version:', willUpdate, version)

  if (willUpdate && needTip) {
    // 延时更新，防止部署未完成用户就刷新空白
    setTimeout(() => {
      // 右下角通知提示
      window.dispatchEvent(
        new CustomEvent('onmessageUpdate', {
          detail: {
            msg: 'A new update of the website is available. Please refresh the page and get the latest updates.',
            version: version,
          },
        })
      )
    }, 10000)
    needTip = false // 关闭更新提示，防止重复提醒
  }
}

// 设置定时检查
const start = async () => {
  // 获取下一个凌晨2点的时间差
  const timeUntilNext2AM = getTimeUntilNext2AM()

  // 首次执行的延迟时间
  setTimeout(() => {
    autoUpdate() // 执行一次检查更新
    // 每天执行一次检查更新
    setInterval(autoUpdate, 24 * 60 * 60 * 1000) // 24小时后再次检查
  }, timeUntilNext2AM)

  // 监听页面是否隐藏
  // document.addEventListener('visibilitychange', () => {
  //   hidden = document.hidden
  //   if (needPrint) printConsole('🚀 ~ file: auto-update.js:64 ~ document.addEventListener ~ hidden, needTip:', hidden, needTip)
  //   // 页面隐藏了就不检查更新。或者已经有一个提示框了，防止重复提示。
  //   if (!hidden && needTip) {
  //     autoUpdate()
  //   } else {
  //     stop()
  //   }
  // })
}

// 停止检测更新
const stop = () => {
  if (setTimeoutId) {
    clearTimeout(setTimeoutId)
    setTimeoutId = ''
  }
}

export default { start }
