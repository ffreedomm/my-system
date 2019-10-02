<template>
    <div>
        <div class="container">
            <el-row>
                <el-col :span="9">
                <treeselect style="width:90%" 
                    v-model="orgId" 
                    :options="orgList"
                    default-expand-all="true"
                    placeholder="机构信息" />
                </el-col>
                <el-col :span="15">
                    {{weather}} &nbsp; &nbsp; &nbsp; {{ date | formaDate }}
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="9">
                    <el-row>
                        <div id="myChart" :style="{width: '100%', height: '200px'}"></div>
                    </el-row>
                    <el-row>
                        <el-table :data="tData" height="320">
                            <el-table-column fixed="left" type="index" width="50" label="序号" align="center" />
                            <el-table-column prop="org.name" label="机构名称"/>
                            <el-table-column prop="deviceSum" label="设备数量" width="100"/>
                            <el-table-column prop="terminalSum" label="终端数量" width="100"/>
                        </el-table>
                    </el-row>
                </el-col>
                <el-col :span="15">
                    <el-row :gutter="40">
                           <baidu-map  class="map" 
                                :zoom="zoom" :center="center"
                                @ready="handler" 
                                :scroll-wheel-zoom="true"
                                ak="%E6%82%A8%E7%9A%84%E5%AF%86%E9%92%A5">
                                <bm-marker 
                                v-for="marker in markers" :key="marker.id"
                                    @click="getDeviceInfo(marker.id)"
                                    :position="{lng: marker.longitude, lat: marker.latitude}" 
                                    animation="BMAP_ANIMATION_BOUNCE">
                                <bm-label 
                                    :content="marker.name" 
                                    :labelStyle="{color: 'red', fontSize : '15px'}" 
                                    :offset="{width: 20, height: -20}"/>
                                </bm-marker>
                                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"/>
                                <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"/>
                                <!-- <bm-view 
                                    :style="{width:'100%',height: '600px',flex: 1,marginBottom:'-30px'}"/> -->
                                </baidu-map>
                    </el-row>
                </el-col>
            </el-row>
            <el-divider/>
            <el-row :gutter="40">
                <el-col :span="9">
                    <el-row :gutter="20" class="mgb20">
                        <el-col :span="8">
                            <el-card
                                shadow="always"
                                :body-style="{padding: '0px','background-color': 'lightskyblue'}"
                            >
                                <div slot="header" class="clearfix">
                                    <div
                                        style="color:blue;font-size:16px;font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #f3f3f3;"
                                    >总报警数</div>
                                </div>
                                <div class="grid-content grid-con-1">
                                    <div class="grid-cont-right">
                                        <div class="grid-num">{{warningData.total}}</div>
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
                                        style="color:green;font-size:16px;font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #f3f3f3;"
                                    >已处理数</div>
                                </div>
                                <div class="grid-content grid-con-2">
                                    <div class="grid-cont-right">
                                        <div class="grid-num">{{warningData.handled}}</div>
                                        <span class="percent">{{warningData.handledPercent}}%</span>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card
                                shadow="hover"
                                :body-style="{padding: '0px','background-color': '#f3704b'}"
                            >
                                <div slot="header" class="clearfix">
                                    <div
                                        style="color:red;font-size:16px;font-weight:bold;margin:-18px -20px; padding:10px 10px; background: #f3f3f3;"
                                    >未处理数</div>
                                </div>
                                <div class="grid-content grid-con-2">
                                    <div class="grid-cont-right">
                                        <div class="grid-num">{{warningData.unhandled}}</div>
                                        <span class="percent">{{warningData.unhandledPercent}}%</span>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                        <el-divider>报警条数</el-divider>
                        <el-tabs type="border-card" header-style="font-size: 12px;">
                            <el-tab-pane>
                                <span slot="label">1小时内(1条)</span>
                            </el-tab-pane>
                            <el-tab-pane>
                                <span slot="label">8小时内(3条)</span>
                            </el-tab-pane>
                            <el-tab-pane>
                                <span slot="label">24小时内(6条)</span>
                            </el-tab-pane>
                            <el-table>
                                <el-table-column></el-table-column>
                            </el-table>
                        </el-tabs>
                </el-col>
                <el-col :span="9">
                    <div id="myChart2" :style="{width: '100%', height: '400px'}"></div>
                </el-col>
                <el-col :span="6">
                    <div id="myChart3" :style="{width: '100%', height: '400px'}"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import {BaiduMap,BmNavigation,BmView,BmGeolocation,BmCityList,BmMarker,BmLabel} from 'vue-baidu-map'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getQueryOrgList,getAllTerminalTotalListForOrg,getAllDeviceListForOrg,getTerminalTotalListForOrgOrChild,
