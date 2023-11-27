<script setup lang="ts">
import { ref } from 'vue'
// 获取layout配置相关的仓库
import useLayoutSettingStore from '@/store/modules/setting'
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'

let layoutSettingStore = useLayoutSettingStore()
let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()

const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

const fullScreen = () => {
  // Dom对象的一个属性：可以用来判断当前是不是全屏模式【true: 全屏, false: 不是全屏】
  let full = document.fullscreenElement
  if (!full) {
    // 文档根节点的方法requestFullscreen，实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const logout = async () => {
  // 1. 向服务器发送退出请求
  // 2. 清空仓库中用户相关数据
  // 3. 跳转到登录界面
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

// ----- 设置 -----
// 颜色组件
const color = ref('rgba(255, 69, 0, 0.68)')

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

const setColor = () => {
  // 获取根节点
  const el = document.documentElement

  el.style.setProperty('--el-color-primary', color.value)
}

// 开关 | 暗黑模式切换
let dark = ref<boolean>(false)

const changeDark = () => {
  // 获取根节点
  let el = document.documentElement
  dark.value ? (el.className = 'dark') : (el.className = '')
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefresh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>

  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          @change="setColor"
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="dark"
          size="small"
          active-icon="MoonNight"
          inactive-icon="Sunny"
          inline-prompt
        />
      </el-form-item>
    </el-form>
  </el-popover>

  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
  />

  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang=""></style>
