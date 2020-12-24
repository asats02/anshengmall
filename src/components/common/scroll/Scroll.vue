<template>
  <div class="wrapper" ref="wrapper">
    <div class="wpr-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BetterScroll from 'better-scroll'
  export default {
    name: 'Scroll',
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        bs: null
      }
    },
    mounted() {
      //  querySelector 拿到元素不准确，可以绑定ref获取特定的一个元素

      this.bs = new BetterScroll(this.$refs.wrapper, {
        observeDOM: true,
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })
      //  监听滚动
      this.bs.on('scroll', (position) => {
        this.$emit('scroll', position)
      })
      //  监听上拉事件
      this.bs.on('pullingUp', () => {
        //  上拉加载更多
        this.$emit('pullingUP')

      })
    },
    methods: {
      //  封装scroll 本身的 scrollTo方法
      scrollTo(x, y, time = 500) {
        this.bs && this.bs.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.bs && this.bs.finishPullUp()
      },
      refresh() {
        this.bs && this.bs.refresh()
        console.log('refresh刷新');
      }

    }
  }
</script>

<style>

</style>
