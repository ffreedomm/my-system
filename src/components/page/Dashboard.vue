<template>
    <div>
    <div class="container">
      <el-row :gutter="40">
            <el-col :span="12">
        <el-divider content-position="left">整体情况监控</el-divider>
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card
                            shadow="always"
                            :body-style="{padding: '0px','background-color': 'lightskyblue'}"
                        >
                            <div slot="header" class="clearfix">
                                <div
                                    style="font-size:14px;font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #f3f3f3;"
                                >企业总数</div>
                            </div>
                            <div class="grid-content grid-con-1">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{t1Data.orgSum}}家</div>
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
                                    style="font-size:14px;font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #f3f3f3;"
                                >产污设备数</div>
                            </div>
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{t1Data.productDeviceSum}}个</div>
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
                                    style="font-size:14px;font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #f3f3f3;"
                                >治污设备数</div>
                            </div>
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{t1Data.treatDeviceSum}}个</div>
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
                                    style="font-size:14px;font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #f3f3f3;"
                                >监控点数</div>
                            </div>

                            <div class="grid-content grid-con-1">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{t1Data.terminalSum}}个</div>
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
                                    style="font-size:14px;font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #f3f3f3;"
                                >产污异常企业数</div>
                            </div>
                            <div class="grid-content grid-con-3">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{t1Data.productFaultOrgSum}}家</div>
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
                                    style="font-size:14px;font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #f3f3f3;"
                                >治污异常企业数</div>
                            </div>
                            <div class="grid-content grid-con-3">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{t1Data.treatFaultOrgSum}}家</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>

            <el-col :span="12">
        <el-divider content-position="left">企业分布</el-divider>
                <div id="myChart" :style="{width: '800', height: '290px'}"></div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
            <el-divider content-position="left">故障统计</el-divider>
                <div id="myChartNew" :style="{width: '400', height: '380px'}"></div>
            </el-col>
            <el-col :span="12">
        <el-divider content-position="left">用电量统计</el-divider>
                <div id="myChart2" :style="{width: '400', height: '380px'}"></div>
            </el-col>
        </el-row>
    </div>
    </div>
</template>

