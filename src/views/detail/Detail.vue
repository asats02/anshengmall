<template>
  <div class="detail">
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="detail-content" :probe-type="3" :pull-up-load="true">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goodsInfo"></detail-base-info>
      <detail-shop-info :shop="shopInfo"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo"></detail-goods-info>
      <detail-params-info :param-info="itemParams"></detail-params-info>
    </scroll>

  </div>
</template>
<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper.vue'
  import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
  import DetailShopInfo from './childComps/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
  import DetailParamsInfo from './childComps/DetailParamsInfo'
  import Scroll from 'components/common/scroll/Scroll'

  import { getDetail, Goods, Shop ,GoodsParam} from 'network/detail'
  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamsInfo,
      Scroll
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goodsInfo: {},
        shopInfo: {},
        detailInfo: {},
        itemParams: {}
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
        console.log(data);
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
      })
    }
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
    height: calc(100% - 44px);
  }

  .detail-nav {
    position: relative;
    z-index: 1;
  }
</style>
