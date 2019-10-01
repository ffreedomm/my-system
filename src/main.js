import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = '物联网数据终端管理系统';
    const role = localStorage.getItem('username').role;
    if (!role && to.path !== '/login') {
        next('/login');
    }else {
        next();
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
