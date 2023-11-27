<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()

let loginForm = reactive({
  username: 'admin',
  // password: '111111'
  password: 'atguigu123',
})

let loading = ref(false)

// 获取el-form组件，vc实例
let loginForms = ref()

// 登录按钮回调
const login = async () => {
  // 保证全部表单项校验通过再发请求
  await loginForms.value.validate()

  // 加载效果
  loading.value = true
  // 通知仓库发登录请求
  try {
    await userStore.userLogin(loginForm)
    // 编程式导航跳转到展示数据首页（有query特殊处理）
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // 登陆成功，加载结束
    loading.value = false
    // 登陆成功的提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi, ${getTime()}好`,
    })
  } catch (error) {
    // 登陆失败，加载结束
    loading.value = false
    // 登陆成功的提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

const validatorUsername = (rule: any, value: any, callback: any) => {
  // rule: 校验规则对象
  // console.log(rule)
  // value：表单元素文本内容
  if (value.length === 0) {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error('密码应为6~16位的任意组合'))
  } else {
    callback()
  }
}

// 定义表单校验需要的配置项
const rules = {
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur' },
    // { required: true, min: 6, max: 10, message: '账号长度至少6位', trigger: 'change' },
    { validator: validatorUsername, trigger: 'change' },
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度至少6位', trigger: 'change' },
    { validator: validatorPassword, trigger: 'change' },
  ],
}
</script>

<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到admin界面</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
