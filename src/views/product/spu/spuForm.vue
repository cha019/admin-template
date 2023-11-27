<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSalAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import type {
  SpuData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  SaleAttrValue,
} from '@/api/product/spu/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])

// 控制照片预览方法dialog框
let dialogVisible = ref<boolean>(false)

// 存储预览图片地址
let dialogImageUrl = ref<string>('')

// 数据
let allTradeMark = ref<Trademark[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])
// 收集还未选择的销售属性的ID与属性值的名字
let saleAttrIDAndValueName = ref<string>('')

let inputArr = ref<any>([])

// 存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})

// 点击取消按钮：通知父组件切换场景为0
const cancel = () => {
  $emit('changeScene', {
    flag: 0,
    params: 'update',
  })
}

// 初始化数据
const initHasSpuData = async (spu: SpuData) => {
  SpuParams.value = spu

  // 获取全部品牌数据·
  let result: AllTradeMark = await reqAllTradeMark()
  allTradeMark.value = result.data

  // 获取某一个品牌旗下全部售卖商品的图片
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })

  // 获取已有spu的销售属性
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  saleAttr.value = result2.data

  // 获取全部SPU的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSalAttr()
  allSaleAttr.value = result3.data
}

// 照片墙点击预览按钮时触发的钩子
const handlePictureCardPreview = (file: any) => {
  // 预览图片的地址
  dialogImageUrl.value = file.url
  // 弹窗dialog框
  dialogVisible.value = true
}

// 照片墙删除文件钩子
const handleRemove = () => {}

// 照片墙上传成功之前的钩子
const handlerUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必是PNG/JPG/GIF',
    })
    return false
  }
}

// 计算出当前sou还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

// 添加销售属性方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIDAndValueName.value.split(':')
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  saleAttr.value.push(newSaleAttr)
  saleAttrIDAndValueName.value = ''
}

// toEdit
const toEdit = (row: SaleAttr, $index: number) => {
  // 点击按钮，编辑模式
  // 动态添加，收集新增的属性值
  row.flag = true
  row.saleAttrValue = ''
  // 聚焦
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// toLook
const toLook = (row: SaleAttr) => {
  // 属性值ID与属性值名字
  const { baseSaleAttrId, saleAttrValue } = row

  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }

  // 去空
  if (saleAttrValue?.trim() === '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空的',
    })
    return
  }

  // 重复校验
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === saleAttrValue
  })

  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复',
    })
    return
  }
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}

// 保存按钮回调
const save = async () => {
  // 更新SPU | 添加SPU

  // 照片数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })

  // 销售值属性
  SpuParams.value.spuSaleAttrList = saleAttr.value

  let res = await reqAddOrUpdateSpu(SpuParams.value)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  }
}

// add spu 场景 ---------- ----------
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(SpuParams.value, {
    id: 0,
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })
  imgList.value = []
  saleAttr.value = []
  saleAttrIDAndValueName.value = ''

  // 赋值
  SpuParams.value.category3Id = c3Id

  // 获取全部品牌数据·
  let result: AllTradeMark = await reqAllTradeMark()
  allTradeMark.value = result.data

  // 获取全部SPU的销售属性
  let result1: HasSaleAttrResponseData = await reqAllSalAttr()
  allSaleAttr.value = result1.data
}

// 暴露方法
defineExpose({ initHasSpuData, initAddSpu })
</script>

<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请您SPU属性名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>

    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="(item, index) in allTradeMark"
          :label="item.tmName"
          :key="item.id"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请您SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <!-- 
        v-model:file-list   展示默认图片
        action              上传图片的接口地址
        list-type           文件列表的类型
       -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>

    <el-form-item label="SPU销售属性">
      <el-select
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
        v-model="saleAttrIDAndValueName"
      >
        <el-option
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>

      <el-button
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        :disabled="saleAttrIDAndValueName ? false : true"
        @click="addSaleAttr"
      >
        添加属性
      </el-button>

      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          width="80px"
          type="index"
          align="center"
          label="序号"
        ></el-table-column>
        <el-table-column
          width="120px"
          label="销售属性名字"
          prop="saleAttrName"
        ></el-table-column>

        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <el-tag
              style="margin: 0px 5px"
              @close="row.spuSaleAttrValueList.splice($index, 1)"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
              calss="mx-1"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              :ref="(vc: any) => (inputArr[$index] = vc)"
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag == true"
              placeholder="请您输入属性值"
              size="small"
              style="width: 100px; margin-right: 5px"
            ></el-input>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Plus"
              @click="toEdit(row, $index)"
            ></el-button>
          </template>
        </el-table-column>

        <el-table-column width="120px" label="操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        size="default"
        @click="save"
        :disabled="saleAttr.length > 0 ? false : true"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang=""></style>
