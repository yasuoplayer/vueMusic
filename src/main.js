import Vue from 'vue'
import VueRouter from 'vue-router'
import vuex from 'vuex'
import  APP from './APP'
import './common/stylus/index.styl'
import  router from './router.js'
import store from './store/store'
Vue.use(vuex)
Vue.use(VueRouter)
new Vue({
 	el:"#app",
    router,
    store,
  render: h => h(APP)
})
