export default {
  created () {
    this.request()
  },
  methods: {
    /**
     * 触发配置中所有设置了事件的属性,并会传入两个参数到事件当中
     * @param  {object} config  CRUD中该属性的配置信息
     * @param  {string} key    该属性的名称
     */
    fnForeach: function () {
      let data = this.config.data
      for (var k in data) {
        if (Array.isArray(data[k].dictionary)) {
          this[data[k].dictionary[0]](data[k], k)
        } else if (typeof data[k].dictionary === 'string') this[data[k].dictionary](data[k], k)
      }
    },
    /**
     * 下拉菜单字典转换
     * @param  {object} config  CRUD中该属性的配置信息
     * @param  {string} key    该属性的名称
     */
    selectList: function (config, key) {
      this.$http.get(config.dictionary[1]).then(response => {
        let result = response.data
        if (result.rtnCode === 200) {
          let data = result.data.paginationList !== undefined ? result.data.paginationList : result.data
          let dataList = data.map(val => {
            return {
              value: val.id,
              label: val[config.dictionary[2]]
            }
          })
          this.$set(this.dictionary, key, dataList)
        }
      })
    },
    /**
     * 一般字段字典转换
     * @param  {object} config  CRUD中该属性的配置信息
     * @param  {string} key    该属性的名称
     */
    fieldChange: function (config, key) {
      this.$http.get(config.dictionary[1]).then(response => {
        let result = response.data
        if (result.rtnCode === 200) {
          let data = result.data.paginationList !== undefined ? result.data.paginationList : result.data
          let fields = {}
          data.forEach(val => {
            fields[val.id] = val[config.dictionary[2]]
          })
          // this.$set(this.dictionary, key, fields)
          for (var k in this.dataset) {
            this.$set(this.dataset[k], key, fields[this.dataset[k][config.dictionary[3]]])
          }
        }
      })
    }
  },
  watch: {
    tempStatus: function () { // 监控其它组件事件触发更新请求
      this.request()
    }
  }
}
