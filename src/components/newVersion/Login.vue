<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名" auto-complete="false"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" auto-complete="false"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="code">
        <el-input type="text" v-model="loginForm.code" placeholder="点击图片更换验证码" auto-complete="false" 
        style="width:70%;margin-rigth:0.31rem;float: left"></el-input>
        <img :src="captchaUrl"/>
      </el-form-item> -->
        <el-checkbox v-model="checked" class="loginRemember" style="display: block">记住我</el-checkbox>
      <el-form-item>
        <el-button type="primary" style="width:100%" @click="submitLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: 12345
      },
      captchaUrl: '',
      checked: true,
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      }
    }
  },
  methods: {
    submitLogin() {
       this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$message.success('登录成功');
            this.$router.push("/newHome")
          } else {
            this.$message.error('登录失败');
            return false;
          }
        })
    }
  }
}
</script>
<style>
.login-container{
  border-radius: 0.94rem;
  background-clip: border-box;
  margin: 11.25rem auto;
  width: 20%;
  padding: 0.94rem 2.19rem 0.94rem 2.19rem;
  background-color: #fff;
  border: 1px solid #eaeaea;
  box-shadow:  0 0 25px #cac6c6;
}
.loginTitle{
  margin: 0 auto 2.5rem auto;
  text-align: center;
}
.loginRemember{
  text-align: left;
  margin: 0px 0px 2rem 0px;
}
</style>
