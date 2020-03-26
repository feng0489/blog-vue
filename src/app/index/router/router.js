import Vue from 'vue'
import VueRouter from 'vue-router'

import Router from 'vue-router'
/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
}


//前端
import Articles from '../views/articles/Lst'
import ArticlesInfo from '../views/articles/Info'


Vue.use(VueRouter);


export default new VueRouter({
    routes:[
        {
            path:"/",
            component:Articles,
            name:'首页'
        },

        {
            path:"/articles/:id",
            component:Articles,
            name:'articlesList',

        },
        {
            path:"/articles",
            component:Articles,
        },
        {
            path:"/art",
            component:ArticlesInfo,
            name:'articleInfo',
        },
        {
            path:"/art/:id",
            component:ArticlesInfo,
            name:'articleInfoById',
        },


    ],
    mode:"history"
})
