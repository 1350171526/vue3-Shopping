//  createRouter ：创建router实例对象
// createWebHistory：创建history模式得路由

import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'
import Home from '@/views/Home/index.vue'
import Category from '@/views/Category/index.vue'
import subCategory from '@/views/subCategory/index.vue'
import Detail from '@/views/Detail/index.vue'
import CartList from '@/views/CartList/index.vue'
import Checkout from '@/views/Checkout/index.vue'
import Pay from '@/views/Pay/index.vue'
import PayBack from '@/views/Pay/PayBack.vue'
import Member from '@/views/Member/index.vue'
import UserInfo from '@/views/Member/components/UserInfo.vue'
import UserOrder from '@/views/Member/components/UserOrder.vue'
import Person from '@/views/Member/components/Person.vue'
import MyAddress from '@/views/Member/components/MyAddress.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   {
    path: '/',
    component: Layout,
    children:[
      {
        path: '',
        component: Home,
        meta:{
          title: '首页-'
        }
      },
      {
        path: 'category/:id',
        component: Category
      },
      {
        path: 'category/sub/:id',
        component: subCategory
      },
      {
        path: 'detail/:id',
        component: Detail
      },
      {
        path: 'cartlist',
        component: CartList,
        meta:{
          title: '购物车-'
        }
      },
      {
        path: 'checkout',
        component: Checkout,
        meta:{
          title: '结算-'
        }
      },
      {
        path: 'pay',
        component: Pay,
        meta:{
          title: '支付-'
        }
      },
      {
        path: 'paycallback',
        component: PayBack
      },
      {
        path: 'member',
        component: Member,
        children:[
          {
            path: '',
            component: UserInfo,
            meta:{
              title: '个人中心-'
            }
          },
          {
            path: 'order',
            component: UserOrder,
            meta:{
              title: '我的订单-'
            }
          },
          {
            path: 'person',
            component: Person,
            meta:{
              title: '会员中心-'
            }
          },
          {
            path: 'myaddress',
            component: MyAddress,
            meta:{
              title: '地址管理-'
            }
          }
        ]
      }
    ]
   },
   {
    path: '/login',
    component: Login,
    meta:{
      title: '登录-'
    }
   }
  ],
  // 路由行为配置项 （切换路由时滚动条切换到最上方）
  scrollBehavior () {
    return {
      top: 0
    }
  }
})
router.beforeEach(async(to) => {
  const title = (to.meta.title ? to.meta.title : '') + '乐天商城'
  document.title = title
})

export default router
