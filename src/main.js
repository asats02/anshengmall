import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import toast from 'components/common/toast'
Vue.config.productionTip = false
    //  需要添加$bus 原型 事件总线
Vue.prototype.$bus = new Vue()
//  安装toast 插件
Vue.use(toast)

//  解决移动端 点击300ms延迟问题
FastClick.attach(document.body)

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
