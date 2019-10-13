<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="deviceId" placeholder="设备ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="deviceId" width = "80" label="设备ID"></el-table-column>
                <el-table-column prop="data"  width = "800" label="原始数据串"></el-table-column>
                <el-table-column prop="ip" label="发送端IP"></el-table-column>
                <el-table-column prop="electricity" label="电流值"></el-table-column>
                <el-table-column prop="createTime" label="上传时间"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPage"
                    :total="sumUploadata"
                    :page-size="pageSize"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { queryUploadataList, queryUploadataListSum } from '@/api/uploadata'
export default {
  name: 'uploadata',
  data() {
    return {
      deviceId:'',
      start: 1,
      end: 10,
      pageSize: 10,
      sumUploadata: '',
      currentPage: 1,
      tableData: [],
    };
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      queryUploadataList(this.deviceId, this.start, this.end).then(res => {
        if (res.success) {
          this.tableData = res.object
          this.queryUploadataListSum()
        }
      });
    },
    // 分页导航
    handlePageChange(val) {
      this.start = this.pageSize * (val - 1) + 1
      this.end = this.pageSize * val
      this.currentPage = val
      this.getData()
    },
    queryUploadataListSum() {
      queryUploadataListSum(this.deviceId, this.start, this.end).then(res => {
        if (res.success) {
          this.sumUploadata = res.object
        }
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.getData();
    },
  }
}
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
