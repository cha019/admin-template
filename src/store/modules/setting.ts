// 小仓库：layout组件相关配置仓库
import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('LayoutSetting', {
  state: () => {
    return {
      fold: false, // 用户控制菜单折叠还是收起控制
      refresh: false, // 仓库的这个属性用户控制刷新效果
    }
  },
})

export default useLayoutSettingStore
