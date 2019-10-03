<template>
    <div class="container">
        <el-button
            style="margin-bottom: 10px;"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
        >新增</el-button>
        <el-button
            style="margin-bottom: 10px;"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit"
        >修改</el-button>
        <el-button
            style="margin-bottom: 10px;"
            type="primary"
            icon="el-icon-delete"
            @click="handleDel"
        >删除</el-button>
        <el-button
            style="margin-bottom: 10px;"
            type="primary"
            icon="el-icon-suitcase"
            @click="handleEquip"
        >设备信息</el-button>
        <el-tree :data="orgList" @node-click="handleNodeClick"></el-tree>
        <el-dialog :title="title" :visible.sync="addVisible" width="60%">
            <div class="container">
                <div class="form-box">
                    <el-form :model="addForm" label-width="110px">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="上级机构" v-if="!addForm.id">
                                    <el-input readonly v-model="addForm.parentOrgName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="机构名称">
                                    <el-input v-model="addForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="所属行业">
                                    <el-select v-model="addForm.tradeId" placeholder="请选择">
                                        <el-option
                                            v-for="(item, index) in tradeList"
                                            :key="index"
                                            :label="item.name"
                                            :value="item.id"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所属地区">
                                    <el-select v-model="addForm.zoneId" placeholder="请选择">
                                        <el-option
                                            v-for="(item, index) in zoneList"
                                            :key="index"
                                            :label="item.name"
                                            :value="item.id"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="法人代表">
                                    <el-input v-model="addForm.legalPerson"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="法人代码">
                                    <el-input v-model="addForm.legalCode"></el-input>
                                </el-form-item>
                                <el-form-item label="企业性质">
                                    <el-input v-model="addForm.property"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="企业地址">
                                    <el-input v-model="addForm.address"></el-input>
                                </el-form-item>
                                <el-form-item label="企业人数">
                                    <el-input v-model="addForm.population"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人姓名">
                                    <el-input v-model="addForm.contact"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人电话">
                                    <el-input v-model="addForm.phone"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item style="text-align: center;margin-top: 20px;">
                            <el-button type="primary" @click="onSubmit">确认</el-button>
                            <el-button @click="addVisible = false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>
        <!-- 设备信息 -->
        <el-dialog title="设备信息" :visible.sync="detailVisible" width="90%">
            <div class="container">
                <el-table
                    :data="orgData"
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
                    <el-table-column prop="terminalNumber" label="连接的终端"></el-table-column>
                    <el-table-column prop="org.name" label="所属机构"></el-table-column>
                    <el-table-column prop="type" label="设备类型">
                      <template scope="scope">
                         {{format(scope.row.type)}}
                      </template>
                      </el-table-column>
                    <el-table-column prop="productDevice.name" label="关联的产污设备"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                icon="el-icon-search"
                                @click="handleHistory(scope.row)"
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
import { queryOrgList, queryTradeList, queryZoneList, addOrg, removeOrg, updateOrg, allDeviceListForOrg, allDeviceListSumForOrg } from '@/api/baseInfo';
import { log } from 'util';
export default {
  data() {
    return {
      orgList: [],
      selectRow: {},
      addVisible: false,
      addForm: {},
      tradeList: [],
      zoneList: [],
      title: '',
      startOrg: 1,
      endOrg: 3,
      pageSizeOrg: 3,
      sumTradeOrg: '',
      currentPageOrg: 1,
      orgData: [],
      detailVisible: false
    };
  },
  created() {
    this.getData();
    this.queryTradeList()
    this.queryZoneList()
  },
  methods: {
    handleHistory(row){

    },
    format(type){
      console.log('-----type', type);
      
       return type == 1 ? '治污设备':'产污设备'
    },
    handleEquip() {
      if (JSON.stringify(this.selectRow) == '{}') {
        this.$message.warning('请首先选定一个机构！')
      } else {
        allDeviceListForOrg(this.selectRow.id, this.startOrg, this.endOrg).then(res => {
          if (res.success) {
            this.orgData = res.object
            this.allDeviceListSumForOrg()
            this.detailVisible = true
          }
        })
      }
    },
    allDeviceListSumForOrg() {
      allDeviceListSumForOrg(this.selectRow.id).then(res => {
        if (res.success) {
          this.sumTradeOrg = res.object
        }
      })
    },
    // 分页导航
    handlePageChangeOrg(val) {
      this.startOrg = this.pageSizeOrg * (val - 1) + 1
      this.endOrg = this.pageSizeOrg * val
      this.currentPageOrg = val
      this.handleEquip()
    },
    handleEdit() {
      if (JSON.stringify(this.selectRow) == '{}') {
        this.$message.warning('请首先选定一个机构！')
      } else {
        this.title = '编辑'
        this.addForm = {
          id: this.selectRow.id,
          tradeId: this.selectRow.trade.id,
          zoneId: this.selectRow.zone.id,
          parentOrgId: this.selectRow.id,
          name: this.selectRow.name == 'undefined' ? "" : this.selectRow.name,
          legalPerson: this.selectRow.legalPerson == 'undefined' ? "" : this.selectRow.legalPerson,
          property: this.selectRow.property == 'undefined' ? "" : this.selectRow.property,
          legalCode: this.selectRow.legalCode == 'undefined' ? "" : this.selectRow.legalCode,
          address: this.selectRow.address == 'undefined' ? "" : this.selectRow.address,
          population: this.selectRow.population == 'undefined' ? "" : this.selectRow.population,
          contact: this.selectRow.contact == 'undefined' ? "" : this.selectRow.contact,
          phone: this.selectRow.phone == 'undefined' ? "" : this.selectRow.phone,
        }
        this.addVisible = true
      }
    },
    handleDel() {
      if (JSON.stringify(this.selectRow) == '{}') {
        this.$message.warning('请首先选定一个机构！')
      } else {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          removeOrg(this.selectRow.id).then(res => {
            if (res.success) {
              this.$message.success('删除成功')
              this.getData()
            } else {
              this.$message.error(res.message)
            }
          })
        }).catch(() => { });
      }
    },
    queryTradeList() {
      queryTradeList('', '', '').then(res => {
        if (res.success) {
          this.tradeList = res.object
        }
      })
    },
    queryZoneList() {
      queryZoneList('', '', '').then(res => {
        if (res.success) {
          this.zoneList = res.object
        }
      })
    },
    handleAdd() {
      if (JSON.stringify(this.selectRow) == '{}') {
        this.$message.warning('请首先选定一个上级机构！')
      } else {
        this.title = '新增'
        this.addForm = {}
        let tradeId = ''
        let zoneId = ''
        if (this.tradeList[0].id && this.zoneList[0].id) {
          tradeId = this.tradeList[0].id
          zoneId = this.zoneList[0].id
        }
        this.addForm = {
          parentOrgId: this.selectRow.id,
          parentOrgName: this.selectRow.name,
          tradeId: tradeId,
          zoneId: zoneId
        }
        this.addVisible = true
      }
    },
    onSubmit() {
      if (!this.addForm.name) {
        this.$message.warning('机构名称不能为空')
        return
      }
      if (this.addForm.id) {
        updateOrg(this.addForm).then(res => {
          if (res.success) {
            this.$message.success('保存成功')
            this.addVisible = false
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        addOrg(this.addForm).then(res => {
          if (res.success) {
            this.$message.success('保存成功')
            this.addVisible = false
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    getData() {
      queryOrgList('', 1, 9999).then(res => {
        if (res.success) {
          if (res.object && res.object.length > 0) {
            this.orgList = this.toTree(res.object)
          }
        }
      })
    },
    //转为树
    toTree(data) {
      let result = []
      if (!Array.isArray(data)) {
        return result
      }
      data.forEach(item => {
        delete item.children;
      });
      let map = {};
      data.forEach(item => {
        map[item.id] = item;
      });
      data.forEach(item => {
        item.label = item.name;
        let parent = map[item.parentId];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      return result;
    },
    handleNodeClick(data) {
      this.selectRow = data
    }
  }
};
</script>

<style scoped>
</style>
