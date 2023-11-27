<script setup lang="ts">
import { useRouter } from 'vue-router'
let $router = useRouter()

const goHome = () => {
  $router.push('/home')
}
</script>

<template>
  <div class="box">
    <img src="" alt="" />
    <div>404了</div>
    <button @click="goHome">返回首页</button>
  </div>
</template>

<style scoped lang=""></style>
