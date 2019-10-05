<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="tradeId" multiple placeholder="请选择行业">
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
                    v-model="tradeTime"
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
             <el-divider v-if="tradeInfoList.length > 0" content-position="left">统计结果（明细对比）</el-divider>
            <el-table
                v-if="tradeInfoList.length > 0"
                style="margin-bottom: 50px;"
                :data="tradeInfoList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>、
                <el-table-column prop="deviceSum" label="设备总数"></el-table-column>
                <el-table-column prop="faultSum" label="故障总次数（次）"></el-table-column>
                <el-table-column prop="fault1Sum" label="功率轻度超标次数（次）"></el-table-column>
                <el-table-column prop="fault2Sum" label="功率中度超标次数（次）"></el-table-column>
                <el-table-column prop="fault3Sum" label="功率重度超标次数（次）"></el-table-column>
                <el-table-column prop="fault4Sum" label="异常停机次数（次）"></el-table-column>
                <el-table-column prop="fault5Sum" label="异常开机次数（次）"></el-table-column>
                <el-table-column prop="handledSum" label="处理故障次数（次）"></el-table-column>
            </el-table>
            <el-divider v-if="tradeInfoList.length > 0" content-position="left">统计结果（图表对比）</el-divider>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart2" :style="{width: '90%', height: '380px'}"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { queryTradeList, totalListForTradeList } from '@/api/baseInfo'
import { log } from 'util';
export default {
  name: 'industryStatistics',
  data() {
    return {
      tradeList: [],
      tradeId: [],
      tradeTime: [],
      tradeInfoList: []
    };
  },
  mounted() {
    this.queryTradeList()
  },
  methods: {
    handleSearch() {
      if (this.tradeId && this.tradeTime && this.tradeTime.length == 2) {
        this.tradeTime[0] = this.tradeTime[0] + '-0-0-1'
        this.tradeTime[1] = this.tradeTime[1] + '-23-59-59'
        totalListForTradeList(this.tradeId.join(), this.tradeTime).then(res => {
          if (res.success) {
            this.tradeInfoList = res.object
            this.drawLine(this.tradeInfoList)
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
    drawLine(tradeInfoList) {
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      let seriesData = []
      tradeInfoList.forEach(e => {
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
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
            data: ['设备总数', '故障总次数', '功率轻度超标次数', '功率中度超标次数',
               '功率重度超标次数', '异常停机次数', '异常开机次数', '处理故障次数'],
            axisTick: {
              alignWithLabel: true
            }
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
