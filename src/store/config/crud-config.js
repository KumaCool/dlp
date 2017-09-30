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
        showTitle: {name: '窗口标题', formType: ['select'], dictionary: ['fieldChangeLocal']},
        winProperty: {name: '窗口属性', formType: ['select'], dictionary: ['fieldChangeLocal']},
        url: {name: '链接', formType: 'text'}
      }
    },
    created: {
      response: '/column/addColumn',
      data: {
        name: {name: '栏目名', formType: 'text'},
        parentId: {name: '所属栏目', formType: ['select', '0', '一级菜单'], dictionary: ['selectList', '/column/user/list', 'name']},
        icon: {name: '图标', formType: 'select-icon'},
        showTitle: {name: '窗口标题', formType: ['select'], dictionary: ['fieldChangeLocal']},
        winProperty: {name: '窗口属性', formType: ['select'], dictionary: ['fieldChangeLocal']},
        url: {name: '链接', formType: 'text'}
      }
    },
    delete: {
      response: '/column/deleteColumn',
      data: {
        id: []
      }
    }
  },
  // 功能管理
  'action': {
    list: {
      request: '/action/query/page/criteria',
      select: '/action/query/page/criteria',
      selectValue: ['name'],
      data: {
        id: {name: 'ID'},
        name: {name: '功能名称'}
      }
    },
    edit: {
      request: '/action/getAction',
      response: '/action/updateAction',
      data: {
        name: {name: '功能名称', formType: 'text'},
        act: {name: '功能标识', formType: 'text'}
      }
    },
    created: {
      response: '/action/addAction',
      data: {
        name: {name: '功能名称', formType: 'text'},
        act: {name: '功能标识', formType: 'text'}
      }
    },
    delete: {
      response: '/action/delAction',
      data: {
        id: []
      }
    }
  },
  // 角色管理
  'role': {
    list: {
      request: '/role/queryRoleList',
      select: '/role/queryRoleList',
      selectValue: ['roleName'],
      data: {
        id: {name: 'ID'},
        roleName: {name: '角色名称'}
      }
    },
    edit: {
      request: '/role/queryRole',
      response: '/role/updateRole',
      data: {
        roleName: {name: '角色名称', formType: 'text'}
      }
    },
    created: {
      response: '/role/addRole',
      data: {
        roleName: {name: '角色名称', formType: 'text'}
      }
    },
    delete: {
      response: '/role/deleteRole',
      data: {
        id: []
      }
    }
  },
  // 抢修信息
  'repair': {
    list: {
      request: '/inspect/repair',
      data: {
        id: {name: 'ID'},
        type: {name: '类型', formType: 'text'},
        problemDesc: {name: '问题描述', formType: 'text'},
        problemType: {name: '问题类型', formType: 'text'},
        // submitTime: {name: '提交时间', formType: 'text'},
        // submitPerson: {name: '提交人', formType: 'text'},
        // handleTime: {name: '处理时间', formType: 'text'},
        // handlePerson: {name: '处理人', formType: 'text'},
        // handleResult: {name: '处理结果描述', formType: 'text'},
        status: {name: '处理状态', formType: 'text'}
      }
    },
    edit: {
      request: '/inspect/repair/query',
      response: '/inspect/repair/update',
      data: {
        // fid: {name: '坐标ID', formType: 'text'},
        type: {name: '类型', formType: 'text'},
        problemDesc: {name: '问题描述', formType: 'text'},
        problemType: {name: '问题类型', formType: ['select'], dictionary: ['fieldChangeLocal']},
        // submitTime: {name: '提交时间', formType: 'text'},
        // submitPerson: {name: '提交人', formType: 'text'},
        // handleTime: {name: '处理时间', formType: 'text'},
        // handlePerson: {name: '处理人', formType: 'text'},
        handleResult: {name: '处理结果描述', formType: 'text'},
        status: {name: '处理状态', formType: ['select'], dictionary: ['fieldChangeLocal']},
        latlng: {name: '坐标', formType: 'text'}
      }
    },
    created: {
      response: '/inspect/repair/insert',
      data: {
        // fid: {name: '坐标ID', formType: 'text'},
        type: {name: '类型', formType: 'text'},
        problemDesc: {name: '问题描述', formType: 'text'},
        problemType: {name: '问题类型', formType: ['select'], dictionary: ['fieldChangeLocal']},
        // submitTime: {name: '提交时间', formType: 'text'},
        // submitPerson: {name: '提交人', formType: 'text'},
        // handleTime: {name: '处理时间', formType: 'text'},
        // handlePerson: {name: '处理人', formType: 'text'},
        handleResult: {name: '处理结果描述', formType: 'text'},
        status: {name: '处理状态', formType: ['select'], dictionary: ['fieldChangeLocal']},
        latlng: {name: '坐标', formType: 'text'}
      }
    },
    delete: {
      response: '/role/deleteRole',
      data: {
        id: []
      }
    }
  }
}

export default config
