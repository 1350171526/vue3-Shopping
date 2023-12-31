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

  // 合并购物车
  export const mergeCartAPI = (data) => {
    return request({
      url: '/member/cart/merge',
      method: 'POST',
      data
    })
  }

  // 修改购物车商品
  export const reviseCartAPI = ({id,count,selected}) =>{
    return request({
      url: `/member/cart/${id}`,
      method: 'PUT',
      data:{
        count,
        selected
      }
    })
  }