<script>
import { getBasicInfoTotalForToday,getOrgInZoneTotalList,getPETotalForAll,getTotalListForAllZones} from '@/api/homepage';
export default {
    name: 'dashboard',
    data() {
        return {
            t1Data : {},
            t1Data_2Arr : [],
            t2Data_xArr : [],
            t2Data_yArr : [],
            t3Data_xArr : [],
            t3Data_yArr : [],
            tNewDataName:[],
            tNewData1Arr:[],
            tNewData2Arr:[],
            tNewData3Arr:[],
            tNewData4Arr:[],
            tNewData5Arr:[],
            tNewData6Arr:[],
            tNewData7Arr:[],
            tNewData8Arr:[],
        };
    },

    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    mounted() {
        //获取数据
        this.getT1Data();
        this.getT2Data();
        this.getT3Data();
        this.getTNewData();
    },
    methods: {
        //基本情况监控
        getT1Data(){
            getBasicInfoTotalForToday().then(res=>{
                if(res.success){
                    if(res.object){
                        this.t1Data = res.object;
                    }
                }
            })
        },
        //企业分布
        getT2Data(){
            const _this = this;
            getOrgInZoneTotalList().then(res=>{
                if(res.success){
                    if(res.object && res.object.length > 0){
                        res.object.forEach((item) =>{
                            _this.t2Data_xArr.push(item.zone.name);  
                            _this.t2Data_yArr.push(item.orgSum);
                            //渲染图标
                            _this.drawT2();
                        });
                    }
                }
            })
        },
        //30天用电量
        getT3Data(){
            const _this = this;
            getPETotalForAll().then(res=>{
                if(res.success){
                    if(res.object && res.object.electricityTotalList.length > 0){
                        res.object.electricityTotalList.forEach(item =>{
                            _this.t3Data_xArr.push(item.createTime.substring(0, _this.find(item.createTime,'-',2)));
                        });
                        res.object.powerTotalList.forEach(item =>{
                            _this.t3Data_yArr.push(Number(item.kwh/1000).toFixed(2));
                        });
                        _this.drawT3();
                    }
                }
            })
        },

        //故障统计
        getTNewData(){
            const _this = this;
            getTotalListForAllZones().then(res=>{
                if(res.success){
                    if(res.object && res.object.length > 0){
                        res.object.forEach((item) =>{
                            delete item.id;
                            delete item.category;
                            _this.tNewDataName.push(item.name);
                            _this.tNewData1Arr.push(item.deviceSum);
                            _this.tNewData2Arr.push(item.fault1Sum);
                            _this.tNewData3Arr.push(item.fault2Sum);
                            _this.tNewData4Arr.push(item.fault3Sum);
                            _this.tNewData5Arr.push(item.fault4Sum);
                            _this.tNewData6Arr.push(item.fault5Sum);
                            _this.tNewData7Arr.push(item.faultSum);
                            _this.tNewData8Arr.push(item.handledSum);
                        })
                        _this.drawTNew();
                    }
                }
            })
        },

        drawT2(){
            let myChart = this.$echarts.init(document.getElementById('myChart'));
            // 绘制图表
            myChart.setOption({
                //backgroundColor:'#f3f3f3',
                //title: { text: '企业分布' },
                tooltip: {},
                xAxis: {
                    // axisLabel: {
                    //     interval: 0,    //强制文字产生间隔
                    //     rotate: -45,     //文字逆时针旋转45°
                    // },
                    data: this.t2Data_xArr
                },
                yAxis: {},
                legend: {
                    data:['企业分布']
                },
                series: [
                    {
                        itemStyle: {
                            normal: { color: 'rgba(45,140,240,1)' }
                        },
                        name: '企业分布',
                        type: 'bar',
                        data: this.t2Data_yArr
                    }
                ]
            });
        },

        drawT3(){
            let myChart2 = this.$echarts.init(document.getElementById('myChart2'));
            // 绘制图表
            myChart2.setOption({
                //backgroundColor:'#f3f3f3',
                //title: { text: '用电量统计' },
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
                        axisLabel: {
                            interval: 0,    //强制文字产生间隔
                            rotate: -45,     //文字逆时针旋转45°
					   },
                        data : this.t3Data_xArr,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        data: this.t3Data_yArr
                    }
                ],
                legend: {
                    data:['用电量统计']
                },
                series : [
                    {
                        itemStyle: {
                            normal: { color: 'rgba(45,140,240,1)' }
                        },
                        name:'用电量统计',
                        type:'bar',
                        barWidth: '60%',
                        data: this.t3Data_yArr,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                    }
                ]
            });
        },

        find(str,cha,num){
            var x=str.indexOf(cha);
            for(var i=0;i<num;i++){
                x=str.indexOf(cha,x+1);
            }
            return x;
        },

        drawTNew(){
            let myChartNew = this.$echarts.init(document.getElementById('myChartNew'));
            myChartNew.setOption({
    title : {
        //text: '某地区蒸发量和降水量',
        //subtext: '纯属虚构'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data: ['设备总数量','功率轻度超标总次数','功率中度超标总次数',
        '功率重度超标总次数','非法关机总次数','非法开机总次数','故障总次数','处理故障总次数']
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : this.tNewDataName
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'设备总数量',
            type:'bar',
            data:this.tNewData1Arr,
        
        },
        {
            name:'功率轻度超标总次数',
            type:'bar',
            data:this.tNewData2Arr,
        
        },
        {
            name:'功率中度超标总次数',
            type:'bar',
            data:this.tNewData3Arr,
        
        },
        {
            name:'功率重度超标总次数',
            type:'bar',
            data:this.tNewData4Arr,
        
        },
        {
            name:'非法关机总次数',
            type:'bar',
            data:this.tNewData5Arr,
        
        },
        {
            name:'非法开机总次数',
            type:'bar',
            data:this.tNewData6Arr,
        
        },
        {
            name:'故障总次数',
            type:'bar',
            data:this.tNewData7Arr,
        
        },
        {
            name:'处理故障总次数',
            type:'bar',
            data:this.tNewData8Arr,
        
        },
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
    font-size: 26px;
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
