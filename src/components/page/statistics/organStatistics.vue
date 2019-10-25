<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <treeselect
                    v-model="organId"
                    :options="organList"
                    multiple
                    :default-expand-level="3"
                    placeholder="请选择企业"
                    style="width: 300px;"
                />
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
            <el-divider v-if="organInfoList.length > 0" content-position="left">统计结果（明细对比）</el-divider>
            <el-table
                v-if="organInfoList.length > 0"
                style="margin-bottom: 50px;"
                :data="organInfoList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <!-- @selection-change="handleSelectionChange" -->
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
            <el-divider v-if="organInfoList.length > 0" content-position="left">统计结果（图表对比）</el-divider>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="myChart2" :style="{width: '90%', height: '380px'}"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { queryOrgList, totalListForOrgList } from '@/api/baseInfo'
export default {
  name: 'industryStatistics',
  components: {
    Treeselect
  },
  data() {
    return {
      organList: [],
      organId: [],
      organTime: [],
      organInfoList: []
    };
  },
  mounted() {
    this.queryOrgList()
  },
  methods: {
    handleSearch() {
      if (this.organId && this.organTime && this.organTime.length == 2) {
        this.organTime[0] = this.organTime[0] + '-0-0-1'
        this.organTime[1] = this.organTime[1] + '-23-59-59'
        totalListForOrgList(this.organId.join(), this.organTime).then(res => {
          if (res.success) {
            this.organInfoList = res.object
            this.drawLine(this.organInfoList)
          }
        })
      }

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
    drawLine(organInfoList) {
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      let seriesData = []
      let legendData = []
      organInfoList.forEach(e => {
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
