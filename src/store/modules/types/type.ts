import type { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'

// 定义小仓库数据state类型

export interface UserState {
  token: string | null
  menuRouters: RouteRecordRaw[]
  username: string
  avatar: string
  userAsyncRouter: any[]
  buttons: string[]
}

export interface CategoryState {
  c1Id: string | number
  c2Id: string | number
  c3Id: string | number
  c1Arr: CategoryObj[]
  c2Arr: CategoryObj[]
  c3Arr: CategoryObj[]
}
