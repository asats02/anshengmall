
import {
  ADD_COUNT,
  ADD_TO_CART
} from './mutation-type'

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      //  判断同一个商品
    /* let oldProduct = null
    for (let item of state.cartList) {
      if (item.iid === payload.iid) {
        oldProduct=item
      }
    } */
    //  另外一种数组方法
    let oldProduct = context.state.cartList.find((item) => {
      return item.iid===payload.iid
    })
    if (oldProduct) {
      // oldProduct.count+=1
      context.commit(ADD_COUNT, oldProduct)
      resolve('当前商品数量+1')
    } else {
      payload.count=1
      // context.state.cartList.push(payload)
      context.commit(ADD_TO_CART, payload)
      resolve('成功加入购物车')
    }
   })
  }
}
