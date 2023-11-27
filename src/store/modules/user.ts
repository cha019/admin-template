// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
import {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from '@/api/user/type'
// 引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import router from '@/router'
import { constantRouter, asyncRouter, anyRouter } from '@/router/routers'
import type { UserState } from './types/type'
// @ts-ignore (lodash 常用JS库，用于操作数组)
import cloneDeep from 'lodash/cloneDeep'

// 创建用户小仓库
let useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRouters: constantRouter,
      username: '',
      avatar: '',
      userAsyncRouter: [],
      buttons: [],
    }
  },
  // 异步、逻辑处理的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      // 登录请求
      let result: loginResponseData = await reqLogin(data)
      if (result.code == 200) {
        // 成功 200
        this.token = result.data as string
        // 本地持久化存储
        SET_TOKEN(result.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },

    // 获取用户信息的方法
    async userInfo() {
      // 获取用户的信息进行存储仓库（用户名字，头像）
      let result: userInfoReponseData = await reqUserInfo()
      // 获取用户信息成功就存储
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons

        // 菜单权限控制
        let userAsyncRouter = filterAsyncRoute(
          cloneDeep(asyncRouter),
          result.data.routes,
        )
        this.userAsyncRouter = [...userAsyncRouter, ...anyRouter]
        this.menuRouters = [...constantRouter, ...userAsyncRouter]
        ;[...userAsyncRouter, ...anyRouter].forEach((route: any) => {
          router.addRoute(route)
        })

        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // 退出登录
    async userLogout() {
      let result: any = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        // 清空路由配置权限
        this.userAsyncRouter.forEach((route: any) => {
          router.removeRoute(route.name)
        })
        this.userAsyncRouter = []
        this.menuRouters = []
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

// 菜单权限控制：过滤路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

export default useUserStore
