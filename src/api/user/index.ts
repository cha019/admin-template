// 统一管理用户相关的接口
// 发请求就需要 request
import request from '@/utils/request'
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from './type'

// 用户相关的接口
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

// 暴露请求函数
// 登入的接口方法
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
// 获取用户信息的接口方法
export const reqUserInfo = () =>
  request.get<any, userInfoReponseData>(API.USERINFO_URL)
//退出登入的接口
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
