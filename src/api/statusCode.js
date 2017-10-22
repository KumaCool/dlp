import router from '@/router'

export default (code) => {
  switch (code) {
    case 700:
      if (router.history.current.name !== 'login') router.push('login')
      break
    default:
      console.info(`该状态码(${code})还未进行配置!`)
  }
  return new Promise(() => {})
}
