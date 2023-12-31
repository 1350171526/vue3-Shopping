// 管理用户数据相关

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/apis/user'
import { useCartStore } from './cartStore'
import { mergeCartAPI } from '@/apis/cart'
import { postCodeAPI } from '@/apis/user'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const cartStore = useCartStore()
  // 1. 定义管理用户数据的state
  const userInfo = ref({})
  // 2. 定义获取接口数据的action函数
  const getUserInfo = async ({ account, password }) => {
    const res = await loginAPI({ account, password })
    userInfo.value = res.result
    // 合并购物车操作
    await mergeCartAPI(cartStore.cartList.map(item=>{
      return{
        skuId: item.skuId,
        selected: item.selected,
        count: item.count
      }
    }))
    await cartStore.updateNewList()
    // 1. 提示用户
    ElMessage({ type: 'success', message: '登录成功' })
    router.replace({ path: '/' })
  }
  // 2. 定义获取接口数据的action函数
  const getUserInfo1 = async ({ mobile, code }) => {
    const res = await postCodeAPI({ mobile, code })
    userInfo.value = res.result
    // 合并购物车操作
    await mergeCartAPI(cartStore.cartList.map(item=>{
      return{
        skuId: item.skuId,
        selected: item.selected,
        count: item.count
      }
    }))
    await cartStore.updateNewList()
    // 1. 提示用户
    ElMessage({ type: 'success', message: '登录成功' })
    // 2. 跳转首页
    router.replace({ path: '/' })

  }
   // 退出时清除用户信息
   const clearUserInfo = () => {
    userInfo.value = {}
    // 清除购物车
    cartStore.clearCart()
  }
  
  // 3. 以对象的格式把state和action return
  return {
    userInfo,
    getUserInfo,
    clearUserInfo,
    getUserInfo1
  }
}, {
  // 持久化存储
  persist: true,
})