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
                        <el-table :data="tData">
                            <el-table-column fixed="left" type="index" width="50" label="序号" align="center" />
                            <el-table-column prop="org.name" label="机构名称"/>
                            <el-table-column prop="deviceSum" label="设备数量" width="100"/>
                            <el-table-column prop="terminalSum" label="终端数量" width="100"/>
                        </el-table>
                    </el-row>
                </el-col>
                <el-col :span="15">
                    <el-row :gutter="40">
                        <!-- <div class="map">
                        </div> -->
                           <baidu-map  class="map" 
                                :zoom="zoom" :center="center"
                                @ready="handler" 
                                :scroll-wheel-zoom="true"
                                @click="clickEvent"
                                ak="%E6%82%A8%E7%9A%84%E5%AF%86%E9%92%A5">
                                <bm-marker 
                                v-for="marker in markers" :key="marker.id"
                                    :position="{lng: marker.longitude, lat: marker.latitude}" 
                                    animation="BMAP_ANIMATION_BOUNCE">
                                <bm-label 
                                    :content="marker.name" 
                                    :labelStyle="{color: 'red', fontSize : '15px'}" 
                                    :offset="{width: 20, height: -20}"/>
                                </bm-marker>
                                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"/>
                                <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"/>
                                <bm-view 
                                    :style="{width:'100%',height: '400px',flex: 1,marginBottom:'-30px'}"/>
                                </baidu-map>
                    </el-row>
                    <el-row :gutter="40">
                        <div class="table"></div>
                    </el-row>
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
getTerminalAlertTotalInFaultStatus} from '@/api/monitor';

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
            tData:[],
            cData:[],
            timeId:{}
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
                        //this.handler()
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
        //点击地图监听
        clickEvent(e){
            
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
.map{
    height:400px;
    width:100%;
}
.table{
    height:400px;
    width:100%;
    margin-top:20px;
    background:blue

}

.map {
 width: 100%;
 height: 400px;
}
.el-select el-select--small{
    width: 35% !important;
}
</style>
