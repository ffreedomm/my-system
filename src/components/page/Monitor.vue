<template>
    <div>
        
        <div :style="backgroundDiv">
        <el-row style="margin-bottom:8px;">
            <el-col :span="9">
                <div :style="systemName" style="text-align: center;"><span style="display:block;text-align:center；line-height:42px;font-size:21px;color:rgb(197,146,42)">物联网终端管理平台</span></div>
            </el-col>
            <el-col :offset="6" :span="9">
                <div :style="systemName" style="text-align: center;"><span style="display:block;text-align:center；line-height:42px;font-size:21px;color:rgb(203,229,25)">{{ date | formaDate }}，{{weather}}</span></div>
            </el-col>
        </el-row>

        <el-row :gutter="30">
            <el-col :span="8" >
                <div :style="bg1" style="height:auta;width:100%;padding-bottom:20%">
                    <treeselect style="width:78%;padding-top: 23%; padding-left: 12%;" 
                        v-model="orgId" 
                        :options="orgList"
                        :default-expand-level="2"
                        placeholder="企业信息" />
                    <div id="myChart" :style="{width: '100%', height: '200px'}"></div>
                    <el-table :data="tData" height="320px" style="width: 80%;margin-left: 10%;">
                        <el-table-column fixed="left" type="index" width="50" label="序号" align="center" />
                        <el-table-column prop="org.name" label="企业名称"/>
                        <el-table-column prop="deviceSum" label="设备数量" width="100"/>
                        <el-table-column prop="terminalSum" label="终端数量" width="100"/>
                    </el-table>
                </div>
            </el-col>

            <el-col :span="8">
                    <baidu-map  class="map" :zoom="zoom" :center="center"
                        @ready="handler" 
                        :scroll-wheel-zoom="true"
                        ak="%E6%82%A8%E7%9A%84%E5%AF%86%E9%92%A5">
                        <bm-marker 
                        v-for="marker in markers" :key="marker.id"
                            @click="getDeviceInfo(marker.id)"
                            :position="{lng: marker.longitude, lat: marker.latitude}" 
                            >
                        <bm-label 
                            :content="marker.name" 
                            :labelStyle="{color: 'red', fontSize : '15px'}" 
                            :offset="{width: 20, height: -20}"/>
                        </bm-marker>
                        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"/>
                        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"/>
                    </baidu-map>
                    <div :style="bg2" style="height:auta;width:100%;padding-bottom:2%">
                        <div>
                            <el-row :gutter="20">
                                <el-col span="12">
                                    <div v-if="deviceObj && deviceObj.name" id="myChart2" :style="{width: '95%', height: '150px'}" style=";padding-left:12%;margin-top: 50px">
                                        <p style="color:white;font-size:14px;padding-top:2px;padding-bottom: 1px;">设备名称：{{deviceObj.name}}</p>

                                        <p style="color:white;font-size:14px;padding-top:2px;padding-bottom: 1px;">设备编号：{{deviceObj.number}}</p>

                                        <p style="color:white;font-size:14px;padding-top:2px;padding-bottom: 1px;">设备类型：{{deviceObj.type == 1?'治污设备':'产污设备'}}</p>

                                        <p style="color:white;font-size:14px;padding-top:2px;padding-bottom: 1px;">所属企业：{{deviceObj.org.name}}</p>
                                    </div>
                                </el-col>
                                <el-col span="12">
                                    <div id="myChart3" :style="{width: '200px', height: '200px'}"></div>
                                </el-col>
                            </el-row>
                        </div>
                </div>

            </el-col>

            <el-col :span="8">
                <el-row :gutter="10" style="margin-top:9%">
                    <el-col :span="8">
                        <div :style="pane" style="width:100%;height:100%">
                            <div>
                                <span style="color:rgb(83,118,238);margin-left:10px;margin-top:15px;font-size:18px">总报警数</span><br /><br />
                                <span style="color:rgb(83,118,238);margin-left:10px;height:12px;font-weight:bold">{{warningData.total}}</span>
                            </div>
                        </div>
                     </el-col>
                    <el-col :span="8">
                        <div :style="pane" style="width:100%;height:100%">
                            <div>
                                <span style="color:rgb(81,143,24);margin-left:10px;margin-top:15px;font-size:18px">已处理数</span><br /><br />
                                <span style="color:rgb(81,143,24);margin-left:10px;margin-bottom:8px;font-weight:bold">{{warningData.handled}}</span>
                                <span style="color:rgb(81,143,24);margin-left:10px;font-weight:bold">{{warningData.handledPercent*100}}%</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div :style="pane" style="width:100%;height:100%">
                            <div>
                                <span style="color:rgb(220,17,117);margin-left:10px;margin-top:15px;font-size:18px">未处理数</span><br /><br />
                                <span style="color:rgb(220,17,117);margin-left:10px;margin-bottom:8px;font-weight:bold">{{warningData.unhandled}}</span>
                                <span style="color:rgb(220,17,117);margin-left:10px;font-weight:bold">{{warningData.unhandledPercent*100}}%</span>
                            </div>
                        </div>
                    </el-col>
                    </el-row>
                    
                    <div :style="warningBG" style="margin-top:20px;width:100%;height:400px;">
                        <div style="padding-top:32px;padding-left:35px;"><span style="font-size:18px;color:white">报警信息</span></div> 
                        <el-tabs type="border-card" header-style="font-size: 12px;" style="width:88%;height:70%;margin-left:35px;margin-top:5px;margin-right:45px;margin-bottom:50px;">

                                <el-tab-pane >
                                    <span slot="label" @click="getWarningDatas(24, false)">1小时内({{msgSize1}}条)</span>
                                </el-tab-pane>
                                <el-tab-pane>
                                    <span slot="label" @click="getWarningDatas(48, false)">8小时内({{msgSize2}}条)</span>
                                </el-tab-pane>
                                <el-tab-pane>
                                    <span slot="label" @click="getWarningDatas(72, false)">24小时内({{msgSize3}}条)</span>
                                </el-tab-pane>
                                <el-table :data="warningMsgs" @row-click="dealWarming">
                                    <el-table-column>
                                        <template scope="scope">
                                    {{scope.row.device.org.name}}——{{scope.row.device.name}}出现{{dCodeStatus(scope.row.status)}}，
                                    电流峰值={{scope.row.maxElectricity}}A，功率峰值={{scope.row.maxPower/1000}}KW
                                    </template></el-table-column>
                                    <el-table-column prop="endTime"></el-table-column>
                                </el-table>
                            </el-tabs> 
                    </div>

                        <div :style="lastBG" style="margin-top:30px;width:100%;height:100%;">
                            <div style="width:88%;height:70%;margin-left:35px;margin-top:25px;margin-right:45px;margin-bottom:50px;padding-bottom:18px">
                            <p style="color:white;font-size:18px;padding-top:18px;padding-bottom:15px">最新通知</p>
                            <p style="color:white;font-size:14px;padding-top:2px;padding-bottom: 1px;" v-for="item in noticeData" :key="item" @click="showDetail(item.content)">
                                <a href="#" style="color:white;font-size:14px;">{{ item.title }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item.createTime }}</a></p>
                            </div>
                        </div>
                    </el-table>
            </el-col>
        
        </el-row>
        </div>

                <!-- 新增/编辑弹出框 -->
        <el-dialog title="处理" :visible.sync="editVisible" width="60%">
            <el-form :model="dForm" ref="dForm" :rules="rules" label-width="170px">
                <el-row :gutter="0"> 
                    <el-col :span="24">
                        <el-form-item prop="loginPassword" label="密码">
                            <el-input v-model="dForm.loginPassword"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="0"> 
                    <el-col :span="24">
                        <el-form-item prop="loginName" label="用户名">
                            <el-input v-model="dForm.loginName" disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="0"> 
                    <el-col :span="24">
                        <el-form-item prop="memo" label="备注">
                            <el-input type="textarea" rows="3" v-model="dForm.memo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
               <!-- <el-row :gutter="0">
                    <el-col :span="24">
                        <el-form-item prop="terminalAlertId" label="设备ID">
                            <el-input v-model="dForm.terminalAlertId"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="通知详情" :visible.sync="detailVisible" width="50%">
          <div id="detail"></div>
      </el-dialog>
    </div>
