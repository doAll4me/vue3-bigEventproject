<script setup>
import { userLoginService, userRegisterService } from '@/api/user'
import { useUserStore } from '@/stores'
import { Lock, User } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const isRegister = ref(true)
const userStore = useUserStore()
const { setToken } = userStore
const router = useRouter()

// 用于提交的form数据字段
// 注册字段（依据接口字段
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
//表单校验规则（普通数据，非响应式
// 1.非空校验： required：true 、 message提示 、触发时机 trigger：blur（失焦） change（一改变就触发
// 2.长度校验： min,max
// 3.正则校验： pattern
// 4.自定义校验 =>自己写逻辑校验(校验函数)
//    validator:(rule, value, callback)
//    (1)rule 当前校验规则相关的信息
//    (2)value 所校验的表单元素目前的表单值
//    (3)callback无论成功还是失败，都需要 callback回调
//        callback()校验成功
//        callback(newError(错误信息))校验失败
const rules = ref({
  username: [
    { required: true, message: '请输入有效的用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名长度在5-10个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入有效的密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入有效的密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致！'))
        } else {
          callback() //校验成功也要callback
        }
      },
      trigger: 'blur'
    }
  ]
})

// 不是表单数据，是表单组件实例
// 与表单做绑定后form.value === elFormInstance（表单对象
const form = ref()
// 注册表单提交
const register = async () => {
  await form.value.validate() //预校验
  // console.log('发送注册请求') //如果前面的validate校验没通过的话，就不会到后面的发送请求
  const res = await userRegisterService(formModel.value)
  ElMessage.success(res.data.message)
  // console.log('注册成功')
  form.value.resetFields()
  isRegister.value = false
}

// 登录表单提交
const login = async () => {
  await form.value.validate() //预校验
  // console.log('发送登录请求')
  const res = await userLoginService(formModel.value)
  // console.log(res)
  ElMessage.success(res.data.message)
  // 若登录成功，存储token到本地
  setToken(res.data.token)
  form.value.resetFields()
  router.push('./') //登录成功跳转本地
}

// 切换登录/注册页面时 重置输入框内容
watch(isRegister, () => {
  form.value.resetFields()
})
</script>

<template>
  <!-- table布局（从左往右） row一行 分成24份 -->
  <el-row class="login-page">
    <!-- col列 ：span=12在一行中占12份（50% -->
    <el-col :span="12" class="bg"></el-col>
    <!-- col列 ：span=6在一行中占6份（25% -->
    <!-- ：offset=3  离左侧margin 3份（1/8 -->
    <el-col :span="6" :offset="3" class="form">
      <!-- el-form 表单组件 -->

      <!--
          校验相关属性（通过一整个表单数据对象维护数据
          :model='ruleForm' 绑定form的数据对象
          :rules='rules' 绑定form规则对象
          :v-model='rulsFrom.xxx' 给表单元素绑定form子属性
          props 配置生效的校验规则（对应rules字段
      -->

      <!-- 注册表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <!-- el-form-item 表单的一行 -->
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <!-- el-input表单组件 -->
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" underline="never" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!-- 测试 -->
        <!-- <el-form-item>
          <el-input :prefix-icon="View" placeholder="测试"></el-input>
        </el-form-item> -->
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" underline="never">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" underline="never" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
