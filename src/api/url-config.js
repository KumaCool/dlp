const serverDLP = 'http://116.62.225.78:8380'

// 登录
export const login = serverDLP + '/sys/login'

// 权限管理
export const per = {
  // 获取用户权限栏目功能关系
  relation: serverDLP + '/per/col/ac/get'
}
