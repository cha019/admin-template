/// <reference types="vite/client" />

// 解决ts不识别.vue后缀文件的方法
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
