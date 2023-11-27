import { createApp } from 'vue'
import App from '@/App.vue'

// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入element-plus国际化
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 引入svg图标所需要的插件
import 'virtual:svg-icons-register'
// 引入全局组件插件
import gloablComponent from '@/components/index'
// 引入暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入模版全局样式
import '@/styles/index.scss'
// 引入路由
import router from '@/router'
// 引入仓库
import pinia from './store'
// 引入路由鉴权文件
import './permission'
// 引入自定义指令文件
import { isHasButton } from '@/directive/has'

// 获取应用实例对象
const app = createApp(App)

// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn, // 国际化配置
})
// 安装全局组件插件
app.use(gloablComponent)
// 注册模版路由
app.use(router)
// 安装仓库
app.use(pinia)
// 全局自定义指令
isHasButton(app)

// -----

// 将应用挂载到挂载点上
app.mount('#app')
