/*
 * @Description: 自动更新
 */
import {printConsole} from '@/utils'

let version // 新版本
// const timeData = 60 * 1000 // 检查间隔时间
const timeData = 300 * 1000 // 检查间隔时间
let hidden = false // 页面是否隐藏
let setTimeoutId
let needTip = true // 默认开启提示
let needPrint = false
 
// 获取版本号
const getVersion = async () => {
  return fetch('/version.json?timestep=' + Date.now()).then((res) => res.json())
}
 
// 检查更新
const checkUpdate = async () => {
  if(needPrint) printConsole('***************🚀checkUpdate**************')
  const currentVersion = sessionStorage.getItem("version")
  version = (await getVersion()).version
  // 本地没有 version，表示刚进入系统，直接塞值
  if (!currentVersion) return sessionStorage.setItem("version", version)
 
  if(needPrint) printConsole("🚀 ~ file: auto-update.js:19 ~ version:", version)
  if(needPrint) printConsole("🚀 ~ file: auto-update.js:21 ~ currentVersion:", currentVersion)
  if(needPrint) printConsole("🚀 ~ file: auto-update.js:23 ~ Number(version) !== Number(currentVersion):", Number(version) !== Number(currentVersion))
  let needRefresh = false
  if (Number(version) !== Number(currentVersion)) {
    if(needPrint) printConsole('%c 发现新版本', 'color: red')
    needRefresh = true
  }
  return needRefresh
}
 
// 自动更新
const autoUpdate = async () => {
  setTimeoutId = setTimeout(async () => {
    // 页面隐藏了就不检查更新
    if (!hidden) {
      const willUpdate = await checkUpdate()
      if(needPrint) printConsole("🚀 ~ file: auto-update.js:71 ~ setTimeoutId=setTimeout ~ willUpdate, version:", willUpdate, version)
 
      if (willUpdate && needTip) {
        // 延时更新，防止部署未完成用户就刷新空白
        setTimeout(()=>{
 
          // ----弹框确认---先简单点弹框确认，可以用注释内的，跳过右下角通知的内容（Step3、4）
          // const result = confirm('发现新版本，点击确定更新')
          // if (result) {
          //   sessionStorage.setItem('version', version)
          //   location.reload() // 刷新当前页
          // }
          // --------------
          
          //*****右下角通知提示 */
          window.dispatchEvent(
            new CustomEvent("onmessageUpdate", {
              detail: {
                msg: "A new update of the website is available. Please refresh the page and get the latest updates.",
                version: version
              },
            })
          )
          //******************* */
 
        }, 10000)
        needTip = false // 关闭更新提示，防止重复提醒
      }
    }
    if(needPrint) printConsole("🚀 ~ file: auto-update.js:90 ~ autoUpdate ~ needTip: ", needTip)
    if (needTip) {
      if(needPrint) console.warn('needTip autoUpdate');
      autoUpdate()
    }
  }, timeData)
}
 
// 停止检测更新
const stop = () => {
  if (setTimeoutId) {
    clearTimeout(setTimeoutId)
    setTimeoutId = ''
  }
}
 
// 开始检查更新
const start = async () => {
  // currentVersion = (await getVersion()).version
  autoUpdate()
  // 监听页面是否隐藏
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden
    if(needPrint) printConsole("🚀 ~ file: auto-update.js:64 ~ document.addEventListener ~ hidden, needTip:", hidden, needTip)
    // 页面隐藏了就不检查更新。或者已经有一个提示框了，防止重复提示。
    if (!hidden && needTip) {
      autoUpdate()
    } else {
      stop()
    }
  })
}
 
export default { start }
 