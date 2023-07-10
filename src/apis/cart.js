import request from '@/utils/http'
// 封装购物车相关接口
// 加入购物车
export const insertCartAPI = ({ skuId, count }) => {
    return request({
      url: '/member/cart',
      method: 'POST',
      data: {
        skuId,
        count
      }
    })
  }

// 获取最新的购物车列表
  export const findNewCartListAPI = () => {
    return request ({
        url: '/member/cart'
    })
  }

  // 删除接口
  export const delCartAPI = (ids) => {
    return request({
      url: '/member/cart',
      method: 'DELETE',
      data: {
        ids
      }
    })
  }