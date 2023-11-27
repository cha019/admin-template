// 进行axios二次封装：使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'

// 创建axios对象，进行基础配置（base_api，timeout）
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

// 请求拦截器
request.interceptors.request.use((config) => {
  // config: headers属性请求头，给服务器端携带公共参数
  // 获取用户相关的仓库里面的token，登陆成功之后请求携带给服务器
  let userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功回调
    return response.data
  },
  (error) => {
    // 失败回调：处理http网络错误
    let message = ''
    let status = error.response.status
    switch (status) {
      case 401:
        message = 'Token 过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现错误'
        break
    }
    // 提示错误信息
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(error)
  },
)

export default request
