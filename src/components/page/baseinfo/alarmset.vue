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
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="device.name" label="正常功率范围" width="170">
                    <template scope="scope">
                        {{scope.row.normalPowerLowLimit}}--{{scope.row.normalPowerUpperLimit}}
                    </template>
                </el-table-column>
                <el-table-column prop="device.number" label="功率轻度超标范围">
                    <template scope="scope">
                        {{scope.row.overPowerLowLimit1}}--{{scope.row.overPowerUpperLimit1}}
                    </template>
                </el-table-column>
                <el-table-column prop="electricity" label="功率中度超标范围">
                    <template scope="scope">
                        {{scope.row.overPowerLowLimit2}}--{{scope.row.overPowerUpperLimit2}}
                    </template>
                </el-table-column>
                <el-table-column prop="voltage" label="功率重度超标范围">
                    <template scope="scope">
                        {{scope.row.overPowerLowLimit3}}--{{scope.row.overPowerUpperLimit3}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280" align="center">
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
        <el-dialog :title="title" :visible.sync="editVisible" width="60%">
            <el-form :model="dForm" ref="dForm" :rules="rules" label-width="170px">
                <el-row :gutter="0"> 
                    <el-col :span="24">
                        <el-form-item prop="name" label="名称">
                            <el-input v-model="dForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="0"> 
                    <el-col :span="12">
                        <el-form-item prop="normalPowerLowLimit" label="正常功率范围下限">
                            <el-input v-model="dForm.normalPowerLowLimit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="normalPowerUpperLimit" label="上限">
                            <el-input v-model="dForm.normalPowerUpperLimit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="0"> 
                    <el-col :span="12">
                        <el-form-item prop="overPowerLowLimit1" label="功率轻度超标范围下限">
                            <el-input v-model="dForm.overPowerLowLimit1"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="overPowerUpperLimit1" label="上限">
                            <el-input v-model="dForm.overPowerUpperLimit1"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="0"> 
                    <el-col :span="12">
                        <el-form-item prop="overPowerLowLimit2" label="功率中度超标范围下限">
                            <el-input v-model="dForm.overPowerLowLimit2"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="overPowerUpperLimit2" label="上限">
                            <el-input v-model="dForm.overPowerUpperLimit2"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="0"> 
                    <el-col :span="12">
                        <el-form-item prop="overPowerLowLimit3" label="功率重度超标范围下限">
                            <el-input v-model="dForm.overPowerLowLimit3"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="overPowerUpperLimit3" label="上限">
                            <el-input v-model="dForm.overPowerUpperLimit3"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {queryList,queryTotal,add, update, remove } from '@/api/alarmset';
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

            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                normalPowerLowLimit: [
                    { required: true, message: '请输入正常功率范围下限', trigger: 'blur' },
                ],
                normalPowerUpperLimit: [
                    { required: true, message: '请输入正常功率范围上限', trigger: 'blur' },
                ],
                overPowerLowLimit1: [
                    { required: true, message: '请输入功率轻度超标范围下限', trigger: 'blur' },
                ],
                overPowerUpperLimit1: [
                    { required: true, message: '请输入功率轻度超标范围上限', trigger: 'blur' },
                ],
                overPowerLowLimit2: [
                    { required: true, message: '请输入功率中度超标范围下限', trigger: 'blur' },
                ],
                overPowerUpperLimit2: [
                    { required: true, message: '请输入功率中度超标范围上限', trigger: 'blur' },
                ],
                overPowerLowLimit3: [
                    { required: true, message: '请输入功率重度超标范围下限', trigger: 'blur' },
                ],
                overPowerUpperLimit3: [
                    { required: true, message: '请输入功率重度超标范围上限', trigger: 'blur' },
                ],
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
            this.title = '编辑'
            this.dForm = {
                alertParamId: row.id,
                name: row.name,
                normalPowerLowLimit: row.normalPowerLowLimit,
                normalPowerUpperLimit: row.normalPowerUpperLimit,
                overPowerLowLimit1: row.overPowerLowLimit1,
                overPowerLowLimit2: row.overPowerLowLimit2,
                overPowerLowLimit3: row.overPowerLowLimit3,
                overPowerUpperLimit1: row.overPowerUpperLimit1,
                overPowerUpperLimit2: row.overPowerUpperLimit2,
                overPowerUpperLimit3: row.overPowerUpperLimit3
            }
            this.editVisible = true;
        },
        saveEdit() {
            this.$refs['dForm'].validate((valid) => {
                if (valid) {
                    //编辑保存
                    if(this.dForm.alertParamId){
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
