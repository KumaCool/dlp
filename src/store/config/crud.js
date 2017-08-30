/**
 * CRUD组件配置
 * {
 *   <string: columnName>: { // 栏目名称
 *     <string: list | created | edit | delete>: { // 列表型 | 创建型 | 修改型 | 删除型
 *       request: <string> // 请求URL
 *       response: <string> // 提交URL
 *       data: { // 要显示的数据字段格式
 *         <string: keyName>: [
 *           <string: chineseName>, // 字段中文名
 *           <string: formType>, // 非list下的表单类型
 *           <string: action> // 绑定事件
 *         ]
 *       }
 *     }
 *   }
 * }
 */
const config = {
  '用户管理': {
    list: {
      request: '/sys/queryUser4PageWithCriteria.json',
      data: {
        // id: ['序号'],
        username: ['用户名'],
        orgId: ['角色']
      }
    },
    edit: {
      request: '/sys/getUser.json',
      response: '/sys/updateUser.json',
      data: {
        username: ['用户名', 'text']
      }
    },
    created: {
      // request: '/sys/getUser.json',
      response: '/sys/addUser.json',
      data: {
        usercode: ['帐号', 'text'],
        password: ['密码', 'password'],
        orgId: ['角色', 'select', 'roleList']
      }
    }
  }
}

export default config
