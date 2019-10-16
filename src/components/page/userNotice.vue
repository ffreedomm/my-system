<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="userName" placeholder="创建人名字" class="handle-input mr10"></el-input>
                <el-input v-model="content" placeholder="内容" class="handle-input mr10"></el-input>
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    style="margin-left: 10px;"
                    v-model="qTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </div>
            <el-button style="margin-bottom: 10px;" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            <el-table
                :data="tableData" 
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @row-click="getDevices"
            >
                <el-table-column type="index" width="70"  label="序号" align="center"></el-table-column>
                <el-table-column prop="user.name" label="用户名称"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" align="center">
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
                    <el-col :span="20">
                        <el-form-item prop="name" label="用户">
                            <el-select v-model="dForm.userId" placeholder="请选择用户">
                                <el-option
                                    v-for="item in users"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="0"> 
                    <el-col :span="20">
                        <el-form-item prop="normalPowerLowLimit" label="内容">
                            <el-input type="textarea" :rows="10" v-model="dForm.content"></el-input>
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
import {queryList,queryTotal,add, update, remove, queryUsers} from '@/api/usernotice';
export default {
    name: 'industry',
    data() {
        return {
            users:[],
            qTime:[],
            title: '新增',
            dForm: {},
            userName: '',
            content:'',
            start: 1,
            end: 5,
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
            }
        };
    },
    created() {
        this.queryUsers()
        this.getData()
    },
    methods: {
        queryUsers(){
            queryUsers().then(res => {
                if(res.success){
                    this.users = res.object
                }
            });
        },
        getData() {
            if(this.qTime && this.qTime.length == 2){
                const req ={
                    userName:this.userName,
                    content:this.content,
                    startTime: this.qTime[0] + '-0-0-1',
                    endTime: this.qTime[1] + '-23-59-59',
                    start:this.start,
                    end:this.end
                }
                queryList(req).then(res => {
                    if(res.success){
                        this.tableData = res.object
                        this.queryTotal()
                    }
                });
            }
        },
        // 分页导航
        handlePageChange(val) {
          this.start = this.pageSize * (val - 1) + 1
          this.end = this.pageSize * val
          this.currentPage = val
          this.getData()
        },
        queryTotal(){
            if(this.qTime && this.qTime.length == 2){
                const req ={
                    userName:this.userName,
                    content:this.content,
                    startTime: this.qTime[0] + '-0-0-1',
                    endTime: this.qTime[1] + '-23-59-59'
                }
            queryTotal(req).then(res=>{
                if(res.success){
                this.dTotal = res.object
                }
            })
            }
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
                userNoticeId: row.id,
                userId: row.user.id,
                content: row.content
            }
            this.editVisible = true;
        },
        saveEdit() {
            this.$refs['dForm'].validate((valid) => {
                if (valid) {
                    //编辑保存
                    if(this.dForm.userNoticeId){
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
