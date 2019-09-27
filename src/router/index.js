import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import( '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import('../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                // {
                //     path: '/icon',
                //     component: () => import('../components/page/Icon.vue'),
                //     meta: { title: '自定义图标' }
                // },
                {
                    path: '/industry',
                    component: () => import('../components/page/BaseTable.vue'),
                    meta: { title: '行业管理' }
                },
                {
                    path: '/monitor',
                    component: () => import('../components/page/Monitor.vue'),
                    meta: { title: '设备实时监控' }
                },
                
            ]
        },
        {
            path: '/login',
            component: () => import('../components/page/Login.vue')
        }
    ]
});
