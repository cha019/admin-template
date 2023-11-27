<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuData,
  SkuInfoData,
} from '@/api/product/spu/type'
import useCategoryStore from '@/store/modules/category'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()

// 场景值
let scene = ref<number>(0)

// 当前页面
let pageNo = ref<number>(1)

// 每一页展示多少数据
let pageSize = ref<number>(3)

// 存储已有品牌数据总数
let total = ref<number>(0)

// SPU数据
let records = ref<Records>([])

// 获取子组件实例
let spu = ref<any>()
let sku = ref<any>()

// sku
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

// 获取三级分类下全部的SPU
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    total.value = result.data.total
    records.value = result.data.records
  }
}

// 当分页器下拉菜单发生变化的时候会触发
const sizeChange = () => {
  getHasSpu()
}

// 监听仓库三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    records.value = []
    // 保证三级分类存在才能发起请求
    if (categoryStore.c3Id) {
      getHasSpu()
    }
  },
)

// ----- spu操作 -----
const addSpu = () => {
  scene.value = 1

  // 调用子组件实例方法初始化新的SPU数据
  spu.value.initAddSpu(categoryStore.c3Id)
}

// 子组件SpuForm绑定的自定义事件：目的是让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加留在第一页
    getHasSpu()
  }
}

const updateSpu = (data: SpuData) => {
  scene.value = 1

  // 调用子组件实例方法获取完整已有的SPU数据
  spu.value.initHasSpuData(data)
}

const addSku = (data: SpuData) => {
  scene.value = 2

  // 调用子组件实例方法初始化数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, data)
}

const findSku = async (row: SpuData) => {
  let res: SkuInfoData = await reqSkuList(row.id as number)
  if (res.code === 200) {
    skuArr.value = res.data
    show.value = true
  }
}

const deleteSpu = async (row: SpuData) => {
  let res: any = await reqRemoveSpu(row.id as number)

  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 路由组件销毁的时候，仓库当中分类相关的数据清空
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<template>
  <div>
    <Category :scene="scene" />

    <el-card style="margin: 10px 0px; height: 100%">
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
        >
          添加SPU
        </el-button>

        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column
            label="序号"
            width="80px"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-popconfirm
                :title="`您确定要删除${row.spuName}?`"
                width="200px"
                icon="Delete"
                icon-color="red"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
              <el-button
                type="success"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="success"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="findSku(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @current-change="getHasSpu"
          @size-change="sizeChange"
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :pager-count="7"
          :disabled="false"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
        />
      </div>

      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>

      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>

      <el-dialog v-model="show" title="SKU列表">
        <el-table :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<style scoped lang=""></style>
