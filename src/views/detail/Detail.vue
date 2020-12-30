<template>
  <div class="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="detailNav"></detail-nav-bar>
    <scroll ref="scroll" class="detail-content" :probe-type="3" :pull-up-load="true" @scroll="detailScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goodsInfo"></detail-base-info>
      <detail-shop-info :shop="shopInfo"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="detailImageLoad"></detail-goods-info>
      <detail-params-info ref="params" :param-info="itemParams"></detail-params-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <!--  ntive 修饰符 可以监听原生组件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
</template>
<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper.vue'
  import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
  import DetailShopInfo from './childComps/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
  import DetailParamsInfo from './childComps/DetailParamsInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
  import DetailBottomBar from './childComps/DetailBottomBar.vue'
  import BackTop from 'components/content/backTop/BackTop'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  // import Toast from 'components/common/toast/Toast'
  import { debounce } from 'common/utils'
  import { itemListenerMixin } from 'common/mixin'

  import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'
  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamsInfo,
      DetailCommentInfo,
      DetailBottomBar,
      BackTop,
      GoodsList,
      Scroll,
      // Toast
    },
    //  混入
    mixins: [itemListenerMixin],

    data() {
      return {
        iid: null,
        topImages: [],
        goodsInfo: {},
        shopInfo: {},
        detailInfo: {},
        itemParams: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        // getthemeTopYs: null
        currentIndex: 0,
        isShowBackTop: false,
        // message: '',
        // show: false
      }
    },
    created() {
      //  拼接字符用params 获取iid
      this.iid = this.$route.params.iid
      //  动态路由使用query 获取iid
      // this.iid=this.$route.query.iid


      //  请求详情数据
      getDetail(this.iid).then(res => {
        //  获取数据
        const data = res.result

        //  1 取出轮播图的数据
        this.topImages = data.itemInfo.topImages

        //  2 创建商品的对象
        this.goodsInfo = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3 创建店铺信息
        this.shopInfo = new Shop(data.shopInfo)

        //  4 取出详情信息
        this.detailInfo = data.detailInfo
        //  5 商品参数
        this.itemParams = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        //  6 评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        //  上面的执行完了，再执行这个函数
        //   它还是有问题，dom加载了，但是图片并没有完全加载
        /* this.$nextTick(() => {
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop-44)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44)
          console.log(this.themeTopYs);
        }) */

      })
      //  请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      //  防抖
      /* this.getthemeTopYs = debounce(() => {
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
        console.log(this.themeTopYs);
      }) */
    },
    methods: {
      detailImageLoad() {
        // this.newRefresh()
        this.$refs.scroll.refresh()

        //  如果调用多次，可以给防抖
        // this.getthemeTopYs()

        //  因为前面事件是加载完成了才发送，只调用一次，不用防抖
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
        this.themeTopYs.push(Number.MAX_VALUE)

      },
      backClick() {
        //   scroll 本身的方法 scrollTo （x坐标，y坐标，时间）
        //  这里使用的是scroll 里面的封装的methods 中的方法
        this.$refs.scroll.scrollTo(0, 0)
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      detailScroll(position) {
        //   大于1000的时候显示
        this.isShowBackTop = (-position.y) > 1000
        //  获取Y值
        let positionY = -position.y
        //  进行对比
        let length = this.themeTopYs.length
        //  普通做法
        /*  for (let i = 0; i < this.themeTopYs.length; i++) {
           if (this.currentIndex!==i&&(i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i])) {
            this.currentIndex=i
            this.$refs.detailNav.currentIndex=this.currentIndex
           }
         } */

        //  hack 做法
        /*  先给themeTopYs 最后添加一个无穷大 */
        for (let i = 0; i < length - 1; i++) {
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
            this.currentIndex = i
            //  传给nav
            this.$refs.detailNav.currentIndex = this.currentIndex
          }
        }
      },
      addToCart() {

        //  1 获取商品信息（只需要展示的）
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goodsInfo.title
        product.desc = this.goodsInfo.desc
        product.price = this.goodsInfo.newPrice
        product.iid = this.iid
        product.newPrice = this.goodsInfo.realPrice
        product.count = 0
        //  将商品添加到购物车里面
        // this.$store.commit('addCart', product)
        this.$store.dispatch('addCart', product).then(res => {
          /* this.show = true
          this.message = res
          setTimeout(() => {
            this.show = false
            this.message=''
          }, 1000); */
          //  插件使用
          this.$toast.show(res)
        })
      }
    },
    mounted() {

      //   监听事件总线

      // this.$refs.scroll.refresh()

    },
    destroyed() {
      //  取消事件总线
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
  }
</script>
<style scoped>
  .detail {
    height: 100vh;
    background-color: #fff;
    position: relative;
    z-index: 10;
  }

  .detail-content {
    background-color: #fff;
    height: calc(100% - 93px);
    overflow: hidden;
  }

  .detail-nav {
    position: relative;
    z-index: 1;
  }
</style>
