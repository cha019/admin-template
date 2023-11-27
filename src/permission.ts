// 路由鉴权（某一个路由什么条件下可以访问、什么条件下不可以访问）
import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
//获取用户相关的小仓库内部token数据,去判断用户是否登录成功（此文件非组件，是外部文件，访问小仓库比较引入pinia）
import pinia from './store'
import useUserStore from './store/modules/user'
import setting from './setting'

// 关闭进度条加载动态
nprogress.configure({ showSpinner: false })

let userStore = useUserStore(pinia)

// 全局守卫：项目中任务路由切换都会触发的钩子
// 全局的前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  // 配置不同路由访问的title名
  document.title = `${setting.title} - ${to.meta.title}`

  // 访问某一个路由之前的守卫
  nprogress.start()

  let token = userStore.token
  let username = userStore.username

  if (token) {
    //用户登录判断
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userInfo()

          // 解决异步路由还没有加载完时放行导致的白屏，使用 next({...to})
          // replace: true只是一个设置信息，告诉VUE本次操作后，不能通过浏览器后退按钮，返回前一个路由 next({...to, replace: true})
          next({ ...to })
        } catch (error) {
          // token过期:获取不到用户信息了，用户手动修改本地存储token（退出登录->用户相关的数据清空）
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //用户未登录判断
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局的后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

// 路由鉴权(路由组件访问权限的设置)
// 全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

// 用户未登录:可以访问login,其余六个路由不能访问(指向login)
// 用户登录成功:不可以访问login[指向首页],其余的路由可以访问
