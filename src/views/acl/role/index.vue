<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqAllRoleList,
  reqRemoveRole,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
} from '@/api/acl/role'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList,
} from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'

let settingStore = useLayOutSettingStore()

// 当前页面
let pageNo = ref<number>(1)

// 每一页展示多少数据
let pageSize = ref<number>(5)

// 存储已有用户总数
let total = ref<number>(0)

// 搜索
let keyword = ref<string>('')

// 角色数据
let allRole = ref<Records>([])

// 搜索
const search = () => {
  getHasRole()
  keyword.value = ''
}

// 重置
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

// sizeChange
const sizeChange = () => {
  getHasRole()
}

const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let res: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (res.code === 200) {
    total.value = res.data.total
    allRole.value = res.data.records
  }
}

onMounted(() => {
  getHasRole()
})

// ----- 添加更新角色 -----

let dialogVisible = ref<boolean>(false)

let RoleParams = reactive<RoleData>({
  roleName: '',
})

let form = ref<any>()

// 增加角色
const addRole = () => {
  dialogVisible.value = true

  Object.assign(RoleParams, {
    id: 0,
    roleName: '',
  })

  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

// 更新角色
const updateRole = (row: RoleData) => {
  dialogVisible.value = true

  Object.assign(RoleParams, row)

  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

// 保存
const save = async () => {
  // 表单校验
  await form.value.validate()

  let res: any = await reqAddOrUpdateRole(RoleParams)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功',
    })
    dialogVisible.value = false
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}

// 表单校验
const validateRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('角色名称至少两位'))
  }
}

const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validateRoleName }],
}

// ----- 分配菜单权限 -----
let drawer = ref<boolean>(false)
// 所有菜单项
let menuArr = ref<MenuList>([])
// 已经被选中的数据
let selectArr = ref<number[]>([])
// 树形结构
let tree = ref<any>()

// 树形控件默认配置
const defaultProps = {
  children: 'children',
  label: 'name',
}

const setPermission = async (row: RoleData) => {
  drawer.value = true

  Object.assign(RoleParams, row)
  let res: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  if (res.code === 200) {
    menuArr.value = res.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    // 只需要添加最后层级节点的ID
    if (item.select && item.level === 4) {
      initArr.push(item.id)
    }
    // 递归查找
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

const handler = async () => {
  const roleId = RoleParams.id as number

  // 被选中的ID
  let arr = tree.value.getCheckedKeys()
  // 半选ID
  let arr1 = tree.value.getHalfCheckedKeys()
  // 结合 被选中的ID 和 半选ID，合并操作
  let permissionId = arr.concat(arr1)

  let res: any = await reqSetPermission(roleId, permissionId)
  if (res.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '分配权限成功',
    })
    window.location.reload()
  }
}

// 删除
const removeRole = async (id: number) => {
  let res: any = await reqRemoveRole(id)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="角色名称">
          <el-input placeholder="角色名称" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            :disabled="keyword ? false : true"
            @click="search"
          >
            搜索
          </el-button>
          <el-button type="primary" size="default" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" @click="addRole" icon="Plus">
        添加角色
      </el-button>

      <el-table style="margin: 10px 0px" border :data="allRole">
        <el-table-column
          label="#"
          align="center"
          type="index"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="ID"
          align="center"
          prop="id"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          align="center"
          prop="roleName"
          show-overflow-tooltip
          width="300px"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
          width="300px"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
          width="300px"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setPermission(row)"
            >
              分配菜单权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定删除${row.roleName}`"
              width="500px"
              @confirm="removeRole(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @current-change="getHasRole"
        @size-change="sizeChange"
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 9, 11]"
        :pager-count="7"
        :disabled="false"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="RoleParams.id ? '更新角色' : '添加角色'"
    >
      <el-form :model="RoleParams" :rules="rules" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            placeholder="请你输入角色名称"
            v-model="RoleParams.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="default" @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="save">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮的权限</h4>
      </template>
      <template #default>
        <!-- 树形控件
          data: 数据源
          show-checkbox: 复选框
          node-key: 节点唯一标识
          default-expand-all: 默认全部展开
          default-checked-keys: 默认勾选节点key的数组
          props: 
         -->
        <el-tree
          ref="tree"
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="handler">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
