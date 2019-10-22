<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="name" placeholder="用户姓名" class="handle-input mr10"></el-input>
                <el-select v-model="role" placeholder="用户角色">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-button
                    style="margin-left: 10px;"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleSearch"
                >查询</el-button>
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
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="name" label="用户姓名"></el-table-column>
                <el-table-column prop="gender" label="性别"></el-table-column>
                <el-table-column prop="role" label="角色">
                    <template slot-scope="scope">{{ fomart(scope.row.role)}}</template>
                </el-table-column>
                <el-table-column prop="org.name" label="所属机构"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
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
        <el-dialog :title="title" :visible.sync="addVisible" width="50%">
            <el-form :model="userForm" :rules="rules" ref="user" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="用户姓名" prop="name">
                            <el-input v-model="userForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="登录名" prop="loginName">
                            <el-input v-model="userForm.loginName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户角色" prop="role">
                            <el-select
                                v-model="userForm.role"
                                placeholder="请选择"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="用户性别" prop="gender">
                            <el-select
                                v-model="userForm.gender"
                                placeholder="请选择"
                                style="width: 100%"
                            >
                                <el-option label="男" value="男"></el-option>
                                <el-option label="女" value="女"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登录密码" prop="loginPassword">
                            <el-input type="password" v-model="userForm.loginPassword"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属机构" prop="orgId">
                        <treeselect
                            style="width:90%"
                            v-model="userForm.orgId"
                            :options="orgList"
                            :default-expand-level="2"
                            placeholder="请选择"
                        />
                        <!-- <el-select
                                v-model="userForm.orgId"
                                placeholder="请选择"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in orgList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                        </el-select>-->
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { queryUserList, queryUserListSum, queryOrgList, addUser, updateUser, removeUser } from '@/api/baseInfo';
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      options: [{
        value: '1',
        label: '系统管理员'
      }, {
        value: '2',
        label: '环保局用户'
      }, {
        value: '3',
        label: '企业用户'
      }],
      name: '',
      role: '',
      start: 1,
      end: 3,
      pageSize: 3,
      sumTrade: 0,
      currentPage: 1,
      tableData: [],
      title: '新增',
      addVisible: false,
      userForm: {},
      orgList: [],
      rules: {
        name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        role: [{ required: true, message: '请选择用户角色', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择用户性别', trigger: 'blur' }],
        orgId: [{ required: true, message: '请选择所属机构', trigger: 'blur' }],
        loginName: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        loginPassword: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getData()
    this.queryOrgList()
  },
  methods: {
    handleEdit(row) {
      this.title = '编辑'
      this.userForm = {
        id: row.id,
        name: row.name,
        role: row.role,
        gender: row.gender,
        loginName: row.loginName,
        loginPassword: row.loginPassword,
        orgId: row.org.id,
      }
      this.addVisible = true
    },
    queryOrgList() {
      queryOrgList('', 1, 9999).then(res => {
        if (res.success) {
          this.orgList = this.toTree(res.object)
        }
      })
    },
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
    fomart(role) {
      if (role == 1) {
        return '系统管理员'
      } else if (role == 2) {
        return '环保局用户'
      } else if (role == 3) {
        return '企业用户'
      }
    },
    getData() {
      queryUserList(this.name, this.role, this.start, this.end).then(res => {
        if (res.success) {
          this.tableData = res.object
          this.queryUserListSum()
        }
      });
    },
    handlePageChange(val) {
      this.start = this.pageSize * (val - 1) + 1
      this.end = this.pageSize * val
      this.currentPage = val
      this.getData()
    },
    queryUserListSum() {
      queryUserListSum(this.name, this.role).then(res => {
        if (res.success) {
          this.sumTrade = res.object
        }
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.getData()
    },
    handleAdd() {
      this.title = '新增'
      this.userForm = {}
      this.addVisible = true
    },
    saveEdit() {
      this.$refs.user.validate(valid => {
        if (valid) {
          if (this.userForm.id) {
            updateUser(this.userForm).then(res => {
              if (res.success) {
                this.$message.success('保存成功')
                this.addVisible = false
                this.getData()
              } else {
                this.$message.warning(res.message)
              }
            })
          } else {
            addUser(this.userForm).then(res => {
              if (res.success) {
                this.$message.success('保存成功')
                this.addVisible = false
                this.getData()
              } else {
                this.$message.warning(res.message)
              }
            })
          }
        } else {
          return false;
        }
      })
    },

    // 删除操作
    handleDelete(row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        removeUser(row.id).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
            this.getData()
          } else {
            this.$message.warning(res.message)
          }
        })
      }).catch(() => { });
    },
  }
};
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
