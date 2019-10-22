<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="name" placeholder="设备名称" class="handle-input mr10"></el-input>
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
                <el-table-column prop="number" label="设备编号"></el-table-column>
                <el-table-column prop="name" label="设备名称"></el-table-column>
                <el-table-column prop="voltage" label="额定电压"></el-table-column>
                <el-table-column prop="power" label="额定功率"></el-table-column>
                <el-table-column prop="longitude" label="经度位置"></el-table-column>
                <el-table-column prop="latitude" label="纬度位置"></el-table-column>
                <el-table-column prop="memo" label="备注说明"></el-table-column>
                <el-table-column prop="terminalNumber" label="连接的终端" width="130"></el-table-column>
                <el-table-column prop="org.name" label="所属企业"></el-table-column>
                <el-table-column prop="type" label="设备类型" :formatter = "stateFormat"></el-table-column>
                <el-table-column prop="productDevice.name" label="关联的产污设备" width="130"></el-table-column>
                <el-table-column label="操作" width="520" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-share"
                            @click="handleDetail(scope.row)"
                        >所属企业详情</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-more"
                            @click="handleHistory(scope.row)"
                        >设备详情</el-button>  
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="handleConnect(scope.row)"
                        >设置连接终端</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-eleme"
                            :disabled="scope.row.type === 2"
                            @click="handleRelate(scope.row)"
                        >关联产污设备</el-button>
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
                    :total="sumDevice"
                    :page-size="pageSize"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增/编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form :model="deviceForm" label-width="70px">
                <el-form-item label="设备编号">
                    <el-input v-model="deviceForm.number"></el-input>
                </el-form-item>
                <el-form-item label="设备名称">
                    <el-input v-model="deviceForm.name"></el-input>
                </el-form-item>
                <el-form-item label="额定电压">
                    <el-input v-model="deviceForm.voltage"></el-input>
                </el-form-item>
                <el-form-item label="额定功率">
                    <el-input v-model="deviceForm.power"></el-input>
                </el-form-item>
                <el-form-item label="经度位置">
                    <el-input v-model="deviceForm.longitude"></el-input>
                </el-form-item>
                <el-form-item label="纬度位置">
                    <el-input v-model="deviceForm.latitude"></el-input>
                </el-form-item>
                <el-form-item label="备注说明">
                    <el-input v-model="deviceForm.memo"></el-input>
                </el-form-item>
                <el-form-item label="所属企业">
                    <el-select @click="" v-model="deviceForm.orgId"  placeholder="选择">
                    <el-option
                        v-for="item in OrgList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="设备类型">
                    <el-select v-model="deviceForm.type"  placeholder="选择">
                    <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 下属机构详情 -->
        <el-dialog title="所属企业详情" :visible.sync="detailVisible" width="90%">
           <div class="container">
            <el-table
                :data="orgData" 
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
            <el-table-column label="机构名称" width="180"> 
                <template slot-scope="scope">
                    <span>{{scope.row.orgname}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="所属行业" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orgtradename}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="所属地区" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orgzonename}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="法人代表" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orglegalPerson}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="法人代码" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orglegalCode}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="机构地址" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orgaddress}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="机构人数" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orgpopulation}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="联系人" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orgcontact}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="联系电话" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orgphone}}</span>
                </template>
	        </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPageOrg"
                    :page-size="pageSizeOrg"
                    :total="sumDeviceOrg"
                    @current-change="handlePageChangeOrg"
                ></el-pagination>
            </div>
        </div>
        </el-dialog>

        <!--  查看设备 -->
        <el-dialog :title="title" :visible.sync="historyVisible" width="40%" >
            <el-form :model="tradeFormEqu" label-width="70px" >
              <el-row :gutter="20">
                <el-col :span="12">  
                  <el-form-item label="设备编号">
                      <label>{{tradeFormEqu.number}}</label>
                  </el-form-item>
                  <el-form-item label="设备名称">            
                    <label>{{tradeFormEqu.name}}</label>
                  </el-form-item>
                </el-col>
                <el-col :span="12"> 
                  <el-form-item label="额定电压">
                    <label>{{tradeFormEqu.voltage}}</label>
                  </el-form-item>
                  <el-form-item label="额定功率">
                    <label>{{tradeFormEqu.power}}</label>
                  </el-form-item>
                </el-col>
                <el-col :span="12">  
                  <el-form-item label="经度位置">
                    <label>{{tradeFormEqu.longitude}}</label>
                  </el-form-item>
                  <el-form-item label="纬度位置">
                    <label>{{tradeFormEqu.latitude}}</label>
                  </el-form-item>
                </el-col> 
                <el-col :span="12"> 
                  <el-form-item label="备注说明">
                    <label>{{tradeFormEqu.memo}}</label>
                  </el-form-item>
                    <el-form-item label=" 所属企业">
                  <label>{{tradeFormEqu.orgId}}</label>
                  </el-form-item>
                </el-col>
                <el-col :span="12"> 
                  <el-form-item label="设备类型">
                    <label>{{tradeFormEqu.type}}</label>
                  </el-form-item> 
                </el-col>
              </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="historyVisible = false">关闭</el-button>
            </span>
        </el-dialog>

        <!-- 设置连接终端 -->
        <el-dialog title="设置连接终端" :visible.sync="connectVisible"  width="90%">
           <div class="container">
            <el-table
                :data="connData" 
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChangeT"
            >
                <el-table-column type="selection"  prop="id" label="选择" ></el-table-column>
                <el-table-column prop="number" label="终端编号"></el-table-column>
                <el-table-column prop="name" label="终端名称"></el-table-column>
                <el-table-column prop="memo" label="备注说明"></el-table-column>
                <el-table-column prop="sendInterval" label="发送数据间隔"></el-table-column>
                <el-table-column prop="device.org.name" label="所属机构"></el-table-column>
                <el-table-column prop="device.name" label="连接设备"></el-table-column>
            </el-table>
            <br><span style="position:relitive;float:right" >
                <el-button @click="connectVisible = false">取 消</el-button>
                <el-button type="primary" @click="linkTerminalToDevice">确 定</el-button>
            </span><br>
        </div>
        </el-dialog>

        <!-- 关联产污设备 -->
        <el-dialog title="关联产污设备" :visible.sync="relateVisible" width="90%">
           <div class="container">
            <el-table
                :data="relData" 
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChangeD"
            >
                <el-table-column type="selection"  prop="id" label="选择"></el-table-column>
                <el-table-column prop="number" label="设备编号"></el-table-column>
                <el-table-column prop="name" label="设备名称"></el-table-column>
                <el-table-column prop="voltage" label="额定电压"></el-table-column>
                <el-table-column prop="power" label="额定功率"></el-table-column>
                <el-table-column prop="longitude" label="经度位置"></el-table-column>
                <el-table-column prop="latitude" label="纬度位置"></el-table-column>
                <el-table-column prop="memo" label="备注说明"></el-table-column>
                <el-table-column prop="terminalNumber" label="连接的终端"></el-table-column>
                <el-table-column prop="org.name" label="所属机构"></el-table-column>
                <el-table-column prop="type" label="设备类型" :formatter = "stateFormat"></el-table-column>
                <el-table-column prop="name" label="关联的产污设备"></el-table-column>
            </el-table>
            <br><span style="position:relitive;float:right" >
                <el-button @click="relateVisible = false">取 消</el-button>
                <el-button type="primary" @click="linkProductDeviceToTreatDevice">确 定</el-button>
            </span><br>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import { queryDeviceList,queryDeviceListSum,addDevice,updateDevice,removeDevice,linkTerminalToDevice,linkProductDeviceToTreatDevice,
        treatDeviceListForOrg,productDeviceListForOrg,device,queryTerminals,
        queryOrgList} from '@/api/equipment'
