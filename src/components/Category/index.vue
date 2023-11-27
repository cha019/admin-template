<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()

// 接受父组件传递过来的scene
defineProps(['scene'])

// 通知仓库获取一级分类的方法
const getC1 = () => {
  categoryStore.getC1()
}

const handler_getc2 = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.getC2()
}

const handler_getc3 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}

// 全局组件挂载完毕，通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1()
})
</script>

<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c1Id"
          @change="handler_getc2"
        >
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c2Id"
          @change="handler_getc3"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped></style>
