/**
 * CRUD组件配置
 * {
 *   <string: columnName>: { // 栏目模块名称
 *     <string: list | created | edit | delete>: { // 列表型 | 创建型 | 修改型 | 删除型
 *       request: <string> // 请求URL
 *       response: <string> // 提交URL
 *       select: <string> // 查询URL
 *       selectValue: <array> // 需要查询的字段
 *       data: { // 要显示的数据字段格式
 *         <string: keyName>: {
 *           name: <string>, // 字段中文名
 *           formType: <string | array>, // created | edit 中的选项,用于设置表单的类型
 *                                          string类型:
 *                                            (text) 文本框
 *                                          array类型:
 *                                            (select) 第一参数为表单类型
 *                                                     第二参数为默认选项值
 *                                                     第三参数为默认选项显示名
 *           dictionary: <array>, // 字典:用于转换数据值的含义
 *                                   第一参数为要触发方法名
 *                                   第二参数为含义数据的请求URL
 *                                   第三参数为URL返回数据需要的字段名
 *                                   第四参数为被替换的字段名
 *         }
 *       }
 *     }
 *   }
 * }
 */
const config = {
  // 用户管理
  'user': {
    list: {
      request: '/user/query/page/criteria',
      select: '/user/query/page/criteria',
      selectValue: ['username'],
      data: {
        usercode: {name: '帐号'},
        username: {name: '用户名'},
        orgId: {name: '角色', dictionary: ['fieldChange', '/role/queryRoleList', 'roleName', 'orgId']}
      }
    },
    edit: {
      request: '/user/getUser',
      response: '/user/updateUser',
      data: {
        usercode: {name: '帐号', formType: 'text'},
        username: {name: '用户名', formType: 'text'},
        password: {name: '密码', formType: 'password'},
        orgId: {name: '角色', formType: ['select'], dictionary: ['selectList', '/role/queryRoleList', 'roleName']}
      }
    },
    created: {
      response: '/user/addUser',
      data: {
        usercode: {name: '帐号', formType: 'text'},
        username: {name: '用户名', formType: 'text'},
        password: {name: '密码', formType: 'password'},
        orgId: {name: '角色', formType: ['select'], dictionary: ['selectList', '/role/queryRoleList', 'roleName']}
      }
    },
    delete: {
      response: '/user/deleteUser',
      data: {
        id: []
      }
    }
  },
  // 栏目管理
  'column': {
    list: {
      request: '/column/user/list',
      select: '/user/query/page/criteria',
      selectValue: ['username'],
      data: {
        name: {name: '名称'}
      }
    },
    edit: {
      request: '/column/get',
      response: '/column/updateColumn',
      data: {
        name: {name: '栏目名', formType: 'text'},
        parentId: {name: '所属栏目', formType: ['select', '0', '一级菜单'], dictionary: ['selectList', '/column/user/list', 'name']},
        icon: {name: '图标', formType: 'select-icon'},
        winProperty: {name: '窗口属性', formType: 'text'},
        url: {name: '链接', formType: 'text'}
      }
    },
    created: {
      response: '/column/addColumn',
      data: {
        name: {name: '栏目名', formType: 'text'},
        parentId: {name: '所属栏目', formType: ['select', '0', '一级菜单'], dictionary: ['selectList', '/column/user/list', 'name']},
        icon: {name: '图标', formType: 'select-icon'},
        winProperty: {name: '窗口属性', formType: 'text'},
        url: {name: '链接', formType: 'text'}
      }
    },
    delete: {
      response: '/column/deleteColumn',
      data: {
        id: []
      }
    }
  }
}

export default config
