<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <treeselect
                    :options="organList"
                    :default-expand-level="3"
                    placeholder="请选择企业"
                    style="width: 300px;"
                    @select="changeHandle"
                />
                <el-select v-model="deviceId" placeholder="请选择设备" style="margin-left: 10px;">
                    <el-option
                        v-for="item in deviceData"
                        :key="item.id"
                        :label="(item.name + '('+ format(item.type))+')'"
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
            <el-divider v-if="electricityList.length > 0" content-position="left">功率分析图</el-divider>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart1" :style="{width: '95%', height: '380px'}"></div>
                </el-col>
            </el-row>
            <el-divider v-if="terminalList.length > 0" content-position="left">故障分析图</el-divider>
             <div v-if="terminalList.length > 0" style="font-size: 12px;margin-left: 25%;display: flex;">
              <span class="spanDIv">
                <div class="zero" style="background: #ffb400;"></div>
                0-正常
              </span>
              <span class="spanDIv"> <div class="zero" style="background: #00ff4e;"></div>1-超标1级警报</span>
              <span class="spanDIv"> <div class="zero" style="background: #ff0000;"></div>2-超标2级警报</span>
              <span class="spanDIv"> <div class="zero" style="background: #00ddff;"></div>3-超标3级警报</span>
              <span class="spanDIv"> <div class="zero" style="background: #baff00;"></div>4-工作时段停机</span>
              <span class="spanDIv"> <div class="zero" style="background: #CD2626;"></div>5-非工作时段启动</span>
            </div>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart3" :style="{width: '95%', height: '380px'}"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { queryOrgList, allDeviceListForOrg, totalListForDeviceList, pETotalForDevice, terminalAlertListInFaultStatusForDevice } from '@/api/baseInfo'
export default {
  components: {
    Treeselect
  },
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
    format(type) {
      return type == 1 ? '治污设备' : '产污设备'
    },
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
        terminalAlertListInFaultStatusForDevice(this.deviceId, this.organTime).then(res => {
          if (res.success) {
            this.terminalList = res.object
            this.drawTerminalLine(this.terminalList)
          }
        })
      }
    },
    drawTerminalLine(terminalList) {
      // let dataName = ['正常', '超标1级警报', '超标2级警报', '超标3级警报', '工作时段停机', '非工作时段启动']
      let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
      let yData = []
      let xData = []
      terminalList.forEach(e => {
        xData.push(e.startTime)
        yData.push(e.status)
      });
      // 绘制图表
      myChart3.setOption({
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
            data: xData,
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series:  [{
          type: 'bar',
          data: yData,
          itemStyle: {
            normal: {
              //每根柱子颜色设置
              color: function (params) {
                let colorList = ['#ffb400', '#00ff4e', '#ff0000', '#00ddff', '#baff00', '#CD2626'];
                return colorList[params.value];
              }
            }
          },
        }]
      });
    },
    queryOrgList() {
      queryOrgList('', 1, 9999).then(res => {
        if (res.success) {
          this.organList = this.toTree(res.object)
        }
      })
    },
    toTree(data) {
      let result = []
      if (!Array.isArray(data)) {
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
        item.label = item.name;
        let parent = map[item.parentId];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      return result;
    },
    changeHandle(e, id) {
      allDeviceListForOrg(e.id, '', '').then(res => {
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
        // title: {
        //   text: '功率统计'
        // },
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
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 4// 0.1的线条是非常细的了
                }
              }
            },
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
      let legendData = []
      equipInfoList.forEach(e => {
        legendData.push(e.name)
        let data = {
          name: e.name,
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
        legend: {
          data: legendData
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

.zero{
  height: 10px;
  width: 10px;
  margin-right: 8px;
}
.spanDIv{
  margin-left: 10px;
  display: flex;
  align-items: center;
}
.handle-box {
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
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
