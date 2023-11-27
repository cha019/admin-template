<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的JSON数据
import chinaJSON from './china.json'

//获取DOM元素
let map = ref()

//注册中国地图
echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
  let mychart = echarts.init(map.value)
  //设置配置项
  mychart.setOption({
    //地图组件
    geo: {
      map: 'china', // 中国地图
      roam: true, // 鼠标缩放的效果
      left: 150, // 地图的位置调试
      top: 100,
      right: 150,
      bottom: 50,
      zoom: 1.1, // 整体放大多少
      label: {
        //地图上的文字的设置
        show: true, //文字显示出来
        color: 'white',
        fontSize: 8,
      },
      itemStyle: {
        //每一个多边形的样式（渐变色）
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'red', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'blue', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.5, // 透明度
      },
      emphasis: {
        // 地图高亮的效果
        itemStyle: {
          color: 'red',
        },
        label: {
          fontSize: 40,
        },
      },
    },
    grid: {
      // 布局位置
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    series: [
      {
        type: 'lines', // 航线的系列
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [119.306239, 26.075302], // 终点
            ],
            lineStyle: {
              // 统一的样式设置
              color: 'yellow',
              width: 1,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [114.298572, 30.584355], // 终点
            ],
            lineStyle: {
              // 统一的样式设置
              color: 'yellow',
              width: 1,
            },
          },
        ],
        effect: {
          // 开启动画特效
          show: true,
          symbol: 'arrow',
          color: 'white',
          symbolSize: 5,
        },
      },
    ],
  })
})
</script>

<template>
  <div class="box4" ref="map">我是地图组件</div>
</template>

<style scoped lang="scss">
.box4 {
  margin: 10px 0px;
}
</style>
