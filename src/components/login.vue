<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box"><img src='../assets/logo.png' alt=""></div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login_form">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password">></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { encryption } from "../util/util.js";
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          {required: true, message: '请输入登陆名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    resetLoginForm() {
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;

        const user = encryption({
          data: this.loginForm,
          key: 'swordfish..steak',
          param: ['password']
        });
        const {data: res} = await this.$http.post("auth/oauth/token?username=" + user.username + "&password=" + user.password + "&grant_type=password&scope=server");
        if (res.code !== 0) return this.$message.error('登陆失败！');
        this.$message.success('登陆成功！');
        window.sessionStorage.setItem("token", res.data.access_token);
        this.$router.push("/home");
      })
    }
  }


}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6d;
    height: 100%
  }

  .login_box {
    width: 450px;
    height: 320px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 0 #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  }
  }

  .btns {
    display: flex;
    justify-content: flex-end;

  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
