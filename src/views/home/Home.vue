<template>
  <div id="home">
<nav-bar class="home-nav">
  <div slot="center"> 购物街</div>
</nav-bar>
<home-swiper :banners="banners">
</home-swiper>
<home-recommend-view :recommends="recommends">
</home-recommend-view>
  </div>
</template>

<script>
import  NavBar from 'components/common/navbar/NavBar'
import HomeSwiper from './childComps/HomeSwiper'
import HomeRecommendView from './childComps/HomeRecommendView'
import { getHomeMutidata} from 'network/home'

/* import Swiper from 'components/common/swiper/Swiper'
import SwiperItem from 'components/common/swiper/SwiperItem' */
// import {Swiper,SwiperItem} from 'components/common/swiper'


export default {
name:'Home',
components:{
  NavBar,
  HomeSwiper,
  HomeRecommendView

},
data(){
  //  data 用于存储请求过来的数据
  //  请求的数据不存储的话，只用于函数中，函数不调用，数据就会消失
   return{
     banners:[],
     recommends:[]
   }
},
created(){

//  1 请求多个数据
  getHomeMutidata().then(res=>{
    this.banners=res.data.banner.list
    this.recommends=res.data.recommend.list
  })
}
}
</script>

<style>
.home-nav{
  background-color:var(--color-tint);
  color:#fff;
}
</style>