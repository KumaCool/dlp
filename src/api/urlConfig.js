const serverDLP = '',
      serverMap = 'http://116.62.225.78:6080/arcgis/rest/services/BASEMAP/MapServer/'

// 网站配置
export const webconfig = serverDLP + '/webconfig/queryConfig'

// 登录
export const login = serverDLP + '/sys/login'

// 权限管理
export const per = {
  // 获取用户权限栏目功能关系
  relation: serverDLP + '/per/col/ac/get'
}

// 天气
export const weather = serverDLP + '/api/weather'

// 报修查询
export const repair = serverDLP + '/inspect/repair'

// 地图
export const map = {
  // 地图服务
  server: serverMap + 'tile',
  // 地图数据
  data (id) {
    return serverMap + id + '/query'
  }
}

// 用户管理
export const user = {
  select: serverDLP + '/user/query/page/criteria',
  update: serverDLP + '/user/updateUser',
  query: serverDLP + '/user/getUser',
  create: serverDLP + '/user/addUser',
  del: serverDLP + '/user/deleteUser'
}
