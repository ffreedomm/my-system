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
            >
                <el-table-column type="index" width="70"  label="序号" align="center"></el-table-column>
                <el-table-column prop="user.name" label="用户名称"></el-table-column>
                <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="content" label="内容" :show-overflow-tooltip="true"></el-table-column>
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
                        <el-button
                            type="text"
                            icon="el-icon-info"
                            @click="showDetail(scope.row.content)"
                        >查看</el-button>
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


    <el-dialog title="查看" :visible.sync="detailVisible" width="70%">
        <div id="detail"></div>
    </el-dialog>
        <!-- 新增/编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="80%">
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
                        <el-form-item prop="title" label="标题">
                            <el-input v-model="dForm.title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="0"> 
                    <el-col :span="20">
                        <el-form-item prop="normalPowerLowLimit" label="内容">
                            <div ref="editor" style="text-align:left;margin: 5px">
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="图片">
                <el-upload
                    name="Filedata"
                    :action="imageUploadUrl"
                    list-type="picture-card"
                    :on-success="handleAvatarSuccess"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="附件">
                <el-upload
                    name="Filedata"
                    class="upload-demo"
                    :action="fileUploadUrl"
                    :on-success="handleFileSuccess"
                    :file-list="fileList">
                    <el-button size="small" type="primary">选择附件上传</el-button>
                    </el-upload>
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
import E from 'wangeditor'
import {queryList,queryTotal,add, update, remove, queryUsers} from '@/api/usernotice';
export default {
    name: 'industry',
    data() {
        return {
            editor:{},
            fileList:[],
            imageUploadUrl: 'https://video1.dushuren123.com/iotserver/UploadImageFile?width=800&FiledataFileName=Filedata&name=Filedata',
            fileUploadUrl: 'https://video1.dushuren123.com/iotserver/UploadAccessoryFile?width=800&FiledataFileName=Filedata',
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
            detailVisible: false,

            rules: {
            },
            dialogImageUrl: '',
            dialogVisible: false
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
            let req ={
                userName:this.userName,
                content:this.content,
                startTime: '',
                endTime: '',
                start:this.start,
                end:this.end
            }
            if(this.qTime && this.qTime.length == 2){
                req ={
                  userName:this.userName,
                  content:this.content,
                  startTime: this.qTime[0] + '-0-0-1',
                  endTime: this.qTime[1] + '-23-59-59',
                  start:this.start,
                  end:this.end
              }
            }
            queryList(req).then(res => {
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
            this.$nextTick(()=> {
                this.initEditor("");
            })
        },
        handleEdit(row){
            this.title = '编辑'
            this.dForm = {
                userNoticeId: row.id,
                userId: row.user.id,
                title:row.title,
                content: row.content
            }
            this.editVisible = true;
            this.$nextTick(()=> {
                this.initEditor(row.content);
            })
        },
        initEditor(content){
            this.editor = new E(this.$refs.editor)
            this.editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
            this.editor.customConfig.uploadFileName = 'file'
            //this.editor.customConfig.uploadImgServer = this.imageUploadUrl // 上传图片到服务器
            this.editor.customConfig.onchange = (html) => {
            this.dForm.content = html
            }
            this.editor.create()
            this.editor.txt.html(content)
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
        handleAvatarSuccess(res, file) {
            this.dForm.content = this.dForm.content +"</br><img src='"+"https://video1.dushuren123.com/iotnewclient/" +res.object.src+"' width='800px'/>";
        },
        handleFileSuccess(res, file){
            this.dForm.content = this.dForm.content +"</br><a href='"+"https://video1.dushuren123.com/iotnewclient/" +res.object.href+"'>"+res.object.name+"</a>"
        },
        handleRemove(){},
        showDetail(d){
            this.detailVisible = true;
            this.$nextTick(()=>{
                document.getElementById("detail").innerHTML = d;
            })
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
.el-select{
    width: 100%
}
</style>
