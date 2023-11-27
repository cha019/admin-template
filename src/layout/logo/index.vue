<script setup lang="ts">
import setting from '@/setting'
</script>

<script lang="ts">
export default {
  name: 'Logo',
}
</script>

<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-slider-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: $base-slider-logo-title-fontSize;
    margin-left: 20px;
    white-space: nowrap; // 防止文字太多折叠时挤压变形
  }
}
</style>
