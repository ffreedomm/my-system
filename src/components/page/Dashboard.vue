<template>
    <div>
        <el-divider content-position="left">整体情况监控</el-divider>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <div class="grid-cont-right">
                                    <div class="grid-num">5家</div>
                                    <div>机构总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">6个</div>
                                    <div>产污设备数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">8个</div>
                                    <div>治污设备数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <div class="grid-cont-right">
                                    <div class="grid-num">12个</div>
                                    <div>监控点数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <div class="grid-cont-right">
                                    <div class="grid-num">4家</div>
                                    <div>产污异常机构数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <div class="grid-cont-right">
                                    <div class="grid-num">3家</div>
                                    <div>治污异常机构数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row :gutter="20">
            <el-col :span="12">
                <div id="myChart" :style="{width: '500', height: '380px'}"></div>
            </el-col>
            <el-col :span="12">
                <div id="myChart2" :style="{width: '500', height: '380px'}"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            todoList: [
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: true
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: true
                }
            ],
            data: [
                {
                    name: '2018/09/04',
                    value: 1083
                },
                {
                    name: '2018/09/05',
                    value: 941
                },
                {
                    name: '2018/09/06',
                    value: 1139
                },
                {
                    name: '2018/09/07',
                    value: 816
                },
                {
                    name: '2018/09/08',
                    value: 327
                },
                {
                    name: '2018/09/09',
                    value: 228
                },
                {
                    name: '2018/09/10',
                    value: 1065
                }
            ],
            options: {
                title: '最近七天每天的用户访问量',
                showValue: false,
                fillColor: 'rgb(45, 140, 240)',
                bottomPadding: 30,
                topPadding: 30
            },
            options2: {
                title: '最近七天用户访问趋势',
                fillColor: '#FC6FA1',
                axisColor: '#008ACD',
                contentColor: '#EEEEEE',
                bgColor: '#F5F8FD',
                bottomPadding: 30,
                topPadding: 30
            }
        };
    },

    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    mounted() {
        this.drawLine();
    },
    methods: {
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'));
            let myChart2 = this.$echarts.init(document.getElementById('myChart2'));
            // 绘制图表
            myChart.setOption({
                title: { text: '机构分布' },
                tooltip: {},
                xAxis: {
                    data: ['安康市', '宝鸡市', '汉中市', '商洛市', '铜川市', '渭南市', '西安市', '延安市']
                },
                yAxis: {},
                series: [
                    {
                        itemStyle: {
                            normal: { color: 'rgba(45,140,240,1)' }
                        },
                        name: '机构分布',
                        type: 'bar',
                        data: [1, 1, 0, 0, 0, 3, 0, 0]
                    }
                ]
            });
            // 绘制图表
            myChart2.setOption({
                title: { text: '近30天用电量统计' },
                tooltip: {},
                xAxis: {
                    data: ['安康市', '宝鸡市', '汉中市', '商洛市', '铜川市', '渭南市', '西安市', '延安市']
                },
                yAxis: {},
                series: [
                    {
                        itemStyle: {
                            normal: { color: 'rgba(45,140,240,1)' }
                        },
                        name: '销量',
                        type: 'bar',
                        data: [1, 1, 0, 0, 0, 3, 0, 0]
                    }
                ]
            });
        }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
