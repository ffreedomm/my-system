<template>
    <div>
        <el-divider content-position="left">整体情况监控</el-divider>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card
                            shadow="always"
                            :body-style="{padding: '0px','background-color': 'lightskyblue'}"
                        >
                            <div slot="header" class="clearfix">
                                <div
                                    style="font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #fff;"
                                >机构总数</div>
                            </div>
                            <div class="grid-content grid-con-1">
                                <div class="grid-cont-right">
                                    <div class="grid-num">5家</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card
                            shadow="hover"
                            :body-style="{padding: '0px','background-color': '#94d6da'}"
                        >
                            <div slot="header" class="clearfix">
                                <div
                                    style="font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #fff;"
                                >产污设备数</div>
                            </div>
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">6个</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card
                            shadow="hover"
                            :body-style="{padding: '0px','background-color': '#dbce8f'}"
                        >
                            <div slot="header" class="clearfix">
                                <div
                                    style="font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #fff;"
                                >治污设备数</div>
                            </div>
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">8个</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card
                            shadow="hover"
                            :body-style="{padding: '0px','background-color': '#d3d7d4'}"
                        >
                            <div slot="header" class="clearfix">
                                <div
                                    style="font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #fff;"
                                >监控点数</div>
                            </div>

                            <div class="grid-content grid-con-1">
                                <div class="grid-cont-right">
                                    <div class="grid-num">12个</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card
                            shadow="hover"
                            :body-style="{padding: '0px','background-color': '#f173ac'}"
                        >
                            <div slot="header" class="clearfix">
                                <div
                                    style="font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #fff;"
                                >产污异常机构数</div>
                            </div>
                            <div class="grid-content grid-con-3">
                                <div class="grid-cont-right">
                                    <div class="grid-num">4家</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card
                            shadow="hover"
                            :header-style="{color:'#f3704b'}"
                            :body-style="{padding: '0px','background-color': '#f3704b'}"
                        >
                            <div slot="header" style="{color:#f3704b}" class="clearfix">
                                <div
                                    style="font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #fff;"
                                >治污异常机构数</div>
                            </div>
                            <div class="grid-content grid-con-3">
                                <div class="grid-cont-right">
                                    <div class="grid-num">3家</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <div id="myChart" :style="{width: '500', height: '290px'}"></div>
            </el-col>
        </el-row>
        <el-divider></el-divider>
         <!-- <el-row :gutter="20">
            
           <el-col :span="12">
                 <div id="myChart2" :style="{width: '500', height: '380px'}"></div>
             </el-col>
        </el-row> -->
        <el-row :gutter="20">
            <el-col :span="24">
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
            "electricityTotalList": [{
			"createTime": "2019-8-28-19-59-52",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-8-30-10-6-12",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-1-0-12-31",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-2-14-18-50",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-4-4-25-10",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-5-18-31-29",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-7-8-37-48",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-8-22-44-8",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-10-12-50-27",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-12-2-56-46",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-13-17-3-6",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-15-7-9-25",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-16-21-15-44",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-18-11-22-4",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-20-1-28-23",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-21-15-34-42",
			"electricity": 88.18316580749493,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-23-5-41-1",
			"electricity": 27.611924328376144,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-24-19-47-21",
			"electricity": 30.446782748721446,
			"power": 0.0,
			"voltage": 0.0
		}, {
			"createTime": "2019-9-26-9-53-40",
			"electricity": 556.4789419102278,
			"power": 26590.533078292417,
			"voltage": 373.10070114440646
		}, {
			"createTime": "2019-9-27-23-59-59",
			"electricity": 0.0,
			"power": 0.0,
			"voltage": 0.0
		}],
        "powerTotalList": [{
			"endTime": "2019-8-30-10-6-12",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-8-28-19-59-52"
		}, {
			"endTime": "2019-9-1-0-12-31",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-8-30-10-6-12"
		}, {
			"endTime": "2019-9-2-14-18-50",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-1-0-12-31"
		}, {
			"endTime": "2019-9-4-4-25-10",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-2-14-18-50"
		}, {
			"endTime": "2019-9-5-18-31-29",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-4-4-25-10"
		}, {
			"endTime": "2019-9-7-8-37-48",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-5-18-31-29"
		}, {
			"endTime": "2019-9-8-22-44-8",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-7-8-37-48"
		}, {
			"endTime": "2019-9-10-12-50-27",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-8-22-44-8"
		}, {
			"endTime": "2019-9-12-2-56-46",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-10-12-50-27"
		}, {
			"endTime": "2019-9-13-17-3-6",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-12-2-56-46"
		}, {
			"endTime": "2019-9-15-7-9-25",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-13-17-3-6"
		}, {
			"endTime": "2019-9-16-21-15-44",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-15-7-9-25"
		}, {
			"endTime": "2019-9-18-11-22-4",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-16-21-15-44"
		}, {
			"endTime": "2019-9-20-1-28-23",
			"kwh": 0.0,
			"power": 0.0,
			"startTime": "2019-9-18-11-22-4"
		}, {
			"endTime": "2019-9-21-15-34-42",
			"kwh": 469545.46537487296,
			"power": 12322.32102107132,
			"startTime": "2019-9-20-1-28-23"
		}, {
			"endTime": "2019-9-23-5-41-1",
			"kwh": 567512.948855051,
			"power": 14893.289905001373,
			"startTime": "2019-9-21-15-34-42"
		}, {
			"endTime": "2019-9-24-19-47-21",
			"kwh": 204122.89630530003,
			"power": 5356.775234721389,
			"startTime": "2019-9-23-5-41-1"
		}, {
			"endTime": "2019-9-26-9-53-40",
			"kwh": 2932749.745355427,
			"power": 76964.39748999143,
			"startTime": "2019-9-24-19-47-21"
		}, {
			"endTime": "2019-9-27-23-59-59",
			"kwh": 2826595.8205234255,
			"power": 74178.5911392001,
			"startTime": "2019-9-26-9-53-40"
		}]
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
        let timeArr = [];
        this.electricityTotalList.forEach(item =>{
            timeArr.push(item.createTime);
        });
        let kwhArr = [];
        this.powerTotalList.forEach(item =>{
            kwhArr.push(Number(item.kwh));
        });
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
                legend: {
                    data:['机构分布']
                },
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
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : timeArr,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'用电量统计',
                        type:'bar',
                        barWidth: '60%',
                        data:kwhArr
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
    height: 80px;
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
    color: #fff;
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
    color: blue;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: lightskyblue;
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