</template>

<script>
import {BaiduMap,BmNavigation,BmView,BmGeolocation,BmCityList,BmMarker,BmLabel} from 'vue-baidu-map'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getQueryOrgList,getAllTerminalTotalListForOrg,getAllDeviceListForOrg,getTerminalTotalListForOrgOrChild,
getTerminalAlertTotalInFaultStatus, getTerminalRecordListForDevice,getTotalListForDeviceList,
QueryUnhandledTerminalAlertListInFaultStatus,HandleTerminalAlertInFaultStatusForUser} from '@/api/monitor';
import {device} from '@/api/equipment';
import {queryList} from '@/api/usernotice';
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
            deviceObj:{},
          noticeData: [],
          detailVisible:false,
            dForm:{},
            editVisible:false,
            msgSize1:0,
            msgSize2:0,
            msgSize3:0,
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
            lastCData:[],
            warningMsgs:[],
            backgroundDiv: {
                backgroundImage:'url(' + require('../../assets/img/bg_1.jpg') + ')',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100% 100%'
            },
            systemName:{
                backgroundImage:'url(' + require('../../assets/img/1-2.png') + ')',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100% 100%'
            },
            bg1:{
                backgroundImage:'url(' + require('../../assets/img/1-7.png') + ')',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100% 100%'
            },
            bg2:{
                backgroundImage:'url(' + require('../../assets/img/1-15.png') + ')',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100% 100%'
            },
            pane:{
                backgroundImage:'url(' + require('../../assets/img/1-4.png') + ')',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100% 100%'
            },
            warningBG:{
                backgroundImage:'url(' + require('../../assets/img/1-15.png') + ')',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100% 100%'
            },
            lastBG:{
                backgroundImage:'url(' + require('../../assets/img/1-15.png') + ')',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100% 100%'
            },
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
            //获取通知
            this.getNotice();

            this.cData = [];
            //获取企业
            this.getOrgList();
            //列表
            this.getTData();
            //地图标点
            this.getMapPoint();
            //报警处理
            this.getWarningData();
            //饼图数据
            this.getCircelData();
            this.getWarningDatas(24, true);
            this.getWarningDatas(48, true);
            this.getWarningDatas(72, true);
        },

        dCodeStatus(status){
            if(status == 0){
                return "正常"
            }
            if(status == 1){
                return "超标1级警报"
            }
            if(status == 2){
                return '超标2级警报'
            }
            if(status == 3){
                return '超标3级警报'
            }
            if(status == 4){
                return '工作时段停机'
            }
            if(status == 5){
                return '非工作时段启动'
            }
        },
        showDetail(d){
            this.detailVisible = true;
            this.$nextTick(()=>{
                document.getElementById("detail").innerHTML = d;
            })
        },
        //获取通知
        getNotice(){
          queryList().then(res => {
              if(res.success){
                  this.noticeData = res.object
              }
          });
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
                        if(this.warningData.total && this.warningData.unhandled){
                            this.warningData.unhandledPercent = (this.warningData.unhandled / this.warningData.total).toFixed(6)
                        }
                        if(this.warningData.total && this.warningData.handled){
                            this.warningData.handledPercent = (this.warningData.handled / this.warningData.total).toFixed(6)
                        }
                    }
                }
            })
        },

        //处理报警
        dealWarming(row, column, event){
            this.dForm.loginName=localStorage.getItem('username')
            this.dForm.terminalAlertId=row.id
            this.editVisible = true;
        },

        saveEdit(){
            HandleTerminalAlertInFaultStatusForUser(this.dForm).then(res=>{
                if(res.success){
                    this.getWarningDatas(24, true);
                    this.getWarningDatas(48, true);
                    this.getWarningDatas(72, true);
                    this.dForm.loginPassword=''
                    this.dForm.memo=''
                    this.editVisible = false;
                }
            })
            this.editVisible = false;
        },

        //报警条数
        getWarningDatas(hours, isfirst){
            QueryUnhandledTerminalAlertListInFaultStatus(hours).then(res=>{
                if(res.success){
                    if(isfirst && hours == 24){
                        this.warningMsgs = res.object
                    }
                    let tempMsgSize = 0;
                    if(res.object && res.object.length > 0){
                        tempMsgSize = res.object.length
                    }
                    if(hours == 24){
                        this.msgSize1 = tempMsgSize
                    }
                    if(hours == 48){
                        this.msgSize2 = tempMsgSize
                    }
                    if(hours == 72){
                        this.msgSize3 = tempMsgSize
                    }
                    res.object.forEach(item =>{
                    let temp = item.endTime.split("-")
                        let tempEndTime = ""
                        temp.forEach((item1, index) =>{
                            if(index <= 4){
                                tempEndTime += item1;
                                if(index < 2){
                                    tempEndTime +="-"
                                }
                                if(index == 2){
                                    tempEndTime+=" "
                                }
                                if(index == 3){
                                    tempEndTime+=" : "
                                }
                            }
                        })
                        item.endTime = tempEndTime
                    })
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
            var mapStyle ={
                features: ["road","building","water","land"],//隐藏地图上的"poi",
            style : 'midnight',
            };
            map.setMapStyle(mapStyle);
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
                    //text: '实时状态统计'
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
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine :{show:true} 
                    }
                ]
            });
        },

        //点击地图的点获取折线图和饼图数据
        getDeviceInfo(id){
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
                        //this.initZXChart();
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

            //获取设备信息
            device(id).then(res=>{
                if(res.success){
                    this.deviceObj = res.object
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
                    data: this.lastTYArr,
                    axisLabel: {
                    show: true,
                        textStyle: {
                        color: 'white',  //更改坐标轴文字颜色
                        //fontSize : 14      //更改坐标轴文字大小
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'white' //更改坐标轴颜色
                        }
                    }
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
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    margin: 0;
  }
.table{
    height:400px;
    width:100%;
    margin-top:20px;
    background:blue

}

.map {
 width: 100%;
 height: 500px;
 margin-top:9%
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
