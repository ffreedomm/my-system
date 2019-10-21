<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">物联网数据终端管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="name">
                    <el-input v-model="param.name" placeholder="请输入用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <div style="display: flex;">
                    <el-input
                        style="width: 50%;"
                        placeholder="请输入验证码"
                        v-model="param.code"
                        @keyup.enter.native="submitForm()"
                    >
                    </el-input>
                    <img @click="changeCode()" :src="codeImg" width="40%" height="30px" style="padding-left: 9%;"/>
                  </div>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { getNewCheckCode,loginForUser} from '@/api/index';
export default {
    data: function() {
        return {
            imgBaseUrl:'https://video1.dushuren123.com/iotserver/CheckCodeImage?id=',
            codeImg: '',
            param: {
                name: '',
                password: '',
                code: '',
            },
            rules: {
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
            },
        };
    },
    created(){
      this.GetNewCheckCode()
    },
    methods: {
      changeCode(){
        this.GetNewCheckCode()
      },
      //存储sessionId
        GetNewCheckCode(){
          getNewCheckCode().then(res=>{
            if(res.success){
              localStorage.setItem('sessionId', res.object.sessionId);
              this.codeImg = this.imgBaseUrl+ res.object.sessionId;
            }
          })
        },
        submitForm() {
            this.$refs.login.validate(valid => {
              if (valid) {
                    this.param.sessionId = localStorage.getItem('sessionId')
                    loginForUser(this.param).then(res=>{
                      if(res.success){
                        this.$message.success('登录成功');
                        localStorage.setItem('username', res.object.name);
                        localStorage.setItem('id', res.object.id);
                        localStorage.setItem('role', res.object.role);
                        localStorage.setItem('loginPassword', res.object.loginPassword);
                        this.$router.push('/dashboard');
                      }else{
                        //success，error，info，warning
                         this.$message.warning(res.message);
                      }
                    })
                } else {
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #000;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>