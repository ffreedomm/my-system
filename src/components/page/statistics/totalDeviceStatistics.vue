<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="organId" placeholder="请选择机构" @change="changeHandle">
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
            <el-divider v-if="equipInfoList.length > 0" content-position="left">统计结果（明细对比）</el-divider>
            <el-table
                v-if="equipInfoList.length > 0"
                style="margin-bottom: 50px;"
                :data="equipInfoList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="deviceSum" label="设备总数"></el-table-column>
                <el-table-column prop="faultSum" label="故障总次数（次）"></el-table-column>
                <el-table-column prop="fault1Sum" label="功率轻度超标次数（次）"></el-table-column>
                <el-table-column prop="fault2Sum" label="功率中度超标次数（次）"></el-table-column>
                <el-table-column prop="fault3Sum" label="功率重度超标次数（次）"></el-table-column>
                <el-table-column prop="fault4Sum" label="异常停机次数（次）"></el-table-column>
                <el-table-column prop="fault5Sum" label="异常开机次数（次）"></el-table-column>
                <el-table-column prop="handledSum" label="处理故障次数（次）"></el-table-column>
            </el-table>
            <el-divider v-if="equipInfoList.length > 0" content-position="left">统计结果（图表对比）</el-divider>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart2" :style="{width: '90%', height: '380px'}"></div>
                </el-col>
            </el-row>
            <el-divider v-if="electricityList.length > 0" content-position="left">故障现场分析</el-divider>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart1" :style="{width: '95%', height: '380px'}"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { queryOrgList, allDeviceListForOrg, totalListForDeviceList, pETotalForDevice,terminalAlertListInFaultStatusForDevice } from '@/api/baseInfo'
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
      electricityList: []
    };
  },
  mounted() {
    this.queryOrgList()
  },
  methods: {
    handleSearch() {
      if (this.deviceId && this.organTime && this.organTime.length == 2) {
        this.organTime[0] = this.organTime[0] + '-0-0-1'
        this.organTime[1] = this.organTime[1] + '-23-59-59'
        totalListForDeviceList(this.deviceId, this.organTime).then(res => {
          if (res.success) {
            this.equipInfoList = res.object
            this.drawLine(this.equipInfoList)
          }
        })
        pETotalForDevice(this.deviceId, 25, this.organTime).then(res => {
          if (res.success) {
            this.electricityList = res.object.electricityTotalList
            this.drawElectricityLine(this.electricityList)
          }
        })
        terminalAlertListInFaultStatusForDevice(this.deviceId ,this.organTime).then(res=>{

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
    drawElectricityLine(list) {
      let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
      let xArr = [], yArr = [], tArr = [], bArr = [];
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          tArr.push(5500);
          bArr.push(4500);
          yArr.push(Number(item.power).toFixed(2));
          xArr.push(this.formatDate(item.createTime))
        })
      }
      // 绘制图表
      myChart1.setOption({
        title: {
          text: '功率统计'
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
          data: ['实际功率值', '合法功率上限', '合法功率下限']
        },
        grid: {
          left: '3%',
          right: '9%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xArr,
            axisLabel: {
              interval: 0,    //强制文字产生间隔
              rotate: -45,
              interval: 1     //文字逆时针旋转45°
            },
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '实际功率值',
            type: 'line',
            stack: '总量',
            data: yArr
          },
          {
            name: '合法功率上限',
            type: 'line',
            stack: '',
            data: tArr
          },
          {
            name: '合法功率下限',
            type: 'line',
            stack: '',
            data: bArr
          }
        ]
      });
    },
    drawLine(equipInfoList) {
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      let seriesData = []
      equipInfoList.forEach(e => {
        let data = {
          // name: e.name,
          type: 'bar',
          data: [e.deviceSum, e.faultSum, e.fault1Sum, e.fault2Sum, e.fault3Sum, e.fault4Sum, e.fault5Sum, e.handledSum]
        }
        seriesData.push(data)
      });
      // 绘制图表
      myChart2.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '8%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['设备总数', '故障总次数', '功率轻度超标次数', '功率中度超标次数', '功率重度超标次数', '异常停机次数', '异常开机次数', '处理故障次数'],
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: seriesData
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
