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
                {
                    path: '/industry',
                    component: () => import('../components/page/baseinfo/industry.vue'),
                    meta: { title: '行业管理' }
                },
                {

                    path: '/region',
                    component: () => import('../components/page/baseinfo/region.vue'),
                    meta: { title: '地区管理' }
                },
                {
                    path: '/organ',
                    component: () => import('../components/page/baseinfo/organ.vue'),
                    meta: { title: '机构管理' }
                },
                {
                    path: '/users',
                    component: () => import('../components/page/baseinfo/users.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/equipment',
                    component: () => import('../components/page/baseinfo/equipment.vue'),
                    meta: { title: '设备管理' }
                },
                {
                    path: '/terminal',
                    component: () => import('../components/page/baseinfo/terminal.vue'),
                    meta: { title: '终端管理' }
                },
                {
                    path: '/collection',
                    component: () => import('../components/page/baseinfo/collection.vue'),
                    meta: { title: '采集数据管理' }
                },
                {
                    path: '/alarmset',
                    component: () => import('../components/page/baseinfo/alarmset.vue'),
                    meta: { title: '报警参数设置' }
                },
                {
                    path: '/intervalset',
                    component: () => import('../components/page/baseinfo/intervalset.vue'),
                    meta: { title: '工作时段设置' }
                },
                {
                    path: '/peakset',
                    component: () => import('../components/page/baseinfo/peakset.vue'),
                    meta: { title: '错峰时段报备' }
                },
                {
                    path: '/monitor',
                    component: () => import('../components/page/Monitor.vue'),
                    meta: { title: '设备实时监控' }
                },
                {
                    path: '/industryStatistics',
                    component: () => import('../components/page/statistics/industryStatistics.vue'),
                    meta: { title: '按行业统计' }
                },
                {
                    path: '/zoneStatistics',
                    component: () => import('../components/page/statistics/zoneStatistics.vue'),
                    meta: { title: '按地区统计' }
                },
                {
                    path: '/organStatistics',
                    component: () => import('../components/page/statistics/organStatistics.vue'),
                    meta: { title: '按机构统计' }
                },
                {
                    path: '/equipmentStatistics',
                    component: () => import('../components/page/statistics/equipmentStatistics.vue'),
                    meta: { title: '按设备统计' }
                },
                {
                    path: '/totalDeviceStatistics',
                    component: () => import('../components/page/statistics/totalDeviceStatistics.vue'),
                    meta: { title: '设备故障现场分析' }
                },
                /*********用电情况统计开始****************************************************** */
                {
                    path: '/statisticalfortrade',
                    component: () => import('../components/page/electricity/statisticalfortrade.vue'),
                    meta: { title: '按行业统计' }
                },
                {
                    path: '/statisticalforzone',
                    component: () => import('../components/page/electricity/statisticalforzone.vue'),
                    meta: { title: '按地区统计' }
                },
                {
                    path: '/statisticalfororg',
                    component: () => import('../components/page/electricity/statisticalfororg.vue'),
                    meta: { title: '按机构统计' }
                },
                {
                    path: '/statisticalfordevice',
                    component: () => import('../components/page/electricity/statisticalfordevice.vue'),
                    meta: { title: '按设备统计' }
                },
                {
                    path: '/statisticalforcontrast',
                    component: () => import('../components/page/electricity/statisticalforcontrast.vue'),
                    meta: { title: '按关联设备对比统计' }
                },
                /*************用电情况统计结束***************************************************** */
                {
                    path: '/editPassword',
                    component: () => import('../components/page/editPassword.vue'),
                    meta: { title: '修改密码' }
                },
                {
                    path: '/constructionPlan',
                    component: () => import('../components/page/constructionPlan.vue'),
                    meta: { title: '施工方案管理' }
                },
                {
                    path: '/uploadata',
                    component: () => import('../components/page/uploadata.vue'),
                    meta: { title: '上传数据查看' }
                },
                {
                    path: '/logsmanage',
                    component: () => import('../components/page/logsmanage.vue'),
                    meta: { title: '操作日志管理' }
                },
                {
                    path: '/userNotice',
                    component: () => import('../components/page/userNotice.vue'),
                    meta: { title: '用户通知管理' }
                },
                
            ]
        },
        {
            path: '/login',
            component: () => import('../components/page/Login.vue')
        }
    ]
});
