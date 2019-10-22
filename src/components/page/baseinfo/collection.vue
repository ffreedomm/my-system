<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="deviceNumber" placeholder="设备编号" class="handle-input mr10"></el-input>
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
                <el-table-column prop="terminal.device.terminalNumber" label="所属终端"></el-table-column>
                <el-table-column prop="device.name" label="所属设备" width="170"></el-table-column>
                <el-table-column prop="device.number" label="设备编号"></el-table-column>
                <el-table-column prop="electricity" label="电流值"></el-table-column>
                <el-table-column prop="voltage" label="电压值"></el-table-column>
                <el-table-column prop="power" label="功率值"></el-table-column>
                <el-table-column prop="createTime" label="记录时间" width="140">
                    <template scope="scope">
                        {{ formatDate(scope.row.createTime) }}
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
                    :total="sumTrade"
                    :page-size="pageSize"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增/编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form :model="dForm" ref="dForm" :rules="rules" label-width="90px">
                <el-form-item prop="electricity" label="电流值">
                    <el-input v-model="dForm.electricity"></el-input>
                </el-form-item>
                <el-form-item prop="voltage" label="电压值">
                    <el-input v-model="dForm.voltage"></el-input>
                </el-form-item>
                <el-form-item prop="power" label="功率值">
                    <el-input v-model="dForm.power"></el-input>
                </el-form-item>
                <el-form-item prop="terminalId" label="所属终端">
                    <el-select class="item-choose" width="30%" v-model="dForm.terminalId" size="small">
                        <el-option
                            v-for="(item,index) in terminalList"
                            :key="index"
                            :label="item.number"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="deviceId" label="所属设备">
                    <el-select class="item-choose" v-model="dForm.deviceId" size="small">
                        <el-option
                            v-for="(item,index) in deviceList"
                            :key="index"
                            :label="(item.name +'('+ item.number)+')'"
                            :value="item.id">
                        </el-option>
                    </el-select>
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
import { queryCollectionList, queryTotal, queryTerminals, 
queryDevices, addTerminalRecord, updateTerminalRecord,removeTerminalRecord } from '@/api/collection';
import {formatDate} from '../../../utils/dateUtil'
export default {
    name: 'industry',
    data() {
        return {
            title: '新增',
            dForm: {},
            deviceNumber: '',
            start: 1,
            end: 10,
            pageSize: 10,
            sumTrade: 0,
            currentPage: 1,
            tableData: [],
            startOrg: 1,
            endOrg: 3,
            pageSizeOrg: 3,
            sumTradeOrg: '',
            currentPageOrg: 1,
            orgData: [],
            editVisible: false,
            detailVisible: false,
            terminalList:[],
            deviceList:[],

            rules: {
                electricity: [
                    { required: true, message: '请输入电流值', trigger: 'blur' },
                ],
                voltage: [
                    { required: true, message: '请输入电压值', trigger: 'blur' },
                ],
                power: [
                    { required: true, message: '请输入功率值', trigger: 'blur' },
                ],
                terminalId: [
                    { required: true, message: '请选择所属终端', trigger: 'change' },
                ],
                deviceId: [
                    { required: true, message: '请选择所属设备', trigger: 'change' },
                ],
            }
        };
    },
    created() {
        this.getData()
    },
    methods: {
        formatDate,
        getData() {
            queryCollectionList(this.deviceNumber, this.start, this.end).then(res => {
              if(res.success){
                this.tableData = res.object
                this.queryTotal()
                if(this.start == 1){
                    this.queryTerminals() 
                    this.queryDevices()
                }
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
          queryTotal(this.deviceNumber).then(res=>{
            if(res.success){
              this.sumTrade = res.object
            }
          })
        },
        //终端列表
        queryTerminals(){
            queryTerminals().then(res=>{
            if(res.success){
                this.terminalList = res.object
            }
          })
        },
        //设备列表
        queryDevices(){
            queryDevices().then(res=>{
            if(res.success){
              this.deviceList = res.object
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
              terminalRecordId: row.id,
              electricity: row.electricity,
              voltage: row.voltage,
              power: row.power,
              terminalId: row.terminal.id,
              deviceId: row.device.id,

            }
            this.editVisible = true;
        },
        saveEdit() {
            this.$refs['dForm'].validate((valid) => {
                if (valid) {
                    //编辑保存
                    if(this.dForm.terminalRecordId){
                        updateTerminalRecord(this.dForm).then(res=>{
                        if(res.success){
                            this.$message.success('修改成功')
                            this.editVisible = false
                            this.getData()
                        }else{
                            this.$message.error(res.message)
                        }
                        })
                    }else{// 新增保存
                        addTerminalRecord(this.dForm).then(res=>{
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
              removeTerminalRecord(row.id).then(res=>{
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
