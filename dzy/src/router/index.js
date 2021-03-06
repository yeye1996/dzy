import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/components/login')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/components/home')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/components/admin')
    }
  ]
})
