<template lang="">
  <div>
    <nav-bar class="nav-bar">
      <div slot="left" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div v-for="(item,index) in titles"
         class="title-item"
          @click="itemClick(index)"
          :class="{active:currentIndex===index}">
          {{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>
<script>
  import NavBar from 'components/common/navbar/NavBar'
  export default {
    name: "DetailNavBar",
    components: {
      NavBar
    },
    data() {
      return {
        titles: ['商品', '参数', '评论', '推荐'],
        currentIndex: 0
      }
    },
    methods: {
      itemClick(index) {
        this.currentIndex = index
        this.$emit('titleClick',index)
      },
      backClick(){
        this.$router.back()
        // this.$router.go(-1)
      }
    }
  }
</script>
<style scoped>
  .nav-bar {
    background-color: #fff;
  }

  .nav-bar img {
    text-align: center;
    margin-top: 10px;
  }

  .title {
    display: flex;
  }

  .title-item {
    flex: 1;
    font-size: 13px;
  }

  .active {
    color: var(--color-high-text);
  }
</style>
