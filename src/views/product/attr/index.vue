<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
let attrArr = ref<Attr[]>([])

// 定义card组件内容切换变量
let scene = ref<number>(0)

// 定义一个响应式的数据控制编辑模式与查看模式的切换
let flag = ref<boolean>(true)

// 收集新增的属性数据
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3,
})

// 准备一个数组，存储对应的组件实例 el-input
let inputArr = ref<any>({})

// 添加属性按钮的回调
const addAttr = () => {
  // 清空上一次的数据遗留
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    // 点击按钮收集新增属性的三级分类属性ID
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })

  scene.value = 1
}

// 更新属性按钮的回调
const updateAttr = (row: Attr) => {
  scene.value = 1

  // 将已有的属性对象赋值给 attrParams 对象
  // Object.assign 赋值为浅拷贝
  // JSON.parse(JSON.stringify(row)) 深拷贝
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

// 删除某一个已有的属性
const deleteAttr = async (attrId: number) => {
  let result = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })

    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 添加属性值
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,
  })

  // 获取最后的el-input进行聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 属性值表单元素失去焦点事件回调
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断 - 1 空数据判断
  if (row.valueName.trim() == '') {
    // 删除掉对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)

    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }

  // 非法情况判断 - 2 重复的属性值判断
  let repeat = attrParams.attrValueList.find((item) => {
    // 切记把排除当前元素
    if (item !== row) {
      return item.valueName === row.valueName
    }
  })

  if (repeat) {
    // 删除掉对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)

    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }

  row.flag = false
}

// 属性值表单元素获得焦点事件回调
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true

  // input聚焦
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 取消
const cancel = () => {
  scene.value = 0
}

// 保存
const save = async () => {
  // 发请求
  let result: any = await reqAddOrUpdateAttr(attrParams)

  if (result.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
}

// 获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

// 监听仓库三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类存在才能发起请求
    if (categoryStore.c3Id) {
      getAttr()
    }
  },
)

// 路由组件销毁的时候，仓库当中分类相关的数据清空
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />

    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          @click="addAttr"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="150px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`您确定要删除${row.attrName}?`"
                width="200px"
                icon="Delete"
                icon-color="red"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请您输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
        >
          添加屬性
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>

        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            width="80px"
            type="index"
            align="center"
            label="序号"
          ></el-table-column>
          <el-table-column label="屬性值名称">
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                size="small"
                placeholder="请您输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="屬性值操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang=""></style>
