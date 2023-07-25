import { getAddressAPI } from '@/apis/checkout'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGetAddressStore = defineStore('address', () => {
    const addressInfo = ref({})
    const curAddress = ref({})
    const getAddress = async () =>{
    const res = await getAddressAPI()
    addressInfo.value = res.result
    // 适配默认地址 从地址列表筛选出来 isdefault ===0 的项
    const item = addressInfo.value.find(item => item.isDefault === 0)
    curAddress.value = item
    }

    return{
      curAddress,
      getAddress,
      addressInfo,
    }
})