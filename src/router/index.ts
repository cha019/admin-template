// 通过vue-router插件实现模版路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRouter } from './routers'

// 创建路由器
let router = createRouter({
  // 路由模式
  history: createWebHashHistory(),
  routes: constantRouter,
  // 加载滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router

// 开发菜单权限

// 1. 第一步：拆分路由
//         - 静态（常量）路由：大家都可以拥有的路由
//         - 异步路由：不同角色拥有的不同的路由
//         - 任意路由
