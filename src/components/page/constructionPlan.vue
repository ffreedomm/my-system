<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="name" placeholder="方案名称" class="handle-input mr10"></el-input>
                <el-input v-model="orgName" placeholder="企业名称" class="handle-input mr10"></el-input>
                <el-select v-model="status" placeholder="请选择状态">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    style="margin-top: 10px;margin-right: 10px;"
                    v-model="organTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </div>
            <el-button
                style="margin-bottom: 10px;"
                type="primary"
                icon="el-icon-plus"
                @click="handleAdd"
            >新增</el-button>
            <!-- <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column type="index" width="70" label="序号"></el-table-column>
                <el-table-column prop="name" label="行业名称"></el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-share"
                            @click="handleDetail(scope.row)"
                        >审核</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table> -->
            <!-- <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPage"
                    :total="sumTrade"
                    :page-size="pageSize"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div> -->
        </div>

        <!-- 新增/编辑弹出框 -->
        <!-- <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form :model="tradeForm" label-width="70px">
                <el-form-item label="行业名称">
                    <el-input v-model="tradeForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
import { queryOrgList } from '@/api/baseInfo'
export default {
  name: 'industry',
  data() {
    return {
      title: '新增',
      name: '',
      status: '',
      orgName: '',
      organTime: [],
      options: [{
        value: '1',
        label: '未审核'
      }, {
        value: '2',
        label: '审核通过'
      }, {
        value: '3',
        label: '审核未通过'
      }
      ],
      start: 1,
      end: 10,
      pageSize: 10,
      sumTrade: '',
      currentPage: 1,
      tableData: [],
      editVisible: false,
    };
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      // queryConstructionPlanList(this.name, this.start, this.end).then(res => {
      //   if (res.success) {
      //     this.tableData = res.object
      //     this.queryTradeListSum()
      //   }
      // });
    },
    // 分页导航
    handlePageChange(val) {
      this.start = this.pageSize * (val - 1) + 1
      this.end = this.pageSize * val
      this.currentPage = val
      this.getData()
    },
    queryTradeListSum() {
      queryTradeListSum(this.name).then(res => {
        if (res.success) {
          this.sumTrade = res.object
        }
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.getData();
    },
    // 新增操作
    handleAdd() {
      this.title = '新增'
      this.tradeForm = {}
      this.editVisible = true;
    },
    handleEdit(row) {
      this.title = '编辑'
      this.tradeForm = {
        id: row.id,
        name: row.name
      }
      this.editVisible = true;
    },
    saveEdit() {
      if (this.tradeForm.name) {
        //编辑保存
        if (this.tradeForm.id) {
          updateTrade(this.tradeForm).then(res => {
            if (res.success) {
              this.$message.success('保存成功')
              this.editVisible = false
              this.getData()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {// 新增保存
          addTrade(this.tradeForm.name).then(res => {
            if (res.success) {
              this.$message.success('保存成功')
              this.editVisible = false
              this.getData()
            } else {
              this.$message.error(res.message)
            }
          })
        }

      } else {
        this.$message.warning('行业名称不能为空')
      }
    },
    // 删除操作
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        removeTrade(row.id).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => { });
    },
    orgListSumForTrade(row) {
      orgListSumForTrade(row.id).then(res => {
        if (res.success) {
          this.sumTradeOrg = res.object
        }
      })
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
