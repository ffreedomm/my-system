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
                    <el-select v-model="deviceForm.orgId"  placeholder="选择">
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

        <!-- 下属企业详情 -->
        <el-dialog title="所属企业详情" :visible.sync="detailVisible" width="90%">
           <div class="container">
            <el-table
                :data="orgData" 
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
            <el-table-column label="企业名称" width="180"> 
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
            <el-table-column label="企业地址" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orgaddress}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="企业人数" width="180">
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
        <el-dialog title="设备详情" :visible.sync="historyVisible" width="90%">
           <div class="container">
            <el-table
                :data="hisData" 
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
            <el-table-column label="所属终端" width=""> 
                <template slot-scope="scope">
                    <span>{{scope.row.terminal.number}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="所属设备" width="">
                <template slot-scope="scope">
                    <span>{{scope.row.device.name}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="电流值" width="">
                <template slot-scope="scope">
                    <span>{{scope.row.electricity}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="电压值" width="">
                <template slot-scope="scope">
                    <span>{{scope.row.voltage}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="功率值" width="">
                <template slot-scope="scope">
                    <span>{{scope.row.power}}</span>
                </template>
	        </el-table-column>
            <el-table-column label="记录时间" width="">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime}}</span>
                </template>
	        </el-table-column>
            </el-table>
            <br>
            <br>
            <el-row :gutter="40">
                <el-col :span="9">
                    <div id="ChartZx" :style="{width: '100%', height: '400px'}"></div>
                </el-col>
                <el-col :span="6">
                    <div id="ChartBt" :style="{width: '100%', height: '400px'}"></div>
                </el-col>
            </el-row>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPageHis"
                    :page-size="pageSizeHis"
                    :total="sumDeviceHis"
                    @current-change="handlePageChangeHis"
                ></el-pagination>
            </div>
        </div>
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
                <el-table-column prop="device.org.name" label="所属企业"></el-table-column>
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
                <el-table-column prop="org.name" label="所属企业"></el-table-column>
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
        treatDeviceListForOrg,productDeviceListForOrg,device,queryTerminals,terminalRecordListForDevice,terminalRecordListSumForDevice,
        queryOrgList,getTotalListForDeviceList} from '@/api/equipment'
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

            startHis: 1,
            endHis: 15,
            pageSizeHis: 15,
            sumDeviceHis: '',
            currentPageHis: 1,
            hisData: [],
            deviceID: '',

            connData: [],
            relData: [],
            OrgList: [],
            powerData: [],
            elecData: [],
            BtData: [],
            swData: [],
            
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
        }
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
              deviceId :row.id
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
       // 下属企业详情操作
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

        //查看设备详情
        handleHistory(row){
            terminalRecordListForDevice(row.id, this.startHis, this.endHis).then(res=>{
             if(res.success){
                this.hisData = res.object
                this.deviceID = row.id
                this.terminalRecordListSumForDevice(row)
                this.historyVisible = true
                this.getBtList()
                }
            })
        },

        terminalRecordListSumForDevice(row){
          terminalRecordListSumForDevice(row.id, this.startHis, this.endHis).then(res=>{
            if(res.success){
              this.sumDeviceHis = res.object
            }
          })
        },

        //查看设备详情分页调用
        handleHistoryVal(){
            terminalRecordListForDevice(this.deviceID, this.startHis, this.endHis).then(res=>{
             if(res.success){
                this.hisData = res.object
                this.terminalRecordListSumForDeviceVal()
                this.historyVisible = true
              }
          })
        },

        terminalRecordListSumForDeviceVal(){
          terminalRecordListSumForDevice(this.deviceID, this.startHis, this.endHis).then(res=>{
            if(res.success){
              this.sumDeviceHis = res.object
            }
          })
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
           // 企业分页导航
        handlePageChangeOrg(val) {
          this.startOrg = this.pageSizeOrg * (val - 1) + 1
          this.endOrg = this.pageSizeOrg * val
          this.currentPageOrg = val
          this.handleDetail()
        },

        //设备详情分页
        handlePageChangeHis(val){
          this.startHis = this.pageSizeHis * (val - 1) + 1
          this.endHis = this.pageSizeHis * val
          this.currentPageHis = val
          this.handleHistoryVal()
        },

        
        //企业列表
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

        //获取饼状图数据
        getBtList(){
            getTotalListForDeviceList(this.deviceID).then(res=>{
                if(res.success){
                    if(res.object && res.object.length > 0){
                        this.BtData = [];
                        let temp = res.object[0];
                        this.BtData.push(
                            {
                                value:temp.faultSum - temp.handledSum,
                                name:'未处理故障数'
                            },
                            {
                                value:temp.handledSum,
                                name:'已处理故障数'
                            },
                        );
                        this.initCChart();
                        this.getZxList();
                    }
                }
            });
        },

        //获取折线图数据
        getZxList(){   
            this.elecData = []
            this.powerData = []
            this.swData = []
            this.hisData.forEach((item) =>{
                this.elecData.push(Number(item.electricity))
                this.powerData.push(Number(item.power/1000).toFixed(2))
                this.swData.push('')
            });
            this.initZXChart();
        },

        //折线图
        initZXChart(){
            let ChartZx = this.$echarts.init(document.getElementById('ChartZx'));
            ChartZx.setOption({
                title: {
                    text: '实时数据趋势'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['电流值','功率值'],
                    align: 'left'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: 'this.swData'
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'电流值',
                        type:'line',
                        data: this.elecData
                    },
                    {
                        name:'功率值',
                        type:'line',
                        data: this.powerData
                    }
                ]
            });

        },

        //饼图
        initCChart(){
            let ChartBt = this.$echarts.init(document.getElementById('ChartBt'));
            ChartBt.setOption({
                title: {
                    text: '实时状态统计'
                },
                tooltip : {
                    position: 'inner',
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '',
                        type: 'pie',
                        radius : '75%',
                        center: ['45%', '50%'],
                        data:this.BtData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{ 
                                label:{ 
                                    show: true, 
                                    formatter: '{a} \n{b}\n{c} ({d}%)' 
                                }, 
                                labelLine :{show:true} 
                            }
                        },
                        label: {
                            // normal: {
                            //     position: 'inner'
                            // }
                        },
                        labelLine :{show:true} 
                    }
                ]
            });
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
