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
                    component: () => import('../components/page/industry.vue'),
                    meta: { title: '行业管理' }
                },
                {

                    path: '/region',
                    component: () => import('../components/page/region.vue'),
                    meta: { title: '地区管理' }
                },
                {
                    path: '/organ',
                    component: () => import('../components/page/organ.vue'),
                    meta: { title: '机构管理' }
                },
                {
                    path: '/users',
                    component: () => import('../components/page/users.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/equipment',
                    component: () => import('../components/page/equipment.vue'),
                    meta: { title: '设备管理' }
                },
                {
                    path: '/terminal',
                    component: () => import('../components/page/terminal.vue'),
                    meta: { title: '终端管理' }
                },
                {
                    path: '/collection',
                    component: () => import('../components/page/collection.vue'),
                    meta: { title: '采集数据管理' }
                },
                {
                    path: '/alarmset',
                    component: () => import('../components/page/baseinfo/alarmset.vue'),
                    meta: { title: '报警参数设置' }
                },
                {
                    path: '/intervalset',
                    component: () => import('../components/page/intervalset.vue'),
                    meta: { title: '工作时段设置' }
                },
                {
                    path: '/peakset',
                    component: () => import('../components/page/peakset.vue'),
                    meta: { title: '错峰时段报备' }
                },
                {
                    path: '/monitor',
                    component: () => import('../components/page/Monitor.vue'),
                    meta: { title: '设备实时监控' }
                },
                {
                    path: '/industryStatistics',
                    component: () => import('../components/page/industryStatistics.vue'),
                    meta: { title: '按行业统计' }
                },
                
            ]
        },
        {
            path: '/login',
            component: () => import('../components/page/Login.vue')
        }
    ]
});
