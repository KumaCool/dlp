/**
 * 设置 state 的值
 * @param  {object} obj   要设置的state对象
 */
export const setState = (state, obj) => {
  for (var k in obj) {
    state[k] = obj[k]
  }
}
