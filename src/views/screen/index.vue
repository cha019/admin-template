<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Top from './components/top/index.vue'

import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'

import Map from './components/map/index.vue'
import Line from './components/line/index.vue'

import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Counter from './components/counter/index.vue'

// 获取数据大屏展示内容盒子的DOM元素
let screen = ref()

// 大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const hh = window.innerHeight / h
  return ww < hh ? ww : hh
}

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})

// window视口发生变化时触发
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}
</script>

<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Counter class="counter"></Counter>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
}
.screen {
  width: 1920px;
  height: 1080px;
  position: fixed;
  transform-origin: left top;
  left: 50%;
  top: 50%;
  .top {
    width: 100%;
    height: 40px;
  }
  .bottom {
    display: flex;
    .left {
      padding: 10px;
      flex: 1;
      height: 1040px; // 1080px - top(40px)
      display: flex;
      flex-direction: column;
      .tourist {
        flex: 1.5;
      }
      .sex {
        flex: 1;
      }
      .age {
        flex: 1;
      }
    }
    .center {
      padding: 10px;
      flex: 2;
      display: flex;
      flex-direction: column;
      .map {
        flex: 3;
      }
      .line {
        flex: 1;
      }
    }
    .right {
      padding: 10px;
      flex: 1;
      height: 1040px; // 1080px - top(40px)
      display: flex;
      flex-direction: column;
      .rank {
        flex: 1.5;
      }
      .year {
        flex: 1;
      }
      .counter {
        flex: 1;
      }
    }
  }
}
</style>