getTerminalAlertTotalInFaultStatus, getTerminalRecordListForDevice,getTotalListForDeviceList} from '@/api/monitor';

export default {
    name: 'monitor',
　　components: {
    BaiduMap,
    BmNavigation,
    BmView,
    BmCityList,
    BmMarker,
    BmLabel,
    Treeselect
  },

    data() {
        return {
            date:new Date(),
            weather:'',
            orgId:1,
            orgList:[],
            zoom: 10,
            center:{lng: 108.89, lat: 34.34},
            markers:[],
            warningData:{},
            tData:[],
            cData:[],
            timeId:{},
            lastTDLArr:[],
            lastTGLArr:[],
            lastTYArr:[],
            lastCData:[]
        };
    },
    watch: {
      orgId(val) {
        this.orgId = val;
        this.initData();
      }
    },
    computed: {
        
    },
    beforeDestroy:function(){
        //实例销毁前青出于定时器
        if(this.timeId){
            clearInterval(this.timeId);
        }
    },
    mounted() {
        //创建定时器更新时间
        var _this = this;
        this.timeId= setInterval(function(){
            _this.date = new Date();
        },1000);
        this.initWeather();
        this.initData();
    },
    methods: {
        //初始化数据
        initData(){
            this.cData = [];
            //获取机构
            this.getOrgList();
            //列表
            this.getTData();
            //地图标点
            this.getMapPoint();
            //报警处理
            this.getWarningData();
            //饼图数据
            this.getCircelData();
        },
        //下拉框数据
        getOrgList(){
            const req = {start:1,end:99999}
            getQueryOrgList(req).then(res=>{
                if(res.success){
                    if(res.object && res.object.length > 0){
                        this.orgList = this.toTree(res.object);
                    }
                }
            })
        },
        //饼图下表列表数据
        getTData(){
            getAllTerminalTotalListForOrg(this.orgId).then(res=>{
                if(res.success){
                    if(res.object && res.object.length > 0){
                        this.tData = res.object
                    }
                }
            })
        },
        //地图标点数据
        getMapPoint(){
            getAllDeviceListForOrg(this.orgId).then(res=>{
                if(res.success){
                    if(res.object && res.object.length > 0){
                        this.markers = res.object
                        if(this.orgId != 1){
                            this.center={lng: this.markers[0].longitude, lat: this.markers[0].latitude};
                       }else{
                            this.center={lng: 108.89, lat: 34.34};
                       }
                    }
                }
            })
        },

        //获取饼图数据
        getCircelData(){
            getTerminalTotalListForOrgOrChild(this.orgId).then(res=>{
                if(res.success){
                    if(res.object && res.object.length > 0){
                        res.object.forEach((item) =>{
                            this.cData.push({value:item.deviceSum,name:item.org.name});
                        })
                        this.initChart()
                        this.initCChart();
                    }
                }
            })
        },

        //报警处理
        getWarningData(){
            getTerminalAlertTotalInFaultStatus().then(res=>{
                if(res.success){
                    if(res.object){
                        this.warningData = res.object
                    }
                }
            })
        },
        
        //转为树
        toTree(data) {
            let result = []
            if(!Array.isArray(data)) {
                return result
            }
            data.forEach(item => {
                delete item.children;
            });
            let map = {};
            data.forEach(item => {
                map[item.id] = item;
            });
            data.forEach(item => {
                item.label=item.name;
                let parent = map[item.parentId];
                if(parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    result.push(item);
                }
            });
            return result;
        },

        initWeather(){
            var weatherArr = ["晴，30°C", "多云，26°C", "小雨，21°C"];
            var rand = Math.random();
            rand = parseInt(rand * 10, 10) % 3;
            this.weather = weatherArr[rand];
        },

        //初始化地图
        handler ({BMap, map}) {
            window.map = map;
        },
        initChart(){
            let myChart = this.$echarts.init(document.getElementById('myChart'));
            myChart.setOption({
                tooltip : {
                    position: 'inner',
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '',
                        type: 'pie',
                        radius : '75%',
                        center: ['45%', '50%'],
                        data:this.cData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{ 
                                label:{ 
                                    show: true, 
                                    formatter: '{a} \n{b}\n{c} ({d}%)' 
                                }, 
                                labelLine :{show:true} 
                            }
                        },
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine :{show:true} 
                    }
                ]
            });
        },

        //最后的饼图
        initCChart(){
            let myChart3 = this.$echarts.init(document.getElementById('myChart3'));
            myChart3.setOption({
                title: {
                    text: '实时状态统计'
                },
                tooltip : {
                    position: 'inner',
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '',
                        type: 'pie',
                        radius : '75%',
                        center: ['45%', '50%'],
                        data:this.lastCData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{ 
                                label:{ 
                                    show: true, 
                                    formatter: '{a} \n{b}\n{c} ({d}%)' 
                                }, 
                                labelLine :{show:true} 
                            }
                        },
                        label: {
                            // normal: {
                            //     position: 'inner'
                            // }
                        },
                        labelLine :{show:true} 
                    }
                ]
            });
        },

        //点击地图的点获取折线图和饼图数据
        getDeviceInfo(id){
            debugger
            let req = {
                deviceId:id,
                start:1,
                end:10
            }
            getTerminalRecordListForDevice(req).then(res=>{
                if(res.success){
                    if(res.object && res.object.length > 0){
                        this.lastTDLArr = []
                        this.lastTGLArr = []
                        this.lastTYArr = []
                        res.object.forEach((item) =>{
                            this.lastTDLArr.push(Number(item.electricity))
                            this.lastTGLArr.push(Number(item.power/1000).toFixed(2))
                            this.lastTYArr.push('')
                        })
                        this.initZXChart();
                    }
                }
            });
            getTotalListForDeviceList(id).then(res=>{
                if(res.success){
                    if(res.object && res.object.length > 0){
                        this.lastCData = [];
                        let temp = res.object[0];
                        this.lastCData.push(
                            {
                                value:temp.deviceSum,
                                name:'设备总数量'
                            },
                            {
                                value:temp.fault1Sum,
                                name:'功率轻度超标总次数'
                            },
                            {
                                value:temp.fault2Sum,
                                name:'功率中度超标总次数'
                            },
                            {
                                value:temp.fault3Sum,
                                name:'功率重度超标总次数'
                            },
                            {
                                value:temp.fault4Sum,
                                name:'非法关机总次数'
                            },
                            {
                                value:temp.fault5Sum,
                                name:'非法开机总次数'
                            },
                            {
                                value:temp.faultSum,
                                name:'故障总次数'
                            },
                            {
                                value:temp.handledSum,
                                name:'处理故障总次数'
                            },
                        );
                        this.initCChart();
                    }
                }
            });
            
        },
        //折线图
        initZXChart(){
            let myChart2 = this.$echarts.init(document.getElementById('myChart2'));
            myChart2.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['电流值','功率值'],
                    align: 'left'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.lastTYArr
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'电流值',
                        type:'line',
                        data: this.lastTDLArr
                    },
                    {
                        name:'功率值',
                        type:'line',
                        data: this.lastTGLArr
                    }
                ]
            });

        },
    },
    filters:{
        //设置一个函数来进行过滤
        formaDate(value){
            //创建一个时间日期对象
            var date = new Date();
            var year = date.getFullYear();      //存储年
            var month = date.getMonth()+1 <10 ? '0'+date.getMonth()+1 : date.getMonth()+1;    //存储月份
            var day = date.getDate() <10 ? '0'+date.getDate() : date.getDate();//存储日期
            var hours = date.getHours() <10 ? '0'+date.getHours() : date.getHours();      //存储时
            var minutes = date.getMinutes() <10 ? '0'+date.getMinutes() : date.getMinutes();  //存储分
            var seconds = date.getSeconds() <10 ? '0'+date.getSeconds() : date.getSeconds();  //存储秒
            var week = "    星期" + "日一二三四五六".charAt(date.getDay());
            //返回格式化后的日期
            return year+'年'+month+'月'+day+'日'+hours+'时'+minutes+'分'+seconds+'秒'+week;
        }
    },
};
</script>


<style scoped>
.table{
    height:400px;
    width:100%;
    margin-top:20px;
    background:blue

}

.map {
 width: 100%;
 height: 520px;
}
.el-select el-select--small{
    width: 35% !important;
}

.grid-content {
    display: flex;
    height: 80px;
}

.grid-cont-right {
    margin-left: 10px;
    margin-top: 8px;
    flex: 1;
    text-align: start;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 26px;
    font-weight: bold;
    color: #fff;
}
.percent{
    font-size: 18px;
    float: right;
    margin-right: 12px;
    margin-top: 12px;
    color: #fff
}
</style>
