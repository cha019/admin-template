<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import {
  reqHasTradeMark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

// 当前页面
let pageNo = ref<number>(1)

// 每一页展示多少数据
let limit = ref<number>(2)

// 存储已有品牌数据总数
let total = ref<number>(0)

// 存储已有品牌数据
let trademarkArr = ref<Records>([])

// 控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)

// 收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})

// 获取el-form组件实例
let formRef = ref()

// 获取已有品牌的接口封装为一个函数
const getHasTradeMark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTradeMark(
    pageNo.value,
    limit.value,
  )

  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

// 分页器当前页面发生变化的时候会触发
// const changePageNo = () => {
//   getHasTradeMark()
// }

// 当下拉菜单发生变化的时候会触发
const sizeChange = () => {
  // 当前每一页的数据量发生变化的时候，当前页码归一
  // pageNo.value = 1
  getHasTradeMark()
}

// 新增品牌
const addTrademark = () => {
  dialogFormVisible.value = true

  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''

  // 初次打开新增品牌没有formRef组件实例
  // 1 ts?写法
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  // 2
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

// 修改品牌
const updateTrademark = (row: TradeMark) => {
  dialogFormVisible.value = true

  // 展示当前row数据
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl

  // es6 合并对象方法
  Object.assign(trademarkParams, row)

  // 初次打开新增品牌没有formRef组件实例
  // 1 ts?写法
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  // 2
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

const cancel = () => {
  dialogFormVisible.value = false
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
}

const confirm = async () => {
  // 发请求之前需要对于整个表单进行校验
  await formRef.value.validate()

  let result: any = await reqAddOrUpdateTrademark(trademarkParams)

  if (result.code == 200) {
    // 添加or修改品牌成功
    // 1
    dialogFormVisible.value = false
    // 2
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 3
    getHasTradeMark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 添加品牌失败
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
  }
}

// 删除品牌
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    getHasTradeMark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}

// 组件挂载完毕钩子
onMounted(() => {
  getHasTradeMark()
})

// 上传图片成功之前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
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

// 上传图片成功之后触发的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  // response 上传图片post请求成功之后服务器返回的数据body
  // uploadFile 上传图片成功之后一些图片的信息

  // 收集上传图片的地址。添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  // 图片上传成功，清除对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}

// 表单校验规则

const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}

const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  // 如果图片上传，有url地址
  if (value) {
    callBack()
  } else {
    callBack(new Error('Logo图片务必上传'))
  }
}

const rules = {
  // required ：必填
  // trigger  ：失去焦点 [blur, change] 对于图片上传没用
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}
</script>

<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        @click="addTrademark"
        v-has="`btn.Trademark.add`"
      >
        添加品牌
      </el-button>

      <!-- 表格组件：用于展示已有的平台数据 -->
      <el-table border style="margin: 10px 0px" :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>

        <!-- table-column: 默认展示数据用div -->

        <el-table-column label="品牌名称" prop="tmName"></el-table-column>

        <el-table-column label="品牌LOGO">
          <template #="{ row, $index }">
            <img
              :src="row.logoUrl"
              alt="未有图片"
              style="width: 100px; height: 100 px"
            />
          </template>
        </el-table-column>

        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.tmName}?`"
              width="250px"
              icon="Delete"
              icon-color="red"
              @confirm="removeTradeMark(row.id)"
            >
              <template #reference>
                <el-button>Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器组件 pagination
          current-page :  当前页
          page-size :     每一页展示数据条数
          page-sizes :    设置每一页展示多少的下拉菜单数据
          background :    按钮背景
          layout :        页面分页器六个组件布局调整 
      -->
      <el-pagination
        @current-change="getHasTradeMark"
        @size-change="sizeChange"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[2, 4, 6, 8]"
        :pager-count="7"
        :disabled="false"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
      />
    </el-card>

    <!-- 对话框组件：添加品牌和修改品牌 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="80px" prop="logoUrl">
          <!-- upload组件相关属性：
            action 上传图片请求接口
          -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>

      <!-- 具名插槽：footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
