<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="organId" placeholder="请选择企业" @change="changeHandle">
                    <el-option
                        v-for="item in organList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select v-model="deviceId" placeholder="请选择设备" style="margin-left: 10px;">
                    <el-option
                        v-for="item in deviceData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    style="margin-left: 10px;"
                    v-model="organTime"
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
            <el-divider v-if="equipInfoList.length > 0" content-position="left">关联设备信息</el-divider>
            <el-table
                v-if="equipInfoList.length > 0"
                style="margin-bottom: 50px;"
                :data="equipInfoList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column type="index" width="70" align="center" label="序号"></el-table-column>
                <el-table-column prop="number" label="设备编号"></el-table-column>
                <el-table-column prop="name" label="设备名称"></el-table-column>
                <el-table-column prop="voltage" label="额定电压"></el-table-column>
                <el-table-column prop="power" label="额定功率"></el-table-column>
                <el-table-column prop="longitude" label="经度位置"></el-table-column>
                <el-table-column prop="latitude" label="纬度位置"></el-table-column>
                <el-table-column prop="terminalNumber" label="连接的终端"></el-table-column>
                <el-table-column prop="org.name" label="所属企业"></el-table-column>
                <el-table-column prop="" label="设备类型">
                    <template scope="scope">
                        {{scope.row.type  == 1 ? "治污设备" :"产污设备" }}
                    </template>
                </el-table-column>
                <el-table-column prop="productDevice.name" label="关联的产污设备"></el-table-column>
            </el-table>
            <el-divider v-if="equipInfoList.length > 0" content-position="left">电流对比统计：</el-divider>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart1" :style="{width: '100%', height: '380px'}"></div>
                </el-col>
            </el-row>
            <el-divider v-if="equipInfoList.length > 0" content-position="left">电压对比统计：</el-divider>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart2" :style="{width: '100%', height: '380px'}"></div>
                </el-col>
            </el-row>
            <el-divider v-if="equipInfoList.length > 0" content-position="left">功率对比统计：</el-divider>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart3" :style="{width: '100%', height: '380px'}"></div>
                </el-col>
            </el-row>
            <el-divider v-if="equipInfoList.length > 0" content-position="left">功耗对比统计：</el-divider>
            <el-row :gutter="20" style="margin-bottom:'20px';">
                <el-col :span="24">
                    <div id="myChart4" :style="{width: '100%', height: '380px'}"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { queryOrgList, allDeviceListForOrg  } from '@/api/baseInfo'
