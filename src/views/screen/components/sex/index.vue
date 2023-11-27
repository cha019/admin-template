<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

//获取charts节点
let charts = ref()

onMounted(() => {
  //初始化echarts实例
  let mycharts = echarts.init(charts.value)
  //设置配置项
  mycharts.setOption({
    //组件标题
    title: {
      text: '男女比例', //主标题
      textStyle: {
        color: 'skyblue', //主标题颜色
      },
      left: '40%', //主标题位置
    },
    //x|y
    xAxis: {
      show: false, // x轴不展示
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false, // y轴不展示
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20, // 柱状图宽度
        z: 100, // 柱状图层级
        itemStyle: {
          color: 'skyblue', // 柱状图颜色
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20, // 柱状图宽度
        barGap: '-100%', // 调整女士柱条位置
        itemStyle: {
          color: 'pink',
          borderRadius: 20,
        },
      },
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  })
})
</script>

<template>
  <div class="box1">
    <div class="top">
      <p class="title">男女比例</p>
      <p class="bg"></p>
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="women">
        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<style scoped lang="scss">
.box1 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin: 10px 0px;
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
  .sex {
    display: flex;
    justify-content: center;
    .man {
      margin: 30px 20px 20px 20px;
      width: 120px;
      height: 110px;
      background: url(../../images/man-bg.png) no-repeat;
      display: flex;
      justify-content: center; // 水平居中
      align-items: center; // 垂直居中
    }
    .women {
      margin: 30px 20px 20px 20px;
      width: 120px;
      height: 110px;
      background: url(../../images/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .rate {
    margin: 2px 10px;
    display: flex;
    justify-content: space-between;
    color: white;
  }

  .charts {
    margin: 0px 10px;
    height: 100px;
  }
}
</style>
