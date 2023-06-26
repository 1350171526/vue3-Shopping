//  createRouter ：创建router实例对象
// createWebHistory：创建history模式得路由

import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'
import Home from '@/views/Home/index.vue'
import Category from '@/views/Category/index.vue'
import subCategory from '@/views/subCategory/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   {
    path: '/',
    component: Layout,
    children:[
      {
        path: '',
        component: Home
      },
      {
        path: 'category/:id',
        component: Category
      },
      {
        path: 'category/sub/:id',
        component: subCategory
      }
    ]
   },
   {
    path: '/login',
    component: Login
   }
  ],
  // 路由行为配置项 （切换路由时滚动条切换到最上方）
  scrollBehavior () {
    return {
      top: 0
    }
  }
})

export default router