export default {
    name: 'device',
    data() {
        return {
            title: '设备操作',
            deviceForm: {},
            tradeFormEqu: {},
            name: '',
            start: 1,
            end: 10,
            pageSize: 10,
            sumDevice: '',
            currentPage: 1,
            tableData: [],

            startOrg: 1,
            endOrg: 5,
            pageSizeOrg: 5,
            sumDeviceOrg: '',
            currentPageOrg: 1,
            orgData: [],

            connData: [],
            relData: [],
            OrgList: [],

            typeList:[
                {id:1,name:'治污设备'},
                {id:2,name:'产污设备'}
            ],

            editVisible: false,
            detailVisible: false,
            historyVisible: false,
            connectVisible: false,
            relateVisible: false,

            deviceIdT:'',
            deviceIdD:'',
            multipleSelectionT: [],   // 终端选中
            multipleSelectionD: [],   // 设备选中
        };
    },
    created() {
        this.getData();
        this.queryOrgList();
    },
    
    methods: {
        getData() {
            queryDeviceList(this.name, this.start, this.end).then(res => {
              if(res.success){
                this.tableData = res.object
                this.queryDeviceListSum()
              }
            });
        },

        handleSelectionChangeT (val) {               
                this.multipleSelectionT = val;    
        },

        handleSelectionChangeD (val) {
                this.multipleSelectionD = val;
        },

        // 分页导航
        handlePageChange(val) {
          this.start = this.pageSize * (val - 1) + 1
          this.end = this.pageSize * val
          this.currentPage = val
          this.getData()
        },
        queryDeviceListSum(){
          queryDeviceListSum(this.name).then(res=>{
            if(res.success){
              this.sumDevice = res.object
            }
          })
        },
        stateFormat(row, column) {
            console.log(row.type)
            if (row.type === 1) {
            return '治污设备'
            } else if (row.type === 2) {
            return '产污设备'
            }
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        // 新增操作
        handleAdd() {
            this.title = '新增'
            this.deviceForm = {}
            this.editVisible = true;
        },
        handleEdit(row){
            this.title = '编辑'
            this.deviceForm = {
              id: row.id,
              number: row.number,
              memo: row.memo,
              name: row.name,
              longitude: row.longitude,
              latitude: row.latitude,
              voltage: row.voltage,
              power: row.power,
              type: row.type,
              orgId :row.org.id,
              deviceId :row.productDevice.id
            }
            this.editVisible = true;
        },
        saveEdit() {
            if(this.deviceForm.name){
              //编辑保存
              if(this.deviceForm.id){
                updateDevice(this.deviceForm).then(res=>{
                  if(res.success){
                    this.$message.success('保存成功')
                    this.editVisible = false
                    this.getData()
                  }else{
                    this.$message.error(res.message)
                  }
                })
              }else{// 新增保存
                addDevice(this.deviceForm).then(res=>{
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
              this.$message.warning('设备名称不能为空')
            }
        },
         // 删除操作
        handleDelete(row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
              removeDevice(row.id).then(res=>{
                if(res.success){
                  this.$message.success('删除成功')
                  this.getData()
                }else{
                   this.$message.error(res.message)
                }
              })
            }).catch(() => {});
        },
       // 下属机构详情操作
        handleDetail(row) {
             this.orgData[0] = {
                orgname: row.org.name,
                orgtradename: row.org.trade.name,
                orgzonename: row.org.zone.name,
                orglegalPerson: row.org.legalPerson,
                orglegalCode: row.org.legalCode,
                orgaddress: row.org.address,
                orgpopulation: row.org.population,
                orgcontact: row.org.contact,
                orgphone: row.org.phone
            }
            this.detailVisible = true
        },
        //查看设备
        handleHistory(row){
            this.title = '设备详情'
            this.tradeFormEqu = {
              id: row.id,
              number: row.number,
              memo: row.memo,
              name: row.name,
              longitude: row.longitude,
              latitude: row.latitude,
              voltage: row.voltage,
              power: row.power,
              type: row.type == 1 ? '治污设备' : '产污设备',
              orgId :row.org.id,
            }
            this.historyVisible = true;
        },
        //连接终端列表
        handleConnect(row) {
            queryTerminals().then(res=>{
             if(res.success){
                this.connData = res.object
                this.connectVisible = true
                this.deviceIdT = row.id
              }
          })
        },
        //产污设备列表
        handleRelate(row) {
            productDeviceListForOrg(row.org.id).then(res=>{
             if(res.success){
                 if(row.type === 1){
                    this.relData = res.object
                    this.relateVisible = true
                    this.deviceIdD = row.id
                 }else{
                   this.$message.warning('非治污设备，禁止操作')
                }
                
              }
          })
        },
           // 机构分页导航
        handlePageChangeOrg(val) {
          this.startOrg = this.pageSizeOrg * (val - 1) + 1
          this.endOrg = this.pageSizeOrg * val
          this.currentPageOrg = val
          this.handleDetail()
        },


        //机构列表
        queryOrgList() {
            queryOrgList().then(res=>{
             if(res.success){
                this.OrgList = res.object
              }
          })
        },
        
        //设备连接终端
        linkTerminalToDevice() {
            if(this.multipleSelectionT.length>1){
                     this.$message.warning('请选择一个终端')
            }else{
            linkTerminalToDevice(this.multipleSelectionT[0].id,this.deviceIdT).then(res=>{
             if(res.success){
                this.$message.success('设置成功')
                this.connectVisible = false
                this.getData()
              }
            })
          }
        },

        //关联产污设备
        linkProductDeviceToTreatDevice() {
            linkProductDeviceToTreatDevice(this.multipleSelectionD[0].id,this.deviceIdD).then(res=>{
             if(res.success){
                this.$message.success('关联成功')
                this.relateVisible = false
                this.getData()
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
