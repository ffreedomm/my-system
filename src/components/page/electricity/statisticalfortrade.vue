<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="qId" placeholder="请选择行业">
                    <el-option
                        v-for="item in tradeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    style="margin-left: 10px;"
                    v-model="qTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
                <el-button
                    style="margin-left: 10px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleSearch"
                >统计结果</el-button>
            </div>
            <el-divider content-position="left" v-if="resultInfo.name">行业：{{resultInfo.name}}</el-divider>
            <el-divider content-position="left" v-if="resultInfo.name">时间：{{this.qTime[0]}} 0:0 到 {{this.qTime[1]}} 23:59</el-divider>
            <el-divider content-position="left" v-if="resultInfo.name">总功耗：{{kwhSum}}</el-divider>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart1" :style="{width: '100%', height: '380px'}"></div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart2" :style="{width: '100%', height: '380px'}"></div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart3" :style="{width: '100%', height: '380px'}"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import {forTotal} from '@/api/electricity'
import { queryTradeList } from '@/api/baseInfo'
export default {
  name: 'industryStatistics',
  data() {
    return {
        selName:"",
        qId: [],
        qTime: [],
        tradeList:[],
        kwhSum: 0,
        resultInfo:{}
    };
  },
  
  mounted() {
    this.queryTradeList()
  },
  methods: {
    handleSearch() {
      if (this.qId && this.qTime && this.qTime.length == 2) {
          const data ={
              tradeId: this.qId,
              pointSum: 25,
              startTime: this.qTime[0] + '-0-0-1',
              endTime: this.qTime[1] + '-23-59-59'
          }
        forTotal(data, 'Trade').then(res => {
          if (res.success) {
            this.resultInfo = res.object
            if(res.object.kwhSum && res.object.kwhSum > 0){
                this.kwhSum = (res.object.kwhSum/1000).toFixed(2)
            }
            this.drawLine1(this.resultInfo.electricityTotalList)
            this.drawLine2(this.resultInfo.electricityTotalList)
            this.drawLine3(this.resultInfo.powerTotalList)
          }else{
              this.$message.error(res.message)
          }
        })
      }

    },

    queryTradeList() {
      queryTradeList('', '', '').then(res => {
        if (res.success) {
          this.tradeList = res.object
        }
      })
    },


    formatDate(dateString){
        var ss = dateString.split("-");
        return ss[0]+"-"+ss[1]+"-"+ss[2]+" "+ss[3]+":"+ss[4]    
    },

    //电流电压
    drawLine1(list) {
      let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
      let xArr = [],dlArr = [],dyArr = [];
      if(list && list.length > 0){
          list.forEach((item, index) =>{
              dlArr.push(Number(item.electricity).toFixed(2));
              dyArr.push(Number(item.voltage).toFixed(2));
              xArr.push(this.formatDate(item.createTime))
          })
      }
      // 绘制图表
      myChart1.setOption({
        title: {
            text: '电流电压统计'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['电流值','电压值']
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
                boundaryGap : false,
                axisLabel: {
                    interval: 0,    //强制文字产生间隔
                    rotate: -45,
                    interval: 1     //文字逆时针旋转45°
                },
                data : xArr,
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
                name:'电流值',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data: dlArr,
                itemStyle : { 
                    color:{
                            colorStops: [{
                                offset: 0, color: 'rgb(148,230,93)' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#ffffff' // 100% 处的颜色
                            }],
                    }
                },
            },
            {
                name:'电压值',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data: dyArr,
                itemStyle : { 
                    color:{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#1CD8D2' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#ffffff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                    }
                },
            }
        ]
    });
    },

    //功率
    drawLine2(list) {
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
       let xArr = [],yArr = [];
      if(list && list.length > 0){
          list.forEach((item, index) =>{
              yArr.push(Number(item.power).toFixed(2));
              xArr.push(this.formatDate(item.createTime))
          })
      }
      // 绘制图表
      myChart2.setOption({
        title: {
            text: '功率统计'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['实际功率值']
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
                boundaryGap : false,
                data : xArr,
                axisLabel: {
                    interval: 0,    //强制文字产生间隔
                    rotate: -45,
                    interval: 1     //文字逆时针旋转45°
                },
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'实际功率值',
                type:'line',
                stack: '总量',
                data: yArr
            }
        ]
    });
    },

    //功耗
    drawLine3(list) {
        let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
        let xArr = [],yArr = [];
        if(list && list.length > 0){
            list.forEach((item, index) =>{
                yArr.push(Number(item.kwh/1000).toFixed(2));
                xArr.push(this.formatDate(item.startTime))
            })
        }
        var labelOption = {
            normal: {
                show: true,
                verticalAlign: 'middle',
                rotate: 90,
                formatter: '{c} KWH ',
                fontSize: 16,
                rich: {
                    name: {
                        textBorderColor: '#f33'
                    }
                }
            }
        };
      // 绘制图表
      myChart3.setOption({
        title: {
            text: '功耗统计'
        },
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter:function(v){
                var startTime = v[0]['name'];
                var eTime = Number(startTime.split(" ")[1].split(":")[0])+1;
                var endTime = startTime.split(" ")[0] +" "+ eTime + ":0";
                return "时间："+startTime + " 到 " + endTime + 
                "</br>" +v[0]['seriesName']+v[0]['value']+"KWH"
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
                data : xArr,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    interval: 0,    //强制文字产生间隔
                    rotate: -45,
                    interval: 1     //文字逆时针旋转45°
                },
                
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'功耗:',
                type:'bar',
                barWidth: '100%',
                data: yArr,
                itemStyle: {
                    color:'rgb(45,140,240)',
                    borderWidth:'1',
                    borderColor:'rgb(237,194,64)'
                },
                label: labelOption
            },
            
        ]
    });
    },

  }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
