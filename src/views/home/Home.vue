<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center"> 购物街</div>
    </nav-bar>
    <tab-control ref="tabControl1" :titles="['流行','新款','精选']" @tabClick="tabClick" class="tab-control"
      v-show="isTabFixed"></tab-control>
    <!--  scroll  传入的probe-type 值来觉得需要实时监听吗 -->
    <scroll class="content" ref="scroll" :probe-type="3" :pull-up-load="true" @scroll="contentScroll"
      @pullingUP="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad">
      </home-swiper>
      <home-recommend-view :recommends="recommends">
      </home-recommend-view>
      <home-feature-view>
      </home-feature-view>
      <tab-control ref="tabControl2" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>

      <goods-list :goods="showGoods"></goods-list>

    </scroll>

    <!--  ntive 修饰符 可以监听原生组件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import HomeRecommendView from './childComps/HomeRecommendView'
  import HomeFeatureView from './childComps/HomeFeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'



  import {
    getHomeMutidata,
    getHomeGoods
  } from 'network/home'
  import { debounce } from 'common/utils'


  /* import Swiper from 'components/common/swiper/Swiper'
  import SwiperItem from 'components/common/swiper/SwiperItem' */
  // import {Swiper,SwiperItem} from 'components/common/swiper'


  export default {
    name: 'Home',
    components: {

      HomeSwiper,
      HomeRecommendView,
      HomeFeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop

    },
    data() {
      //  data 用于存储请求过来的数据
      //  请求的数据不存储的话，只用于函数中，函数不调用，数据就会消失
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': { page: 0, list: [] },
          'new': { page: 0, list: [] },
          'sell': { page: 0, list: [] }
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        itemImgListener: null
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },

    activated() {
      //  最好刷新一次
      this.$refs.scroll.refresh()
      // 进来
      this.$refs.scroll.scrollTo(0, this.saveY, 0)

    },
    deactivated() {
      //  离开
      this.saveY = this.$refs.scroll.bs.y
      //  取消全局事件的监听
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    created() {

      //  1 请求多个数据
      this.getHomeMutidata()

      //  2 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')


    },
    mounted() {

      //   监听事件总线
      const newRefresh = debounce(this.$refs.scroll.refresh, 100)
      this.itemImgListener = () => { newRefresh() }
      this.$bus.$on('itemImageLoad', this.itemImgListener)
    },
    methods: {
      /*  事件监听 */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        //   scroll 本身的方法 scrollTo （x坐标，y坐标，时间）
        //  这里使用的是scroll 里面的封装的methods 中的方法
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
        //   大于1000的时候显示
        this.isShowBackTop = (-position.y) > 1000
        //   tabControl 是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      //   上拉加载跟多
      loadMore() {
        this.getHomeGoods(this.currentType)
        //    加载完成重新计算dom 实现srcoll 滚动效果
        this.$refs.scroll.refresh()
      },
      swiperImageLoad() {
        //  拿到tabcontrol 的offsettop
        //  组件没有offsettop 需要拿到组件里面的元素
        //  所有组件都有一个属性$el , 用户获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop

      },

      /*  网络请求方法 */
      //  请求函数的方法放在methods
      getHomeMutidata() {
        getHomeMutidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        let page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          //  数组追加到数组，使用es6中的扩展运算符最简单

          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  /*  scoped  当前作用域
 */
  #home {

    /*  视口高度 vh */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

  }

  .content {
    /*  动态设置高度 */
    /* height:calc(100% - 93px); */
    overflow: hidden;
    /* margin-top: 44px; */

    /*  定位 */
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
