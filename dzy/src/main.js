// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store/index.js'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

//将axios注册vue实例
Vue.prototype.axios = axios;
//将element-ui注册vue实例
Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

// router.beforeEach((to, from, next) => {
//   if (to.path == "/admin") {
//     if (store.state.user.uid !== null) {
//       next();
//     } else {
//       alert("！！！！非法入侵 ！！！！");
//       next('/');
//     }
//   } else {
//     if (store.state.user.uid !== null) {
//       next();
//     } else {
//       alert("！！！！Please enter your account password！！！！");
//       next('/');
//     }
//   }
// });