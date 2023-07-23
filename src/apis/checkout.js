import request from '@/utils/http'
/**
 * 获取结算信息
 */
export const getCheckoutInfoAPI = () => {
  return request({
    url:'/member/order/pre'
  })
}

// 创建订单
export const createOrderAPI = (data) => {
  return request({
    url: '/member/order',
    method: 'POST',
    data
  })
}
// 添加地址
export const addAddressAPI = (data) => {
  return request({
    url: '/member/address',
    method: 'POST',
    data
  })
}

// 删除地址
export const delAddressAPI = (id) => {
  return request({
    url: `/member/address/${id}`,
    method: 'DELETE'
  })
}

// 修改地址
// export const reviseAddressAPI = (id,data) => {
//   return request({
//     url: `/member/address/${id}`,
//     method: 'PUT',
//     data
//   })
// }

// 获取地址
export const getAddressAPI = () => {
  return request({
    url: '/member/address'
  })
}