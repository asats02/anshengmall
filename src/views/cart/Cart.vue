<template>
  <div class="cart">
    <nav-bar class="cart-nav">
      <div slot='center'>购物车({{cartLength}})</div>
    </nav-bar>
      <cart-list></cart-list>
      <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childComps/CartList.vue'
  import CartBottomBar from './childComps/CartBottomBar.vue'


  //  mapGetters 直接使用getters 里面的数据
  import { mapGetters } from 'vuex'
  export default {
    name: 'Cart',
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      // 1 第一种计算属性常用方法
      /* cartLength() {
        return this.$store.getters.cartLength
      } */

      // 2 将getters 里面的数据搬过来用
      ...mapGetters([
        'cartLength'
      ])
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
    background-color: #fff;
  }
  .cart-nav {
    background-color: var(--color-tint);
    color: #fff;
    position: relative;
    top: 0;
  }

</style>
