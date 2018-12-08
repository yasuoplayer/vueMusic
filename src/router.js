import Vue from'vue'
import Singer from './components/Singer/Singer'
import Rank from './components/Rank/Rank'
import Search from './components/Search/Search'
import Recommend from './components/Recommend/Recommend'
import VueRouter from "vue-router"

var routes = [
    {
        path:"/singer",
        component:Singer
    },
    {
        path:"/",
        component:Recommend
    },
    {
        path:"/rank",
        component:Rank
    },
    {
        path:"/search",
        component:Search
    },
    {
        path:"/recommend",
        component:Recommend
    }
];
// 定义路由组件
var router = new VueRouter({
    routes
});

export default router