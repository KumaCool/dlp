/**
 * 判断是否拥有权限,传入的值都互相关联时才代表该权限成立
 * @param  {object} obj   每个键值代表要查询的对应权限值.
 * @return {boolean}      true 代表拥有权限
 */
export default {
  methods: {
    permission: function (obj) {
      let log = console.log.bind(console)
      let per = this.$store.state.permission
      if (typeof obj === 'object' && !Array.isArray(obj)) {
      /* eslint-disable */
        outprint:for (var i = 0; i < per.length; i++) {
          var count = Object.getOwnPropertyNames(obj).length
          for (var k in obj) {
            if (per[i][k].indexOf(obj[k]) > -1) {
              count --
            } else continue outprint
          }
          if (count === 0) return true
        }
      /* eslint-enable */
        return false
      } else return log('permission: 参数类型错误!')
    }
  }
}
