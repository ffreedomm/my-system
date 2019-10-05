<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="name" placeholder="名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </div>
            <el-button style="margin-bottom: 10px;" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            <el-table
                :data="tableData" 
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column type="index" width="70"  label="序号" align="center"></el-table-column>
                <el-table-column prop="name" label="报备名称" width="220"></el-table-column>
                <el-table-column prop="periods" label="时段设置" width="280"></el-table-column>
                <el-table-column prop="reporter" label="报备人" ></el-table-column>
                <el-table-column prop="org.name" label="报备机构" width="150"></el-table-column>
                <el-table-column prop="memo" label="备注"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                        >编辑</el-button>
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
                    :total="dTotal"
                    :page-size="pageSize"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增/编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="40%">
            <el-form :model="dForm" ref="dForm" :rules="rules" label-width="90px">
                <el-form-item prop="name" label="名称">
                    <el-input v-model="dForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="periods" label="时段设置">
                    <el-input v-model="dForm.periods"></el-input>
                </el-form-item>
                <el-form-item prop="reporter" label="报备人">
                    <el-input v-model="dForm.reporter"></el-input>
                </el-form-item>
                <el-form-item prop="orgId" label="报备机构">
                    <el-select class="item-choose" v-model="dForm.orgId" size="small">
                        <el-option
                            v-for="(item,index) in orgList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="memo" label="备注">
                    <el-input v-model="dForm.memo"></el-input>
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
import {queryList, queryTotal, add, update, remove, getOrgList } from '@/api/peakset';
export default {
    name: 'industry',
    data() {
        return {
            title: '新增',
            dForm: {},
            name: '',
            start: 1,
            end: 10,
            pageSize: 10,
            dTotal: 0,
            currentPage: 1,
            tableData: [],
            startOrg: 1,
            endOrg: 3,
            pageSizeOrg: 3,
            currentPageOrg: 1,
            editVisible: false,
            orgList:[],
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                periods: [
                    { required: true, message: '请输入时段设置', trigger: 'blur' },
                ],
                reporter: [
                    { required: true, message: '请输入报备人', trigger: 'blur' },
                ],
                orgId: [
                    { required: true, message: '请选择报备机构', trigger: 'blur' },
                ]
            }
        };
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            queryList(this.name, this.start, this.end).then(res => {
              if(res.success){
                this.tableData = res.object
                this.queryTotal()
                this.getOrgList()
              }
            });
        },

        //查找机构
        getOrgList(){
            getOrgList().then(res => {
              if(res.success){
                this.orgList = res.object
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
        queryTotal(){
          queryTotal(this.name).then(res=>{
            if(res.success){
              this.dTotal = res.object
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
            this.dForm = {}
            this.editVisible = true;
        },
        handleEdit(row){
            debugger
            this.title = '编辑'
            this.dForm = {
                reportPeriodId: row.id,
                name: row.name,
                periods: row.periods,
                memo: row.memo,
                reporter: row.reporter,
                orgId: row.org.id
            }
            this.editVisible = true;
        },
        saveEdit() {
            this.$refs['dForm'].validate((valid) => {
                if (valid) {
                    //编辑保存
                    if(this.dForm.reportPeriodId){
                        update(this.dForm).then(res=>{
                        if(res.success){
                            this.$message.success('修改成功')
                            this.editVisible = false
                            this.getData()
                        }else{
                            this.$message.error(res.message)
                        }
                        })
                    }else{// 新增保存
                        add(this.dForm).then(res=>{
                        if(res.success){
                            this.$message.success('保存成功')
                            this.editVisible = false
                            this.getData()
                        }else{
                            this.$message.error(res.message)
                        }
                        })
                    }
                } else {
                    return false;
                }
        });
              
        },
         // 删除操作
        handleDelete(row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
              remove(row.id).then(res=>{
                if(res.success){
                  this.$message.success('删除成功')
                  this.getData()
                }else{
                   this.$message.error(res.message)
                }
              })
            }).catch(() => {});
        },
           // 分页导航
        handlePageChangeOrg(val) {
          this.startOrg = this.pageSizeOrg * (val - 1) + 1
          this.endOrg = this.pageSizeOrg * val
          this.currentPageOrg = val
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
.el-select{
    width: 100%
}
</style>
