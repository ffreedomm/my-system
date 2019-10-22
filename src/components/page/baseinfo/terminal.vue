<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="number" placeholder="终端编号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </div>
            <el-button
                style="margin-bottom: 10px;"
                type="primary"
                icon="el-icon-plus"
                @click="handleAdd"
            >新增</el-button>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="number" label="终端编号"></el-table-column>
                <el-table-column prop="name" label="终端名称"></el-table-column>
                <el-table-column prop="memo" label="备注说明"></el-table-column>
                <el-table-column prop="sendInterval" label="发送数据间隔"></el-table-column>
                <el-table-column prop="device.org.legalPerson" label="所属机构"></el-table-column>
                <el-table-column prop="device.name" label="连接设备"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPage"
                    :total="sumTermina"
                    :page-size="pageSize"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增/编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="40%">
            <el-form :model="terminalForm" label-width="120px">
                <el-form-item label="终端编号">
                    <el-input v-model="terminalForm.number"></el-input>
                </el-form-item>
                <el-form-item label="终端名称">
                    <el-input v-model="terminalForm.name"></el-input>
                </el-form-item>
                <el-form-item label="发送数据间隔">
                    <el-input v-model="terminalForm.sendInterval"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="terminalForm.memo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { queryTerminalList, queryTerminalListSum, addTerminal, updateTerminal, removeTerminal } from '@/api/terminal'
export default {
  name: 'terminal',
  data() {
    return {
      title: '新增',
      terminalForm: {},
      name: '',
      start: 1,
      end: 10,
      pageSize: 10,
      sumTermina: 0,
      currentPage: 1,
      tableData: [],
      editVisible: false,
      number: '',
    };
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      queryTerminalList(this.number, this.start, this.end).then(res => {
        if (res.success) {
          this.tableData = res.object
          this.queryTerminalListSum()
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
    queryTerminalListSum() {
      queryTerminalListSum(this.number).then(res => {
        if (res.success) {
          this.sumTermina = res.object
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
      this.terminalForm = {}
      this.editVisible = true;
    },
    handleEdit(row) {
      this.title = '编辑'
      this.terminalForm = {
        id: row.id,
        name: row.name,
        number: row.number,
        sendInterval: row.sendInterval,
        memo: row.memo
      }
      this.editVisible = true;
    },
    saveEdit() {
      if (!this.terminalForm.number) {
        this.$message.warning('终端编号不能为空')
        return
      }
      if (!this.terminalForm.sendInterval) {
        this.$message.warning('发送数据间隔不能为空')
        return
      }
      //编辑保存
      if (this.terminalForm.id) {
        updateTerminal(this.terminalForm).then(res => {
          if (res.success) {
            this.$message.success('保存成功')
            this.editVisible = false
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        })
      } else {// 新增保存
        addTerminal(this.terminalForm).then(res => {
          if (res.success) {
            this.$message.success('保存成功')
            this.editVisible = false
            this.getData()
          } else {
             this.$message.error(res.message)
          }
        })
      }
    },
    // 删除操作
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        removeTerminal(row.id).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => { });
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
