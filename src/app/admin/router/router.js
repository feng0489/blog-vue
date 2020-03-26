import Vue from 'vue'
import VueRouter from 'vue-router'


//后台
import Home from '../views/index/Home'
import AdminLst from '../views/admin/Lst'
import AdminInfo from '../views/admin/Info'
import Cat from '../views/cate/Lst'
import CatInfo from '../views/cate/Info'
import Article from '../views/Article/Lst'
import ArticleInfo from '../views/Article/Info'
import Links from '../views/Links/Lst'
import LinksInfo from '../views/Links/Info'
import System from '../views/sys/System'
import Tags from '../views/sys/Tags'
import TagsInfo from '../views/sys/TasgsInfo'





Vue.use(VueRouter);


export default new VueRouter({
    routes:[
        {//首页
            path:"/admin",
            component:Home
        },
        {//管理员列表
            path:"/admin/lst",
            component:AdminLst,
            name:'管理员列表'

        },
        {//管理员添加
            path:"/admin/add",
            component:AdminInfo,
            name:'管理员添加'

        },
        {//管理员修改
            path:"/admin/edit",
            component:AdminInfo,
            name:'管理员修改'

        },
        {//栏目列表
            path:"/admin/cat/lst",
            component:Cat,
            name:'栏目列表'
        },
        {//栏目添加
            path:"/admin/cat/add",
            component:CatInfo,
            name:'栏目添加'

        },
        {//栏目修改
            path:"/admin/cat/edit",
            component:CatInfo,
            name:'栏目修改'

        },
        {//文章列表
            path:"/admin/article/lst",
            component:Article,
            name:'文章列表'
        },
        {//文章添加
            path:"/admin/article/add",
            component:ArticleInfo,
            name:'文章添加'

        },
        {//文章修改
            path:"/admin/article/edit",
            component:ArticleInfo,
            name:'文章修改'

        },
        {//友情链接列表
            path:"/admin/links/lst",
            component:Links,
            name:'友情链接'

        },
        {//友情链接添加
            path:"/admin/links/add",
            component:LinksInfo,
            name:'友情链接添加'

        },
        {//友情链接修改
            path:"/admin/links/edit",
            component:LinksInfo,
            name:'友情链接修改'

        },
        {//系统设置
            path:"/admin/sys",
            component:System,
            name:'系统设置'
        },
        {//标签列表
            path:"/admin/sys/tags",
            component:Tags,
            name:'标签列表',
            children:[

            ]
        },
        {//标签添加
            path:"/admin/sys/tags/add",
            component:TagsInfo,
            name:'标签添加',
            children:[

            ]
        },
        {//标签修改
            path:"/admin/sys/tags/edit",
            component:TagsInfo,
            name:'标签修改',
            children:[

            ]
        }

    ],
    mode:"history"
})
