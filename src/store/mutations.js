//
import {
  ADD_COUNT,
  ADD_TO_CART
} from './mutation-type'

export default {
  //  修改state 的数据
    //  每个方法完成的事件比较单一一点，可以使用devtools追踪
    [ADD_COUNT](state, payload) {
      payload.count++
    },
  [ADD_TO_CART](state, payload) {
      payload.checked=true
      state.cartList.push(payload)
    }
}
