import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI ,{Message,Loading,MessageBox} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import _ from 'lodash';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

axios.defaults.baseURL = 'http://192.168.75.21:9999/';//配置请求的根路径

//loading对象
let loading;
//当前正在请求的数量
let needLoadingRequestCount = 0;

//显示loading
function showLoading(target) {
  // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
  // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
  if (needLoadingRequestCount === 0 && !loading) {
    loading = Loading.service({
      lock: true,
      text: "Loading...",
      background: 'rgba(255, 255, 255, 0.5)',
      target: target || "body"
    });
  }
  needLoadingRequestCount++;
}

//隐藏loading
function hideLoading() {
  needLoadingRequestCount--;
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); //做个保护
  if (needLoadingRequestCount === 0) {
    //关闭loading
    toHideLoading();
  }
}

//防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
var toHideLoading = _.debounce(()=>{
  loading.close();
  loading = null;
}, 300);

axios.interceptors.request.use(config => {
  if (config.url.indexOf("auth/oauth/token") !== -1) {
    config.headers.Authorization = "Basic YWxsb3k6YWxsb3k=";
  } else {
    config.headers.Authorization = "Bearer " + window.sessionStorage.getItem('token')
  }
  if(config.headers.showLoading !== false){
    showLoading(config.headers.loadingTarget);
  }
  return config;
}, err => {
  //判断当前请求是否设置了不显示Loading
  if(config.headers.showLoading !== false){
    hideLoading();
  }
  Message.error('请求超时!');
  return Promise.resolve(err);
});


//响应拦截器
axios.interceptors.response.use(
  response => {
    //判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if(response.config.headers.showLoading !== false){
      hideLoading();
    }
    return response;
  },
  error => {
    //判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if(error.config.headers.showLoading !== false){
      hideLoading();
    }
    if (error && error.response) {
      switch (error.response.status) {
        case 400: error.message = '请求参数错误(400)'; break;
        case 401: this.$router.push('/login'); break;
        case 403: error.message = '拒绝访问(403)'; break;
        case 404: error.message = '请求地址不存在(404)'; break;
        case 408: error.message = '请求超时(408)'; break;
        case 500: error.message = '服务器错误(500)'; break;
        case 501: error.message = '服务未实现(501)'; break;
        case 502: error.message = '网络错误(502)'; break;
        case 503: error.message = '服务不可用(503)'; break;
        case 504: error.message = '网络超时(504)'; break;
        case 505: error.message = 'HTTP版本不受支持(505)'; break;
        default: error.message = `连接出错(${error.response.status})!`;
      }
      Message.error(error.message);
    }else if(error.response.data && error.response.data.message){
      Message.error(JSON.parse(error.response.data.message).message);
    } else {
      Message.error('连接服务器失败!');
    }
    return Promise.reject(error);
  }
);


Vue.use(ElementUI);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
