<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="userName" placeholder="用户名称" class="handle-input mr10"></el-input>
                <el-input v-model="operation" placeholder="操作内容" class="handle-input mr10"></el-input>
                <el-button
                    style="margin-left: 10px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleSearch"
                >查询</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="user.name" label="用户"></el-table-column>
                <el-table-column prop="createTime" label="操作时间"></el-table-column>
                <el-table-column prop="operation" label="操作内容"></el-table-column>
                <el-table-column prop="ip" label="用户IP"></el-table-column>
                <el-table-column prop="memo" label="说明"></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
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
                    :total="sumLogs"
                    :page-size="pageSize"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 验证弹出框 -->
        <el-dialog :title = "权限验证" :visible.sync="permVisible" width="30%">
            <el-form :model="permForm" label-width="100px">
                <el-form-item label="管理员账号">
                    <el-input v-model="permForm.name"></el-input>
                </el-form-item>
                <el-form-item label="管理员密码">
                    <el-input type="password" v-model="permForm.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="permVisible = false">取 消</el-button>
                <el-button type="primary" @click="checkAdminAccount">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { queryLogsmanageList,queryLogsmanageListSum,removeLogsmanage,checkAdminAccount} from '@/api/logsmanage';
export default {
  name: 'logsmanage',
  data() {
    return {
      userName: '',
      operation: '',
      start: 1,
      end: 10,
      pageSize: 10,
      sumLogs: '',
      currentPage: 1,
      tableData: [],
      permVisible:false,
      permForm: {},
      flag: false
    };
  },
  created() {
    this.showAdminAccount();
  },
  methods: {
    getData() {
      queryLogsmanageList(this.userName, this.operation, this.start, this.end).then(res => {
        if (res.success) {
          this.tableData = res.object
          this.queryLogsmanageListSum()
        }
      });
    },
    handlePageChange(val) {
      this.start = this.pageSize * (val - 1) + 1
      this.end = this.pageSize * val
      this.currentPage = val
      if(this.flag === true){
         this.getData()
      }else{
        this.showAdminAccount()
      }
    },
    queryLogsmanageListSum() {
      queryLogsmanageListSum(this.userName, this.operation, this.start, this.end).then(res => {
        if (res.success) {
          this.sumLogs = res.object
        }
      })
    },
    // 触发搜索按钮
    handleSearch() {
      if(this.flag === true){
        this.getData()
      }else{
        this.showAdminAccount()
      }
    },
    // 删除操作
    handleDelete(row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
            type: 'warning'
        }).then(() => {
            removeLogsmanage(row.id).then(res=>{
              if(res.success){
                this.$message.success('删除成功')
                this.getData()
              }else{
                this.$message.warning(res.message)
              }
            })
       }).catch(() => {});
    },

    showAdminAccount() { 
      this.permForm = {}
      this.permVisible = true
    },

    checkAdminAccount() {
      checkAdminAccount(this.permForm).then(res => {
        if (res.success) {
          this.getData()
          this.flag = true
          this.permVisible = false
        }else{
          this.$message.error(res.message)
        }
      })
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
