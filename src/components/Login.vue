<template>
  <div>
    <b-form  @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-1" label="用户名:" label-for="input-1"
                    description="We'll never share your account with anyone else.">
        <b-form-input
          id="input-1"
          v-model="form.username"
          placeholder="Enter account"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="密码:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">登陆</b-button>
      <b-button type="reset" variant="danger">重置</b-button>
    </b-form>
  </div>
</template>


<script>
import {encryption} from "../util/util.js";

export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      show: true
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      const user = encryption({
        data: this.form,
        key: 'swordfish..steak',
        param: ['password']
      });
      this.$http.post("auth/oauth/token?username=" + user.username + "&password=" + user.password + "&grant_type=password&scope=server")
        .then(res => {
          if (res.data.code !== 0) {
            this.$message.error('登陆失败！');
          } else {
            this.$message.success('登陆成功！');
            window.sessionStorage.setItem("token", res.data.data.access_token);
            this.$router.push("/home");
          }
        }).catch(error => {
        this.$message.error(error.response === undefined ? error.message : error.response.data.msg);
      });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.username = '';
      this.form.password = '';
      this.show = false;
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>

<style>
  .form {
    width: 100%;
    text-align: left;
    padding-left: 40%;
    padding-right: 40%;
    padding-top: 50px;
  }
</style>
