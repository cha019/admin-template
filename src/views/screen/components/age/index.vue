<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

//获取charts节点
let charts = ref()

onMounted(() => {
  let mychart = echarts.init(charts.value)
  //设置配置项
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      right: 30,
      top: 50,
      orient: 'vertical', // 图例组件方向的设置（默认水平），垂直
      textStyle: {
        color: 'white',
        fontSize: 15,
      },
    },
    series: [
      {
        name: 'pie data',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1100, name: '军事' },
          { value: 900, name: '新闻' },
          { value: 700, name: '直播' },
          { value: 500, name: '娱乐' },
          { value: 300, name: '财经' },
        ],
      },
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  }
  mychart.setOption(option)
})
</script>

<template>
  <div class="box2">
    <div class="top">
      <p class="title">年龄比例</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  .top {
    margin-left: 10px;
    .title {
      margin-top: 10px;
      color: white;
      font-size: 20px;
    }
    .bg {
      margin-top: 10px;
      width: 70px;
      height: 10px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
    }
  }

  .charts {
    height: 260px;
  }
}
</style>
