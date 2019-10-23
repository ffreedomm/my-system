<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="name" placeholder="地区名称" class="handle-input mr10"></el-input>
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
                <el-table-column type="index" width="70"  label="序号"></el-table-column>
                <el-table-column prop="name" label="地区名称"></el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-share"
                            @click="handleDetail(scope.row)"
                        >下属企业详情</el-button>
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

        <!-- 企业详情弹出框 -->
        <el-dialog :title="title" :visible.sync="listOrgVisible" width="30%" >
            <el-form :model="tradeFormOrg" label-width="70px" >
              <el-row :gutter="20">
                <el-col :span="12">  
                  <el-form-item label="企业名称">
                      <label>{{tradeFormOrg.name}}</label>
                  </el-form-item>
                  <el-form-item label="所属地区">            
                    <label>{{tradeFormOrg.zonename}}</label>
                  </el-form-item>
                </el-col>
                <el-col :span="12"> 
                  <el-form-item label="所属行业">
                    <label>{{tradeFormOrg.tradename}}</label>
                  </el-form-item>
                  <el-form-item label="法人代表">
                    <label>{{tradeFormOrg.legalPerson}}</label>
                  </el-form-item>
                </el-col>
                <el-col :span="12">  
                  <el-form-item label="企业性质">
                    <label>{{tradeFormOrg.property}}</label>
                  </el-form-item>
                  <el-form-item label="企业人数">
                    <label>{{tradeFormOrg.population}}</label>
                  </el-form-item>
                </el-col> 
                <el-col :span="12"> 
                  <el-form-item label="联系人">
                    <label>{{tradeFormOrg.contact}}</label>
                  </el-form-item>
                    <el-form-item label="联系电话">
                  <label>{{tradeFormOrg.phone}}</label>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="listOrgVisible = false">关闭</el-button>
            </span>
        </el-dialog>

        <!-- 新增/编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form :model="tradeForm" label-width="70px">
                <el-form-item label="地区名称">
                    <el-input v-model="tradeForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 下属企业详情 -->
        <el-dialog title="下属企业详情" :visible.sync="detailVisible" width="90%">
           <div class="container">
            <el-table
                :data="orgData" 
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                 <el-table-column type="index" width="50"  label="序号"></el-table-column>
                <el-table-column prop="name" label="企业名称"></el-table-column>
                <el-table-column prop="zone.name" label="所属地区"></el-table-column>
                <el-table-column prop="trade.name" label="所属行业"></el-table-column>
                <el-table-column prop="legalPerson" label="法人代表"></el-table-column>
                <el-table-column prop="property" label="企业性质"></el-table-column>
                <el-table-column prop="population" label="企业人数"></el-table-column>
                <el-table-column prop="contact" label="联系人"></el-table-column>
                <el-table-column prop="phone" label="联系电话"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-search"
                            @click="handleDetailOrg(scope.row)"
                        >查看历史数据</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPageOrg"
                    :page-size="pageSizeOrg"
                    :total="sumTradeOrg"
                    @current-change="handlePageChangeOrg"
                ></el-pagination>
            </div>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import { queryZoneList,queryZoneListSum,addZone,updateZone,
         removeZone,orgListForZone,orgListSumForZone } from '@/api/baseInfo'
export default {
    data() {
        return {
            title: '新增',
            tradeForm: {},
            tradeFormOrg: {},
            name: '',
            start: 1,
            end: 10,
            pageSize: 10,
            sumTrade: '',
            currentPage: 1,
            tableData: [],
            startOrg: 1,
            endOrg: 5,
            pageSizeOrg: 5,
            sumTradeOrg: '',
            currentPageOrg: 1,
            orgData: [],
            editVisible: false,
            detailVisible: false,
            listOrgVisible: false,
        };
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            queryZoneList(this.name, this.start, this.end).then(res => {
              if(res.success){
                this.tableData = res.object
                this.queryZoneListSum()
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
        queryZoneListSum(){
          queryZoneListSum(this.name).then(res=>{
            if(res.success){
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
        handleEdit(row){
            this.title = '编辑'
            this.tradeForm = {
              id: row.id,
              name: row.name
            }
            this.editVisible = true;
        },
        handleDetailOrg(row){
            this.title = '企业详情'
            this.tradeFormOrg = {
              id: row.id,
              name: row.name,
              zonename: row.zone.name,
              tradename: row.trade.name,
              legalPerson: row.legalPerson,
              property: row.property,
              population: row.population,
              contact: row.contact,
              phone: row.phone
            }
            this.listOrgVisible = true;
        },
        saveEdit() {
            if(this.tradeForm.name){
              //编辑保存
              if(this.tradeForm.id){
                updateZone(this.tradeForm).then(res=>{
                  if(res.success){
                    this.$message.success('保存成功')
                    this.editVisible = false
                    this.getData()
                  }else{
                    this.$message.error(res.message)
                  }
                })
              }else{// 新增保存
                addZone(this.tradeForm.name).then(res=>{
                  if(res.success){
                    this.$message.success('保存成功')
                    this.editVisible = false
                    this.getData()
                  }else{
                    this.$message.error(res.message)
                  }
                })
              }
              
            }else{
              this.$message.warning('地区名称不能为空')
            }
        },
         // 删除操作
        handleDelete(row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
              removeZone(row.id).then(res=>{
                if(res.success){
                  this.$message.success('删除成功')
                  this.getData()
                }else{
                   this.$message.error(res.message)
                }
              })
            }).catch(() => {});
        },
       // 下属企业详情操作
        handleDetail(row) {
          orgListForZone(row.id, this.startOrg, this.endOrg).then(res=>{
             if(res.success){
                this.orgData = res.object
                this.orgListSumForZone(row)
                this.detailVisible = true
              }
          })
        },
         orgListSumForZone(row){
          orgListSumForZone(row.id).then(res=>{
            if(res.success){
              this.sumTradeOrg = res.object
            }
          })
        },
           // 分页导航
        handlePageChangeOrg(val) {
          this.startOrg = this.pageSizeOrg * (val - 1) + 1
          this.endOrg = this.pageSizeOrg * val
          this.currentPageOrg = val
          this.handleDetail()
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
