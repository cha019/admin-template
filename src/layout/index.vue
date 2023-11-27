<script setup lang="ts">
import { useRoute } from 'vue-router'
import logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
// 获取layout配置相关的仓库
import useLayoutSettingStore from '@/store/modules/setting'

let userStore = useUserStore()
let layoutSettingStore = useLayoutSettingStore()

// 获取路由对象
let $route = useRoute()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div
      class="layout_slider"
      :class="{ fold: layoutSettingStore.fold ? true : false }"
    >
      <logo></logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="#001529"
          text-color="white"
          active-text-color="yellowgreen"
          :default-active="$route.path"
          :collapse="layoutSettingStore.fold ? true : false"
          :collapse-transition="false"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRouters"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 顶部导航 -->
    <div
      class="layout_tabbar"
      :class="{ fold: layoutSettingStore.fold ? true : false }"
    >
      <Tabbar></Tabbar>
    </div>

    <!-- 内容展示区域 -->
    <div
      class="layout_main"
      :class="{ fold: layoutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    color: white;
    width: $base-slider-width;
    height: 100vh;
    background: $base-slider-background;
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-slider-logo-height);
      .el-menu {
        border-right: none;
      }
    }
    &.fold {
      width: $base-slider-min-width;
    }
  }

  .layout_tabbar {
    position: fixed;
    top: 0px;
    left: $base-slider-width;
    width: calc(100% - $base-slider-width);
    height: $base-slider-height;
    transition: all 0.3s;
    &.fold {
      width: calc(100% - $base-slider-min-width);
      left: $base-slider-min-width;
    }
  }

  .layout_main {
    position: absolute;
    top: $base-slider-height;
    left: $base-slider-width;
    width: calc(100% - $base-slider-width);
    height: calc(100vh - $base-slider-height);
    background: yellowgreen;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100% - $base-slider-min-width);
      left: $base-slider-min-width;
    }
  }
}
</style>
