<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-input v-model="name" placeholder="方案名称" class="handle-input mr10"></el-input>
                    </el-col>
                    <el-col :span="8">
                        <el-input v-model="orgName" placeholder="企业名称" class="handle-input mr10"></el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-select
                            style="margin-top: 10px;width: 300px;"
                            v-model="status"
                            placeholder="请选择状态"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            style="margin-top: 10px;"
                            v-model="organTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="3">
                        <el-button
                            style="margin-top: 10px;margin-left: 10px;"
                            type="primary"
                            icon="el-icon-search"
                            @click="handleSearch"
                        >查询</el-button>
                    </el-col>
                </el-row>
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
                <el-table-column type="index" width="70" label="序号"></el-table-column>
                <el-table-column prop="name" label="方案名称"></el-table-column>
                <el-table-column prop="org" label="所属企业"></el-table-column>
                <el-table-column prop="status" label="审核状态"></el-table-column>
                <el-table-column prop="checker" label="审核人"></el-table-column>
                <el-table-column prop="checkTime" label="审核时间"></el-table-column>
                <el-table-column prop="memo" label="审核意见"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="creator" label="创建人"></el-table-column>
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
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPage"
                    :total="sumTrade"
                    :page-size="pageSize"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增/编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="40%">
            <el-form :model="tradeForm" label-width="70px">
                <el-form-item label="方案名称" style="padding-left: 50px;">
                    <el-input style="width: 60%;" v-model="tradeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="所属企业" style="padding-left: 50px;">
                    <el-select
                        style="width: 60%;"
                        v-model="tradeForm.orgId"
                        multiple
                        placeholder="请选择企业"
                    >
                        <el-option
                            v-for="item in organList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="方案文件" style="padding-left: 50px;">
                  <input style="width: 60%;"  type="file" @change="tirggerFile($event)" />
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
import { queryOrgList, queryConstructionPlanList, queryConstructionPlanListSum } from '@/api/baseInfo'
import { add } from '@/api/constructionPlan'
export default {
  name: 'industry',
  data() {
    return {
      fileList: [],
      tradeForm: {},
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
      organList: [],
      file:{}
    };
  },
  created() {
    this.getData()
    this.queryOrgList()
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    queryOrgList() {
      queryOrgList('', 1, 9999).then(res => {
        if (res.success) {
          this.organList = res.object
        }
      })
    },
    getData() {
      let startTime = ''
      let endTime = ''
      if (this.organTime && this.organTime.length == 2) {
        startTime = this.organTime[0]
        endTime = this.organTime[1]
      }
      queryConstructionPlanList(this.name, this.status, this.orgName, startTime, endTime, this.start, this.end).then(res => {
        if (res.success) {
          this.tableData = res.object
          this.queryConstructionPlanListSum()
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
    queryConstructionPlanListSum() {
      let startTime = ''
      let endTime = ''
      if (this.organTime && this.organTime.length == 2) {
        startTime = this.organTime[0]
        endTime = this.organTime[1]
      }
      queryConstructionPlanListSum(this.name, this.status, this.orgName, startTime, endTime).then(res => {
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
    httpRequest (data) {
      let _this = this
      let rd = new FileReader() 
      let file = data.file
      rd.readAsDataURL(file)
      rd.onloadend = function (e) {
        _this.tradeForm.Filedata = this.result
      }
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
        let param = new FormData()
            param.append('creatorId',1)
            param.append('Filedata', this.file, this.file.name)
		        param.append('name', this.tradeForm.name)
            param.append('orgId', this.tradeForm.orgId)
          add(param).then(res => {
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
    tirggerFile(event){
      this.file = event.target.files[0]
    }
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
