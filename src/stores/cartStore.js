// 封装购物车模块

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import { insertCartAPI, findNewCartListAPI,delCartAPI,reviseCartAPI } from '@/apis/cart'

export const useCartStore = defineStore('cart', () => {
  const useStore = useUserStore()
  const isLogin = computed(() => useStore.userInfo.token)
  // 1. 定义state - cartList
  const cartList = ref([])
  // 获取最新购物车列表
  const updateNewList = async () => {
    const res = await findNewCartListAPI()
    cartList.value = res.result
  }
  // 2. 定义action - addCart
  const addCart = async (goods) => {
    const { skuId, count } = goods
    // 登录
    if (isLogin.value) {
      // 登录之后的加入购车逻辑
      await insertCartAPI({ skuId, count })
      updateNewList()
    }else{
    // console.log('添加', goods)
    // 添加购物车操作
    // 已添加过 - count + 1
    // 没有添加过 - 直接push
    // 思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到了就是添加过
    const item = cartList.value.find((item) => goods.skuId === item.skuId)
    if (item) {
      // 找到了
      item.count++
    } else {
      // 没找到
      cartList.value.push(goods)
    }
    }
    
  }

// 修改购物车内容
const adviseCart = async(goods) => {
  const {id,count,selected} = goods
  if(isLogin.value){
    await reviseCartAPI({id,count,selected})
  }
}


// 删除购物车
  const delCart = async (skuId) =>{
    if(isLogin.value){
      // 调用接口实现购物车中的删除功能
      await delCartAPI([skuId])
      updateNewList()
    }else{
    // 找到删除项的下标值
    const idx = cartList.value.findIndex((item) => skuId === item.skuId)
    cartList.value.splice(idx,1)
    }
    
  }

  // 退出登录时 清除购物车信息
  const clearCart = () =>{
    cartList.value=[]
  }



  // 计算属性
  // 1.总的数量 所有相的count之和
  const allCount = computed(()=> cartList.value.reduce((a,c) => a+c.count,0))
  // 2，总价 所有项的count*price之和
  const allPrice = computed(()=> cartList.value.reduce((a,c) => a+c.count*c.price,0))

// 单选框双向绑定功能
  const singleCheck = async(skuId,selected) =>{
    // 通过skuId找到修改的那一项 然后把他的selected修改为传过来的selected
    const item = cartList.value.find((item) => item.skuId === skuId)
    item.selected = selected
    if(isLogin.value){
      await reviseCartAPI({id:skuId,selected,count:item.count})
    }
    
  }

  // isAll是否全选
  const isAll = computed(() => cartList.value.every((item) => item.selected))

  // 全选功能
  const allCheck = (selected) => {
    cartList.value.forEach(async(item) => {
      item.selected = selected
      if(isLogin.value){
        await reviseCartAPI({id:item.skuId,selected:item.selected,count:item.count})
      }
      
    })
  }

  // 已选择数量
  const selectedCount = computed (() => cartList.value.filter(item => item.selected).reduce((a,c) => a+c.count,0))
  // 已选择商品价格总和
  const selectedPrice = computed (() => cartList.value.filter(item => item.selected).reduce((a,c) => a+c.count*c.price,0))

  return {
    cartList,
    addCart,
    delCart,
    allCount,
    allPrice,
    singleCheck,
    isAll,
    allCheck,
    selectedCount,
    selectedPrice,
    clearCart,
    updateNewList,
    isLogin,
    adviseCart
  }
}, {
    // 持久化存储
  persist: true,
})