import { getChartsData, getDevices  } from '@/api/statisticalforcontrast'
import { log } from 'util';
export default {
  data() {
    return {
      organList: [],
      deviceData: [],
      organId: '',
      deviceId: '',
      organTime: [],
      equipInfoList: [],
      electricityList: [],
      terminalList: []
    };
  },
  mounted() {
    this.queryOrgList()
  },
  methods: {
    handleSearch() {
      if (this.deviceId && this.organTime && this.organTime.length == 2) {
        let startTime = this.organTime[0] + '-0-0-1';
        let endTime = this.organTime[1] + '-23-59-59'
        
        getDevices(this.deviceId).then(res => {
          if (res.success) {
            this.equipInfoList = res.object
            this.getChartsDataForDevice(this.equipInfoList,startTime,endTime);
          }
        })

      }
    },
    getChartsDataForDevice(equipInfoList,startTime,endTime){
        if(equipInfoList && equipInfoList.length > 0){
          let ids = [];
          equipInfoList.forEach(item =>{
          ids.push(item.id)
          })
          const req ={
            startTime: startTime,
            endTime: endTime,
            pointSum:25,
            ids:ids,
            method:'PETotalListForDeviceList'
          }
          getChartsData(req).then(res => {
            if (res.success) {
              this.drawLine(res.object)
            }
          })
        }

    },

    queryOrgList() {
      queryOrgList('', 1, 9999).then(res => {
        if (res.success) {
          this.organList = res.object
        }
      })
    },
    changeHandle(e) {
      allDeviceListForOrg(e, '', '').then(res => {
        if (res.success) {
          this.deviceData = res.object
        }
      })
    },
    formatDate(dateString) {
      var ss = dateString.split("-");
      return ss[0] + "-" + ss[1] + "-" + ss[2] + " " + ss[3] + ":" + ss[4]
    },
    drawLine(dataList) {
      this.drawLine1(dataList);
      this.drawLine2(dataList);
      this.drawLine3(dataList);
      this.drawLine4(dataList);

    },
    drawLine1(dataList) {
      let legendArr = []; let xArr = []; let yArr = [];
        dataList.forEach((item,index) =>{
          legendArr.push(item.name)
          let temp = [];
          item.electricityTotalList.forEach(item1=>{
            if(item1.electricity){
              temp.push(Number(item1.electricity).toFixed(2))
            }else{
              temp.push(0.00)
            }
            if(index == 0){
              xArr.push(this.formatDate(item1.createTime))
            }
          })
          yArr.push({
              name: item.name,
              type: 'line',
              stack: '电流',
              data: temp
          })
        })
      let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
        // 绘制图表
      myChart1.setOption({
        title: {
            text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
            data: legendArr
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
            data: xArr,
            axisLabel: {
              interval: 0,    //强制文字产生间隔
              rotate: -45,
              interval: 1     //文字逆时针旋转45°
            },
        },
        yAxis: {
            type: 'value'
        },
        series: yArr
      }, {notMerge: true});
    },
    drawLine2(dataList) {
      let legendArr = []; let xArr = []; let yArr = [];
        dataList.forEach((item,index) =>{
          legendArr.push(item.name)
          let temp = [];
          item.electricityTotalList.forEach(item1=>{
            if(item1.voltage){
              temp.push(Number(item1.voltage).toFixed(2))
            }else{
              temp.push(0.00)
            }
            if(index == 0){
              xArr.push(this.formatDate(item1.createTime))
            }
          })
          yArr.push({
              name: item.name,
              type: 'line',
              stack: '电压',
              data: temp
          })
        })
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
        // 绘制图表
      myChart2.setOption({
        title: {
            text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
            data: legendArr
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
            data: xArr,
            axisLabel: {
              interval: 0,    //强制文字产生间隔
              rotate: -45,
              interval: 1     //文字逆时针旋转45°
            },
        },
        yAxis: {
            type: 'value'
        },
        series: yArr
      }, {notMerge: true});

    },
    drawLine3(dataList) {
      let legendArr = []; let xArr = []; let yArr = [];
        dataList.forEach((item,index) =>{
          legendArr.push(item.name)
          let temp = [];
          item.electricityTotalList.forEach(item1=>{
            if(item1.power){
              temp.push(Number(item1.power).toFixed(2))
            }else{
              temp.push(0.00)
            }
            if(index == 0){
              xArr.push(this.formatDate(item1.createTime))
            }
          })
          yArr.push({
              name: item.name,
              type: 'line',
              stack: '功率',
              data: temp
          })
        })
      let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
        // 绘制图表
      myChart3.setOption({
        title: {
            text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
            data: legendArr
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
            data: xArr,
            axisLabel: {
              interval: 0,    //强制文字产生间隔
              rotate: -45,
              interval: 1     //文字逆时针旋转45°
            },
        },
        yAxis: {
            type: 'value'
        },
        series: yArr
      }, {notMerge: true});

    },
    drawLine4(dataList) {
      let legendArr = []; let xArr = []; let yArr = [];
        dataList.forEach((item,index) =>{
          legendArr.push(item.name)
          let temp = [];
          item.powerTotalList.forEach(item1=>{
            if(item1.power){
              temp.push(Number(item1.power).toFixed(2))
            }else{
              temp.push(0.00)
            }
            if(index == 0){
              xArr.push(this.formatDate(item1.startTime))
            }
          })
          yArr.push({
              name: item.name,
              type: 'bar',
              stack: '功率',
              data: temp
          })
        })
          let myChart4 = this.$echarts.init(document.getElementById('myChart4'));
          myChart4.setOption({
        title : {
            //text: '某地区蒸发量和降水量',
            //subtext: '纯属虚构'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data: legendArr
        },
        grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
        calculable : true,
        xAxis : [
            {
                type : 'category',
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
        series : yArr
    }, {notMerge: true});
          
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
