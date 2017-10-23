import router from '@/router'

export default (code, info) => {
  let msg
  switch (code) {
    case 500:
      msg = info
      break
    case 504:
      msg = '服务器链接超时!'
      break
    case 700:
      if (router.history.current.name !== 'login') router.push('login')
      break
    default:
      msg = `该状态码(${code})还未进行配置!`
  }
  if (msg !== undefined) console.warn(msg)
  return new Promise(() => {})
}
