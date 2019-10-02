<template>
    <div class="container">
        <div class="form-box">
            <el-form :model="form" :rules="rules" ref="edit" label-width="80px">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input type="password" v-model="form.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="form.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="surePassword">
                    <el-input type="password" v-model="form.surePassword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">修改</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {updatePassword} from '@/api/index';
export default {
  name: 'baseform',
  data() {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        surePassword: '',
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        surePassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.edit.validate(valid => {
        if (valid) {
          if(localStorage.getItem('loginPassword') !== this.form.oldPassword){
            this.$message.error('旧密码不正确');
            return false
          }
          if(this.form.newPassword !== this.form.surePassword){
            this.$message.error('新密码和确认密码不相同');
            return false
          }
          updatePassword(localStorage.getItem('id'), this.form.oldPassword, this.form.newPassword).then(res=>{
            if(res.success){
              this.$message.success('修改成功！')
               localStorage.removeItem('username');
              localStorage.removeItem('id');
              localStorage.removeItem('role');
              localStorage.removeItem('loginPassword');
              this.$router.push('/login');
            }else{
              this.$message.error(res.message)
            }
          })
        }else {
          return false
        }
      })
      //  localStorage.getItem('loginPassword')
      // 
    },
    reset(){
      this.form = {}
    }
  }
};
</script>