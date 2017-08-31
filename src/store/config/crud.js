/**
 * CRUD组件配置
 * {
 *   <string: columnName>: { // 栏目名称
 *     <string: list | created | edit | delete>: { // 列表型 | 创建型 | 修改型 | 删除型
 *       request: <string> // 请求URL
 *       response: <string> // 提交URL
 *       select: <string> // 查询URL
 *       selectValue: <array> // 需要查询的字段
 *       data: { // 要显示的数据字段格式
 *         <string: keyName>: {
 *           name: <string>, // 字段中文名
 *           formType: <string>, // 非 list 类下的表单类型
 *           dictionary: <string>, // 字典函数
 *         }
 *       }
 *     }
 *   }
 * }
 */
const config = {
  '用户管理': {
    list: {
      request: '/user/query/page/criteria',
      select: '/user/query/page/criteria',
      selectValue: ['username'],
      data: {
        usercode: {name: '帐号'},
        username: {name: '用户名'},
        orgId: {name: '角色', dictionary: 'roleList'}
      }
    },
    edit: {
      request: '/user/getUser',
      response: '/user/updateUser',
      data: {
        usercode: {name: '帐号', formType: 'text'},
        username: {name: '用户名', formType: 'text'},
        password: {name: '密码', formType: 'password'},
        orgId: {name: '角色', formType: 'select', dictionary: 'roleList'}
      }
    },
    created: {
      response: '/user/addUser',
      data: {
        usercode: {name: '帐号', formType: 'text'},
        username: {name: '用户名', formType: 'text'},
        password: {name: '密码', formType: 'password'},
        orgId: {name: '角色', formType: 'select', dictionary: 'roleList'}
      }
    },
    delete: {
      response: '/user/deleteUser',
      data: {
        id: []
      }
    }
  }
}

export default config
