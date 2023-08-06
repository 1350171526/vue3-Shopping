// 封装和用户相关的接口函数
import request from '@/utils/http'

export const loginAPI = ({ account, password }) =>{
    return request ({
        url: '/login',
        method: 'POST',
        data: {
            account,
            password
        }
    })
}
export const getLikeListAPI = ({ limit = 4 }) => {
    return request({
      url:'/goods/relevant',
      params: {
        limit 
      }
    })
  }

export const getCodeAPI = (mobile) => {
  return request({
    url: '/login/code',
    params:{
      mobile
    }
  })
}

export const postCodeAPI = ({mobile,code}) => {
  return request({
    url: '/login/code',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}