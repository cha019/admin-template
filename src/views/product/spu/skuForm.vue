<script setup lang="ts">
import { ref, reactive } from 'vue'
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import { ElMessage } from 'element-plus'
import type { SpuData, SkuData } from '@/api/product/spu/type'

let $emit = defineEmits(['changeScene'])

let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<any>([])

// 表格对象
let table = ref<any>()

let skuParams = reactive<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [
    // {
    //   attrId: '',
    //   valueId: '',
    // },
  ],
  skuSaleAttrValueList: [
    // {
    //   saleAttrId: '',
    //   saleAttrValueId: '',
    // },
  ],
  skuDefaultImg: '',
})

// 给skuParams设置默认的图片
const handler = (row: any) => {
  // 清空所有选中
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  // 选中当前行
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}

const cancel = () => {
  $emit('changeScene', {
    flag: 0,
    params: 'update',
  })
}

const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: SpuData,
) => {
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id as number | string
  skuParams.tmId = spu.tmId

  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  attrArr.value = result.data

  let result1: any = await reqSpuHasSaleAttr(spu.id as number)
  saleArr.value = result1.data

  let result2: any = await reqSpuImageList(spu.id as number)
  imgArr.value = result2.data
}

// 保存方法
const save = async () => {
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])

  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({ saleAttrId, saleAttrValueId })
      }
      return prev
    },
    [],
  )

  let res = await reqAddSku(skuParams)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })
    $emit('changeScene', { flag: 0, params: 'update' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}

// 暴露方法
defineExpose({ initSkuData })
</script>

<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>

    <el-form-item label="重量(克)">
      <el-input
        placeholder="重量(克)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>

    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${item1.id}`"
              v-for="(item1, index) in item.attrValueList"
              :key="item1.id"
              :label="item1.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${item1.id}`"
              v-for="(item1, index) in item.spuSaleAttrValueList"
              :key="item1.id"
              :label="item1.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang=""></style>
