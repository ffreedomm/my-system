<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '3',
                    title: '基础信息管理',
                    subs: [
                        {
                            index: 'industry',
                            title: '行业管理'
                        },
                        {
                            index: 'region',
                            title: '地区管理'
                        },
                        {
                            index: 'organ',
                            title: '机构管理'
                        },
                        {
                            index: 'users',
                            title: '用户管理'
                        },
                        {
                            index: 'equipment',
                            title: '设备管理'
                        },
                        {
                            index: 'terminal',
                            title: '终端管理'
                        },
                        {
                            index: 'collection',
                            title: '采集数据管理'
                        },
                        {
                            index: 'alarmset',
                            title: '报警参数设置'
                        },
                        {
                            index: 'intervalset',
                            title: '工作时段设置'
                        },
                        {
                            index: 'peakset',
                            title: '错峰时段报备'
                        },
                    ]
                },
                {
                   icon: 'el-icon-s-grid',
                    index: '4',
                    title: '数据监控',
                    subs: [
                      {
                            index: 'monitor',
                            title: '设备实时监控'
                        },
                    ]
                },
                {
                   icon: 'el-icon-eleme',
                    index: '5',
                    title: '故障情况统计',
                    subs: [
                      {
                          index: 'form',
                          title: '按行业统计'
                      },
                      {
                          index: 'form',
                          title: '按地区统计'
                      },
                      {
                          index: 'form',
                          title: '按机构统计'
                      },
                      {
                          index: 'form',
                          title: '按设备统计'
                      },
                      {
                          index: 'form',
                          title: '设备故障现场分析'
                      },
                    ]
                },
                {
                   icon: 'el-icon-table-lamp',
                    index: '6',
                    title: '用电情况统计',
                    subs: [
                        {
                          index: 'form',
                          title: '按行业统计'
                      },
                      {
                          index: 'form',
                          title: '按地区统计'
                      },
                      {
                          index: 'form',
                          title: '按机构统计'
                      },
                      {
                          index: 'form',
                          title: '按设备统计'
                      },
                      {
                          index: 'form',
                          title: '按关联设备对比统计'
                      },
                    ]
                },
                {
                   icon: 'el-icon-setting',
                    index: '7',
                    title: '其他',
                    subs: [
                        {
                          index: 'form',
                          title: '上传数据查看'
                      },
                      {
                          index: 'form',
                          title: '操作日志管理'
                      },
                      {
                          index: 'form',
                          title: '修改密码'
                      },
                    ]
                },
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
