<template>
  <div class="goods-item" @click="itemClick">
    <!--  @load  监听图片加载完成事件 -->
    <img :src="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price"> {{goodsItem.price}}</span>
      <span class="collect"> {{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GoodsListItem',
    props: {
      goodsItem: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      showImage() {
        return this.goodsItem.image || this.goodsItem.show.img
      }
    },
    methods: {
      imageLoad() {
        //  发出事件总线
        this.$bus.$emit('itemImageLoad')
        
        //  另一种思路，用路由判断
        /* if (this.$route.path.indexOf('/home')) {
          this.$bus.$emit('itemImageLoad')
        }else if(this.$route.path.indexOf('/detail')){
          this.$bus.$emit('itemImageLoad')
        } */

      },
      itemClick() {
        this.$router.push('/detail/' + this.goodsItem.iid)
        //  index.js  里面path 写'detail/:iid'
        // console.log(this.goodsItem);

        //  下面这种动态路由，index.js  里面path 直接写'detail'

        /* this.$router.push({
          path:'/detail',
          query:{
            iid:this.goodsItem.iid
          }
        }) */
      }
    }
  }
</script>

<style>
  .goods-item {
    padding-bottom: 40px;
    position: relative;

    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>
