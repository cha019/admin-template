import pinia from '@/store'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore(pinia)

export const isHasButton = (app: any) => {
  // 全局自定义指令：实现按钮的权限控制
  app.directive('has', {
    // 使用这个全局自定义指令的DMO|组件挂载完毕的时候会执行一次
    mounted(el: any, options: any) {
      // 不存在，从DOM树上干掉
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
